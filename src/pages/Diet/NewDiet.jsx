import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, InputAdornment, TextField, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { theme } from './../../theme';
import { DescriptionAlertError, DescriptionAlertSuccess } from '../../components/DescriptionAlerts';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { changeHeightVmax } from '../../Common';
import axios from "axios";

export const NewDiet = () => {
    let dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const initialState = {
        Naziv: '',
        Opis: '',
        UH_min: '',
        UH_max: '',
        PROTEINI_min: '',
        PROTEINI_max: '',
        MASTI_min: '',
        MASTI_max: '',
        KreatorId: user[0].id
    }
    
    const [dietData, setDietData] = useState(initialState);
    const { Naziv, Opis, UH_min, UH_max, PROTEINI_min, PROTEINI_max, MASTI_min, MASTI_max } = dietData;
    
    const [ errorState, setErrorState ] = useState(false);
    const [ successState, setSuccessState ] = useState(false);

    const onChangeParameter = (e) => {
        setErrorState(false);
        setSuccessState(false);
        setDietData((prevState) => ({
          ...prevState,
          [e.target.name] : e.target.value,
        }))
    }

    const saveDiet = () => {
        if(UH_max <= 100 && PROTEINI_max <= 100 && MASTI_max <= 100
            && UH_min >= 0 && PROTEINI_min >= 0 && MASTI_min >= 0 && Naziv!==undefined
            && UH_max > UH_min && PROTEINI_max > PROTEINI_min && MASTI_max > MASTI_min)
        {
            console.log(dietData);
            dispatch(addDiet(dietData));
            setErrorState(false);
        }
        else
        {
            setDietData((prevState) => ({
                ...prevState,
                UH_min: '',
                UH_max: '',
                PROTEINI_min: '',
                PROTEINI_max: '',
                MASTI_min: '',
                MASTI_max: ''
              }));
            setErrorState(true);
        }
    }

    const addDiet = (dietData) => {
        return function (dispatch) {
            axios
            .post(`${process.env.REACT_APP_API}/diet`, dietData)
            .then((resp) => {
                console.log("Response from addDiet: ",resp);
                setSuccessState(true);
                setDietData(initialState);
            })
            .catch((error) => console.log(error));
        }
    }

    useEffect(()=>{
        changeHeightVmax();
    },[]);

    return (
      <Box flex={4} p={2}>
        <Stack direction='row' justifyContent='center' sx={{ backgroundColor: theme.palette.secondary.main, border: "1px solid black"}}>
            <Typography><h1>Dodajte dijetu koju zelite</h1></Typography>
        </Stack>
        <Divider color="black" sx={{mt: 3, mb:5}}/>
        <Stack direction="row" spacing={2}>
            <Stack 
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25vw' },
                '& fieldset': {
                    borderColor: 'black',
                },
                '&:hover fieldset': {
                    borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                    borderColor: 'black',
                },
            }}
            noValidate
            autoComplete="off"
            direction="column"
            spacing={2}
            justifyContent="space-between">
                    <TextField
                    id="outlined-textarea"
                    label="Naziv"
                    name="Naziv"
                    value={Naziv}
                    onChange={onChangeParameter}
                    placeholder="Unesite naziv"
                    maxrows={1}
                    multiline
                    />
                    <TextField
                    id="outlined-multiline-static"
                    label="Opis"
                    name="Opis"
                    value={Opis}
                    onChange={onChangeParameter}
                    placeholder="Unesite opis.."
                    multiline
                    rows={10}
                    />
            </Stack>
            <Stack direction="column" spacing={2}>
                <Typography align="right">*Unesite granice UH</Typography>
                <Stack
                direction="row"
                maxrows = {2}
                spacing={2}
                sx={themeForStack}>
                    <TextField
                    id="outlined-textarea"
                    label="UH_min"
                    name="UH_min"
                    value={UH_min}
                    onChange={onChangeParameter}
                    placeholder="Unesite min UH"
                    maxrows={1}
                    multiline
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            %
                            </InputAdornment>
                        }}
                    />
                    <TextField
                    id="outlined-textarea"
                    label="UH_max"
                    name="UH_max"
                    value={UH_max}
                    onChange={onChangeParameter}
                    placeholder="Unesite max UH"
                    maxrows={1}
                    multiline
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            %
                            </InputAdornment>
                        }}
                    />
                </Stack>
                <Typography align="right">*Unesite granice proteina</Typography>
                <Stack
                direction="row"
                maxrows = {2}
                spacing={2}
                sx={themeForStack}>                    
                    <TextField
                        id="outlined-textarea"
                        label="PROTEINI_min"
                        name="PROTEINI_min"
                        value={PROTEINI_min}
                        onChange={onChangeParameter}
                        placeholder="Unesite min proteina"
                        maxrows={1}
                        multiline
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                %
                              </InputAdornment>
                          }}
                    />
                    <TextField
                    id="outlined-textarea"
                    label="PROTEINI_max"
                    name="PROTEINI_max"
                    value={PROTEINI_max}
                    onChange={onChangeParameter}
                    placeholder="Unesite max proteina"
                    maxrows={1}
                    multiline
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            %
                            </InputAdornment>
                        }}
                    />
                </Stack>
                <Typography align="right">*Unesite granice masti</Typography>
                <Stack
                direction="row"
                maxrows = {2}
                spacing={2}
                sx={themeForStack}>                    
                    <TextField
                        id="outlined-textarea"
                        label="MASTI_min"
                        name="MASTI_min"
                        value={MASTI_min}
                        onChange={onChangeParameter}
                        placeholder="Unesite min masti"
                        maxrows={1}
                        multiline
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                %
                              </InputAdornment>
                          }}
                        />
                        <TextField
                        id="outlined-textarea"
                        label="MASTI_max"
                        name="MASTI_max"
                        value={MASTI_max}
                        onChange={onChangeParameter}
                        placeholder="Unesite max masti"
                        maxrows={1}
                        multiline
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                %
                              </InputAdornment>
                          }}
                        />
                </Stack>
            </Stack>
        </Stack>
        <Button sx={{m:1}} variant="contained" onClick={saveDiet} endIcon={<SaveAltIcon />}>
        Zapamti
        </Button>
        {errorState && DescriptionAlertError("Ne smete uneti ispod 0 za minimum, niti iznad 100 za maximum")}
        {successState && DescriptionAlertSuccess("Uspesno ste dodali dijetu.")}
      </Box>
      
    )
  }

const themeForStack = {
    marginTop: 0,
    '& .MuiTextField-root': { m: 1, width: '14vw' },
    '& fieldset': {
        borderColor: 'black',
    },
    '&:hover fieldset': {
        borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
        borderColor: 'black',
    },
}