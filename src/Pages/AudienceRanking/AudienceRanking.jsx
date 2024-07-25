import React, { useEffect } from "react";
import "./AudienceRanking.css";
import { useTable, useSortBy, usePagination } from "react-table";
import { audienceRankingData } from "../UserProfile/utils";
import { backend_url } from "../../config";
import { useState } from "react";
import axios, { all } from "axios";
import Loader from "../Loader/Loader"
import { useRedirectToLogin } from "../../customHooks/useRedirectToLogin";
import { useNavigate } from "react-router-dom";

// Example of how to use the functions

const columns = [
  {
    Header: "Rank",
    accessor: "rank",
  },
  {
    Header: "Name",
    accessor: "name",
    disableSortBy: true,
  },
  {
    Header: "Worth",
    accessor: "worth",
  },
];


const AudienceRanking = () => {

  const navigate = useNavigate();
  const [audienceRank, setAudienceRank] = useState([]);
  const [allAudienceRanks, setAllAudienceRanks] = useState([]);
  const [currUser, setcurrUser] = useState();
  const [pageNumber, setpageNumber] = useState(1);
  const [totRows, setTotRows] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [manageFetechReq, setManageFetechReq] = useState([1]);
  
  // if not loged in then redirect to login
  useRedirectToLogin()

  
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
      data: audienceRank,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
    );
  
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch audience ranking
      const audienceRanking = await getAudienceRanking(pageSize, pageNumber);
      setAllAudienceRanks((prev) => [...prev,audienceRanking]);
      setAudienceRank(audienceRanking)
      setLoading((prev) => false);
    } catch (error) {
      console.error("Error:", error.message);
      setLoading(false);
    }
  };

  // Function to fetch audience ranking
  const getAudienceRanking = async (pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(
        `${backend_url}/portfolios/audienceRanking`,
        {
          params: {
            pageSize,
            pageNumber,
          },
        }
      );
      const datas = response.data; // Assuming the response contains the ranking data

      const res = datas.users.map((data) => {
        return {
          rank: data.rank,
          name: data.name,
          worth: data.worth,
        };
      });
      setTotRows(datas.totDocuments);
      return res;
    } catch (error) {
      console.error("Error fetching audience ranking:", error.message);
    }
  };


  // Function to fetch current user's rank
  const getCurrUserRank = async (userId) => {
    try {
      const { data } = await axios.get(
        `${backend_url}/portfolios/currUserRank?userId=${userId}`
      );
      setcurrUser((prev) => data);
      console.log("currUser")
    } catch (error) {
      console.error("Error fetching current user's rank:", error.message);
      navigate("/Login")
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("icell_pitcher_userId");
    const currUserRank = getCurrUserRank(userId);
  }, []);
  useEffect(() => {
    fetchData();
  }, [manageFetechReq]);
  
  useEffect(() => {

    if (allAudienceRanks.length >= pageNumber) {
      setAudienceRank(allAudienceRanks[pageNumber-1]);
    }
  }, [pageNumber])

  return loading ? (
    <Loader />
  ) : (
    <div className="audience-ranking">
      <h1>Ranking Page</h1>

      <div className="audience-ranking-table">
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
            <tr
              className="self-rank"
              style={{ display: pageNumber !== 1 ? "none" : "table-row" }}
            >
              <td>{currUser && currUser.rank}</td>
              <td>{currUser && currUser.name}</td>
              <td>{currUser && currUser.worth}</td>
            </tr>
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
      <div className="btn-container2">
        <div className="btn-page">
          <button
            disabled={pageNumber === 1}
            onClick={() => {
              setpageNumber((prevPage) => {
                
                return prevPage - 1
              });
              
            }}
          >
            Prev
          </button>
          <span>
            {pageNumber} of {Math.ceil(totRows / pageSize)}
          </span>
          <button
            disabled={pageNumber === Math.ceil(totRows / pageSize)}
            onClick={() => {
              
              if (!manageFetechReq.includes(pageNumber + 1)) {
                setManageFetechReq((prev) => [...prev, pageNumber + 1]);
              }
              setpageNumber((prevPage) => {
                return prevPage + 1
              });

            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudienceRanking;
