import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, FormHelperText, Input, InputAdornment, Button } from '@mui/material';
import { addAdditionalInfo, changePage } from '../../redux/newPatient/actions';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';

export const AnthropometricParameters = () => {
    const { additionalInfo } = useSelector((state) => state.newPatient);
    const { user } = useSelector((state) => state.auth);
    let dispatch = useDispatch();

    const initialStateAddInfo = {
        KreatorId: user[0].id,
        Visina: '' || additionalInfo.Visina,
        Tezina: '' || additionalInfo.Tezina
        }
    const [ additionalInfoPatient, setAdditionalInfoPatient ] = useState(initialStateAddInfo);
    const { Visina, Tezina } = additionalInfoPatient;

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
        <Button sx={{ m: 3 }} onClick={onClickEvent}>Zapamti</Button>
        <Button sx={{ m: 3 }} onClick={onClickEventBack}>Vrati se nazad</Button>
    </Box>
  )
}
