import Box from '@mui/material/Box';
import Navs from '../../components/topnav';
import Sidenavs from '../../components/sidenav';
import APIKeysComponent from '../../components/Admin/APIKeys/APIKeysComponent';
import { useKeycloak } from '@react-keycloak/web';
import { LOGI_ROLE_API_KEYS_READ } from '../../common/LogiRoles';
import "./APIKeysPage.css";

function APIKeysPage() {
	const { keycloak } = useKeycloak();

	let hasAPIKeysRead = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_READ);

	if (keycloak.idTokenParsed) {
		return (
			<div className='App'>
				<Navs />
				<table className='mptable'>
					<tbody>
					<tr>
						<td className='sidenavtd'>
							<Box sx={{ position: 'sticky', top: 0 }}>
								<Sidenavs adminOpen={true}/>
							</Box>
						</td>
						<td class="apikeys-page-td">
							{hasAPIKeysRead ? (<Box sx={{ height: `100%` }}>
								<div class="apikeys-page-div">
									<APIKeysComponent />
								</div></Box>) : (<p>You do not have permission to view this page</p>)}
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

export default APIKeysPage
