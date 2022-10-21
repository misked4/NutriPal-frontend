import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, InputAdornment, TextField, Button, Typography, FormControl, 
    Input, InputLabel, MenuItem, Select, FormHelperText, IconButton, 
    Grid, Paper, List, ListItem, ListItemButton, ListItemIcon, Checkbox, ListItemText, 
    Autocomplete, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Card,
    CardMedia, CardContent, Dialog, DialogActions } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Stack } from '@mui/system';
import { theme } from './../../theme';
import { DescriptionAlertError, DescriptionAlertSuccess } from '../../components/DescriptionAlerts';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import InfoIcon from '@mui/icons-material/Info';
import { getAllGroceries, getGroceriesByName, uploadImage } from './APIcalls';
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
        Cloudinary_public_id: null,
        Cilj: 1,
        Niz_namirnica: null
    }

    const [ groceries, setGroceries ] = useState([]);
    const [ recipeData, setRecipeData ] = useState(initialState);
    const { Naslov, Opis, Minutaza, Broj_porcija } = recipeData;
    
    const [ pageRecipe, setPageRecipe ] = useState(1);
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
        if(Naslov!==undefined && Opis!==undefined && previewSource && right.length > 0)
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
                setPageRecipe(1);
                handleAllRight();
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
                setRecipeData({...recipeData, Cloudinary_public_id: result.public_id, Slika: result.secure_url, Niz_namirnica: right});
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
    
    // #region Click next
    const onClickNext = () => {
        setPageRecipe(pageRecipe+1);
    };
    // #endregion

    // #region ListOfGroceries
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [details, setDetailes] = useState(false);
    const [groceryWithDetails, setGroceryWithDetails] = useState({});

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    var leftChecked = intersection(checked, left);
    var rightChecked = intersection(checked, right);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        if(right.length!==0)
        {
        for(var i = 0;i < left.length; i++){
            for(var j = 0;j < right.length; j++){
            if(JSON.stringify(left[i]) === JSON.stringify(right[j])){
                right.splice(j, 1);
            }
            }
        }
        }
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        if(right.length!==0)
        {
        for(var i = 0;i < leftChecked.length; i++){
            for(var j = 0;j < right.length; j++){
            if(JSON.stringify(leftChecked[i]) === JSON.stringify(right[j])){
                right.splice(j, 1);
            }
            }
        }
        }
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        //setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        //setLeft(left.concat(right));
        setRight([]);
        setChecked(not(checked, rightChecked)); //moja linija
    };

    const changeInput = (e) => {
        if(!e.target.value)
        {      
          var startIndex = 0;
          var endIndex = 10;
          setLeft(groceries.slice([startIndex], [endIndex]).map(oneGrocery=>{
            let currentGrocery = createModelForGrocery(oneGrocery.id, oneGrocery.Naziv, oneGrocery.kcal, oneGrocery.UH, oneGrocery.Proteini, oneGrocery.Masti, oneGrocery.Kategorija, oneGrocery.Slika, 1);
            return currentGrocery; 
          }));
        }
        else
        {
          getGroceriesByName(e.target.value)
            .then(data=>{
              setLeft(data.map(oneGrocery=>{
                let currentGrocery = createModelForGrocery(oneGrocery.id, oneGrocery.Naziv, oneGrocery.kcal, oneGrocery.UH, oneGrocery.Proteini, oneGrocery.Masti, oneGrocery.Kategorija, oneGrocery.Slika, 1);
                return currentGrocery; 
              }));
            })
            .catch(e=>console.log(e));
        }
    }

    const createModelForGrocery = (id, Naziv, kcal, UH, Proteini, Masti, Kategorija, Slika, Kolicina) => {
        return { id, Naziv, kcal: Math.round(kcal * 100) / 100, UH: Math.round(UH * 100) / 100, Proteini: Math.round(Proteini * 100) / 100, Masti: Math.round(Masti * 100) / 100, Kategorija, Slika, Kolicina };
    }

    useEffect(()=>{
        getAllGroceries()
          .then(data=>{
            setGroceries(data.map(oneGrocery=>{
              let currentGrocery = createModelForGrocery(oneGrocery.id, oneGrocery.Naziv, oneGrocery.kcal, oneGrocery.UH, oneGrocery.Proteini, oneGrocery.Masti, oneGrocery.Kategorija, oneGrocery.Slika, 1);
              return currentGrocery; 
            }));
            var startIndex = 0;
            var endIndex = 5;
            setLeft(data.slice([startIndex], [endIndex]).map(oneGrocery=>{
              let currentGrocery = createModelForGrocery(oneGrocery.id, oneGrocery.Naziv, oneGrocery.kcal, oneGrocery.UH, oneGrocery.Proteini, oneGrocery.Masti, oneGrocery.Kategorija, oneGrocery.Slika, 1);
              return currentGrocery; 
            }));
          })
          .catch(e=>console.log(e));
    },[]);

    const onChangeQuantity = (event, groceryId) => {
        const newRightSide = right.map(obj => {
            if (obj.id === groceryId) {
              return {...obj, Kolicina: parseInt(event.target.value)};
            }
            return obj;
          });
        setRight(newRightSide);
    }

    const customList = (items, side) => (
        <Box>
            <Paper sx={{ width: 530, height: 300, overflow: 'auto' }}>
                <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value.id}-label`;

                    return (
                        <ListItem
                        key={value.id}
                        secondaryAction={
                            <Box >
                            {side==="left"? <InfoIcon edge="end" aria-label="comments" onClick={()=>seeDetails(value)}/> :
                            <Input
                                edge="end"
                                aria-label="comments"
                                name="Kolicina"
                                type="number"
                                value={value.Kolicina}
                                onChange={(e)=>onChangeQuantity(e, value.id)}
                                inputProps={{ min: 1, max: 50, step: "1" }}
                                endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                            />}</Box>
                        }
                        disablePadding
                        >
                            <ListItemButton role="listitem" onClick={handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value.Naziv} sx={{ maxLength: 10, textOverflow: 'ellipsis' }}/>
                            </ListItemButton>
                        </ListItem>
                    );
                    })}
                    <ListItem />
                </List>
            </Paper>
            <Autocomplete spacing={2} sx={{ m: 2, width: 200,position: "center" }}
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={items.map((option) => option.Naziv)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Pretazite po Nazivu..."
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                        onChange={changeInput}
                    />
                    )}
                />
        </Box>
    );

    const seeDetails = (grocery) => {
        setGroceryWithDetails(grocery);        
        setDetailes(true);
    }

    const handleClose = () => {
        setDetailes(false);
      };
    // #endregion

    return (
      <Box flex={4} p={2}>
        <Stack direction='row' justifyContent='center' sx={{ backgroundColor: theme.palette.secondary.main, border: "1px solid black"}}>
            {pageRecipe!==2? <Typography>Dodajte recept koji zelite!</Typography> : <Typography>Izaberite namirice za recept!</Typography>}
    
        </Stack>
        <Divider color="black" sx={{mt: 3, mb:5}}/>
        
        {errorState && DescriptionAlertError("Morate uneti naziv i opis, kao i sliku. Proverite da li ste uneli neku namirnicu.")}
        {successState && DescriptionAlertSuccess("Uspesno ste dodali recept.")}

        {pageRecipe===1 && <Box>
            <Stack direction="column" spacing={2} id='swingBox' className='swing-in-top-fwd' display="flex" justifyContent="center" alignItems="center">
                <Grid container spacing={2} alignItems="center">
                        <Grid item>{customList(left, "left")}</Grid>
                        <Grid item>
                            <Grid container direction="column">
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAllRight}
                                    disabled={left.length === 0}
                                >
                                    <Typography color={left.length===0?"none":"black"}> &gt;&gt; </Typography>
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedRight}
                                    disabled={leftChecked.length === 0}
                                >                
                                    <Typography color={leftChecked.length===0?"none":"black"}> &gt; </Typography>
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedLeft}
                                    disabled={rightChecked.length === 0}
                                >
                                    <Typography color={rightChecked.length===0?"none":"black"}> &lt; </Typography>
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAllLeft}
                                    disabled={right.length === 0}
                                >
                                    <Typography color={right.length===0?"none":"black"}> &lt;&lt; </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>{customList(right,"right")}</Grid>
                </Grid>
            </Stack>
            <Button onClick={onClickNext} variant="contained" endIcon={<NextPlanIcon />} sx={{width: "15%", height: "25%",ml:27,mt:5 }}>
                Dalje
            </Button></Box>}
        {pageRecipe===2 && <Box><Stack direction="row" spacing={2}>
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
            </Stack>
        </Stack></Box>}
        
        {groceryWithDetails && <Dialog
          fullScreen={fullScreen}
          open={details}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <Card sx={{ width: 530, height: 470 }}>
                <CardMedia
                    component="img"
                    height="230"
                    image={groceryWithDetails.Slika}
                    alt="Nemamo sliku :("
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {groceryWithDetails.Naziv}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Namirnica (100g)</TableCell>
                                    <TableCell align="right">Kalorije</TableCell>
                                    <TableCell align="right">Ugljeni hidrati</TableCell>
                                    <TableCell align="right">Proteini</TableCell>
                                    <TableCell align="right">Masti</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                key={groceryWithDetails.Naziv}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {groceryWithDetails.Naziv}
                                </TableCell>
                                <TableCell align="right">{groceryWithDetails.kcal}</TableCell>
                                <TableCell align="right">{groceryWithDetails.UH}</TableCell>
                                <TableCell align="right">{groceryWithDetails.Proteini}</TableCell>
                                <TableCell align="right">{groceryWithDetails.Masti}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
          
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Procitao sam
            </Button>
          </DialogActions>
        </Dialog>}
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

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  