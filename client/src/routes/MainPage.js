import Box from '@mui/material/Box';
import Navs from '../components/topnav';
import Sidenavs from '../components/sidenav';
import { useKeycloak } from '@react-keycloak/web';
import MainComponent from '../components/mainpage';

function MainPage() {
	const { keycloak } = useKeycloak();
	if (keycloak.idTokenParsed) {
		return (
			<div className='App'>
				<div>
					<Navs />
				</div>
				<table className='mptable'>
					<tbody>
					<tr>
						<td className='sidenavtd'>
							<Box sx={{ position: 'sticky', top: 0, border: 'solid 1px gold' }}>
								<Sidenavs adminOpen={false}/>
							</Box>
						</td>
						<td class="asn-page-route-td">
							<Box sx={{ border: 'solid 1px green' }}>
								<div class="asn-page-div">
									<MainComponent />
								</div>
							</Box>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		);
	} else {
		window.location.href = '/';
	}
};

export default MainPage;
