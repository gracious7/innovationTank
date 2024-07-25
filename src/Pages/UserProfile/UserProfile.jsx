import { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import { Data, generateRandomColor } from "./utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useTable, useSortBy, usePagination } from "react-table";
import { backend_url } from "../../config.js";
import { useRedirectToLogin } from "../../customHooks/useRedirectToLogin.js";
import { useNavigate } from "react-router-dom";

Chart.register(...registerables);
ChartJS.register(ArcElement, Tooltip, Legend);

const columns = [
  {
    Header: "S.NO. ",
    accessor: "sno",
    disableSortBy: true,
  },
  {
    Header: "Startups",
    accessor: "startup",
    disableSortBy: true,
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  // {
  //   Header: "Percent",
  //   accessor: "percent",
  // },
  {
    Header: "Multiplier",
    accessor: "multiplier",
    disableSortBy: true,
  },
  {
    Header: "Worth",
    accessor: "worth",
  },
];

const options = {
  // scaleShowValues : true,
  scales: {
    x: {
      grid: {
        color: "red", // X-axis grid color
      },
      ticks: {
        color: "blue", // X-axis tick color
        autoSkip: false,
        padding: 10,
        maxRotation: 90,
        minRotation: 80,
        // fontSize: 100
      },
    },
    y: {
      grid: {
        color: "rgba(0,255,0,0.5)", // Y-axis grid color
      },
      ticks: {
        color: "orange", // Y-axis tick color
        beginAtZero: true,
      },
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [boughtStocks, setBoughtStocks] = useState([]);
  const [startupNames, setStartupNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalWorth, setTotalWorth] = useState();


  useRedirectToLogin();



  const chartData = {
    labels: startupNames, // total startup name
    datasets: [
      {
        label: "Bought Stock ",
        data: boughtStocks, //bought stock
        backgroundColor: generateRandomColor(startupNames.length),
        hoverOffset: 4,
      },
    ],
  };

  // console.log("chatData:" , tableData);
  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex },
    pageCount,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    axios
      .post(`${backend_url}/api/v1/user/buy/details`, {
        token: localStorage.getItem("icell_pitcher_code")?.slice(1, -1),
      })
      .then(({ data }) => {
        setBoughtStocks(data.buyStartupStocks);
        setStartupNames(data.startupsName);
        let multiplierArr = data.multiplier;
        let table = [];
        let len = data.buyStartupStocks.length;
        var total = 0;
        for (let i = 0; i < len; i++) {

          const quant = data.buyStartupStocks[i];
          const curr = data.buyStartupStocks[i] * multiplierArr[i];
          table.push({
            sno: i + 1,
            startup: data.startupsName[i],
            quantity: quant,
            // percent: 94,
            multiplier: multiplierArr[i],
            worth: curr,
          });
          total = total + curr;
        }
        setTotalWorth(total);
        setTableData(table);
      })
      .catch((err) => {
        console.log("userprofile error", err);
      });
  }, []);
  return (
    <div className="user-profile">
      <h1>Your Profile</h1>
      <div className="user-profile-chart-container">
        <div className="doughnut-chart">
          <Doughnut options={options} data={chartData} />
        </div>
        <div className="bar-chart">
          <Bar options={options} data={chartData} />
        </div>
      </div>

      <div className="user-profile-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.isSorted && (
                      <span>{column.isSortedDesc ? "↑" : "↓"}</span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="btn-container1">
        <button disabled={!canPreviousPage} onClick={previousPage}>
          Prev
        </button>
        <span>
          {pageIndex + 1} of {pageCount}
        </span>
        <button disabled={!canNextPage} onClick={nextPage}>
          Next
        </button>
      </div>

      {/* <div className="user-profile-details">
        <div>
          <p>Total Worth - {totalWorth}$</p>
        </div>
        <div>
          <p>money invested - 34$</p>
          <p>Total Stocks - 34$</p>
        </div>
        <div>
          <p className="profit">Profit - 34$</p>
          <p className="loss">Loss - 34$</p>
        </div>
      </div> */}
    </div>
  );
};

export default UserProfile;
