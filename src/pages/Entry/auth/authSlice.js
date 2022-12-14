import { TurnedIn } from "@mui/icons-material";
import { fabClasses } from "@mui/material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";


//Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));


const initialState = {
    user: user? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Register user
export const register = createAsyncThunk('auth/register', async(user, thunkAPI) => {
    try{   
        return await authService.register(user);
    }
    catch(error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try{   
        return await authService.login(user);
    }
    catch(error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('async/logout', async () => {
    await authService.logout()
})

export const loading = createAsyncThunk('async/loading', async () => {
    await authService.loading()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => state = initialState, //reset state to default values
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            }) // what is happening when the register action is panding
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload // becouse of the function rejectWithValue-that's gonna do, its gonna reject and give us message into payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(loading.fulfilled, (state) => {
                state.isLoading = true
            })
    },
})

export const { reset } = authSlice.actions
export default authSlice.reducer