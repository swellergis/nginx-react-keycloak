import React, { useState, useEffect } from 'react';
import { LOGI_ROLE_ADMIN_FUNCTIONS, LOGI_ROLE_API_KEYS_READ, LOGI_ROLE_DYNAMIC_PREFS_READ } from '../common/LogiRoles';
import { Link } from "react-router-dom";
import { useKeycloak } from '@react-keycloak/web';
import Box from '@mui/material/Box';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ApiIcon from '@mui/icons-material/Api';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import '../App.css';
import './sidenav.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fetchErrorMessage } from './mainpage';

// const versionUrl = '/middleware/api/v3/version_number/';
const versionUrl = '/api/v3/version_number';

export default function Sidenavs(props) {
    const { keycloak } = useKeycloak();
    const adminOpen = props.adminOpen;

    const sidenavTheme = createTheme({
        palette: {
            navIconColor: {
                main: '#FFFFFF',
                contrastText: '#fff',
            },
            selectedNavIconColor: {
                main: '#4287F5',
                contrastText: '#fff',
            },
        },
    });

    const [nestedAdminListOpen, setNestedAdminListOpen] = useState(adminOpen); // changing from true.
    const [version, setVersion] = useState('No version available');
    const unselectedColor = "navIconColor";
    const selectedColor = "selectedNavIconColor";
    const [fetchErrorMessageOpen, setFetchErrorMessageOpen] = useState(false);
    /* Number of milliseconds to show notifications */
    const notificationAutoclose = 5000;

    const handleFetchErrorClosed = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setFetchErrorMessageOpen(false);
    };

    useEffect(() => {
        fetch(versionUrl, {
            method: 'GET',
            headers: {
                'access-token': keycloak.token
            },
        }).then((response) => {
            if (!response.ok) throw new Error(response.status);
            // else return response.text();
            else return response.json();
        })
            .then(resp => {
                setVersion(resp.data);
                document.title = "Logi v" + resp.data;
            }).catch((error) => {
                console.log('error: ' + error);
                setFetchErrorMessageOpen(true);
            });
    }, [keycloak])

    useEffect(() => {
        if (version === 'Version v' || version === '') {
            var datex = new Date();
            console.log('Session is stale at: ', datex)
            keycloak.logout();
        }
    }, [version])

    const handleButtonClick = (event) => {
        if (event === null) {
            return;
        }

        if (event.currentTarget === null) {
            return;
        }

        let lookedUpLink = null;

        switch (event.currentTarget.id) {
            case 'sidenav-admin-button':
                lookedUpLink = document.getElementById('sidenav-admin-link');
                lookedUpLink.click();
                break;
            case 'sidenav-apikeys-button':
                lookedUpLink = document.getElementById('sidenav-apikeys-link');
                lookedUpLink.click();
                break;
            case 'sidenav-contactus-button':
                lookedUpLink = document.getElementById('sidenav-contactus-link');
                lookedUpLink.click();
                break;
            default:
        }
    };

    let hasAdminFunctions = keycloak.hasRealmRole(LOGI_ROLE_ADMIN_FUNCTIONS);
    let hasDynamicPrefsRead = keycloak.hasRealmRole(LOGI_ROLE_DYNAMIC_PREFS_READ);
    let hasApiKeysRead = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_READ);

    const handleAdministrativeListButtonClicked = () => {
        setNestedAdminListOpen(!nestedAdminListOpen);
    };

    const [snackState,] = React.useState({
        snackbarVertical: 'bottom',
        snackbarHorizontal: 'center',
    });

    const { snackbarHorizontal, snackbarVertical } = snackState;

    return (
        <Box sx={{ width: '18rem' }} id="sidenav_list_box">
            <List
                sx={{ width: '100%', maxWidth: 360, }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader"></ListSubheader>
                }
            >
                {hasAdminFunctions ? (<ListItemButton id="sidenav-administration-button" onClick={handleAdministrativeListButtonClicked}>
                    <ThemeProvider theme={sidenavTheme}>
                        <ListItemIcon>
                            <AdminPanelSettingsIcon color="navIconColor" />
                        </ListItemIcon>
                    </ThemeProvider>
                    <ListItemText primary="Administration" />
                    {nestedAdminListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>) : ''}
                {hasAdminFunctions ? (<Collapse in={nestedAdminListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {hasApiKeysRead ? (<ListItemButton
                            id="sidenav-apikeys-button"
                            onClick={handleButtonClick}
                            sx={{ pl: 4 }}>
                            <ThemeProvider theme={sidenavTheme}>
                                <ListItemIcon>
                                    <ApiIcon {...(window.location.pathname === "/apikeys" ? { color: selectedColor } : { color: unselectedColor })} />
                                </ListItemIcon>
                            </ThemeProvider>
                            <ListItemText
                                {...(window.location.pathname === "/apikeys" && { class: "selected-sidenav-list-item-text" })}
                                primary="API Keys" />
                            <Link id="sidenav-apikeys-link" hidden class="snlink" to="/apikeys" />
                        </ListItemButton>) : ''}
                    </List>
                </Collapse>) : ''}
                <List>
                    <ListItemButton
                        id="sidenav-contactus-button"
                        onClick={handleButtonClick}>
                        <ThemeProvider theme={sidenavTheme}>
                            <ListItemIcon>
                                <ContactPageIcon {...(window.location.pathname === "/contactus" ? { color: selectedColor } : { color: unselectedColor })} />
                            </ListItemIcon>
                        </ThemeProvider>
                        <ListItemText
                            {...(window.location.pathname === "/contactus" && { class: "selected-sidenav-list-item-text" })}
                            primary="Contact Us" />
                        <Link id="sidenav-contactus-link" hidden class="snlink" to="/contactus" />
                    </ListItemButton>
                </List>
                <List>
                    <ListItem
                        id="sidnav-version-button">
                        <ThemeProvider theme={sidenavTheme}>
                            <ListItemIcon>
                                <ApiIcon {...(window.location.pathname === "/reports" ? { color: unselectedColor } : { color: unselectedColor })} />
                            </ListItemIcon>
                        </ThemeProvider>
                        <ListItemText primary={"Version v" + version || "Version not available."} className="sidenav-list-item-text"></ListItemText>
                    </ListItem>
                </List>
            </List>
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

        </Box>
    )

}

// export default Sidenavs;
