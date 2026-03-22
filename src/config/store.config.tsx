import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducer/user.reducer";

const store = configureStore({
    reducer:{
        auth: userReducer
    }
});
export default store;