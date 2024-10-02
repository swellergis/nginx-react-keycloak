import React, { useState } from 'react';
import Login from "./components/login";
import MainPage from './routes/MainPage';
import { useKeycloak } from '@react-keycloak/web';
import './App.css';

function App() {
    const { keycloak, } = useKeycloak();

    if (keycloak.authenticated) {
        return ( <MainPage /> )
    } else {
        return (
            <div className='App'>
                <Login />
            </div>
        );
    }
}

export default App;
