import axios from "axios";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { backend_url } from "../../config";
import { Chart  } from 'chart.js/auto'
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

function generateTimeIntervals(currentTime) {
  const endDate = new Date(`2024-02-01 ${currentTime}`);
  return endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const LineChart1 = ({ portfolio_id, socket }) => {
  const [label, setLabel] = useState([]);
  const [lineLabel, setLineLabel] = useState([]);


  // for making fetch request
  useEffect(() => {
    axios
      .post(`${backend_url}/portfolios/data/line-chart`, {
        portfolio_id,
      })
      .then(({ data }) => {
        setLabel(data.x);
        setLineLabel(data.lineData);
      });
  }, []);

  // for making socket connection
  useEffect(() => {
    const generateLable = (data) => {
      // data -> avg stock / user
      const curr = new Date(Date.now());
      const currTime = `${curr.getHours()}:${curr.getMinutes()}`;
      let interval = generateTimeIntervals(currTime);

      setLabel((x) => {
        if (interval == x[x.length - 1]) {
          setLineLabel((prevLine) => {
            let lineLableCopy = [...prevLine];
            lineLableCopy[lineLableCopy.length - 1] = data;
            return lineLableCopy;
          });
          return [...x];
        } else {
          setLineLabel((prev) => {
            return [...prev, data];
          });
          return [...x, interval];
        }
      });
    };


    socket.on("line-chart-data", generateLable);
    return () => {
      // socket.disconnect();
    };
  }, []);

  const options = {
    scales: {
      x: {
        grid: {
          color: "#dddddd", // X-axis grid color
        },
        ticks: {
          color: "#dddddd", // X-axis tick color
        },
      },
      y: {
        grid: {
          color: "#dddddd", // Y-axis grid color
        },
        ticks: {
          color: "#dddddd", // Y-axis tick color
        },
      },
    },
  };
  

  return (
    <div className="line-chart">
      <Line
        datasetIdKey="id"
        data={{
          labels: label,
          datasets: [
            {
              id: 1,
              label: "",
              data: lineLabel,
            },
          ],
        }}
        options={options}
      
      />
    </div>
  );
};

export default LineChart1;
