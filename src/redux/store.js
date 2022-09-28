import logger from "redux-logger";
import reduxThunk from "redux-thunk";
import rootReducer from "./root-reduces";
import { configureStore } from '@reduxjs/toolkit';

const  middlewares = [reduxThunk];

if(process.env.NODE_ENV === "development"){
    middlewares.push(logger);
}

const store = configureStore(rootReducer);

export default store;