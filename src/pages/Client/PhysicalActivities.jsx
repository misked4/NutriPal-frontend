import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Box, Button, MenuItem, FormControl, Input, InputAdornment, FormHelperText, InputLabel, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import { addAdditionalInfo, changePage, getAllActivities, addPatientAction } from '../../redux/newPatient/actions';
import { TextField } from '@mui/material';
import { theme } from "../../theme";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/system';

export const PhysicalActivities = () => {
    const { additionalInfo } = useSelector((state) => state.newPatient);
    const { basicInfo } = useSelector((state) => state.newPatient);
    const { activities } = useSelector((state) => state.newPatient);
    const { user } = useSelector((state) => state.auth);
    let dispatch = useDispatch();

    const initialStateAddInfo = {
        KreatorId: user[0].id,
        Visina: additionalInfo.Visina,
        Tezina: additionalInfo.Tezina,
        Cilj_ishrane: additionalInfo.Cilj_ishrane,
        PotrosnjaKalorija: '25' || additionalInfo.PotrosnjaKalorija,
        DijetaId: additionalInfo.DijetaId
        }
    const [ additionalInfoPatient, setAdditionalInfoPatient ] = useState(initialStateAddInfo);
    const { PotrosnjaKalorija } = additionalInfoPatient;
    const [ custom, setCustom ] = useState(false);
    const [ selectedActivity, setSelectedActivity] = useState([]);
    const [ listOfSelectedActivities, setListOfSelectedActivities ] = useState([]);

    const [ time, setTime ] = useState({
      Hours: 0,
      Minutes: 0
    });
    const [ kcal, setKcal ] = useState(0);

    const handleTime = (event) => {
      if((event.target.name === "Minutes" && event.target.value >= 60) || event.target.value < 0
        || (event.target.name === "Hours" && event.target.value >= 24))
      {
        event.target.value = 0;        
      }
      setTime({
        ...time,
        [event.target.name]: event.target.value,
      });
    };

    const changeCustom = () => {
      setCustom(!custom);
      if(custom)
        setAdditionalInfoPatient({ ...additionalInfoPatient, PotrosnjaKalorija: '25' });
      else setAdditionalInfoPatient({ ...additionalInfoPatient, PotrosnjaKalorija: '0' });
    }

    const handleChange = (prop) => (event) => {
        setAdditionalInfoPatient({ ...additionalInfoPatient, [prop]: event.target.value });
    };

    const Save = (e) => {
      e.preventDefault();
      if(PotrosnjaKalorija !== ''){
        dispatch(addAdditionalInfo(additionalInfoPatient));
        dispatch(addPatientAction(user[0].id, additionalInfoPatient, basicInfo)); //ova funckija ide na kraju
        dispatch(changePage("4"));
      }
    };
    const returnBack = (e) => {
      e.preventDefault();
      if(PotrosnjaKalorija !== ''){
        dispatch(addAdditionalInfo(additionalInfoPatient));
      }
      dispatch(changePage("2"));
    };

    const intensityOfPhysicalActivity = [
        {
          value: '20',
          label: 'Veoma slab',
        },
        {
          value: '25',
          label: 'Slab',
        },
        {
          value: '30',
          label: 'Umeren',
        },
        {
          value: '35',
          label: 'Pojacan',
        },
        {
          value: '40',
          label: 'Izrazen',
        },
        {
          value: '45',
          label: 'Ektreman',
        },
      ];

    const calculate = () => {
      const factor = selectedActivity.Faktor;
      const sumMinutes = Number(time.Hours) * 60 + Number(time.Minutes);
      const oneCalculateKcal = Math.round(factor * sumMinutes);
      setKcal(kcal + oneCalculateKcal);
      setAdditionalInfoPatient({ ...additionalInfoPatient, PotrosnjaKalorija: (kcal + oneCalculateKcal) });
      const item = {
        Id: selectedActivity.id,
        Naziv: selectedActivity.Naziv,
        Faktor: selectedActivity.Faktor,
        Hours: Number(time.Hours),
        Minutes: Number(time.Minutes),
        CalculatedKcal: oneCalculateKcal
      }
      listOfSelectedActivities.push(item);   
    }

    useEffect(() => {
      console.log(additionalInfo);
      dispatch(getAllActivities());
    },[]);

    return (
    <Box>
      {!custom? <><TextField
          sx={{ m: 3, width: '500px' }}
          select
          label="Izaberite"
          value={PotrosnjaKalorija}
          onChange={handleChange('PotrosnjaKalorija')}
          helperText="Molimo Vas izaberite intenzitet fizicke aktivnosti"
        >
          {intensityOfPhysicalActivity.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button  sx={{ m: 1.5 }} onClick={changeCustom}>Dodatne aktivnosti</Button></> :
        <><Stack spacing={1}><Item>{ activities.length>0 && <Autocomplete
          onChange={(event, value) => setSelectedActivity(value)}
          sx={{ m: 3, width: '400px' }}
          //multiple - za vise
          limitTags={2}
          options={activities}
          getOptionLabel={(option) => option.id + " | " +option.Naziv}
          renderInput={(params) => (
            <TextField {...params} label="Aktivnosti" placeholder="Favorites"/>
          )}/>}
          <FormControl variant="standard" sx={{ m: 2, mt: 3, width: '10ch' }} >
          <InputLabel>Unesi sate</InputLabel>
          <Input
            name="Hours"
            type="number"
            value={time.Hours}
            onChange={handleTime}
            inputProps={{ min: 0, max: 60, step: "1" }}
            endAdornment={<InputAdornment position="end">h</InputAdornment>}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ m: 2, mt: 3, width: '10ch' }}>
        <InputLabel>Unesi minutazu</InputLabel>
          <Input
            name="Minutes"
            type="number"
            value={time.Minutes}
            onChange={handleTime}
            inputProps={{ min: 0, max: 60, step: "1" }}
            endAdornment={<InputAdornment position="end">min</InputAdornment>}

          />
        </FormControl>
        <Button  sx={{ m: 3 }} onClick={calculate}>Izracunaj kalorije</Button></Item>
          <Item>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Aktivnost</StyledTableCell>
                  <StyledTableCell align="center">Kalorije</StyledTableCell>
                </TableRow>
                <TableBody>
                  {listOfSelectedActivities.map((activityWithAddInfo)=>(
                    <StyledTableRow key={activityWithAddInfo.id}>
                      <StyledTableCell align="center">{activityWithAddInfo.Naziv}</StyledTableCell>
                      <StyledTableCell align="center">{activityWithAddInfo.CalculatedKcal}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </TableHead>
            </Table>
          </TableContainer></Item>
          
        <Item><Button  sx={{ m: 3 }} onClick={changeCustom}>Vrati se nazad</Button></Item></Stack></>}
        
        <FormControl variant="standard" sx={{ m: 2, mt: 3, width: '35ch' }}>
          <Input
            disabled={true}
            value={PotrosnjaKalorija}
            endAdornment={<InputAdornment position="end">kcal</InputAdornment>}
            startAdornment= {
              <InputAdornment position="start">
                <ScaleIcon />
              </InputAdornment>
            }
          />
          <FormHelperText>kcal</FormHelperText>
        </FormControl>
        <Button  sx={{ m: 3 }} onClick={Save}>Zapamti</Button>
        <Button  sx={{ m: 3 }} onClick={returnBack}>Vrati se nazad</Button>
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
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.otherColor.main,
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));
// #endregion