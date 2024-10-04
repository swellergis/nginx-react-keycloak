import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Alert from '@mui/material/Alert';
import Navs from '../components/topnav';
import Sidenavs from '../components/sidenav';
import { useKeycloak } from '@react-keycloak/web';
import { LOGI_ROLE_DYNAMIC_PREFS_READ } from '../common/LogiRoles';
import "./ContactUsPage.css";

// const contactEmailFetchUrl = '/middleware/api/globalpreferences/?name=contactemail';
const contactEmailFetchUrl = '/api/globalpreferences/?name=contactemail';
// const contactEmailFetchUrl = '/api/apikeys?name=tester';
// const contactEmailFetchUrl = '/api/apikeys/tester';
const defaultEmailAddress = "default@lumen.com";


function ContactUsPage() {

	const [emailAddress, setEmailAddress] = useState(defaultEmailAddress);

	const { keycloak } = useKeycloak();

	// let hasDynPrefsReadRead = keycloak.hasRealmRole(LOGI_ROLE_DYNAMIC_PREFS_READ);
	let hasDynPrefsReadRead = true;

	useEffect(() => {

		const fetchContactEmail = async () => {
			await fetch(contactEmailFetchUrl, {
				method: 'GET',
				headers: {
					'access-token': keycloak.token
				},
			})
				.then((response) => response.json())
				.then((respData) => {

					// response looks like
					// {
					// 	"count": 1,
					// 	"next": null,
					// 	"previous": null,
					// 	"results": [
					// 		{
					// 			"id": 9,
					// 			"section": "Settings",
					// 			"name": "contactemail",
					// 			"raw_value": "foo@lumen.com"
					// 		}
					// 	]
					// }

					if (respData.count === 0) {
						// shouldn't happen, but handle it anyway
						console.log("response is not valid");
						return;
					}

					// there can only be one pref with the given name
					// setEmailAddress(respData.results[0]['raw_value'])
					console.log("data: " + JSON.stringify(respData));
					setEmailAddress(respData.data);
				});
		};

		if (hasDynPrefsReadRead) {
			fetchContactEmail();
		}
		else {
		}
	}, [hasDynPrefsReadRead, keycloak]);

	if (keycloak.idTokenParsed) {
		return (
			<div className='App'>
				<div style={{border: 'solid 7px red'}}>
					<Navs />
				</div>
				<table className='mptable'>
					<tbody>
					<tr>
						<td className='sidenavtd'>
							<Box sx={{ position: 'sticky', top: 0 }}>
								<Sidenavs />
							</Box>
						</td>
						<td class="contact-page-td">
							<Box sx={{ height: `100%` }}>
								<div class="contact-page-div">
									<p>
										<Alert severity='info'>
											If you have a question or need assistance, feel free to reach out to us at <b>{emailAddress}</b>
											(<ContentCopyIcon sx={{ fontSize: 15 }} desc="copy to clipboard" id="conect-page-copy-icon" onClick={() => {
												navigator.clipboard.writeText(emailAddress);
											}} />Click to copy to clipboard)
										</Alert>
									</p>
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

export default ContactUsPage;
