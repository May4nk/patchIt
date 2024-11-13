import App from './App';
import React from 'react';
import client from "./client";
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoggedUserProvider } from "./context/userContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <ApolloProvider client={client}>
    <GoogleOAuthProvider clientId="632307576369-mtg71mrrhgqseqe5r5s7pu4fdu126n08.apps.googleusercontent.com">
      <AuthProvider>
        <LoggedUserProvider>
          <BrowserRouter>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </BrowserRouter>
        </LoggedUserProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </ApolloProvider>
);

