import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, InputAdornment, TextField, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { theme } from './../../theme';
import { DescriptionAlertError, DescriptionAlertSuccess } from '../../components/DescriptionAlerts';
import { uploadImage } from './APIcomms';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import axios from "axios";

export const NewRecipe = () => {
    let dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const initialState = {
        Naslov: '',
        Opis: '',
        Minutaza: 0,
        Broj_porcija: 0,
        KreatorId: user[0].id,
        Slika: null,
        Cloudinary_public_id: null
    }
    
    const [ recipeData, setRecipeData ] = useState(initialState);
    const { Naslov, Opis, Minutaza, Broj_porcija } = recipeData;
    
    const [ errorState, setErrorState ] = useState(false);
    const [ successState, setSuccessState ] = useState(false);

    const onChangeParameter = (e) => {
        setErrorState(false);
        setSuccessState(false);
        setRecipeData((prevState) => ({
          ...prevState,
          [e.target.name] : e.target.value,
        }))
    }

    const saveRecipe = () => {
        if(Naslov!==undefined && Opis!=undefined && previewSource)
        {
            uploadImageFunction(previewSource);
        }
        else
        {
            setRecipeData(initialState);
            setErrorState(true);
        }
    }

    const addRecipe = (recipeDate) => {
        return function (dispatch) {
            axios
            .post(`${process.env.REACT_APP_API}/recipe`, recipeDate)
            .then((resp) => {
                console.log("Response from addRecipe: ",resp);
                setSuccessState(true);
                setPreviewSource(null);
                setRecipeData(initialState);
            })
            .catch((error) => console.log(error));
        }
    }
    // #region fileUpload
    const [previewSource, setPreviewSource] = useState();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
    }
    
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); //convert image to URL
        reader.onloadend = () => {
        setPreviewSource(reader.result);
        }    
    }
    const uploadImageFunction = async(base64EncodedImage) => {
        const body = JSON.stringify({
          data: base64EncodedImage
        });
        const jsonObj = JSON.parse(body);
        //dispatch(loading());
        uploadImage(jsonObj)
          .then(result=>{            
                setRecipeData({...recipeData, Cloudinary_public_id: result.public_id, Slika: result.secure_url});
          })
          .catch(e=>console.log(e));
    }

    useEffect(()=>{
        console.log("EFFECT");
        if(recipeData.Cloudinary_public_id!==null)
        {
            dispatch(addRecipe(recipeData));
            setErrorState(false);
        }
      }, [recipeData.Cloudinary_public_id]) //dodaj navigate
    // #endregion
    return (
      <Box flex={4} p={2}>
        <Stack direction='row' justifyContent='center' sx={{ backgroundColor: theme.palette.secondary.main, border: "1px solid black"}}>
            <Typography><h1>Dodajte recept koji zelite</h1></Typography>
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
                    label="Naslov"
                    name="Naslov"
                    value={Naslov}
                    onChange={onChangeParameter}
                    placeholder="Unesite Naslov"
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
                <Typography align="right">*Unesite minutazu i broj porcija</Typography>
                <Stack
                direction="row"
                maxrows = {2}
                spacing={2}
                sx={themeForStack}>
                    <TextField
                    id="outlined-textarea"
                    label="Minutaza"
                    name="Minutaza"
                    value={Minutaza}
                    onChange={onChangeParameter}
                    placeholder="Unesite minutazu"
                    maxrows={1}
                    multiline
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            min
                            </InputAdornment>
                        }}
                    />
                    <TextField
                    id="outlined-textarea"
                    label="Broj_porcija"
                    name="Broj_porcija"
                    value={Broj_porcija}
                    onChange={onChangeParameter}
                    placeholder="Unesite br. porcija"
                    maxrows={1}
                    multiline
                    />
                </Stack>
            </Stack>
        </Stack>
        {previewSource && (<Box
                                  component="img"
                                  sx={{
                                    height: "50%",
                                    width: "50%",
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                  }}
                                  src={previewSource}
                                />)}
        <input type="file" name="image" onChange={handleFileInputChange}/>    
        <Button sx={{m:1}} variant="contained" onClick={saveRecipe} endIcon={<SaveAltIcon />}>
        Zapamti
        </Button>
        {errorState && DescriptionAlertError("Morate uneti naziv i opis, kao i sliku.")}
        {successState && DescriptionAlertSuccess("Uspesno ste dodali recept.")}
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