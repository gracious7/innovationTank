import React, { useEffect, useState, useRef } from "react";
import "./BuyPage.css";
import Carousel from "./Carousel";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPortfolio } from "../../actions/portfolio";
import LineChart1 from "./LineChart1";
import { ToastCallError, ToastCallSuccess } from "../../ReactToast";
import { io } from "socket.io-client";
import { backend_url } from "../../config";
import { useMyDetails } from "../../customHooks/useMyDetails";



let socket;
let userId;

const BuyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.portfolio);
  const [currProject, setCurrProject] = useState();
  const [bio, setBio] = useState();
  const [name, setName] = useState();
  const [leader, setLeader] = useState();
  const [stocks, setStocks] = useState();
  const [userMoney, setUserMoney] = useState(0);
  let [carouselItems, setCarouselItems] = useState([]);

  const [me, setRender] = useMyDetails();

  // custom hook
  const comp1 = () => {
    return <p style={{ textAlign: "center" }}>{bio}</p>;
  };

  useEffect(() => {
    dispatch(getPortfolio());
  }, [dispatch]);

  const buyRef = useRef("");

  const handleBuy = () => {
    let buyProd = buyRef.current.value;
    if (!buyProd || buyProd <= 0) {
      ToastCallError("Invalid Input");
      return;
    }

    socket.volatile.emit("buy", id, userId, buyProd);
    buyRef.current.value = "";
  };

  useEffect(() => {
    socket = io(backend_url);
    // socket = io("http://localhost:5000");
    console.log("useeffect");

    userId = localStorage.getItem("icell_pitcher_userId");
    //   ? JSON.parse(localStorage.getItem("icell_pitcher_userId"))
    //   : null;
    userId = localStorage.getItem("icell_pitcher_userId")
      ? JSON.parse(localStorage.getItem("icell_pitcher_userId"))
      : null;

    console.log(userId);
    socket.on("connect", () => {
      console.log("Socket is connected (frontend)");
    });

    socket.emit("join-room", id);

    socket.emit("getStock", id, userId, (getData) => {
      setStocks(getData[0]);
      setUserMoney(getData[1]);

      // navbar change
    });

    socket.on("show-stock", (stock) => {
      setStocks(stock[0]);
      setUserMoney(stock[1]);
    });

    socket.on("userStock-empty", () => {
      ToastCallError("Dont have enough Stock ");
    });

    socket.on("stock-empty", () => {
      ToastCallError("stock empty");
    });

    socket.on("successfully-purchased", (purchasedProd) => {
      ToastCallSuccess(`Successfully Purchased ${purchasedProd} stocks`);
      setRender((prev) => !prev);


    });

    socket.on("disconnect", function () {
      console.log("Got disconnect!");
      navigate("/Portfolio");
    });

    setCarouselItems([
      <LineChart1 portfolio_id={id} socket={socket} />,
      comp1(),
  
    ]);
    return () => {
      console.log("socket disconnecg");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Check if projects is not empty and has at least one element
    if (projects && projects.length > 0) {
      var project = projects[0];

      for (var i = 0; i < project.length; i++) {
        if (project[i]._id === id) {
          setCurrProject(project[i]);
          setName(project[i].name);
          setBio(project[i].about);
          setLeader(project[i].leader);
          setStocks(project[i].stock);
          break; // Once the project is found, exit the loop
        }
      }
    }

  }, [id]);

  useEffect(()=>{    setCarouselItems([
    <div className="LineChart">
 <LineChart1 portfolio_id={id} socket={socket} />
    </div>
   ,
    comp1(),

  ]);},[bio])

  // const carouselItems = [<LineChart1 socket={socket} /> ,comp1(), comp2()];

  return (
    <div className="buy-page">
      <div className="buy-page-details">
        <h2>{name}</h2>

        <Carousel items={carouselItems} />
      </div>
      <div className="buy-page-input">
        <p>
          <input
            type="number"
            placeholder={`Enter Amount / ${stocks}`}
            className="buy-amount"
            ref={buyRef}
          />
        </p>
        <button onClick={handleBuy}>Buy</button>
      </div>
    </div>
  );
};

export default BuyPage;
