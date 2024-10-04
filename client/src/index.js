import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AppOrig from './AppOrig';
import reportWebVitals from './reportWebVitals';
// import APIKeysPage from './routes/admin/APIKeysPage';
import ContactUsPage from './routes/ContactUsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReactKeycloakProvider authClient={keycloak}>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />}></Route>
              <Route path="/contactus" element={
                  <ContactUsPage />
              }></Route>
          </Routes>
      </BrowserRouter>
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
