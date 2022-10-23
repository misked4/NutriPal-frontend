import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Box, Button, MenuItem, FormControl, Input, InputAdornment, FormHelperText, InputLabel, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import { addAdditionalInfo, changePage, getAllActivities, addPatientAction } from '../../redux/newPatient/actions';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
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
        BMR: '' || additionalInfo.BMR,
        TEE: '' || additionalInfo.TEE,
        BMI: '' || additionalInfo.BMI,
        DijetaId: additionalInfo.DijetaId,
        }
    const [ additionalInfoPatient, setAdditionalInfoPatient ] = useState(initialStateAddInfo);
    const { PotrosnjaKalorija, BMR, TEE, BMI, Visina, Tezina } = additionalInfoPatient;
    const [ custom, setCustom ] = useState(false);
    const [ selectedActivity, setSelectedActivity] = useState([]);
    const [ listOfSelectedActivities, setListOfSelectedActivities ] = useState([]);
    const [ kcal, setKcal ] = useState(0);
    var bmr, tee, bmi = '';

    const [ time, setTime ] = useState({
      Hours: 0,
      Minutes: 0
    });    

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
          factor: '1.3',
          label: 'Veoma slab',
        },
        {
          value: '25',
          factor: '1.52',
          label: 'Slab',
        },
        {
          value: '30',
          factor: '1.67',
          label: 'Umeren',
        },
        {
          value: '35',
          factor: '1.85',
          label: 'Pojacan',
        },
        {
          value: '40',
          factor: '2.2',
          label: 'Izrazen',
        },
        {
          value: '45',
          factor: '2.5',
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
      calculateAll3Parameters();
    },[]);

    useEffect(() => {
      console.log(additionalInfo);
      calculateAll3Parameters();
    },[PotrosnjaKalorija]);

    const calculateAll3Parameters = () => {
      var BMRfromFunction = calculateBMR();
      calculateTEE(BMRfromFunction);
      calculateBMI();
      console.log(additionalInfoPatient);
    }

    const calculateBMR = () => { //super
      var formula = null;
      const Broj_godina=sqlToJsDateAndCalcAge(basicInfo.Datum_rodjenja);
      if(basicInfo && basicInfo.Pol === 'M')
      {
        formula = (10*Tezina)+(6.25*Visina)-(5*Broj_godina)+5;
      }
      else{
        formula = (10*Tezina)+(6.25*Visina)-(5*Broj_godina)-161;
      }
      formula = Math.round(formula * 100) / 100;
      bmr = formula;
      return formula;
    }

    const calculateTEE = (BMRfromFunction) => { //MORA DA SE ISPRAVI ZA IZABRANE AKTIVNOSTI SA MINUTAZOM
      var factor= '1.3';
      factor = intensityOfPhysicalActivity.find((el) => el.value === PotrosnjaKalorija).factor;
      var formula = BMRfromFunction * factor;
      formula = Math.round(formula * 100) / 100;
      tee = formula;
      setAdditionalInfoPatient({ ...additionalInfoPatient, TEE: formula });
    }

    const calculateBMI = () => { //super
      console.log("bmr");
      console.log(bmr);
      console.log("tee");
      console.log(tee);
      var formula = null;
      if(basicInfo)
      { 
        formula = Tezina / ((Visina/100) * (Visina/100));
        formula = Math.round(formula * 100) / 100;
        console.log("BMI");
        console.log(formula);
        setAdditionalInfoPatient({ ...additionalInfoPatient, BMR: bmr, TEE: tee, BMI: formula });
      }
    }

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
        <Stack direction='row' space={4}>
          <Stack direction='column' space={2}>
            <FormControl variant="standard" sx={{ m: 2, mt: 3, width: '35ch' }}>
              <Input
                disabled={true}
                value={BMR}
                endAdornment={<InputAdornment position="end">kcal</InputAdornment>}
                startAdornment= {
                  <InputAdornment position="start">
                    <SquareFootIcon/>
                  </InputAdornment>
                }
              />
              <FormHelperText>BMR (Bazalni metabolizam)</FormHelperText>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 2, mt: 3, width: '35ch' }}>
              <Input
                disabled={true}
                value={TEE}
                endAdornment={<InputAdornment position="end">kcal</InputAdornment>}
                startAdornment= {
                  <InputAdornment position="start">
                    <SquareFootIcon/>
                  </InputAdornment>
                }
              />
              <FormHelperText>TEE (Ukupna energetska potrošnja)</FormHelperText>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 2, mt: 3, width: '35ch' }}>
              <Input
                disabled={true}
                value={BMI}
                endAdornment={<InputAdornment position="end">kg/m^2</InputAdornment>}
                startAdornment= {
                  <InputAdornment position="start">
                    <SquareFootIcon/>
                  </InputAdornment>
                }
              />
              <FormHelperText>BMI (Indeks telesne mase)</FormHelperText>
            </FormControl>
          
          
          </Stack>

          <Stack direction='column' space={2}>
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
            <Stack direction='row' space={2}>
              <Button  sx={{ m: 3 }} onClick={Save}>Zapamti</Button>
              <Button  sx={{ m: 3 }} onClick={returnBack}>Vrati se nazad</Button>
            </Stack>
          </Stack>
        </Stack>
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
// #endregion