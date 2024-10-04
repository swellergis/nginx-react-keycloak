/**
 * Takes an array of objects describing table column headers that looks like:
 * 
 * {
 *  id: 'field_name',
 *  numeric: false,
 *  disablePadding: true,
 *  label: 'UI column name',
 *  hide: false
 * }
 * 
 * 
 * @param {Array} headCells 
 * @returns Set
 */
export function populateHiddenCols(headCells) {
    let ret = new Set();

    for (let i = 0; i < headCells.length; i++) {
        if (headCells[i].hide) {
            ret.add(headCells[i].id);
        }
    }

    return ret;
}

export function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
