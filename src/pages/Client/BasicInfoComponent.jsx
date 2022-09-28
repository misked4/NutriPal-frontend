import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Button, Typography, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { addBasicInfo, changePage, checkEmailAction } from '../../redux/newPatient/actions';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DatePicker from 'react-date-picker';
import { DescriptionAlertError } from '../../components/DescriptionAlerts';

export const BasicInfoComponent = () => {
  const { basicInfo } = useSelector((state) => state.newPatient);
  const { validEmail } = useSelector((state) => state.newPatient);
  let dispatch = useDispatch();

  const initialStateBasicInfo = {
      Ime: '' || basicInfo.Ime,
      Prezime: '' || basicInfo.Prezime,
      Email: '' || basicInfo.Email,
      Lozinka: '' || basicInfo.Lozinka,
      Lozinka2: '' || basicInfo.Lozinka2,
      Datum_rodjenja: '2022-9-21' || basicInfo.Datum_rodjenja,
      Uloga: 'Pacijent',
      Telefon: '' || basicInfo.Telefon,
      Adresa: '' || basicInfo.Adresa,
      Slika: '' || basicInfo.Slika,
      Pol: 'M' || basicInfo.Pol,
      Dodatne_info_Id: null || basicInfo.Dodatne_info_Id //ako je potrebno uhvati additionalInfo iz NewPatient
    }
    const [ basicInfoOfPatient, setBasicInfoOfPatient ] = useState(initialStateBasicInfo);
    const { Ime, Prezime, Email, Lozinka, Lozinka2, Telefon, Adresa, Pol } = basicInfoOfPatient;

    const [ error, setError ] = useState("");
    const [ dateFromForm, setDateFromForm ] = useState(new Date());

    const handleChange = (prop) => (event) => {
      setBasicInfoOfPatient({ ...basicInfoOfPatient, [prop]: event.target.value });
    };    
    
    const changeDate = (newDate) => {
      const offset = newDate.getTimezoneOffset();
      const newDateWithZone = new Date(newDate.getTime() - (offset*60*1000));
      const dateString = newDateWithZone.toISOString().split('T')[0];
      setDateFromForm(newDate); //moramo da vratimo ono sto DataPicker prepoznaje, ne moze samo dateString
      setBasicInfoOfPatient({ ...basicInfoOfPatient, Datum_rodjenja: dateString});
    }

    const handleImage = event => {
      const fileUploaded = event.target.files[0];
      console.log(fileUploaded);
    }

    const onClickEvent = (e) => {
      e.preventDefault();
      checkEverything();
    }

    const checkEmailEvent= () => {
      dispatch(checkEmailAction(Email));
    }

    const checkEverything = () => {
      console.log(basicInfoOfPatient);
      if(validEmail === undefined || validEmail === true)
      {
        checkEmailEvent();
      }
      if(validEmail === false)
      {
        if(basicInfoOfPatient.Ime && basicInfoOfPatient.Prezime && basicInfoOfPatient.Email && basicInfoOfPatient.Lozinka && 
          basicInfoOfPatient.Lozinka2 && basicInfoOfPatient.Datum_rodjenja && basicInfoOfPatient.Telefon && basicInfoOfPatient.Adresa)
        {
          if(basicInfoOfPatient.Lozinka === basicInfoOfPatient.Lozinka2)
          {
            setError("");
            console.log("USPESNO");
            dispatch(addBasicInfo(basicInfoOfPatient));
            dispatch(changePage("2"));
          }
          else setError("Lozinka");
        }
      }
    }

    useEffect(()=>{
      if(basicInfo.Email === undefined)
      {
        console.log("useeffect");
        if(validEmail === true)
        {
          setError("Email");
          console.log("Nazalost email je vec zauzet, izaberite neki drugi.");
        }
        else {
          if(validEmail === false && Email !== undefined)
          {
            checkEverything();
          }
          if(validEmail === undefined)
            setBasicInfoOfPatient({ ...basicInfoOfPatient, Email: ''});
        }
      }
    },[validEmail]);

    return (
    <Box>
      <FormControl variant="standard" sx={{ m: 1.5, mt: 3, width: '40ch' }}>
          <Input
            inputProps={{ maxLength: 30 }}
            value={Ime}
            onChange={handleChange('Ime')}
            endAdornment={Ime ? <InputAdornment position="end">Ime</InputAdornment> : <InputAdornment position="end">Niste uneli ime <WarningAmberOutlinedIcon/></InputAdornment>}
            startAdornment= {
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            }
          />
          <FormHelperText>name</FormHelperText>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1.5, mt: 3, width: '40ch' }}>
          <Input
            inputProps={{ maxLength: 30 }}
            value={Prezime}
            onChange={handleChange('Prezime')}
            endAdornment={Prezime ? <InputAdornment position="end">Prezime</InputAdornment> : <InputAdornment position="end">Niste uneli Prezime <WarningAmberOutlinedIcon/></InputAdornment>}
          />
          <FormHelperText>surname</FormHelperText>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1.5, mt: 3, width: '70ch' }}>
          <Input
            inputProps={{ maxLength: 100 }}
            value={Email}
            onChange={handleChange('Email')}
            disabled = {basicInfo.Email ? true : false}
            endAdornment={Email ? <InputAdornment position="end">Email</InputAdornment> : <InputAdornment position="end">Niste uneli Email <WarningAmberOutlinedIcon/></InputAdornment>}
            startAdornment= {
              <InputAdornment position="start">
                <AlternateEmailIcon />
              </InputAdornment>
            }
          />
          <FormHelperText>email</FormHelperText>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1.5, mt: 3, width: '35ch' }}>
          <Input
            inputProps={{ maxLength: 100 }}
            value={Lozinka}
            onChange={handleChange('Lozinka')}
            endAdornment={Lozinka ? <InputAdornment position="end">Lozinka</InputAdornment> : <InputAdornment position="end">Niste uneli Lozinku <WarningAmberOutlinedIcon /></InputAdornment>}
            startAdornment= {
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            }
          />
          <FormHelperText>password</FormHelperText>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1.5, mt: 3, width: '35ch' }}>
          <Input
            inputProps={{ maxLength: 100 }}
            value={Lozinka2}
            onChange={handleChange('Lozinka2')}
            endAdornment={Lozinka2 ? <InputAdornment position="end">Potvrda</InputAdornment> : <InputAdornment position="end">Niste potvrdili Lozinku <WarningAmberOutlinedIcon/></InputAdornment>}
          />
          <FormHelperText>confirm password</FormHelperText>
        </FormControl>
        
        <FormControl variant="standard" sx={{ m: 1.5, mt: 3, width: '50ch' }}>
        <InputLabel>Telefon</InputLabel>
          <Input
            inputProps={{ maxLength: 100 }}
            value={Telefon}
            onChange={handleChange('Telefon')}
            endAdornment={<InputAdornment position="end">Telefon</InputAdornment>}
          />
        </FormControl>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={Pol}
            onChange={handleChange('Pol')}
          >
            <FormControlLabel value="F" control={<Radio />} label="Female" />
            <FormControlLabel value="M" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth sx={{ m: 1.5 }} variant="standard">
          <InputLabel>Adresa</InputLabel>
          <Input
            inputProps={{ maxLength: 100 }}
            value={Adresa}
            onChange={handleChange('Adresa')}
            endAdornment={<InputAdornment position="end">Ulica i broj</InputAdornment>}
          />
        </FormControl>
        
        <Typography
          variant="body1"
          style={{whiteSpace: 'pre-line'}}
          sx={{ m: 1.5, mt: 3 }}
        >
          Datum rodjenja:
          <DatePicker onChange={(date) => {
                                const d = new Date(date);
                                changeDate(d);
                              }} value={dateFromForm} sx={{ m: 1.5, mt: 3, width: '50ch' }}/>
        </Typography>


        <Button sx={{ m: 1.5, mt: 3 }} onClick={onClickEvent}>Zapamti</Button>
        <Button
          variant="contained"
          component="label"
          sx={{ m: 1.5, mt: 3 }}
        >
          Upload File
          <input hidden accept="image/*" type="file" onChange={handleImage}/>
        </Button>
        {error && error==="Email" && DescriptionAlertError("Email koji ste uneli je vec zauzet.")}
        {error && error==="Lozinka" && DescriptionAlertError("Lozinke se ne poklapaju.")}
    </Box>
  )
}
