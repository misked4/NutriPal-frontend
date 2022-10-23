import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, InputLabel, MenuItem, Select, FormHelperText, FormControl, TextField, 
  Card, CardMedia, CardContent, CardActions, IconButton, Input, InputAdornment, Chip, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportIcon from '@mui/icons-material/Report';
import { Stack } from '@mui/system';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import { getAllRecipesForNutri, getRecipeWithHisGroceries, postWeeklyMenu, 
  getWeeklyMenu, getAdditionalInfoForPatient, getDiet } from './APIcalls';
import { DescriptionAlertError, DescriptionAlertSuccess } from '../../components/DescriptionAlerts';
import { changePage } from '../../redux/newPatient/actions';
import Autocomplete from '@mui/material/Autocomplete';
import './NewFoodSchedule.css'

const n = 7;
const m = 8;
const k = 5;
export const NewFoodSchedule = ({ personOnADietPlan }) => {
  const { user } = useSelector((state) => state.auth);
  const { page } = useSelector((state) => state.newPatient); //ovo nam je potrebno da bi videli da li menjamo neciji jelovnik preko
  //profila ili ne

  let dispatch = useDispatch();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
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

  const [statusMatrix, setStatusMatrix] = useState(Array.from({length: m},()=> Array.from({length: k}, () => null)));
  const [formWithStatusMatrix, setFormWithStatusMatrix] = useState(false);
  const [dietForPersonOnADietPlan, setDietForPersonOnADietPlan] = useState({});
  const [arrayOfMinAndMaxValues, setArrayOfMinAndMaxValues] = useState([]);

  // #region additional fields
  const [sumKcal, setSumKcal] = useState(0);
  const [sumUH, setSumUH] = useState(0);
  const [sumProteini, setSumProteini] = useState(0);
  const [sumMasti, setSumMasti] = useState(0);
  // #endregion

  const [percentOfServings, setPercentOfServings] = useState(0);
  const thisIsForNutritionist = (personOnADietPlan.id === user[0].id? true: false);

  function AfterSlideIn() {
    setTimeout(function(){
      setHiddenForm(true);
      setChosenRecipe(null);
      setNumberOfServings(1);
      setSumKcal(0);
      setSumUH(0);
      setSumProteini(0);
      setSumMasti(0);
    }, 1200);
    var element = document.getElementById("swingBox");
    
    if (element.classList.contains('swing-in-top-fwd')) {
      element.classList.remove('swing-in-top-fwd');      
      element.classList.add('swing-out-top-bck');
    }
  }

  useEffect(()=>{
    if(personOnADietPlan.Uloga === "Korisnik")
    {
      getDiet(personOnADietPlan.DijetaId)
        .then(result=>{
          setDietForPersonOnADietPlan(result);
          setArrayOfMinAndMaxValues([{min: result.UH_min, max:result.UH_max},
            {min: result.PROTEINI_min, max:result.PROTEINI_max}, 
            {min: result.MASTI_min, max: result.MASTI_max}]);
        })
        .catch(e=>console.log(e));
    }
    if(!thisIsForNutritionist)
    {
      setPageRecipe(2);
      getAdditionalInfoForPatient(personOnADietPlan.Dodatne_info_Id)
        .then(result=>{
          setGoal(result.Cilj_ishrane);
          setMatrixFunction(user[0].id, personOnADietPlan.id,result.Cilj_ishrane);
        })
        .catch(e=>console.log(e));
    }
    getAllRecipesForNutri(user[0].id)
          .then(result=>setRecipes(result))
          .catch(e=>console.log(e));
  },[]);

  useEffect(()=>{
    if(thisIsForNutritionist)
    {
      setMatrixFunction(user[0].id, personOnADietPlan.id, goal);
    }
  },[goal]);

  const setMatrixFunction = (nutriId, patientId, goal) => {
    getWeeklyMenu(nutriId, patientId, goal)
      .then(result=>{setMatrix(result); console.log(result);})
      .catch(e=>console.log(e));
  }

  const returnToNull = (rowIndex, columnIndex) => {
    let copy = [...matrix];
    copy[rowIndex][columnIndex] = null;
    setMatrix(copy);
    console.log(matrix);
  };

  const addMatrixField = (rowIndex, columnIndex) => {
    setFormWithStatusMatrix(false);

    setIndexOfRow(rowIndex);
    setIndexOfColumn(columnIndex);
    setHiddenForm(false);
    setChosenRecipe(null);//ovde dodaj kcal, proteini, masti, uh na null
    
    setSumKcal(0);
    setSumUH(0);
    setSumProteini(0);
    setSumMasti(0);
  }

  const updateMatrixField = (rowIndex, columnIndex) => {
    setFormWithStatusMatrix(false);

    const recipeIdFromMatrix = matrix[rowIndex][columnIndex].chosenRecipe;
    const recipeForUpdate = recipes.find(x => x.id === recipeIdFromMatrix);
    const getNumberOfServings = matrix[rowIndex][columnIndex].numberOfServings; 
    setNumberOfServings(getNumberOfServings);

    const oldValue = recipeForUpdate.Broj_porcija;
    const percent = (getNumberOfServings-oldValue)/Math.abs(oldValue) * 100;
    setPercentOfServings(percent);
    /*setSumKcal(matrix[rowIndex][columnIndex].sum_kcal);
    setSumUH(matrix[rowIndex][columnIndex].sum_UH);
    setSumProteini(matrix[rowIndex][columnIndex].sum_PROTEINI);
    setSumMasti(matrix[rowIndex][columnIndex].sum_MASTI);*/
    
    setChosenRecipe(recipeForUpdate);
    populateArrayOfGroceries(recipeIdFromMatrix ,percent);
    setIndexOfRow(rowIndex);
    setIndexOfColumn(columnIndex);
    setHiddenForm(false);

    console.log(matrix[rowIndex][columnIndex]);
  }

  const saveARecipeForASpecificMeal = () => {
    putFieldInMatrix(indexOfRow, indexOfColumn);
    AfterSlideIn();
  }

  const putFieldInMatrix = (rowIndex, columnIndex) => {
    var copy = [...matrix];

    if(chosenRecipe != null)
    {
      let infoAboutRecipe = {
        chosenRecipe: chosenRecipe.id,
        numberOfServings: numberOfServings,
        sum_kcal: sumKcal,
        sum_UH: sumUH,
        sum_PROTEINI: sumProteini,
        sum_MASTI: sumMasti
      }
      copy[rowIndex][columnIndex] = infoAboutRecipe;
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
      setPercentOfServings(0);
      populateArrayOfGroceries(newChosenRecipe.id, 0);
    }
    else setChosenRecipe(null);
  }

  const populateArrayOfGroceries = (recipeId, percent) => {
    getRecipeWithHisGroceries(recipeId)
            .then(result=>{
              setGroceriesForChosenRecipe(result);
              var sum_KCAL = 0;
              var sum_UH = 0;
              var sum_PROTEINI = 0;
              var sum_MASTI = 0;
              result.forEach((grocery) => {
                var newQuantity = percent==0? grocery.Kolicina : (grocery.Kolicina*(percent+100))/100;
        
                sum_KCAL += Math.round(grocery.kcal*newQuantity);
                sum_UH += Math.round(grocery.UH*newQuantity);
                sum_PROTEINI += Math.round(grocery.Proteini*newQuantity);
                sum_MASTI += Math.round(grocery.Masti*newQuantity);
              })
              setSumKcal(sum_KCAL);
              setSumUH(sum_UH);
              setSumProteini(sum_PROTEINI);
              setSumMasti(sum_MASTI);
              setPercentOfServings(percent);
            })
            .catch(e=>console.log(e));
  }

  // #region goal
  const onClickNext = () => {
    setPageRecipe(pageRecipe+1);
    setSuccess(false);
  };

  const handleChangeGoal = (event) => {
    console.log("handleChangeGoal");
    if(thisIsForNutritionist)
      setGoal(event.target.value);
  };
  
  const generateLabelName = (grocery) => {
    var name = "";
    var newQuantity = percentOfServings==0? grocery.Kolicina : (grocery.Kolicina*(percentOfServings+100))/100;

    newQuantity = Math.round(newQuantity*100);
    if(grocery.Naziv.length >= 40)
        name = grocery.Naziv.slice(0, 40) + "...";
    else name = grocery.Naziv.slice(0, 40) + " - ";
    var quantityNumberLabel = newQuantity/1000 < 1? newQuantity : newQuantity/1000;
    var unit = newQuantity/1000 < 1? "g" : "kg"
    return name + "[" + quantityNumberLabel + unit + "]";
}
  // #endregion

  const calculatePercent = (e) => {
    const newValue = e.target.value;
    setNumberOfServings(parseInt(newValue));
    const oldValue = chosenRecipe.Broj_porcija;
    const percent = (newValue-oldValue)/Math.abs(oldValue) * 100;
    setPercentOfServings(percent);
    var sum_KCAL = 0;
    var sum_UH = 0;
    var sum_PROTEINI = 0;
    var sum_MASTI = 0;
    groceriesForChosenRecipe.forEach((grocery) => {
      var newQuantity = percent==0? grocery.Kolicina : (grocery.Kolicina*(percent+100))/100;

      sum_KCAL += Math.round(grocery.kcal*newQuantity);
      sum_UH += Math.round(grocery.UH*newQuantity);
      sum_PROTEINI += Math.round(grocery.Proteini*newQuantity);
      sum_MASTI += Math.round(grocery.Masti*newQuantity);
    })
    setSumKcal(sum_KCAL);
    setSumUH(sum_UH);
    setSumProteini(sum_PROTEINI);
    setSumMasti(sum_MASTI);
  }

  const SaveWholeWeeklyMenu = () => {
    const fullData = {
      matrix: matrix,
      userId: personOnADietPlan.id, //zapamti da prosledjujes sada id od personOnADietPlan !!!
      goal: goal
    }
    postWeeklyMenu(fullData)
          .then(result=>console.log(result))
          .catch(e=>console.log(e));
    if(thisIsForNutritionist)
      setPageRecipe(1);
    setSuccess(true);
    if(!thisIsForNutritionist && page === "4")
    {
      navigate('/myclients');
      dispatch(changePage("1"));
    }
  }
  
  const ReturnToFirstPage = () => {
    setPageRecipe(1);
  }

  const calculateForOneRow = (column) => {
    var result = {
      sum_kcal: 0,      
      sum_UH: 0,
      sum_PROTEINI: 0,
      sum_MASTI: 0
    }
    for(let i = 1; i<n; i++)
    {
      if(matrix[i][column] != null)
      {        
        result.sum_kcal += matrix[i][column].sum_kcal;
        result.sum_UH += matrix[i][column].sum_UH;
        result.sum_PROTEINI += matrix[i][column].sum_PROTEINI;
        result.sum_MASTI += matrix[i][column].sum_MASTI;
      }
    }
    return result;
  }

  const ShowStatusMatrix = () => {
    console.log(arrayOfMinAndMaxValues);
    var auxiliaryMatrix = [];
    
    for(let i=0; i<m; i++) {
      auxiliaryMatrix[i] = new Array(k);
    }

    // #region initialMatrix
    var kcal_recommended = kcalRecommended();

    const UH_MinAndMax = "("+dietForPersonOnADietPlan.UH_min+"% - "+dietForPersonOnADietPlan.UH_max+"%)";
    const PROTEINI_MinAndMax = "("+dietForPersonOnADietPlan.PROTEINI_min+"% - "+dietForPersonOnADietPlan.PROTEINI_max+"%)";
    const MASTI_MinAndMax = "("+dietForPersonOnADietPlan.MASTI_min+"% - "+dietForPersonOnADietPlan.MASTI_max+"%)";
    auxiliaryMatrix[0][0] = "";
    auxiliaryMatrix[0][1] = "kcal (preporuceno: "+kcal_recommended+" kcal)";
    auxiliaryMatrix[0][2] = "Ugljeni hidrati "+UH_MinAndMax;
    auxiliaryMatrix[0][3] = "Proteini " +PROTEINI_MinAndMax;
    auxiliaryMatrix[0][4] = "Masti" +MASTI_MinAndMax;
    auxiliaryMatrix[1][0] = "Ponedeljak";
    auxiliaryMatrix[2][0] = "Utorak";
    auxiliaryMatrix[3][0] = "Sreda";
    auxiliaryMatrix[4][0] = "Cetvrtak";
    auxiliaryMatrix[5][0] = "Petak";
    auxiliaryMatrix[6][0] = "Subota";
    auxiliaryMatrix[7][0] = "Nedelja";
    // #endregion

    for(let i = 1; i<m; i++)
    {
        let result = calculateForOneRow(i);
        if(result!=null)
        {          
          auxiliaryMatrix[i][1] = result.sum_kcal;

          let sumAll3 = result.sum_UH;
          sumAll3 += result.sum_PROTEINI;
          sumAll3 += result.sum_MASTI;

          auxiliaryMatrix[i][2] = Math.round(result.sum_UH / sumAll3 * 100);
          auxiliaryMatrix[i][3] = Math.round(result.sum_PROTEINI / sumAll3 * 100);
          auxiliaryMatrix[i][4] = Math.round(result.sum_MASTI / sumAll3 * 100);
        }
    }
    console.log(auxiliaryMatrix);
    setStatusMatrix(auxiliaryMatrix);
    setFormWithStatusMatrix(true);
  }

  const kcalRecommended = () => {    
    var kcal_recommended = "";
    if(personOnADietPlan.Uloga === "Korisnik")
    {
      if(personOnADietPlan.Cilj_ishrane === "Smanjenje telesne mase")
      {
        kcal_recommended = Math.round(personOnADietPlan.TEE - personOnADietPlan.PotrosnjaKalorija);
      }
      else if(personOnADietPlan.Cilj_ishrane === "Zadržavanje telesne mase")
      {
        kcal_recommended = Math.round(personOnADietPlan.TEE + personOnADietPlan.PotrosnjaKalorija);
      }
      else if(personOnADietPlan.Cilj_ishrane === "Povecanje telesne mase"){
        kcal_recommended = Math.round(personOnADietPlan.TEE + 2 * personOnADietPlan.PotrosnjaKalorija);
      }
    }    
    return kcal_recommended;
  }

  return (
    <Box flex={4} p={2}>
      {success && DescriptionAlertSuccess("Uspesno ste dodali nedeljni plan ishrane.")}
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
                      variant="outlined"
                      component="label"
                      sx={{width: "100%"}}
                      className="buttonWithoutRadius"   
                      id={rowIndex*10 + columnIndex}
                      onClick={()=>addMatrixField(rowIndex, columnIndex)}                   
                    >&nbsp;DODAJ&nbsp;</Button>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenForm &&  <Button onClick={SaveWholeWeeklyMenu} sx={{mt: 3, ml:"78%"}} variant="contained" component="label">POTVRDI CEO NEDELJNI JELOVNIK</Button>}
      {hiddenForm && personOnADietPlan.Uloga === "Korisnik" && <Button onClick={ShowStatusMatrix} sx={{mt: 3, ml:"78%"}} variant="contained" component="label">VIDI NEDELJNI STATUS</Button>}
      {hiddenForm && thisIsForNutritionist && <Button onClick={ReturnToFirstPage} sx={{mt: 3, ml:"78%"}} variant="contained" component="label">VRATI SE NA PRETHODNU STRANU</Button>}
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
              
        <Stack direction="column" spacing={3} sx={{ width: 300, m: 5 }}>{chosenRecipe &&  <Box><Typography>Ukupno:<Input
        edge="end"
        aria-label="comments"
        name="numberOfServings"
        type="number"
        value={numberOfServings}
        sx={{width: "50%", ml: 2}}
        onChange={(event) => calculatePercent(event)}
        inputProps={{ min: 1, max: 50, step: "1" }}
        endAdornment={<InputAdornment position="end">Porcija</InputAdornment>}
        /></Typography>
        <Typography>Kalorija:<Input
        edge="end"
        aria-label="comments"
        name="sumKcal"
        type="number"
        value={sumKcal}
        disabled
        sx={{width: "50%", ml: 2}}
        endAdornment={<InputAdornment position="end">kcal</InputAdornment>}
        /></Typography>
        <Typography>Ugljenih hidrata:<Input
        edge="end"
        aria-label="comments"
        name="sumUH"
        type="number"
        value={sumUH}
        disabled
        sx={{width: "50%", ml: 2}}
        endAdornment={<InputAdornment position="end">g</InputAdornment>}
        /></Typography>
        <Typography>Proteina:<Input
        edge="end"
        aria-label="comments"
        name="sumProteini"
        type="number"
        value={sumProteini}
        disabled
        sx={{width: "50%", ml: 2}}
        endAdornment={<InputAdornment position="end">g</InputAdornment>}
        /></Typography>
        <Typography>Masti:<Input
        edge="end"
        aria-label="comments"
        name="sumMasti"
        type="number"
        value={sumMasti}
        disabled
        sx={{width: "50%", ml: 2}}
        endAdornment={<InputAdornment position="end">g</InputAdornment>}
        /></Typography>
        </Box>}
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
      {formWithStatusMatrix && personOnADietPlan.Uloga === "Korisnik" &&
      <div className="sheet">
        <table className="tableSchedule">
          <tbody>
            {statusMatrix.map((row, rowIndex) => (
              rowIndex===0? <tr className="tableEl" key={rowIndex}>
                <td className="tableEl" key='0'></td>
                <td className="tableEl" key='1'><Typography align="center">{statusMatrix[rowIndex][1]}</Typography></td>
                <td className="tableEl" key='2'><Typography align="center">{statusMatrix[rowIndex][2]}</Typography></td>
                <td className="tableEl" key='3'><Typography align="center">{statusMatrix[rowIndex][3]}</Typography></td>
                <td className="tableEl" key='4'><Typography align="center">{statusMatrix[rowIndex][4]}</Typography></td>
              </tr> :
              <tr className="tableEl" key={rowIndex}>
                {row.map((column, columnIndex) => (
                  rowIndex===1 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  rowIndex===2 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  rowIndex===3 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  rowIndex===4 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  rowIndex===5 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  rowIndex===6 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  rowIndex===7 && columnIndex===0? <td className="tableEl" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                  <td className="tableEl" key={rowIndex*10 + columnIndex}>
                    {statusMatrix[rowIndex][columnIndex]?
                    <Typography>
                        {columnIndex > 1 ?
                        (arrayOfMinAndMaxValues[columnIndex-2] && (arrayOfMinAndMaxValues[columnIndex-2].min > statusMatrix[rowIndex][columnIndex] ||
                        arrayOfMinAndMaxValues[columnIndex-2].max < statusMatrix[rowIndex][columnIndex]))?
                        <>{statusMatrix[rowIndex][columnIndex]}% <ReportIcon sx={{color:'red', mt:1, p:0, width:"5%", height:"5%" }}/></>
                        : <>{statusMatrix[rowIndex][columnIndex]}%</>
                        : statusMatrix[rowIndex][columnIndex] > kcalRecommended() ? <>{statusMatrix[rowIndex][columnIndex]} <ReportIcon sx={{color:'red', mt:1, p:0, width:"5%", height:"5%" }}/></>
                        : <>{statusMatrix[rowIndex][columnIndex]}</>}
                    </Typography>
                    : <Typography>Nema tekst</Typography>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </Box>
  );
};