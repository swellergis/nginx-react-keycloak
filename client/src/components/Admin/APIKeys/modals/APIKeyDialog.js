import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function APIKeyDialog(props) {
    const { onClose, open, created, name, nameSetter, nameValid, nameErrorMessage,
        revoked, revokedSetter, expires, expiresSetter, expiryDate, expiryDateSetter,
        hashedKey, prefix, updateButtonEnabled, onUpdateButtonClick, oneTimeApiKeyVal } = props;

    const handleClose = () => {
        onClose();
    };

    const handleCloseButtonClick = (event) => {
        onClose();
    };

    const handleNameContentChange = (event) => {
        nameSetter(event.target.value);
    };

    const handleRevokedChange = (event) => {
        revokedSetter(event.target.checked);
    };

    const handleExpiresChange = (event) => {
        expiresSetter(event.target.checked);
    };

    const handleExpiryDateChange = (val) => {
        // val is a dayjs object
        expiryDateSetter(val);
    };

    const readOnlyHandler = (event) => {
        // do nothing, we don't want user changing value
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>API key "{name}"</DialogTitle>
                <div class="modal-dialog-content-div">
                    <p>Details for API key {name}</p>
                    <Stack spacing={2} direction="column">
                        {/** Conditionally render the one time api key value */}
                        {oneTimeApiKeyVal !== null
                            ? <Stack spacing={2} direction="column" justifyContent="center">
                                <div
                                    id="apikeys-table-modal-dialog-otvk-helper-text-div"
                                >{"Please copy and paste this key since it will NOT be visible again:"}</div>
                                <br />
                                <div
                                    id="apikeys-table-modal-dialog-otvk-div"
                                >{oneTimeApiKeyVal}</div>
                                <br />
                                <Button
                                    id="apikeys-table-modal-dialog-copy-otvk-to-clipboard-button"
                                    variant="contained"
                                    onClick={() => {
                                        navigator.clipboard.writeText(oneTimeApiKeyVal);
                                    }}>Copy key to clipboard</Button>
                            </Stack>
                            : <div />
                        }
                        <TextField
                            {...(nameValid !== true && { error: undefined })}
                            helperText={nameErrorMessage}
                            label="Name"
                            variant="standard"
                            size="small"
                            value={name}
                            onChange={handleNameContentChange}
                            id="apikeys-table-modal-dialog-name-field"
                        />
                        <TextField
                            label="Created"
                            variant="standard"
                            size="small"
                            value={created}
                            onChange={readOnlyHandler}
                            id="apikeys-table-modal-dialog-created-field"
                        />
                        <TextField
                            label="Prefix"
                            variant="standard"
                            size="small"
                            value={prefix}
                            onChange={readOnlyHandler}
                            id="apikeys-table-modal-dialog-prefix-field"
                        />
                        <TextField
                            label="Hashed Key"
                            variant="standard"
                            size="small"
                            value={hashedKey}
                            onChange={readOnlyHandler}
                            width="480px"
                            multiline
                            id="apikeys-table-modal-dialog-hashed-key-field"
                        />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox
                                id="apikeys-table-modal-dialog-revoked-check-box"
                                checked={revoked}
                                {...(revoked !== true ? { onChange: handleRevokedChange } : { onChange: readOnlyHandler })}
                            />} label="Revoked(NOTE!  Once done, this can't be undone!)" />
                        </FormGroup>
                        {expiryDate !== null ? (
                            <Stack spacing={2} direction="column">
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox
                                        id="apikeys-table-modal-dialog-expires-check-box"
                                        checked={expires}
                                        onChange={handleExpiresChange}
                                    />} label="Expires" />
                                </FormGroup>
                                <DesktopDatePicker
                                    id="apikeys-table-modal-dialog-expiry-date-picker"
                                    label="Expiry Date"
                                    value={expiryDate}
                                    onChange={handleExpiryDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        ) : <FormGroup>
                            <FormControlLabel control={<Checkbox
                                id="apikeys-table-modal-dialog-expires-check-box"
                                checked={expires}
                                onChange={handleExpiresChange}
                            />} label="Expires" />
                        </FormGroup>
                        }
                        <Stack
                            spacing={2}
                            direction="row"
                            justifyContent="center"
                            alignItems="center">
                            <Button id="apikeys-table-modal-dialog-close-button" variant="contained" onClick={handleCloseButtonClick}>Close</Button>
                            <Button id="apikeys-table-modal-dialog-update-button"
                                variant="contained"
                                onClick={onUpdateButtonClick}
                                // put in code to change the enablement of the update button based on changing one of the text fields
                                disabled={!updateButtonEnabled()}
                            >Update</Button>
                        </Stack>
                    </Stack>
                </div>
            </Dialog>
        </LocalizationProvider>
    );
}
