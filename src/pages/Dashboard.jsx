import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { useTheme, Box, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, TableHead, ButtonGroup, Button, TextField, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { tableCellClasses } from '@mui/material/TableCell';
import { theme } from "../theme";
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { deletePatientAction, loadPatientsAction, searchPatientsAction } from '../redux/patients/actions';
import Autocomplete from '@mui/material/Autocomplete';

export const Dashboard = () => {
  let dispatch = useDispatch();
  const { users } = useSelector(state => state.patients); //ovde "users" naziv promenljive MORA BITI ISTI KAO u reducer.js promenljiva koja
  //je zapravo za InitialState
  const { user } = useSelector((state) => state.auth);

  const changeInput = (e) => {
    if(!e.target.value)
      dispatch(loadPatientsAction(user[0].id));
    else dispatch(searchPatientsAction(user[0].id,e.target.value))
  }

  useEffect(()=>{
    console.log("USER ID JE " + user[0].id);
    dispatch(loadPatientsAction(user[0].id));
  },[]);
  
  const handleDelete = (infoId) => {;
    if(window.confirm("Are you sure want to delete the user?")) {
      dispatch(deletePatientAction(user[0].id, infoId));
    }
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box flex={4} p={2}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Slika</StyledTableCell>
              <StyledTableCell align="center">Ime</StyledTableCell>
              <StyledTableCell align="center">Prezime</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Starost</StyledTableCell>
              <StyledTableCell align="center">Visina</StyledTableCell>
              <StyledTableCell align="center">Tezina</StyledTableCell>
              <StyledTableCell align="center">Kalorije</StyledTableCell>
              <StyledTableCell align="center">Akcija</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : users
            ).map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center" component="th" scope="row">
                  <Avatar sx={{ display: 'flex', ml: "30%"}} src={row.Slika}/>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.Ime}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.Prezime}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.Email}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {sqlToJsDateAndCalcAge(row.Datum_rodjenja)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.Visina}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.Tezina}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.PotrosnjaKalorija}
                </StyledTableCell>
                <StyledTableCell align="center">
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '& > *': {
                    m: 1,
                  },
                }}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                  <Button>Promeni</Button>
                  <Button onClick={()=>handleDelete(row.Dodatne_info_Id)}>Obrisi</Button>
                </ButtonGroup>
                </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {emptyRows > 0 && (
              <StyledTableRow style={{ height: 53 * emptyRows }}>
                <StyledTableCell align="center" colSpan={8} />
              </StyledTableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Autocomplete spacing={2} sx={{ m: 2, width: 200 }}
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={users.map((option) => option.Email)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pretazite po email-u..."
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                    onChange={changeInput}
                  />
                )}
              />
    </Box>
  );
}
// #region table elements and other functions
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function sqlToJsDateAndCalcAge(sqlDate){
  //sqlDate in SQL DATETIME format ("yyyy-mm-ddThh:mm:ss.msZ")
  var sqlDateArr1 = sqlDate.split("-");
  //format of sqlDateArr1[] = ['yyyy','mm','ddThh:mm:msZ']
  var sYear = sqlDateArr1[0].toString();

  var currentDate = new Date();
  var currentYear = currentDate.getFullYear().toString();

  var sYearInt = parseInt(sYear);
  var currentYearInt = parseInt(currentYear);

  var age = currentYearInt - sYearInt;
   
  return age;
}
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.cream.main,
    color: theme.palette.primary.main,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
// #endregion