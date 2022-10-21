import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { Box, FormControl, FormHelperText, Input, InputAdornment, Typography, Button, InputLabel, MenuItem, Select } from '@mui/material';
import { Stack } from '@mui/system';
import { addAdditionalInfo, changePage } from '../../redux/newPatient/actions';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';

export const AnthropometricParameters = () => {
    const { additionalInfo } = useSelector((state) => state.newPatient);
    const { user } = useSelector((state) => state.auth);
    const [allDiets, setAllDiets] = useState([]);
    let dispatch = useDispatch();

    const initialStateAddInfo = {
        KreatorId: user[0].id,
        Visina: '' || additionalInfo.Visina,
        Tezina: '' || additionalInfo.Tezina,
        Cilj_ishrane: 'Smanjenje telesne mase' || additionalInfo.Cilj_ishrane,
        DijetaId: 1 || additionalInfo.DijetaId
        }
    const [ additionalInfoPatient, setAdditionalInfoPatient ] = useState(initialStateAddInfo);
    const { Visina, Tezina, Cilj_ishrane, DijetaId } = additionalInfoPatient;

    const handleChange = (prop) => (event) => {
        setAdditionalInfoPatient({ ...additionalInfoPatient , [prop]: event.target.value });
    };

    const onClickEvent = (e) => { //dodati da li je korisnik uneo prave podatke
      e.preventDefault();
      dispatch(addAdditionalInfo(additionalInfoPatient));
      dispatch(changePage("3"));
    };
    const onClickEventBack = (e) => {
      e.preventDefault();
      dispatch(addAdditionalInfo(additionalInfoPatient));
      dispatch(changePage("1"));
    };

    useEffect(()=>{
      axios
      .get(`${process.env.REACT_APP_API}/diets`)
      .then((resp) =>  {
        setAllDiets(resp.data);
        setAdditionalInfoPatient({ ...additionalInfoPatient , DijetaId: additionalInfo.DijetaId? additionalInfo.DijetaId : 1 });
      })
      .catch((error) => console.log(error));
    },[]);

    return (
    <Box>
        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '35ch' }}>
          <Input
            value={Visina}
            onChange={handleChange('Visina')}
            endAdornment={<InputAdornment position="end">cm</InputAdornment>}
            startAdornment= {
              <InputAdornment position="start">
                <HeightIcon />
              </InputAdornment>
            }
          />
          <FormHelperText>height</FormHelperText>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '35ch' }}>
          <Input
            value={Tezina}
            onChange={handleChange('Tezina')}
            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
            startAdornment= {
              <InputAdornment position="start">
                <MonitorWeightIcon />
              </InputAdornment>
            }
          />
          <FormHelperText>weight</FormHelperText>
        </FormControl>
        <Stack direction="row" spacing={2}>
            <Typography sx={{mt: 2, mr: 2}}><h3>Izaberite cilj ishrane:</h3></Typography>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-required-label">Cilj</InputLabel>
                <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={Cilj_ishrane}
                label="Cilj *"
                onChange={handleChange('Cilj_ishrane')}
                >
                    <MenuItem value={"Smanjenje telesne mase"}>Smanjenje telesne mase</MenuItem>
                    <MenuItem value={"Zadržavanje telesne mase"}>Zadržavanje telesne mase</MenuItem>
                    <MenuItem value={"Povecanje telesne mase"}>Povecanje telesne mase</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
            <Typography sx={{mt: 2, mr: 2}}><h3>Izaberite Dijetu za korisnika ishrane:</h3></Typography>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-required-label">Dijeta</InputLabel>
                {allDiets.length>0 && <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={DijetaId}
                label="Dijeta *"
                onChange={handleChange('DijetaId')}
                >
                  {allDiets.map((diet) => (
                    <MenuItem value={diet.id}>{diet.Naziv}</MenuItem>
                  ))}
                </Select> }
                <FormHelperText>Required</FormHelperText>
            </FormControl>
        </Stack>
        <Button sx={{ m: 3 }} onClick={onClickEvent}>Zapamti</Button>
        <Button sx={{ m: 3 }} onClick={onClickEventBack}>Vrati se nazad</Button>
    </Box>
  )
}
