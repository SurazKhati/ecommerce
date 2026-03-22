import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authSvc from "../pages/auth/auth.service";


export const getLoggedInUserRedux : any = createAsyncThunk(
    "User/getLoggedInUserRedux",
    async() =>{
        try{
            const loggedInUser : any  = await authSvc.getRequest('/auth/me', {auth:true})
            return loggedInUser.result

        }catch(exception){
            console.log(exception) 
            throw exception
        }
    }, 
)

const UserSlicer =  createSlice({
    name:"User",
    initialState:{
        loggedInUser: null

    },
    reducers:{
        setloggedInUserForRedux: (state, action) =>{
           state.loggedInUser=action.payload
        }
    },
    extraReducers:(builder: any) =>{
        builder.addCase(getLoggedInUserRedux.fulfilled,(state:any,action:any)=>{
            state.loggedInUser = action.payload
        })
        builder.addCase(getLoggedInUserRedux.rejected,(state:any )=>{
            state.loggedInUser = null;
        })

    }
})
export const {setloggedInUserForRedux} = UserSlicer.actions
export default UserSlicer.reducer;