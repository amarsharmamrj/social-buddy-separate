import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import BaseRouter from './baseRouter';
import "./index.css"
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
       <BaseRouter />
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
