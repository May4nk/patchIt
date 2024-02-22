import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import client from "./client";
import { AuthProvider } from "./context/authContext";
import { LoggedUserProvider } from "./context/userContext";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <AuthProvider>
    <GoogleOAuthProvider clientId="632307576369-mtg71mrrhgqseqe5r5s7pu4fdu126n08.apps.googleusercontent.com">
    <ApolloProvider client={ client }>
      <LoggedUserProvider>  
          <BrowserRouter>
            <React.StrictMode>     
              <App />
            </React.StrictMode>
          </BrowserRouter>
      </LoggedUserProvider>
    </ApolloProvider>
    </GoogleOAuthProvider>
  </AuthProvider>
);

