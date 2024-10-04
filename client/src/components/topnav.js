import { Link } from "react-router-dom";
import '../App.css';
import { useKeycloak } from '@react-keycloak/web';

function Navs() {
  const { keycloak } = useKeycloak();

  const launchUserGuide = async () => {
    const res = await fetch("/middleware/logiug/Lumen_Cyclops_Logi_FMS_User_Guide.pdf", {
      method: 'GET',
      headers: {
        'access-token': keycloak.token
      },
    });
    const uint8arr = new Uint8Array(await new Response(res.body).arrayBuffer());
    
    const link = document.createElement('a');
    const blob = new Blob([uint8arr], { type: 'application/pdf' });
    
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('target', '_blank');
    link.setAttribute('type', 'application/pdf');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logOutUser = () => {
    // window.location.href = '/';
    keycloak.logout()
    // window.location.href = '/'
  }
  return (
    <nav className="topnav">
      <div className="topnav-left">
        {/* <img width="32px" height="32px" src="/logo192.png" className="App-logo2" alt="logo" /> */}
        <Link id="topnav-link-logi-home" to="/">
          <p>Logi</p>
        </Link>
      </div>
      <div className="topnav-right">
        <a id="topnav-link-manage-account" className="fplinks" target="_blank" rel="noreferrer" href={keycloak.idTokenParsed.iss + "/account/"}>Manage Account</a>
        <Link id="topnav-link-user-guide" className="fplinks" onClick={() => launchUserGuide()}>User Guide</Link>
        {/* Should this be a link? */}
        <Link className="fplinks" to="/">{keycloak.idTokenParsed.preferred_username}</Link>
        <Link id="topnav-link-logout" className="fplinks" to="/" onClick={() => logOutUser()}>Logout</Link>
      </div>
    </nav>
  )
}
export default Navs;
