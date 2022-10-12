import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, InputLabel, MenuItem, Select, FormHelperText, FormControl, TextField, 
  Card, CardMedia, CardContent, CardActions, IconButton, Input, InputAdornment, Chip, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Stack } from '@mui/system';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import { getAllRecipesForNutri, getRecipeWithHisGroceries } from './APIcomms';
import Autocomplete from '@mui/material/Autocomplete';
import './NewFoodSchedule.css'

const n = 7;
const m = 8;
export const NewFoodSchedule = ({ personOnADietPlan }) => {
  const { user } = useSelector((state) => state.auth);

  const [matrix, setMatrix] = useState(Array.from({length: n},()=> Array.from({length: m}, () => null)));
  const [indexOfRow, setIndexOfRow] = useState(-1);
  const [indexOfColumn, setIndexOfColumn] = useState(-1);
  const [hiddenForm, setHiddenForm] = useState(true);
  const [pageRecipe, setPageRecipe] = useState(1);  
  const [goal, setGoal] = useState("Smanjenje telesne mase");
  const [recipes, setRecipes] = useState();
  const [chosenRecipe, setChosenRecipe] = useState(null);
  const [groceriesForChosenRecipe, setGroceriesForChosenRecipe] = useState([]);
  const [numberOfServings, setNumberOfServings] = useState(1);

  function AfterSlideIn() {
    setTimeout(function(){
      setHiddenForm(true);
      setChosenRecipe(null);
    }, 1200);
    var element = document.getElementById("swingBox");
    
    if (element.classList.contains('swing-in-top-fwd')) {
      element.classList.remove('swing-in-top-fwd');      
      element.classList.add('swing-out-top-bck');
    }
  }

  useEffect(()=>{
    let copy = [...matrix];
    copy[0][0] = "";
    copy[0][1] = "Ponedeljak";
    copy[0][2] = "Utorak";
    copy[0][3] = "Sreda";
    copy[0][4] = "Cetvrtak";
    copy[0][5] = "Petak";
    copy[0][6] = "Subota";
    copy[0][7] = "Nedelja";
    copy[1][0] = "Dorucak";
    copy[2][0] = "Jutarnja uzina";
    copy[3][0] = "Rucak";
    copy[4][0] = "Popodnevna uzina";
    copy[5][0] = "Vecera";
    copy[6][0] = "Obrok posle vecere";
    setMatrix(copy);
    
    //console.log("personOnADietPlan");
    //console.log(personOnADietPlan);
    getAllRecipesForNutri(user[0].id)
          .then(result=>setRecipes(result))
          .catch(e=>console.log(e));
    // dodati ovde citanje iz baze za svakoga za svaki cilj
  },[]);

  const returnToNull = (rowIndex, columnIndex) => {
    let copy = [...matrix];
    copy[rowIndex][columnIndex] = null;
    setMatrix(copy);
    console.log(matrix);
  };

  const setIndexes = (rowIndex, columnIndex) => {
    setIndexOfRow(rowIndex);
    setIndexOfColumn(columnIndex);
    setHiddenForm(false);
    setChosenRecipe(null);
  }

  const updateMatrixField = (rowIndex, columnIndex) => {
    const recipeIdFromMatrix = matrix[rowIndex][columnIndex].chosenRecipe;
    const recipeForUpdate = recipes.find(x => x.id === recipeIdFromMatrix);
    const getNumberOfServings = matrix[rowIndex][columnIndex].numberOfServings; 
    setNumberOfServings(getNumberOfServings);
    setChosenRecipe(recipeForUpdate);
    setIndexOfRow(rowIndex);
    setIndexOfColumn(columnIndex);
    setHiddenForm(false);
  }

  const saveARecipeForASpecificMeal = () => {
    setFieldInMatrix(indexOfRow, indexOfColumn);
    AfterSlideIn();
    setNumberOfServings(1);
  }

  const setFieldInMatrix = (rowIndex, columnIndex) => {
    var copy = [...matrix];
    if(chosenRecipe != null)
    {
      let recipeIdAndNumberOfServings = {
        chosenRecipe: chosenRecipe.id,
        numberOfServings: numberOfServings
      }
      copy[rowIndex][columnIndex] = recipeIdAndNumberOfServings;
    }
    else {
      copy[rowIndex][columnIndex] = null;
    }
    setMatrix(copy);
    console.log(matrix);
  };

  const autocompleteOnChange = (newChosenName) => {
    if(newChosenName != null)
    {
      var newChosenRecipe = recipes.find(x => x.Naslov === newChosenName);
      setChosenRecipe(newChosenRecipe);
      setNumberOfServings(newChosenRecipe.Broj_porcija);
      getRecipeWithHisGroceries(newChosenRecipe.id)
            .then(result=>setGroceriesForChosenRecipe(result))
            .catch(e=>console.log(e));
    }
    else setChosenRecipe(null);
  }

  // #region goal
  const onClickNext = () => {
    setPageRecipe(pageRecipe+1);
  };
  const handleChangeGoal = (event) => {
      setGoal(event.target.value);
  };
  const generateLabelName = (grocery) => {
    var name = "";
    if(grocery.Naziv.length >= 40)
        name = grocery.Naziv.slice(0, 40) + "...";
    else name = grocery.Naziv.slice(0, 40) + " - ";
    return name + "[" + grocery.Kolicina*100 + "gr" + "]";
}
  // #endregion

  return (
    <Box flex={4} p={2}>
      {pageRecipe===1 && <Box sx={{m:5}}><Stack direction="row" spacing={2}>
            <Typography sx={{mt: 2, mr: 2}}>Izaberite cilj ishrane:</Typography>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-required-label">Cilj</InputLabel>
                <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={goal}
                label="Cilj *"
                onChange={handleChangeGoal}
                >
                    <MenuItem value={"Smanjenje telesne mase"}>Smanjenje telesne mase</MenuItem>
                    <MenuItem value={"Zadržavanje telesne mase"}>Zadržavanje telesne mase</MenuItem>
                    <MenuItem value={"Povecanje telesne mase"}>Povecanje telesne mase</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
            </Stack>            
            <Button onClick={onClickNext} variant="contained" endIcon={<NextPlanIcon />} sx={{width: "15%", height: "25%",ml:27,mt:5 }}>
                Dalje
            </Button>
            </Box>}
        {pageRecipe===2 && <Box><div className="sheet">
        <table className="tableSchedule">
          <tbody>
            {matrix.map((row, rowIndex) => (
              rowIndex===0? <tr className="tableEl" key={rowIndex}>
                <td className="tableEl" key='0'></td>
                <td className="tableEl" key='1'><Typography align="center">Ponedeljak</Typography></td>
                <td className="tableEl" key='2'><Typography align="center">Utorak</Typography></td>
                <td className="tableEl" key='3'><Typography align="center">Sreda</Typography></td>
                <td className="tableEl" key='4'><Typography align="center">Cetvrtak</Typography></td>
                <td className="tableEl" key='5'><Typography align="center">Petak</Typography></td>
                <td className="tableEl" key='6'><Typography align="center">Subota</Typography></td>
                <td className="tableEl" key='7'><Typography align="center">Nedelja</Typography></td>
              </tr> :
              <tr className="tableEl" key={rowIndex}>
                {row.map((column, columnIndex) => (
                  rowIndex===1 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">Dorucak</Typography></td> :
                  rowIndex===2 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">Jutarnja uzina</Typography></td> :
                  rowIndex===3 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">Rucak</Typography></td> :
                  rowIndex===4 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">Popodnevna uzina</Typography></td> :
                  rowIndex===5 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">Vecera</Typography></td> :
                  rowIndex===6 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">Obrok pred spavanje</Typography></td> :
                  <td className="tableEl" key={rowIndex*10 + columnIndex}>
                    {matrix[rowIndex][columnIndex]? <Button
                    variant="contained"
                    component="label"
                    sx={{width: "100%"}}
                    className="buttonWithoutRadius"
                    id={rowIndex*10 + columnIndex}
                    onClick={()=>updateMatrixField(rowIndex, columnIndex)}         
                  >&nbsp;IZMENI&nbsp;</Button> : <Button
                      variant="contained"
                      component="label"
                      sx={{width: "100%"}}
                      className="buttonWithoutRadius"   
                      id={rowIndex*10 + columnIndex}
                      onClick={()=>setIndexes(rowIndex, columnIndex)}                   
                    >&nbsp;DODAJ&nbsp;</Button>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenForm && <Button sx={{mt: 3, ml:"78%"}} variant="contained" component="label">POTVRDI CEO NEDELJNI JELOVNIK</Button>}
      {!hiddenForm && <Stack direction="row" spacing={2} sx={{m:5, ml: "20%"}} id="swingBox" className='swing-in-top-fwd'>
        <Stack direction="column" spacing={2}><Autocomplete
        disablePortal
        id="combo-box-demo"
        options={recipes.map((option) => option.Naslov)}
        sx={{ width: 300 }}
        value={chosenRecipe ? chosenRecipe.Naslov : null}
        onChange={(event, newValue) => {autocompleteOnChange(newValue);}}
        renderInput={(params) => <TextField {...params} label="Recepti" />}
        />
              
        <Stack direction="column" spacing={3} sx={{ width: 300, m: 5 }}>{chosenRecipe &&  <Typography>Ukupno:<Input
        edge="end"
        aria-label="comments"
        name="numberOfServings"
        type="number"
        value={numberOfServings}
        onChange={(event) => {
          setNumberOfServings(parseInt(event.target.value));
        }}
        inputProps={{ min: 1, max: 50, step: "1" }}
        endAdornment={<InputAdornment position="end">Porcija</InputAdornment>}
        /></Typography>}
        <Button onClick={saveARecipeForASpecificMeal} className='swing-in-top-fwd' sx={{ width: 300 }} variant="contained" component="label">Sacuvaj</Button></Stack></Stack>
        {chosenRecipe &&
        <Card className='swing-in-top-fwd' sx={{ width: 530, height: 470 }}>
                <CardMedia
                    component="img"
                    height="230"
                    image={chosenRecipe.Slika}
                    alt="Nemamo sliku :("
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {chosenRecipe.Naslov}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chosenRecipe.Opis.slice(0, 150) + "..."}
                    </Typography>
                </CardContent>
                <CardActions spacing={2}>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon /><Typography>{chosenRecipe.Broj_lajkova}</Typography>
                  </IconButton>
                  <Box>
                  {groceriesForChosenRecipe.map(x=>
                    <Chip label={generateLabelName(x)} sx={{m:0.5}} variant="outlined" color="primary" avatar={<Avatar src={x.Slika} alt="Nemamo sliku :(" />} />
                  ).slice(0,3)}</Box>
                  
                </CardActions>
            </Card>}
        </Stack>}
      </Box>}
    </Box>
  );
};