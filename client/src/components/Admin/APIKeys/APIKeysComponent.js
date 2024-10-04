import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Typography } from '@mui/material';
import { LOGI_ROLE_API_KEYS_READ } from '../../../common/LogiRoles';
import { useKeycloak } from '@react-keycloak/web';
import APIKeyDialog from './modals/APIKeyDialog';
import { isValidApiKeyNameValue, apiKeyNameIsInUse } from '../../../common/validation/apikey/ApiKeyValidator';
import dayjs from 'dayjs';
import APIKeysTab from './ApiKeysTab';
import "./APIKeysTable.css";
import { fetchErrorMessage } from '../../mainpage'

var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const rowsPerPage = 20;

const rootFetchUrl = '/middleware/api/apikeys/';

/* Number of milliseconds to show notifications */
const notificationAutoclose = 5000;


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`api-keys-tabpanel-${index}`}
			aria-labelledby={`api-keys-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `api-keys-tab-${index}`,
		'aria-controls': `api-keys-tabpanel-${index}`,
	};
}

function createData(id, created, name, revoked, expiry_date, hashed_key, prefix) {
	return {
		id,
		created,
		name,
		revoked,
		expiry_date,
		hashed_key,
		prefix,
	};
}

// needed to avoid having to click refresh button twice
let freshSearchTerm = "";

function APIKeysComponent(props) {
	const { keycloak } = useKeycloak();

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const [tabIndex, setTabIndex] = React.useState(0);

	// snackbar state vars
	const [snackState,] = React.useState({
		snackbarVertical: 'bottom',
		snackbarHorizontal: 'center',
	});

	const { snackbarHorizontal, snackbarVertical } = snackState;

	const [apiKeysRefreshNotificationOpen, setApiKeysRefreshNotificationOpen] = useState(false);

	const apiKeysRefreshNotificationMessage = "API Keys Data Refreshed";
	const [fetchErrorMessageOpen, setFetchErrorMessageOpen] = useState(false);

	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('name');
	const [selected, setSelected] = useState([]);
	const [offset, setOffset] = useState(0);
	const [page, setPage] = useState(0);
	const [rows, setRows] = useState([]);
	const [total, setTotal] = useState(0);
	const [, setSearchTerm] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [addButtonEnabled,] = useState(true);
	const [editButtonEnabled, setEditButtonEnabled] = useState(false);
	const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
	const [apiKeySwitch, setApiKeySwitch] = useState(false);

	// modal state vars
	const [selectedCreated, setSelectedCreated] = useState("");
	const [selectedName, setSelectedName] = useState("");
	const [selectedNameValid, setSelectedNameValid] = useState(true);
	const [selectedNameErrorMessage, setSelectedNameErrorMessage] = useState("");
	const [selectedRevoked, setSelectedRevoked] = useState(false);
	const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
	const [selectedExpires, setSelectedExpires] = useState(false);
	const [selectedHashedKey, setSelectedHashedKey] = useState("");
	const [selectedPrefix, setSelectedPrefix] = useState("");
	const [oneTimeApiKeyVal, setOneTimeApiKeyVal] = useState(null);

	const hasApiKeysRead = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_READ);
	// const hasApiKeysAdd = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_ADD);
	// const hasApiKeysEdit = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_EDIT);
	// const hasApiKeysDelete = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_DELETE);

	useEffect(() => {
		fetchData();
	}, [apiKeySwitch])

	const handleModalClose = () => {
		setModalOpen(false);
		setSelected([]);
		setEditButtonEnabled(false);
		setDeleteButtonEnabled(false);
		setOneTimeApiKeyVal(null);
		fetchData();
	};

	const getFreshSearchTerm = () => {
		return freshSearchTerm;
	};

	const handleSearchTermChange = (event) => {
		setSearchTerm(event.target.value);
		freshSearchTerm = event.target.value;
	};

	const getSanitizedSearchFieldContent = () => {
		let ret = getFreshSearchTerm();
		// TODO: we might need to url-encode the search term here
		return ret;
	};

	const fetchData = async () => {
		// todo, do URLencoding on this to avoid any wonky input
		const sanitizedSearchTerm = getSanitizedSearchFieldContent();
		const orderPrefix = (order === 'desc' ? '-' : '');

		await fetch(rootFetchUrl
			+ '?limit=' + rowsPerPage
			+ '&offset=' + offset
			+ '&page=' + (page + 1)
			+ (sanitizedSearchTerm === '' ? '' : '&search=' + sanitizedSearchTerm)
			+ '&ordering=' + orderPrefix + orderBy, {
			method: 'GET',
			headers: {
				'access-token': keycloak.token
			},
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
			.then((respData) => {
				setTotal(respData.count);

				let tmpRows = [];
				for (let i = 0; i < respData.results.length; i++) {
					let entry = respData.results[i];
					tmpRows.push(createData(entry['id'], entry['created'],
						entry['name'], entry['revoked'], entry['expiry_date'],
						entry['hashed_key'], entry['prefix']));
				}

				setRows(tmpRows);
			}).catch((error) => {
				console.log('error: ' + error);
				setFetchErrorMessageOpen(true);

			});
		setApiKeySwitch(false);
	};

	const fetchDataForModal = async () => {
		await fetch(rootFetchUrl
			+ selectedPrefix + '/', {
			method: 'GET',
			headers: {
				'access-token': keycloak.token
			},
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
			.then((respData) => {
				if (respData['prefix'] !== null) {
					setSelectedCreated(respData['created']);
					setSelectedName(respData['name']);
					setSelectedNameValid(true);
					setSelectedNameErrorMessage('');
					setSelectedRevoked(respData['revoked']);

					// dayjs.utc('2014-08-18T21:11:54')
					if (respData['expiry_date'] !== null) {
						setSelectedExpires(true);
						setSelectedExpiryDate(dayjs.utc(respData['expiry_date']));
					}
					else {
						setSelectedExpires(false);
						setSelectedExpiryDate(null);
					}
					setSelectedHashedKey(respData['hashed_key']);
					setModalOpen(true);
				}
			}).catch((error) => {
				console.log('error: ' + error);
				setFetchErrorMessageOpen(true);
			});
	};

	/**
	 * This is separate from the other fetch method because this is called after a new api key is created 
	 * adn the one-time-viewable key is passed to us for display the first time.
	 * 
	 * @param {*} otvk 
	 * @param {*} prefix 
	 */
	const fetchAddedApiKeyByPrefix = async (otvk, prefix) => {
		await fetch(rootFetchUrl + prefix + "/", {
			method: 'GET',
			headers: {
				'access-token': keycloak.token,
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
			.then((respData) => {
				//   // webservice response
				//   {
				//     "id": "o1mC8Cll.pbkdf2_sha256$260000$j2prGAAK4VnDMO6QeLCzKV$qwvnkRuq6vf4wwewKZADJqLGb70b7GM1excb9diRN9o=",
				//     "created": "2022-12-08T13:50:17.818081Z",
				//     "name": "foo",
				//     "revoked": false,
				//     "expiry_date": null,
				//     "hashed_key": "pbkdf2_sha256$260000$j2prGAAK4VnDMO6QeLCzKV$qwvnkRuq6vf4wwewKZADJqLGb70b7GM1excb9diRN9o=",
				//     "prefix": "o1mC8Cll"
				// }

				// we found the api key that was just added
				if (respData['id'] !== null) {
					setSelectedCreated(respData['created']);
					setSelectedName(respData['name']);
					setSelectedRevoked(respData['revoked']);

					if (respData['expiry_date'] !== null) {
						setSelectedExpires(true);
						setSelectedExpiryDate(dayjs.utc(respData['expiry_date']));
					}
					else {
						setSelectedExpires(false);
						setSelectedExpiryDate(null);
					}
					setSelectedHashedKey(respData['hashed_key']);
					setSelectedPrefix(respData['prefix']);

					// open the modal with this apikey
					// set the one-time-visible key so the modal can display it
					setOneTimeApiKeyVal(otvk)
					setModalOpen(true);
				}
			}).catch((error) => {
				console.log('error: ' + error);
				setFetchErrorMessageOpen(true);
			});
	};

	// create a new api key that can then be edited.
	const addApiKey = async () => {

		let newName = "new_api_key_";
		let today = dayjs.utc(new Date().toLocaleString()).format('YYYYMMDDTHHmmss');

		let postData = {
			name: newName + today,
		};
		// console.log("Post data: ", postData)

		await fetch(rootFetchUrl, {
			method: 'POST',
			headers: {
				'access-token': keycloak.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
			.then((respData) => {
				// webservice response
				// {
				//   "key": [
				//       "H5FdRnhq.gS8IxGHb0DQvnUn0OczViCgUVSLS2v5g"
				//   ]
				// }
				// console.log("Return Data: ", respData)
				let keys = [respData['name']];
				// keys will only ever be 1 element long
				if (keys !== null && keys.length === 1) {
					// a new api key was created and this array contains the one-time-visible key
					let otvk = keys[0];
					// we need to capture this key

					// we now need to get the prefix and look up the inserted api key by the prefix
					// the string otvk is split into 2 sections separated by a dot.
					// the prefix is the first section
					let dotPosition = otvk.indexOf(".");
					let prefix = otvk.substring(0, dotPosition);

					fetchAddedApiKeyByPrefix(otvk, prefix);
				}
				else {
				}
			}).catch((error) => {
				console.log('error: ' + error);
				setFetchErrorMessageOpen(true);
			});
	};

	const handleAddApiKeyButtonClick = () => {
		addApiKey();
	};

	function handleResetButtonClick(event) {
		handleSingleApiKeySelection(null);
		setEditButtonEnabled(false);
		setDeleteButtonEnabled(false);

		setOffset(0);
		setPage(0);
		setOrder('asc');
		setOrderBy('name');
		setSearchTerm('');
		freshSearchTerm = '';
		fetchData();
		setSelected([]);
	}

	const deleteApiKey = async () => {
		await fetch(rootFetchUrl
			+ selectedPrefix + '/', {
			method: 'DELETE',
			headers: {
				'access-token': keycloak.token
			},
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			else return response;
		})
			.then((response) => {
				handleResetButtonClick();
			}).catch((error) => {
				console.log('error: ' + error);
				setFetchErrorMessageOpen(true);
			});
	};

	const handleDeleteApiKeyButtonClick = () => {
		deleteApiKey();
	};

	const handleEditApiKeyButtonClick = () => {
		// modalRow now contains the id of the selected row
		// but you'll need to fetch the whole object via another call to the backend
		fetchDataForModal();
	};

	const handleSelectedNameChange = (value) => {
		setSelectedName(value);
		// do validation
		let validInput = isValidApiKeyNameValue(value);
		setSelectedNameValid(validInput);
		setSelectedNameErrorMessage(validInput ? "" : "Typed input is not valid name");

		if (!validInput) {
			// no point in checking for name in use if the name wasn't valid
			return;
		}

		// now check if the name is in use
		apiKeyNameIsInUse(rootFetchUrl, keycloak.token, selectedPrefix, value, setSelectedNameValid,
			setSelectedNameErrorMessage)
	};

	const handleRevokedChange = (val) => {
		setSelectedRevoked(val);
		// setUpdateButtonEnabled(true);
	};

	// conditionally enable the update button in the modal based on if everything passed
	// validation
	const modalUpdateButtonEnabled = () => {
		let shouldEnabledUpdateButton = true;

		// check the various values in the modal to ensure they have
		// valid values and if they don't, this function will return false.

		// name
		if (!selectedNameValid) {
			shouldEnabledUpdateButton = false;
		}

		return shouldEnabledUpdateButton;
	}

	const updateApiKey = async () => {

		let expiryDateVal = null;

		if (selectedExpires) {
			// craft a date string suitable for updating
			// e.g. 2022-12-08T13:50:17.818081Z
			// selectedExpiryDate is a dayjs object
			expiryDateVal = selectedExpiryDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
		}

		let patchData = {
			name: selectedName,
			revoked: selectedRevoked,
			expiry_date: expiryDateVal
		};

		await fetch(rootFetchUrl + selectedPrefix + "/", {
			method: 'PATCH',
			headers: {
				'access-token': keycloak.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(patchData)
		}).then((response) => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
			.then((respData) => {
				// webservice response
				//   {
				//     "id": "F6Jy98KY.pbkdf2_sha256$260000$ifJt4Oo9SDPve4WW5Bvz94$QfxrNur60SnPQ/qMe8JW9F3vOBqYRiC6TCwp13vw2As=",
				//     "created": "2022-12-12T14:14:44.387126Z",
				//     "name": "my_api_key",
				//     "revoked": false,
				//     "expiry_date": "2023-12-27T15:58:31.513000Z",
				//     "hashed_key": "pbkdf2_sha256$260000$ifJt4Oo9SDPve4WW5Bvz94$QfxrNur60SnPQ/qMe8JW9F3vOBqYRiC6TCwp13vw2As=",
				//     "prefix": "F6Jy98KY"
				// }
				if (respData['id'] !== null) {
					fetchData();
				}
				else {
				}
			}).catch((error) => {
				console.log('error: ' + error);
				setFetchErrorMessageOpen(true);
			});
	};

	const handleUpdateButtonClick = (event) => {
		updateApiKey();
		handleModalClose();
	};

	const handleExpiresChanged = (val) => {
		if (!val) {
			// user says the api key doesn't expire.
			setSelectedExpires(false);
			setSelectedExpiryDate(null);
		}
		else {
			// user wants to set an expiry date
			// pick today's date
			let today = new Date().toLocaleDateString();
			setSelectedExpiryDate(dayjs.utc(today));
			setSelectedExpires(true);
		}
		// setUpdateButtonEnabled(true);
	};


	const handleExpiryDateChange = (val) => {
		// val is a dayjs object    
		if (val !== null) {
			console.log("Expire date chosen: " + val.format('YYYY-MM-DDTHH:mm:ssZ[Z]'));
		}
		else {
			console.log("Null expiry date chosen");
		}
		setSelectedExpiryDate(val);
		// setUpdateButtonEnabled(true);
	};

	const handleSingleApiKeySelection = (prefixVal) => {
		setSelectedPrefix(prefixVal);

		if (prefixVal === null) {
			// 0 or more than one selected
			setSelectedCreated("");
			setSelectedName("");
			setSelectedNameValid(false);
			setSelectedNameErrorMessage("Please Pick a name");
			setSelectedExpires(false);
			setSelectedExpiryDate(null);
			setSelectedRevoked(false);
			setSelectedHashedKey("");
		}

	};

	const handleApiKeysRefreshNotificationClosed = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setApiKeysRefreshNotificationOpen(false);
	};

	const handleFetchErrorClosed = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setFetchErrorMessageOpen(false);
	};

	const displayApiKeysRefreshStarted = (event) => {
		setApiKeysRefreshNotificationOpen(true);
	};

	const handleApiKeysRefreshButtonClick = (event) => {
		fetchData();
		displayApiKeysRefreshStarted();
	};

	const getOrderBy = () => {
		return orderBy;
	}

	const getOrder = () => {
		return order;
	}

	if (hasApiKeysRead) {
		return (
			<Box sx={{ width: '100%' }} id="license-keys-top-level-box">
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Snackbar
						open={apiKeysRefreshNotificationOpen}
						autoHideDuration={notificationAutoclose}
						onClose={handleApiKeysRefreshNotificationClosed}
						anchorOrigin={{ vertical: snackbarVertical, horizontal: snackbarHorizontal }}
					>
						<MuiAlert
							className="logi-snackbar-notification-message"
							severity="info"
							variant="filled"
							sx={{ width: '100%' }}>
							{apiKeysRefreshNotificationMessage}
						</MuiAlert>
					</Snackbar>
					<Snackbar
						open={fetchErrorMessageOpen}
						autoHideDuration={notificationAutoclose}
						onClose={handleFetchErrorClosed}
						anchorOrigin={{ vertical: snackbarVertical, horizontal: snackbarHorizontal }}
					>
						<MuiAlert
							className="logi-snackbar-notification-message"
							severity="info"
							variant="filled"
							sx={{ width: '100%' }}>
							{fetchErrorMessage}
						</MuiAlert>
					</Snackbar>
					<APIKeyDialog
						open={modalOpen}
						onClose={handleModalClose}
						created={selectedCreated}
						name={selectedName}
						nameSetter={handleSelectedNameChange}
						nameValid={selectedNameValid}
						nameErrorMessage={selectedNameErrorMessage}
						revoked={selectedRevoked}
						revokedSetter={handleRevokedChange}
						expires={selectedExpires}
						expiresSetter={handleExpiresChanged}
						expiryDate={selectedExpiryDate}
						expiryDateSetter={handleExpiryDateChange}
						hashedKey={selectedHashedKey}
						prefix={selectedPrefix}
						updateButtonEnabled={modalUpdateButtonEnabled}
						onUpdateButtonClick={handleUpdateButtonClick}
						oneTimeApiKeyVal={oneTimeApiKeyVal}
					/>
					<Tabs value={tabIndex} onChange={handleTabChange} aria-label="API Keys Tab Panel">
						<Tab label="API Keys" {...a11yProps(0)} />
					</Tabs>
				</Box>
				<TabPanel value={tabIndex} index={0}>
					<APIKeysTab
						addButtonEnabled={addButtonEnabled}
						addButtonClickListener={handleAddApiKeyButtonClick}
						editButtonEnabled={editButtonEnabled}
						editButtonClickListener={handleEditApiKeyButtonClick}
						deleteButtonEnabled={deleteButtonEnabled}
						deleteButtonClickListener={handleDeleteApiKeyButtonClick}
						editButtonToggle={setEditButtonEnabled}
						deleteButtonToggle={setDeleteButtonEnabled}
						singleSelectionHandler={handleSingleApiKeySelection}
						setApiKeySwitch={setApiKeySwitch}
						order={getOrder}
						orderSetter={setOrder}
						orderBy={getOrderBy}
						orderBySetter={setOrderBy}
						page={page}
						pageSetter={setPage}
						offset={offset}
						offsetSetter={setOffset}
						selected={selected}
						selectedSetter={setSelected}
						searchTerm={getFreshSearchTerm()}
						searchTermSetter={handleSearchTermChange}
						rows={rows}
						total={total}
						fetchData={fetchData}
						resetButtonClickListener={handleResetButtonClick}
						rowsPerPage={rowsPerPage}
						refreshButtonClickHandler={handleApiKeysRefreshButtonClick}
					/>
				</TabPanel>
			</Box>
		);
	}
	else {
		return (<div />);
	}
};

export default APIKeysComponent;
