import {FETCH_ALL, CREATE} from "../constants/actiontypes";

export default (portfolios = [], action) => {
  switch (action.type) {
  
    case FETCH_ALL:
      // portfolios = action.payload
    
      return [action.payload];
    case CREATE:
      return [...portfolios, action.payload];
    default:
      return [...portfolios];
  }
};
