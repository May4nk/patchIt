import React, { ReactNode, createContext, useCallback, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@apollo/client";

//queries
import { LOGOUTUSER, REFRESHTOKEN } from "../utils/loginqueries";

//types
import {
  user,
  actiontype,
  authcontexttype,
  initialstatetype,
  loginusertype,
} from "./types";

const initialState: initialstatetype = { user: null };

const token: string | null = localStorage.getItem("token");

if (token !== null) {
  const decodedToken: user = jwtDecode<user>(token!);

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext<authcontexttype>({
  user: null,
  logout: () => { },
  login: (userData: loginusertype) => { },
});

const AuthReducer = (state: initialstatetype, action: actiontype): initialstatetype => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload }
    case "LOGOUT":
      return { ...state, user: null }
    default:
      return state;
  }
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //mutations
  const [logoutUser] = useMutation(LOGOUTUSER);
  const [refreshToken] = useMutation(REFRESHTOKEN);

  //handler
  const login: (userData: loginusertype) => void = (userData: loginusertype) => {
    localStorage.setItem("token", userData.token);

    dispatch({
      type: "LOGIN",
      payload: userData
    })
  };

  const logout: () => Promise<void> = async () => {
    try {
      await logoutUser({
        variables: {
          userId: state.user?.id
        },
        onCompleted: () => {
          localStorage.removeItem("token");
        }
      });

      dispatch({
        type: "LOGOUT"
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefreshToken = useCallback(async () => {
    try {
      await refreshToken({
        onCompleted: ({ refreshToken }) => {
          if (refreshToken) {
            localStorage.setItem("token", refreshToken.token);

            dispatch({
              type: "LOGIN",
              payload: refreshToken,
            });
          }
        }
      })
    } catch (err) {
      console.error(err);
      logout();
    }
  }, [refreshToken])

  useEffect(() => {
    if (state.user) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: user = jwtDecode<user>(token);
        const now = Date.now();
        const tokenExpiryTime = decodedToken.exp * 1000;
        const refreshThreshold: number = 7 * 60 * 1000; // 5 minutes before expiry
        const refreshInterval: number = 60 * 60 * 1000; // Every 1 hour

        const timeToFirstRefresh = Math.max(tokenExpiryTime - now - refreshThreshold, 0);

        const intervalId = setInterval(handleRefreshToken, refreshInterval);

        const firstRefreshTimeoutId = setTimeout(() => {
          handleRefreshToken();
        }, timeToFirstRefresh);

        return () => {
          clearInterval(intervalId);
          clearTimeout(firstRefreshTimeoutId);
        };
      }
    }
  }, [state.user, handleRefreshToken]);

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };
