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

export const NewActivity = () => {
    let dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const initialState = {
        Naziv: '',
        Faktor: ''
    }

    const [ actionData, setActionData] = useState(initialState);
    const { Naziv, Faktor } = actionData;

    const [ errorState, setErrorState ] = useState(false);
    const [ successState, setSuccessState ] = useState(false);

    useEffect(()=>{
        changeHeightVmax();
    },[]);

    const onChangeParameter = (e) => {
        setErrorState(false);
        setSuccessState(false);
        setActionData((prevState) => ({
          ...prevState,
          [e.target.name] : e.target.value,
        }))
    }

    const saveAction = () => {
        if(Faktor > 0 && Naziv!==undefined)
        {
            console.log(actionData);
            dispatch(addAcitvity(actionData));
            setErrorState(false);
        }
        else
        {
            setActionData((prevState) => ({
                ...prevState,
                Naziv: '',
                Faktor: ''
              }));
            setErrorState(true);
        }
    }

    const addAcitvity = (actionData) => {
        return function (dispatch) {
            axios
            .post(`${process.env.REACT_APP_API}/activity`, actionData)
            .then((resp) => {
                console.log("Response from addAcitvity: ",resp);
                setSuccessState(true);
                setActionData(initialState);
            })
            .catch((error) => console.log(error));
        }
    }

    return (
        <Box flex={4} p={2}>            
            {errorState && DescriptionAlertError("Ne smete uneti ispod 0 za minimum, niti iznad 100 za maximum")}
            {successState && DescriptionAlertSuccess("Uspesno ste dodali dijetu.")}
            <Stack direction='row' justifyContent='center' sx={{ backgroundColor: theme.palette.secondary.main, border: "1px solid black"}}>
            <Typography><h1>Dodajte aktivnost koju zelite</h1></Typography>
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
                spacing={1}>
                        <TextField
                        id="outlined-textarea"
                        label="Naziv"
                        name="Naziv"
                        value={Naziv}
                        onChange={onChangeParameter}
                        placeholder="Unesite naziv aktivnosti"
                        maxrows={1}
                        multiline
                        />
                        <TextField
                        id="outlined-textarea"
                        label="Faktor"
                        name="Faktor"
                        value={Faktor}
                        onChange={onChangeParameter}
                        placeholder="Unesite faktor aktivnosti"
                        maxrows={1}
                        multiline
                        />
                </Stack>
            </Stack>
            <Button sx={{m:1}} variant="contained" onClick={saveAction} endIcon={<SaveAltIcon />}>
            Zapamti
            </Button>
        </Box>
    );
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