import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import '../App.css';

const Login = () => {
  const { keycloak } = useKeycloak();

  const EnterLogin = () => {
    console.log("ENTER LOGIN")
  }

  return (
    <div className='App'>
      <div className='App-header'>
        {/* <img src={logo} className="App-logo1" /> */}
        <h1>Logi</h1>

        {!keycloak.authenticated && (
          <div>
            
              <button
              autoFocus={true}
              id="login-button"
              onKeyDown={(e) => {
                  if (e.key === "Enter") {
                      EnterLogin();
                  }
                }
              }
              onClick={() => keycloak.login()}
            >
              Login
            </button>
            
          </div>
        )}

        {!!keycloak.authenticated && (
          <button
            type="button"
            id="login-button"
            onClick={() => keycloak.logout()}
          >
            Logout ({keycloak.tokenParsed.preferred_username})
          </button>
        )}

      </div>
    </div>
  );
};

export default Login;
