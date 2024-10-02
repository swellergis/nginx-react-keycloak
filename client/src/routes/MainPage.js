// import Box from '@mui/material/Box';
// import Navs from '../components/topnav';
// import Sidenavs from '../components/sidenav';
import { useKeycloak } from '@react-keycloak/web';
import MainComponent from '../components/mainpage';

function MainPage() {
	const { keycloak } = useKeycloak();
	if (keycloak.idTokenParsed) {
		return (
			<div className='App' style={{border: 'solid 1px blue'}}>
				<table className='mptable'>
					<tr>
						<td className='sidenavtd'>
							<div style={{border: 'solid 1px green'}}>
								<h1>side-nav</h1>
							</div>
						</td>
						<td class="asn-page-route-td">
							<div class="asn-page-div" style={{border: 'solid 1px gold'}}>
								<MainComponent />
							</div>
						</td>
					</tr>
				</table>
			</div>
		);
	} else {
		window.location.href = '/';
	}
};

export default MainPage;
