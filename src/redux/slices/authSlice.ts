import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  id: number;
  username: string;
  displayname: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  tokenType: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Try to get initial state from cookies
const getUserFromCookies = (): User | null => {
  const userJson = Cookies.get('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Failed to parse user from cookies', e);
      return null;
    }
  }
  return null;
};

const getTokenFromCookies = (): string | null => {
  return Cookies.get('token') || null;
};

const initialState: AuthState = {
  token: getTokenFromCookies(),
  tokenType: 'Bearer',
  user: getUserFromCookies(),
  isAuthenticated: !!getTokenFromCookies() && !!getUserFromCookies(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      if (action.payload === null) {
        state.token = null;
        state.tokenType = null;
        state.user = null;
        state.isAuthenticated = false;
        
        // Clear cookies
        Cookies.remove('token');
        Cookies.remove('user');
      } else {
        // Handle different payload structures
        if (typeof action.payload === 'object') {
          // Handle direct user object (from API)
          if (action.payload.id !== undefined && action.payload.token === undefined) {
            state.user = action.payload;
            state.isAuthenticated = true;
            
            // Store user in cookie
            Cookies.set('user', JSON.stringify(action.payload), { 
              path: '/', 
              expires: 7,
              secure: true,
              sameSite: 'strict'
            });
          } 
          // Handle object with token and user properties
          else {
            state.token = action.payload.token;
            state.tokenType = action.payload.tokenType || 'Bearer';
            state.user = action.payload.user;
            state.isAuthenticated = true;
            
            // Store in cookies
            if (action.payload.token) {
              Cookies.set('token', action.payload.token, { 
                path: '/', 
                expires: 7,
                secure: true,
                sameSite: 'strict'
              });
            }
            
            if (action.payload.user) {
              Cookies.set('user', JSON.stringify(action.payload.user), { 
                path: '/', 
                expires: 7,
                secure: true,
                sameSite: 'strict'
              });
            }
          }
        }
      }
    },
    logout(state) {
      state.token = null;
      state.tokenType = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear cookies
      Cookies.remove('token');
      Cookies.remove('user');
    },
    // Update user data only
    updateUserData(state, action: PayloadAction<User>) {
      if (state.user) {
        state.user = action.payload;
        // Update cookie
        Cookies.set('user', JSON.stringify(action.payload), { 
          path: '/', 
          expires: 7,
          secure: true,
          sameSite: 'strict'
        });
      }
    },
  },
});

export const { setUser, logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
