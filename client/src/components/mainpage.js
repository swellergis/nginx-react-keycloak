import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2'
// import { FixedSizeList } from 'react-window';
import { useKeycloak } from '@react-keycloak/web';
import './mainpage.css';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';

export const fetchErrorMessage = "An issue has occurred with fetching data.  If problem persists please contact foo@lumen.com";

function MainComponent() {
    const [users, setUsers] = useState([]);
	const { keycloak } = useKeycloak();

	const [mpdata, setMpdata] = useState({});
	const [fetchErrorMessageOpen, setFetchErrorMessageOpen] = useState(false);
	/* Number of milliseconds to show notifications */
	const notificationAutoclose = 5000;

	const [snackState,] = React.useState({
		snackbarVertical: 'bottom',
		snackbarHorizontal: 'center',
	});

	const handleFetchErrorClosed = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setFetchErrorMessageOpen(false);
	};

	useEffect(() => {
		fetch('/api/users/', {
			method: 'GET',
			headers: {
				'access-token': keycloak.token
			},
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			// else return response.text();
			else return response.json();
		}).then(resp => {
			// console.log('response: ' + resp);
			// setMpdata(JSON.parse(resp));
			setMpdata(resp);
            // setUsers(resp['users']);
		}).catch((error) => {
			console.log('error: ' + error);
			setFetchErrorMessageOpen(true);
		});
	}, [keycloak])
    function MainDataList() {
		const [snackState,] = React.useState({
			snackbarVertical: 'bottom',
			snackbarHorizontal: 'center',
		});

		const { snackbarHorizontal, snackbarVertical } = snackState;
		return (Object.entries(mpdata).map(([key, value]) => {
			// console.log('key: ' + key + 
			// 	' value: ' + JSON.stringify(value) + 
			// 	' item-count: ' + value.length +
			// 	' is-array ' + Array.isArray(value));
			if (Array.isArray(value)) {
				return (
					<Grid item xs={6}>
						<h2 class="mainpage-widget-header" id={key}>{key}</h2>
						{value.map(user => <div id={user._id}>{user.name}</div>)}
					</Grid>
				)
			} else {
				return (
					<Grid size={1}>
						<div>{value}</div>
					</Grid>
				)
			}
        }))

	}

    const fetchData = async () => {
        console.log('mpdata: ' + JSON.stringify(mpdata["users"]));
        // const response = await fetch('/api/users/');
        // const response = await fetch('http://localhost:8000/users');
        const response = await fetch('/api/users/', {
            method: 'GET',
			headers: {
				'access-token': keycloak.token
			},
        });
        const data = await response.json();
        setUsers(data['users']);
    };

	// The item renderer is declared outside of the list-rendering component.
	// So it has no way to directly access the items array.
	function ItemRenderer({ data, index, style }) {

		// Access the items array using the "data" prop:
		return (
			// <div class="mainpage-widget-item" style={style}>
			// 	{item}
			// </div>
			<div class="mainpage-widget-item" style={{
				...style,
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				{data[index]}
			</div>
		);
	}

	return (
		<div className='App'>
        <button onClick={fetchData}>Fetch User Data</button>
        <button
            type="button"
            id="login-button"
            onClick={() => keycloak.logout()}
        >
            Logout ({keycloak.tokenParsed.preferred_username})
        </button>
		<Grid container columns={1}>
			<MainDataList></MainDataList>
		</Grid>
		</div>
	)

}

export default MainComponent;
