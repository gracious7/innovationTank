import { useState, useEffect } from "react";
import axios from "axios";
import "../UserProfile/UserProfile.css";
import "./ParticipantRanking.css";

import { Data, generateRandomColor } from "../UserProfile/utils.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useTable, useSortBy, usePagination } from "react-table";
import { backend_url,initialstocks } from "../../config.js";
import { useSelector, useDispatch } from "react-redux";
import { getPortfolio } from "../../actions/portfolio.js";
import { useRedirectToLogin } from "../../customHooks/useRedirectToLogin.js";


Chart.register(...registerables);
ChartJS.register(ArcElement, Tooltip, Legend);

const columns = [
  {
    Header: "Startups",
    accessor: "name",
    disableSortBy: true,
  },
  {
    Header: "Sold stocks",
    accessor: "stock",
  },
  {
    Header: "Multiplier",
    accessor: "multiplier",
    disableSortBy: true,
  },
];

const ParticipantRanking = () => {
  const [soldStocks, setSoldStocks] = useState([]);
  const [startupNames, setStartupNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.portfolio) || [];



  useRedirectToLogin()
  useEffect(() => {
    dispatch(getPortfolio());

   
  }, []);

  useEffect(() => {

    if (posts.length > 0) {
      setStartupNames(posts[0]?.map((post) => post.name));
      setSoldStocks(posts[0]?.map((post) => initialstocks - post.stock));

      setTableData(
        posts[0]?.map((post, idx) => {
          post.stock = initialstocks - post.stock
          return {
            sno: idx + 1,
            ...post,
          };
        })
      );
    }

  }, [posts]);

  const chartData = {
    labels: startupNames, // total startup name
    datasets: [
      {
        label: "Sold Stocks ",
        data: soldStocks, //sold stocks
        backgroundColor: generateRandomColor(
          startupNames ? startupNames.length : 0
        ),
        hoverOffset: 4,
      },
    ],
  };

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

  return posts && posts[0] ? (
    <div className="participants-profile">
      <h1>Participants Summary</h1>
      <div className="participants-profile-chart-container">
        <div className="doughnut-chart">
          <Doughnut options={{ responsive: true }} data={chartData} />
        </div>
        <div className="bar-chart">
          <Bar options={{ maintainAspectRatio: false }} data={chartData} />
        </div>
      </div>

      <div className="participants-profile-table">
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
      <div className="btn-container">
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
    </div>
  ) : (
    "Loading..."
  );
};

export default ParticipantRanking;
