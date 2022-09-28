// #region imports
import React, { useEffect } from 'react'
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { deletePatientAction, loadPatientsAction, searchPatientsAction } from '../redux/patients/actions';
import { theme } from "../theme";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// #endregion



export const Dashboard = () => {
  let dispatch = useDispatch();
  const { users } = useSelector(state => state.patients); //ovde "users" naziv promenljive MORA BITI ISTI KAO u reducer.js promenljiva koja
  //je zapravo za InitialState
  const { user } = useSelector((state) => state.auth);

  const changeInput = (e) => {
    dispatch(searchPatientsAction(user[0].id,e.target.value))
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
  return (
    <Box flex={4} p={2}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Ime</StyledTableCell>
            <StyledTableCell align="center">Prezime</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Visina</StyledTableCell>
            <StyledTableCell align="center">Tezina</StyledTableCell>
            <StyledTableCell align="center">Telefon</StyledTableCell>
            <StyledTableCell align="center">Akcija</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users && users.map((patient) => (
            <StyledTableRow key={patient.id}>
              <StyledTableCell component="th" scope="row">
                {patient.Ime}
              </StyledTableCell>
              <StyledTableCell align="center">{patient.Prezime}</StyledTableCell>
              <StyledTableCell align="center">{patient.Email}</StyledTableCell>
              <StyledTableCell align="center">{patient.Visina}</StyledTableCell>
              <StyledTableCell align="center">{patient.Tezina}</StyledTableCell>
              <StyledTableCell align="center">{patient.Telefon}</StyledTableCell>
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
                  <Button onClick={()=>handleDelete(patient.Dodatne_info_Id)}>Obrisi</Button>
                </ButtonGroup>
                </Box>
              </StyledTableCell>
              
            </StyledTableRow>
          ))}
        </TableBody>
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
  )
}

// #region table elements
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
    backgroundColor: theme.palette.otherColor.main,
    color: theme.palette.primary.main,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
// #endregion
