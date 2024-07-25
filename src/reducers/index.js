import {combineReducers} from 'redux';

import portfolio from './portfolio';
import { authReducer } from './authReducer';

export const reducers = combineReducers({ portfolio, authReducer });
