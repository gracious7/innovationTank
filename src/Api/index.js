import axios from "axios";
import {backend_url} from  "../config"

const url = `${backend_url}/portfolios`;

export const fetchPortfolios = () => axios.get(url);
export const createPortfolio = (newPortfolio) => axios.post(url, newPortfolio);