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

export const NewGrocery = () => {
    let dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const initialState = {
        Naziv: '',
        kcal: '',
        UH: '',
        Proteini: '',
        Masti: '',
        Kategorija: '',
        Slika: ''
    }

    const [ groceryData, setGroceryData] = useState(initialState);
    const { Naziv, kcal, UH, Proteini, Masti, Kategorija, Slika } = groceryData;

    const [ errorState, setErrorState ] = useState(false);
    const [ successState, setSuccessState ] = useState(false);

    useEffect(()=>{
        changeHeightVmax();
    },[]);

    const onChangeParameter = (e) => {
        setErrorState(false);
        setSuccessState(false);
        setGroceryData((prevState) => ({
          ...prevState,
          [e.target.name] : e.target.value,
        }))
    }

    const saveGrocery = () => {
        if(kcal > 0 && UH > 0 && Proteini > 0 && Masti > 0 && Naziv!==undefined)
        {
            console.log(groceryData);
            dispatch(addGrocery(groceryData));
            setErrorState(false);
        }
        else
        {
            setGroceryData((prevState) => ({
                ...prevState,
                Naziv: '',
                kcal: '',
                UH: '',
                Proteini: '',
                Masti: '',
                Kategorija: '',
                Slika: ''
              }));
            setErrorState(true);
        }
    }

    const addGrocery = (groceryData) => {
        return function (dispatch) {
            axios
            .post(`${process.env.REACT_APP_API}/grocery`, groceryData)
            .then((resp) => {
                console.log("Response from addGrocery: ",resp);
                setSuccessState(true);
                setGroceryData(initialState);
            })
            .catch((error) => console.log(error));
        }
    }

    return (
        <Box flex={4} p={2}>            
            {errorState && DescriptionAlertError("Ne smete uneti ispod 0 za minimum, niti iznad 100 za maximum")}
            {successState && DescriptionAlertSuccess("Uspesno ste dodali dijetu.")}
            <Stack direction='row' justifyContent='center' sx={{ backgroundColor: theme.palette.secondary.main, border: "1px solid black"}}>
            <Typography><h1>Dodajte namirnicu koju zelite</h1></Typography>
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
                        placeholder="Unesite naziv"
                        maxrows={1}
                        multiline
                        />
                        <TextField
                        id="outlined-textarea"
                        label="kcal"
                        name="kcal"
                        value={kcal}
                        onChange={onChangeParameter}
                        placeholder="Unesite kalorije(100gr)"
                        maxrows={1}
                        multiline
                        />
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Stack
                    direction="row"
                    maxrows = {2}
                    spacing={2}
                    sx={themeForStack}>
                        <TextField
                        id="outlined-textarea"
                        label="UH"
                        name="UH"
                        value={UH}
                        onChange={onChangeParameter}
                        placeholder="Unesite ugljene hidrate"
                        maxrows={1}
                        multiline
                        />
                    </Stack>
                    <Stack
                    direction="row"
                    maxrows = {2}
                    spacing={2}
                    sx={themeForStack}>
                        <TextField
                        id="outlined-textarea"
                        label="Proteini"
                        name="Proteini"
                        value={Proteini}
                        onChange={onChangeParameter}
                        placeholder="Unesite ugljene proteine"
                        maxrows={1}
                        multiline
                        />
                    </Stack>
                    <Stack
                    direction="row"
                    maxrows = {2}
                    spacing={2}
                    sx={themeForStack}>
                        <TextField
                        id="outlined-textarea"
                        label="Masti"
                        name="Masti"
                        value={Masti}
                        onChange={onChangeParameter}
                        placeholder="Unesite ugljene masti"
                        maxrows={1}
                        multiline
                        />
                    </Stack>
                </Stack>
            </Stack>
            <Button sx={{m:1}} variant="contained" onClick={saveGrocery} endIcon={<SaveAltIcon />}>
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