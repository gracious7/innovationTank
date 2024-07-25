import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../config";

export const useRedirectToLogin = () => {
  console.log("useRedirectToLogin");

  const navigate = useNavigate();
  const fetchLogin = async () => {
    console.log("fetchLogininredirect");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("fetchLogininredirect1");
      let y = localStorage.getItem("icell_pitcher_code")
        ? JSON.parse(localStorage.getItem("icell_pitcher_code"))
        : null;
      if (!y) throw new Error("Token does not exist");
      
      const { data } = await axios.post(
        backend_url + "/api/v1/is_logged_in",
        { token: y },
        config
      );
    } catch (err) {
      navigate("/Login");
    }
  };
  useEffect(() => {
    fetchLogin();
  }, []);

  return [];
};
