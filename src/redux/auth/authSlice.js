import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    isAuthenticated:false,
    user:null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            // Action payload should include user and token
            state.isAuthenticated = true;
            state.user = action.payload;  // Store user object
        
          },
          logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
          },
    }
});
export const { login } = authSlice.actions;
export default authSlice.reducer