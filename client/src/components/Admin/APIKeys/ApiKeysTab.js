import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useKeycloak } from '@react-keycloak/web';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    populateHiddenCols
}
    from '../../../common/table/TableHelper';
import EnhancedTableToolbar from '../../../common/table/EnhancedTableToolbar';
import {
    LOGI_ROLE_API_KEYS_ADD,
    LOGI_ROLE_API_KEYS_DELETE,
    LOGI_ROLE_API_KEYS_EDIT,
    LOGI_ROLE_API_KEYS_READ
} from '../../../common/LogiRoles';
import SingleSelectTableHead from '../../../common/table/SingleSelectTableHead';

const headCells = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
        hide: true
    },
    {
        id: 'created',
        numeric: false,
        disablePadding: true,
        label: 'Created',
        hide: false
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
        hide: false
    },
    {
        id: 'revoked',
        numeric: false,
        disablePadding: true,
        label: 'Revoked?',
        hide: false
    },
    {
        id: 'expiry_date',
        numeric: false,
        disablePadding: true,
        label: 'Expiration Date',
        hide: false
    },
    {
        id: 'hashed_key',
        numeric: false,
        disablePadding: true,
        label: 'Hashed Key',
        hide: true
    },
    {
        id: 'prefix',
        numeric: false,
        disablePadding: true,
        label: 'Prefix',
        hide: false
    },
];

const hiddenCols = populateHiddenCols(headCells);

