import React, { useState, useEffect } from "react";
import "./Navbar.css";
import IcellLogo from "../../Assets/images/Icell4.png";
import Logo from "../../Assets/images/i3_0.png";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { IoMdMenu } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {  useMyDetails } from "../../customHooks/useMyDetails";

function Navbar({ onDataChange }) {
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useMyDetails();
  const navigate = useNavigate();

  // const openInfoModal = () => setInfoModalOpen(!isInfoModalOpen);
  // const closeInfoModal = () => setInfoModalOpen(false);
  // const moneyLeft = 12;

  const touserProfile = ()=>
  {
    navigate("/userProfile")
  }

  const Logout = () => {
    localStorage.removeItem("icell_pitcher_code");

    localStorage.removeItem("icell_pitcher_userId");
    navigate("/");
  };

  const openInfoModal = () => {
    // const newData = event.target.value;
    setInfoModalOpen(!isInfoModalOpen);

    // Call the callback function to update parent state
    onDataChange(isInfoModalOpen);
  };

  const openMenu = () => setMenuOpen(!isMenuOpen);
  //   const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isInfoModalOpen &&
        !event.target.closest(".info-btn") &&
        !event.target.closest(".modal")
      ) {
        openInfoModal();
      }

      if (
        isMenuOpen &&
        !event.target.closest(".menu-btn") &&
        !event.target.closest(".menu")
      ) {
        openMenu();
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isInfoModalOpen, isMenuOpen]);

  return (
    <>
      <div className="nav">
        <div onClick={openInfoModal}>
          <HiOutlineInformationCircle className="info-btn" />
        </div>
        <div>
          <img src={IcellLogo} alt="Icell" width={30} />
        </div>
        <div onClick={openMenu}>
          <IoMdMenu className="menu-btn" />
        </div>
      </div>

      {/* Info Modal */}
      {isInfoModalOpen && (
        <div className="modal-overlay" style={{ filter: "blur(0) !important" }}>
          <div className="modal">
            <div className="modal-header">
              <h2>Instructions</h2>
            </div>
            <ul className="modal-content">
              <li>
                Guard your code as it uniquely identifies you; refrain from
                sharing it with others.
              </li>
              <li>
                Refer to the side menu to track your virtual currency balance.
              </li>
              <li>
                Invest your virtual currency in stocks from the Portfolio of
                Ideas.
              </li>
              <li>
                As the event concludes, the growth of each company will be
                determined based on microeconomic parameters over a 5-year
                period. A growth multiplier will then be assigned to each
                portfolio.
              </li>
              <li>
                Calculate your worth by considering the stocks you've purchased
                and their respective multipliers.
              </li>
              <li>
                Discover your ranking and worth on the Audience Ranking page at
                the conclusion of the event.
              </li>
              <li>
                Review your buy history and analysis in the user profile page.
              </li>
              <li>
                Utilize the chart on the buy page to assess the buy rate for
                each portfolio.
              </li>
              <li>
                Gain insights into the performance of each portfolio through the
                Participants Summary.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Menu */}
      {isMenuOpen && (
        <div className="menu-overlay">
          <div className="menu-heading">
            <div className="logoname">
              <h2 className="-logo--name">Stocks Up</h2>
              <div>
                <img src={Logo} alt="stocksUp-logo" width={40} height={40} />
              </div>
            </div>
          </div>
          <div className="menu">
            <div className="menu-options">
              <a href="#Portfolio" className="menu-item">
                <span>
                  <FaHome />
                </span>
                <span onClick={() => setMenuOpen(!isMenuOpen)}>Home</span>
              </a>
              <a href="#AudienceRanking" className="menu-item">
                {" "}
                <FaRankingStar />
                <span onClick={() => setMenuOpen(!isMenuOpen)}>
                  Audience Ranking
                </span>
              </a>
              <a href="#ParticipantRanking" className="menu-item">
                {" "}
                <FaRankingStar />
                <span onClick={() => setMenuOpen(!isMenuOpen)}>
                  {" "}
                  Participants Summary
                </span>
              </a>
              <div onClick={() => touserProfile()} className="menu-item">
                <FaUser />
                <span onClick={() => setMenuOpen(!isMenuOpen)}>
                  User Portfolio
                </span>
              </div>

              <a onClick={() => Logout()} className="menu-item">
                <FaSignOutAlt />
                <span>Log Out</span>
              </a>
            </div>
            {/* <span onClick={openMenu} className="close-btn">
              &times;
            </span> */}
          </div>
          <button className="balance">
            Balance: <span className="amount">${me.userStock}</span>
          </button>
          <div className="powered-menu">
            Powered by <span className="icell-menu">Innovation Cell</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