function getRowCells(row, labelId, isItemSelected, handleClick) {
    return (
        <TableRow
            hover
            onClick={(event) => handleClick(event, row.prefix)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                />
            </TableCell>
            {!hiddenCols.has("id") ? (<TableCell component="td" id={labelId} scope="row" padding="none">{row.id}</TableCell>) : ''}
            {!hiddenCols.has("created") ? (<TableCell align="left">{row.created}</TableCell>) : ''}
            {!hiddenCols.has("name") ? (<TableCell align="left">{row.name}</TableCell>) : ''}
            {!hiddenCols.has("revoked") ? (<TableCell align="left">{row.revoked ? "✔" : "✘"}</TableCell>) : ''}
            {!hiddenCols.has("expiry_date") ? (<TableCell align="left">{row.expiry_date}</TableCell>) : ''}
            {!hiddenCols.has("hashed_key") ? (<TableCell align="left">{row.hashed_key}</TableCell>) : ''}
            {!hiddenCols.has("prefix") ? (<TableCell align="left">{row.prefix}</TableCell>) : ''}
        </TableRow>
    )
}

function FilterWidget(props) {
    const { searchTerm, onSearchClick, onResetClick, onSearchTermChange } = props;

    return (
        <form onSubmit={onSearchClick}>
            <div id="apikeys-filter-widget-div" class="apikeys-filter-widget-div">
                <div class="apikeys-filter-widget-body-div">
                    <Stack id="apikeys-filter-widget-control-stack" spacing={2} direction="column">
                        <TextField
                            id="apikeys-filter-widget-search-input"
                            label="Search"
                            variant="outlined"
                            size="medium"
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            sx={{ m: 1, minWidth: 100, maxWidth: 410 }}
                        />
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Button type="submit" id="apikeys-filter-widget-search-button" variant="contained">Search</Button>
                        <Button id="apikeys-filter-widget-reset-button" variant="contained" onClick={onResetClick}>Reset</Button>
                    </Stack>
                </div>
            </div>
        </form>
    );
};

export default function APIKeysTab(props) {

    let {
        addButtonEnabled,
        addButtonClickListener,
        editButtonEnabled,
        editButtonClickListener,
        deleteButtonEnabled,
        deleteButtonClickListener,
        editButtonToggle,
        deleteButtonToggle,
        singleSelectionHandler,
        order,
        orderSetter,
        orderBy,
        orderBySetter,
        setApiKeySwitch,
        page,
        pageSetter,
        offset,
        offsetSetter,
        selected,
        selectedSetter,
        searchTerm,
        searchTermSetter,
        rows,
        total,
        fetchData,
        resetButtonClickListener,
        rowsPerPage,
        refreshButtonClickHandler
    } = props;

    const { keycloak } = useKeycloak();

    const hasApiKeysRead = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_READ);
    const hasApiKeysAdd = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_ADD);
    const hasApiKeysEdit = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_EDIT);
    const hasApiKeysDelete = keycloak.hasRealmRole(LOGI_ROLE_API_KEYS_DELETE);

    useEffect(() => {
        resetButtonClickListener();
        // fetchData();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy() === property && order() === 'asc';
        orderSetter(isAsc ? 'desc' : 'asc');
        orderBySetter(property);
        setApiKeySwitch(true);
    };

    const handleRowClick = (event, prefix) => {
        if (selected[0] === prefix) {
            singleSelectionHandler('');
            editButtonToggle(false);
            deleteButtonToggle(false);
            selectedSetter([]);
        } else {
            let newSelected = [prefix];
            singleSelectionHandler(prefix)
            editButtonToggle(true);
            deleteButtonToggle(true);
            selectedSetter(newSelected);
        }
    };

    const handleChangePage = (event, newPage) => {

        let newOffset = offset;

        if (newPage > page) {
            newOffset += rowsPerPage;
        }
        else {
            newOffset -= rowsPerPage;
        }
        offsetSetter(newOffset);

        pageSetter(newPage);
        // fetch the next page's data
        setApiKeySwitch(true);

    };

    const isSelected = (prefix) => selected.indexOf(prefix) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const emptyRows = 0;

    const defaultLabelDisplayedRows = ({ from, to, count }) => {
        return `${from.toLocaleString()}–${to.toLocaleString()} of ${count !== -1 ? count.toLocaleString() : `more than ${to.toLocaleString()}`}`;
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault();
        fetchData();
        selectedSetter([]);
        singleSelectionHandler(null);
        editButtonToggle(false);
        deleteButtonToggle(false);
    };

    if (hasApiKeysRead) {
        return (
            <div id="apikeys-table-top-level-div">
                <div id="apikeys-table-button-bar-div">
                    <Accordion style={{ 'borderRadius': '10px' }} defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>API Keys Refresh / Search</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2} direction="column">
                                <Stack spacing={2} direction="row">
                                    <Button
                                        id="apikeys-table-refresh-button"
                                        variant="contained"
                                        onClick={refreshButtonClickHandler}>Refresh</Button>
                                </Stack>
                                <FilterWidget
                                    searchTerm={searchTerm}
                                    onSearchClick={handleSearchButtonClick}
                                    onResetClick={resetButtonClickListener}
                                    onSearchTermChange={searchTermSetter} />
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div id="apikeys-table-div">
                    <Stack spacing={2} direction="row">
                        <Box sx={{ width: '100%' }} id="apikeys_table_box">
                            <TableContainer>
                                <Table
                                    sx={{ width: '100%' }}
                                    aria-labelledby="tableTitle"
                                    size={'small'}
                                    id="apikeys-table"
                                >
                                    <SingleSelectTableHead
                                        numSelected={selected.length}
                                        order={order()}
                                        orderBy={orderBy()}
                                        onRequestSort={handleRequestSort}
                                        rowCount={total}
                                        headCells={headCells}
                                        fetchMethod={fetchData}
                                        id="apikeys-table-head"
                                    />
                                    <TableBody id="apikeys-table-body">
                                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
           rows.slice().sort(getComparator(order, orderBy)) */}
                                        {rows.map((row, index) => {
                                            const isItemSelected = isSelected(row.prefix);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                getRowCells(row, labelId, isItemSelected, handleRowClick)
                                            );
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    // height: 33 * emptyRows,
                                                    height: 33,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[rowsPerPage]}
                                component="div"
                                count={total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                labelDisplayedRows={defaultLabelDisplayedRows}
                            />
                            <EnhancedTableToolbar numSelected={selected.length} />
                        </Box>
                        <div class="apikeys-table-table-buttons-div">
                            <Stack spacing={2} direction="column">
                                {hasApiKeysAdd ? (<Button id="apikeys-table-add-button"
                                    variant="contained"
                                    onClick={addButtonClickListener}
                                    disabled={!addButtonEnabled}>Add</Button>) : (<p />)}
                                {hasApiKeysEdit ? (<Button id="apikeys-table-edit-button"
                                    variant="contained"
                                    onClick={editButtonClickListener}
                                    disabled={!editButtonEnabled}>Edit</Button>) : (<p />)}
                                {hasApiKeysDelete ? (<Button id="apikeys-table-delete-button"
                                    variant="contained"
                                    onClick={deleteButtonClickListener}
                                    disabled={!deleteButtonEnabled}>Delete</Button>) : (<p />)}
                            </Stack>
                        </div>
                    </Stack>
                </div>
            </div>
        );
    }
    else {
        return (<div />);
    }
}
