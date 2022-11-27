import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, InputLabel, MenuItem, Select, FormHelperText, FormControl, TextField, 
  Card, CardMedia, CardContent, CardActions, IconButton, Input, InputAdornment, Chip, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportIcon from '@mui/icons-material/Report';
import { Stack } from '@mui/system';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import { getAllRecipesForNutri, getRecipeWithHisFullGroceries, postWeeklyMenu, 
  getWeeklyMenu, getAdditionalInfoForPatient, getDiet } from './APIcalls';
import { DescriptionAlertError, DescriptionAlertSuccess } from '../../components/DescriptionAlerts';
import { changePage } from '../../redux/newPatient/actions';
import Autocomplete from '@mui/material/Autocomplete';
import { changeHeightVmax } from '../../Common';
import './NewFoodSchedule.css'

const n = 7;
const m = 8;
const k = 34;
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
  const [sumod_toga_zasicene_masne_kiseline, setSumod_toga_zasicene_masne_kiseline] = useState(0);
  const [sumDijetalna_vlakna, setSumDijetalna_vlakna] = useState(0);
  const [sumUkupno_secera, setSumUkupno_secera] = useState(0);
  const [sumHolesterol, setSumHolesterol] = useState(0);
  const [sumVoda, setSumVoda] = useState(0);
  const [sumMononezasicene_masne_kiseline, setSumMononezasicene_masne_kiseline] = useState(0);
  const [sumPolinezasicene_masne_kiseline, setSumPolinezasicene_masne_kiseline] = useState(0);
  const [sumVitaminC, setSumVitaminC] = useState(0);
  const [sumVitaminB1_Tiamin, setSumVitaminB1_Tiamin] = useState(0);
  const [sumVitaminB2_Riboflavin, setSumVitaminB2_Riboflavin] = useState(0);
  const [sumVitaminB3_Niacin, setSumVitaminB3_Niacin] = useState(0);
  const [sumVitaminB5_Pantotenska_kiselina, setSumVitaminB5_Pantotenska_kiselina] = useState(0);
  const [sumVitaminB6_Piridoksin, setSumVitaminB6_Piridoksin] = useState(0);
  const [sumVitaminB9_Folati, setSumVitaminB9_Folati] = useState(0);
  const [sumVitaminB12_Kobalamin, setSumVitaminB12_Kobalamin] = useState(0);
  const [sumVitaminA, setSumVitaminA] = useState(0);
  const [sumVitaminD, setSumVitaminD] = useState(0);
  const [sumVitaminE, setSumVitaminE] = useState(0);
  const [sumVitaminK, setSumVitaminK] = useState(0);
  const [sumKalcijum_Ca, setSumKalcijum_Ca] = useState(0);
  const [sumZeljezo_Fe, setSumZeljezo_Fe] = useState(0);
  const [sumMagnezijum_Mg, setSumMagnezijum_Mg] = useState(0);
  const [sumFosfor_P, setSumFosfor_P] = useState(0);
  const [sumKalijum_K, setSumKalijum_K] = useState(0);
  const [sumNatrijum_Na, setSumNatrijum_Na] = useState(0);
  const [sumCink_Zn, setSumCink_Zn] = useState(0);
  const [sumBakar_Cu, setSumBakar_Cu] = useState(0);
  const [sumMangan_Mn, setSumMangan_Mn] = useState(0);
  const [sumSelen_Se, setSumSelen_Se] = useState(0);
  const [sumOfAllValues, setSumOfValues] = useState(0);
  // #endregion

  const [percentOfServings, setPercentOfServings] = useState(0);
  const thisIsForNutritionist = (personOnADietPlan.id === user[0].id? true: false);

  function AfterSlideIn() {
    setTimeout(function(){
      setHiddenForm(true);
      setChosenRecipe(null);
      setNumberOfServings(1);
      // #region initial add fields
      setSumKcal(0);
      setSumUH(0);
      setSumProteini(0);
      setSumMasti(0);
      setSumod_toga_zasicene_masne_kiseline(0);
      setSumDijetalna_vlakna(0);
      setSumUkupno_secera(0);
      setSumHolesterol(0);
      setSumVoda(0);
      setSumMononezasicene_masne_kiseline(0);
      setSumPolinezasicene_masne_kiseline(0);
      setSumVitaminC(0);
      setSumVitaminB1_Tiamin(0);
      setSumVitaminB2_Riboflavin(0);
      setSumVitaminB3_Niacin(0);
      setSumVitaminB5_Pantotenska_kiselina(0);
      setSumVitaminB6_Piridoksin(0);
      setSumVitaminB9_Folati(0);
      setSumVitaminB12_Kobalamin(0);
      setSumVitaminA(0);
      setSumVitaminD(0);
      setSumVitaminE(0);
      setSumVitaminK(0);
      setSumKalcijum_Ca(0);
      setSumZeljezo_Fe(0);
      setSumMagnezijum_Mg(0);
      setSumFosfor_P(0);
      setSumKalijum_K(0);
      setSumNatrijum_Na(0);
      setSumCink_Zn(0);
      setSumBakar_Cu(0);
      setSumMangan_Mn(0);
      setSumSelen_Se(0);
      setSumOfValues(0);
      // #endregion
    }, 1200);
    var element = document.getElementById("swingBox");
    
    if (element.classList.contains('swing-in-top-fwd')) {
      element.classList.remove('swing-in-top-fwd');      
      element.classList.add('swing-out-top-bck');
    }
  }

  useEffect(()=>{
    changeHeightVmax();
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
    
    // #region initial add fields
    setSumKcal(0);
    setSumUH(0);
    setSumProteini(0);
    setSumMasti(0);
    setSumod_toga_zasicene_masne_kiseline(0);
    setSumDijetalna_vlakna(0);
    setSumUkupno_secera(0);
    setSumHolesterol(0);
    setSumVoda(0);
    setSumMononezasicene_masne_kiseline(0);
    setSumPolinezasicene_masne_kiseline(0);
    setSumVitaminC(0);
    setSumVitaminB1_Tiamin(0);
    setSumVitaminB2_Riboflavin(0);
    setSumVitaminB3_Niacin(0);
    setSumVitaminB5_Pantotenska_kiselina(0);
    setSumVitaminB6_Piridoksin(0);
    setSumVitaminB9_Folati(0);
    setSumVitaminB12_Kobalamin(0);
    setSumVitaminA(0);
    setSumVitaminD(0);
    setSumVitaminE(0);
    setSumVitaminK(0);
    setSumKalcijum_Ca(0);
    setSumZeljezo_Fe(0);
    setSumMagnezijum_Mg(0);
    setSumFosfor_P(0);
    setSumKalijum_K(0);
    setSumNatrijum_Na(0);
    setSumCink_Zn(0);
    setSumBakar_Cu(0);
    setSumMangan_Mn(0);
    setSumSelen_Se(0);
    setSumOfValues(0);
    // #endregion
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
        sum_MASTI: sumMasti,
        sum_od_toga_zasicene_masne_kiseline: sumod_toga_zasicene_masne_kiseline,
        sum_Dijetalna_vlakna: sumDijetalna_vlakna,
        sum_Ukupno_secera: sumUkupno_secera,
        sum_Holesterol: sumHolesterol,
        sum_Voda: sumVoda,
        sum_Mononezasicene_masne_kiseline: sumMononezasicene_masne_kiseline,
        sum_Polinezasicene_masne_kiseline: sumPolinezasicene_masne_kiseline,
        sum_VitaminC: sumVitaminC,
        sum_VitaminB1_Tiamin: sumVitaminB1_Tiamin,
        sum_VitaminB2_Riboflavin: sumVitaminB2_Riboflavin,
        sum_VitaminB3_Niacin: sumVitaminB3_Niacin,
        sum_VitaminB5_Pantotenska_kiselina: sumVitaminB5_Pantotenska_kiselina,
        sum_VitaminB6_Piridoksin: sumVitaminB6_Piridoksin,
        sum_VitaminB9_Folati: sumVitaminB9_Folati,
        sum_VitaminB12_Kobalamin: sumVitaminB12_Kobalamin,
        sum_VitaminA: sumVitaminA,
        sum_VitaminD: sumVitaminD,
        sum_VitaminE: sumVitaminE,
        sum_VitaminK: sumVitaminK,
        sum_Kalcijum_Ca: sumKalcijum_Ca,
        sum_Zeljezo_Fe: sumZeljezo_Fe,
        sum_Magnezijum_Mg: sumMagnezijum_Mg,
        sum_Fosfor_P: sumFosfor_P,
        sum_Kalijum_K: sumKalijum_K,
        sum_Natrijum_Na: sumNatrijum_Na,
        sum_Cink_Zn: sumCink_Zn,
        sum_Bakar_Cu: sumBakar_Cu,
        sum_Mangan_Mn: sumMangan_Mn,
        sum_Selen_Se: sumSelen_Se
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
    getRecipeWithHisFullGroceries(recipeId)
            .then(result=>{
              setGroceriesForChosenRecipe(result);
              // #region initial add fields
              var sum_KCAL = 0;
              var sum_UH = 0;
              var sum_PROTEINI = 0;
              var sum_MASTI = 0;
              var sum_Energetska_vrednost = 0;
              var sum_Ukupno_proteina = 0;
              var sum_Ukupno_ugljenih_hidrata = 0;
              var sum_Ukupno_masti = 0;
              var sum_od_toga_zasicene_masne_kiseline = 0;
              var sum_Dijetalna_vlakna = 0;
              var sum_Ukupno_secera = 0;
              var sum_Holesterol = 0;
              var sum_Voda = 0;
              var sum_Mononezasicene_masne_kiseline = 0;
              var sum_Polinezasicene_masne_kiseline = 0;
              var sum_VitaminC = 0;
              var sum_VitaminB1_Tiamin = 0;
              var sum_VitaminB2_Riboflavin = 0;
              var sum_VitaminB3_Niacin = 0;
              var sum_VitaminB5_Pantotenska_kiselina = 0;
              var sum_VitaminB6_Piridoksin = 0;
              var sum_VitaminB9_Folati = 0;
              var sum_VitaminB12_Kobalamin = 0;
              var sum_VitaminA = 0;
              var sum_VitaminD = 0;
              var sum_VitaminE = 0;
              var sum_VitaminK = 0;
              var sum_Kalcijum_Ca = 0;
              var sum_Zeljezo_Fe = 0;
              var sum_Magnezijum_Mg = 0;
              var sum_Fosfor_P = 0;
              var sum_Kalijum_K = 0;
              var sum_Natrijum_Na = 0;
              var sum_Cink_Zn = 0;
              var sum_Bakar_Cu = 0;
              var sum_Mangan_Mn = 0;
              var sum_Selen_Se = 0;
              // endregion

              result.forEach((grocery) => {
                var newQuantity = percent==0? grocery.Kolicina : (grocery.Kolicina*(percent+100))/100;
                // #region initial add fields
                sum_KCAL += Math.round(grocery.kcal*newQuantity);
                sum_UH += Math.round(grocery.UH*newQuantity);
                sum_PROTEINI += Math.round(grocery.Proteini*newQuantity);
                sum_MASTI += Math.round(grocery.Masti*newQuantity);
                sum_Energetska_vrednost += Math.round(grocery.Energetska_vrednost*newQuantity);
                sum_Ukupno_proteina += Math.round(grocery.Ukupno_proteina*newQuantity);
                sum_Ukupno_ugljenih_hidrata += Math.round(grocery.Ukupno_ugljenih_hidrata*newQuantity);
                sum_Ukupno_masti += Math.round(grocery.Ukupno_masti*newQuantity);
                sum_od_toga_zasicene_masne_kiseline += Math.round(grocery.od_toga_zasicene_masne_kiseline*newQuantity);
                sum_Dijetalna_vlakna += Math.round(grocery.Dijetalna_vlakna*newQuantity);
                sum_Ukupno_secera += Math.round(grocery.Ukupno_secera*newQuantity);
                sum_Holesterol += Math.round(grocery.Holesterol*newQuantity);
                sum_Voda += Math.round(grocery.Voda*newQuantity);
                sum_Mononezasicene_masne_kiseline += Math.round(grocery.Mononezasicene_masne_kiseline*newQuantity);
                sum_Polinezasicene_masne_kiseline += Math.round(grocery.Polinezasicene_masne_kiseline*newQuantity);
                sum_VitaminC += Math.round(grocery.VitaminC*newQuantity);
                sum_VitaminB1_Tiamin += Math.round(grocery.VitaminB1_Tiamin*newQuantity);
                sum_VitaminB2_Riboflavin += Math.round(grocery.VitaminB2_Riboflavin*newQuantity);
                sum_VitaminB3_Niacin += Math.round(grocery.VitaminB3_Niacin*newQuantity);
                sum_VitaminB5_Pantotenska_kiselina += Math.round(grocery.VitaminB5_Pantotenska_kiselina*newQuantity);
                sum_VitaminB6_Piridoksin += Math.round(grocery.VitaminB6_Piridoksin*newQuantity);
                sum_VitaminB9_Folati += Math.round(grocery.VitaminB9_Folati*newQuantity);
                sum_VitaminB12_Kobalamin += Math.round(grocery.VitaminB12_Kobalamin*newQuantity);
                sum_VitaminA += Math.round(grocery.VitaminA*newQuantity);
                sum_VitaminD += Math.round(grocery.VitaminD*newQuantity);
                sum_VitaminE += Math.round(grocery.VitaminE*newQuantity);
                sum_VitaminK += Math.round(grocery.VitaminK*newQuantity);
                sum_Kalcijum_Ca += Math.round(grocery.Kalcijum_Ca*newQuantity);
                sum_Zeljezo_Fe += Math.round(grocery.Zeljezo_Fe*newQuantity);
                sum_Magnezijum_Mg += Math.round(grocery.Magnezijum_Mg*newQuantity);
                sum_Fosfor_P += Math.round(grocery.Fosfor_P*newQuantity);
                sum_Kalijum_K += Math.round(grocery.Kalijum_K*newQuantity);
                sum_Natrijum_Na += Math.round(grocery.Natrijum_Na*newQuantity);
                sum_Cink_Zn += Math.round(grocery.Cink_Zn*newQuantity);
                sum_Bakar_Cu += Math.round(grocery.Bakar_Cu*newQuantity);
                sum_Mangan_Mn += Math.round(grocery.Mangan_Mn*newQuantity);
                sum_Selen_Se += Math.round(grocery.Selen_Se*newQuantity);
                // endregion
              })
              setSumKcal(sum_KCAL);
              setSumUH(sum_UH);
              setSumProteini(sum_PROTEINI);
              setSumMasti(sum_MASTI);
              // #region initial add fields
              setSumod_toga_zasicene_masne_kiseline(sum_od_toga_zasicene_masne_kiseline);
              setSumDijetalna_vlakna(sum_Dijetalna_vlakna);
              setSumUkupno_secera(sum_Ukupno_secera);
              setSumHolesterol(sum_Holesterol);
              setSumVoda(sum_Voda);
              setSumMononezasicene_masne_kiseline(sum_Mononezasicene_masne_kiseline);
              setSumPolinezasicene_masne_kiseline(sum_Polinezasicene_masne_kiseline);
              setSumVitaminC(sum_VitaminC);
              setSumVitaminB1_Tiamin(sum_VitaminB1_Tiamin);
              setSumVitaminB2_Riboflavin(sum_VitaminB2_Riboflavin);
              setSumVitaminB3_Niacin(sum_VitaminB3_Niacin);
              setSumVitaminB5_Pantotenska_kiselina(sum_VitaminB5_Pantotenska_kiselina);
              setSumVitaminB6_Piridoksin(sum_VitaminB6_Piridoksin);
              setSumVitaminB9_Folati(sum_VitaminB9_Folati);
              setSumVitaminB12_Kobalamin(sum_VitaminB12_Kobalamin);
              setSumVitaminA(sum_VitaminA);
              setSumVitaminD(sum_VitaminD);
              setSumVitaminE(sum_VitaminE);
              setSumVitaminK(sum_VitaminK);
              setSumKalcijum_Ca(sum_Kalcijum_Ca);
              setSumZeljezo_Fe(sum_Zeljezo_Fe);
              setSumMagnezijum_Mg(sum_Magnezijum_Mg);
              setSumFosfor_P(sum_Fosfor_P);
              setSumKalijum_K(sum_Kalijum_K);
              setSumNatrijum_Na(sum_Natrijum_Na);
              setSumCink_Zn(sum_Cink_Zn);
              setSumBakar_Cu(sum_Bakar_Cu);
              setSumMangan_Mn(sum_Mangan_Mn);
              setSumSelen_Se(sum_Selen_Se);
              setSumOfValues(sum_KCAL + sum_UH + sum_PROTEINI + sum_MASTI + sum_od_toga_zasicene_masne_kiseline + sum_Dijetalna_vlakna + sum_Ukupno_secera +
                sum_Holesterol + sum_Voda + sum_Mononezasicene_masne_kiseline + sum_Polinezasicene_masne_kiseline + sum_VitaminC + sum_VitaminB1_Tiamin + 
                sum_VitaminB2_Riboflavin + sum_VitaminB3_Niacin + sum_VitaminB5_Pantotenska_kiselina + sum_VitaminB6_Piridoksin + sum_VitaminB9_Folati + 
                sum_VitaminB12_Kobalamin + sum_VitaminA + sum_VitaminD + sum_VitaminE + sum_VitaminK + sum_Kalcijum_Ca + sum_Zeljezo_Fe + sum_Magnezijum_Mg +
                sum_Fosfor_P + sum_Kalijum_K + sum_Natrijum_Na + sum_Cink_Zn + sum_Bakar_Cu + sum_Mangan_Mn + sum_Selen_Se);
              // endregion
            
              
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
    var sum_Energetska_vrednost = 0;
    var sum_Ukupno_proteina = 0;
    var sum_Ukupno_ugljenih_hidrata = 0;
    var sum_Ukupno_masti = 0;
    var sum_od_toga_zasicene_masne_kiseline = 0;
    var sum_Dijetalna_vlakna = 0;
    var sum_Ukupno_secera = 0;
    var sum_Holesterol = 0;
    var sum_Voda = 0;
    var sum_Mononezasicene_masne_kiseline = 0;
    var sum_Polinezasicene_masne_kiseline = 0;
    var sum_VitaminC = 0;
    var sum_VitaminB1_Tiamin = 0;
    var sum_VitaminB2_Riboflavin = 0;
    var sum_VitaminB3_Niacin = 0;
    var sum_VitaminB5_Pantotenska_kiselina = 0;
    var sum_VitaminB6_Piridoksin = 0;
    var sum_VitaminB9_Folati = 0;
    var sum_VitaminB12_Kobalamin = 0;
    var sum_VitaminA = 0;
    var sum_VitaminD = 0;
    var sum_VitaminE = 0;
    var sum_VitaminK = 0;
    var sum_Kalcijum_Ca = 0;
    var sum_Zeljezo_Fe = 0;
    var sum_Magnezijum_Mg = 0;
    var sum_Fosfor_P = 0;
    var sum_Kalijum_K = 0;
    var sum_Natrijum_Na = 0;
    var sum_Cink_Zn = 0;
    var sum_Bakar_Cu = 0;
    var sum_Mangan_Mn = 0;
    var sum_Selen_Se = 0;
    groceriesForChosenRecipe.forEach((grocery) => {
      var newQuantity = percent==0? grocery.Kolicina : (grocery.Kolicina*(percent+100))/100;

      sum_KCAL += Math.round(grocery.kcal*newQuantity);
      sum_UH += Math.round(grocery.UH*newQuantity);
      sum_PROTEINI += Math.round(grocery.Proteini*newQuantity);
      sum_MASTI += Math.round(grocery.Masti*newQuantity);
      sum_Energetska_vrednost += Math.round(grocery.Energetska_vrednost*newQuantity);
      sum_Ukupno_proteina += Math.round(grocery.Ukupno_proteina*newQuantity);
      sum_Ukupno_ugljenih_hidrata += Math.round(grocery.Ukupno_ugljenih_hidrata*newQuantity);
      sum_Ukupno_masti += Math.round(grocery.Ukupno_masti*newQuantity);
      sum_od_toga_zasicene_masne_kiseline += Math.round(grocery.od_toga_zasicene_masne_kiseline*newQuantity);
      sum_Dijetalna_vlakna += Math.round(grocery.Dijetalna_vlakna*newQuantity);
      sum_Ukupno_secera += Math.round(grocery.Ukupno_secera*newQuantity);
      sum_Holesterol += Math.round(grocery.Holesterol*newQuantity);
      sum_Voda += Math.round(grocery.Voda*newQuantity);
      sum_Mononezasicene_masne_kiseline += Math.round(grocery.Mononezasicene_masne_kiseline*newQuantity);
      sum_Polinezasicene_masne_kiseline += Math.round(grocery.Polinezasicene_masne_kiseline*newQuantity);
      sum_VitaminC += Math.round(grocery.VitaminC*newQuantity);
      sum_VitaminB1_Tiamin += Math.round(grocery.VitaminB1_Tiamin*newQuantity);
      sum_VitaminB2_Riboflavin += Math.round(grocery.VitaminB2_Riboflavin*newQuantity);
      sum_VitaminB3_Niacin += Math.round(grocery.VitaminB3_Niacin*newQuantity);
      sum_VitaminB5_Pantotenska_kiselina += Math.round(grocery.VitaminB5_Pantotenska_kiselina*newQuantity);
      sum_VitaminB6_Piridoksin += Math.round(grocery.VitaminB6_Piridoksin*newQuantity);
      sum_VitaminB9_Folati += Math.round(grocery.VitaminB9_Folati*newQuantity);
      sum_VitaminB12_Kobalamin += Math.round(grocery.VitaminB12_Kobalamin*newQuantity);
      sum_VitaminA += Math.round(grocery.VitaminA*newQuantity);
      sum_VitaminD += Math.round(grocery.VitaminD*newQuantity);
      sum_VitaminE += Math.round(grocery.VitaminE*newQuantity);
      sum_VitaminK += Math.round(grocery.VitaminK*newQuantity);
      sum_Kalcijum_Ca += Math.round(grocery.Kalcijum_Ca*newQuantity);
      sum_Zeljezo_Fe += Math.round(grocery.Zeljezo_Fe*newQuantity);
      sum_Magnezijum_Mg += Math.round(grocery.Magnezijum_Mg*newQuantity);
      sum_Fosfor_P += Math.round(grocery.Fosfor_P*newQuantity);
      sum_Kalijum_K += Math.round(grocery.Kalijum_K*newQuantity);
      sum_Natrijum_Na += Math.round(grocery.Natrijum_Na*newQuantity);
      sum_Cink_Zn += Math.round(grocery.Cink_Zn*newQuantity);
      sum_Bakar_Cu += Math.round(grocery.Bakar_Cu*newQuantity);
      sum_Mangan_Mn += Math.round(grocery.Mangan_Mn*newQuantity);
      sum_Selen_Se += Math.round(grocery.Selen_Se*newQuantity);
    })
    setSumKcal(sum_KCAL);
    setSumUH(sum_UH);
    setSumProteini(sum_PROTEINI);
    setSumMasti(sum_MASTI);
    setSumod_toga_zasicene_masne_kiseline(sum_od_toga_zasicene_masne_kiseline);
    setSumDijetalna_vlakna(sum_Dijetalna_vlakna);
    setSumUkupno_secera(sum_Ukupno_secera);
    setSumHolesterol(sum_Holesterol);
    setSumVoda(sum_Voda);
    setSumMononezasicene_masne_kiseline(sum_Mononezasicene_masne_kiseline);
    setSumPolinezasicene_masne_kiseline(sum_Polinezasicene_masne_kiseline);
    setSumVitaminC(sum_VitaminC);
    setSumVitaminB1_Tiamin(sum_VitaminB1_Tiamin);
    setSumVitaminB2_Riboflavin(sum_VitaminB2_Riboflavin);
    setSumVitaminB3_Niacin(sum_VitaminB3_Niacin);
    setSumVitaminB5_Pantotenska_kiselina(sum_VitaminB5_Pantotenska_kiselina);
    setSumVitaminB6_Piridoksin(sum_VitaminB6_Piridoksin);
    setSumVitaminB9_Folati(sum_VitaminB9_Folati);
    setSumVitaminB12_Kobalamin(sum_VitaminB12_Kobalamin);
    setSumVitaminA(sum_VitaminA);
    setSumVitaminD(sum_VitaminD);
    setSumVitaminE(sum_VitaminE);
    setSumVitaminK(sum_VitaminK);
    setSumKalcijum_Ca(sum_Kalcijum_Ca);
    setSumZeljezo_Fe(sum_Zeljezo_Fe);
    setSumMagnezijum_Mg(sum_Magnezijum_Mg);
    setSumFosfor_P(sum_Fosfor_P);
    setSumKalijum_K(sum_Kalijum_K);
    setSumNatrijum_Na(sum_Natrijum_Na);
    setSumCink_Zn(sum_Cink_Zn);
    setSumBakar_Cu(sum_Bakar_Cu);
    setSumMangan_Mn(sum_Mangan_Mn);
    setSumSelen_Se(sum_Selen_Se);
    setSumOfValues(sum_KCAL + sum_UH + sum_PROTEINI + sum_MASTI + sum_od_toga_zasicene_masne_kiseline + sum_Dijetalna_vlakna + sum_Ukupno_secera +
      sum_Holesterol + sum_Voda + sum_Mononezasicene_masne_kiseline + sum_Polinezasicene_masne_kiseline + sum_VitaminC + sum_VitaminB1_Tiamin + 
      sum_VitaminB2_Riboflavin + sum_VitaminB3_Niacin + sum_VitaminB5_Pantotenska_kiselina + sum_VitaminB6_Piridoksin + sum_VitaminB9_Folati + 
      sum_VitaminB12_Kobalamin + sum_VitaminA + sum_VitaminD + sum_VitaminE + sum_VitaminK + sum_Kalcijum_Ca + sum_Zeljezo_Fe + sum_Magnezijum_Mg +
      sum_Fosfor_P + sum_Kalijum_K + sum_Natrijum_Na + sum_Cink_Zn + sum_Bakar_Cu + sum_Mangan_Mn + sum_Selen_Se);
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
  
  // back to first page, 2 next functions
  const ReturnToFirstPage = () => {
    setPageRecipe(1);
  }

  const calculateForOneRow = (column) => { //TODO: add others here
    var result = {
      sum_kcal: 0,      
      sum_UH: 0,
      sum_PROTEINI: 0,
      sum_MASTI: 0,
      sum_Energetska_vrednost: 0,
      sum_Ukupno_proteina: 0,
      sum_Ukupno_ugljenih_hidrata: 0,
      sum_Ukupno_masti: 0,
      sum_od_toga_zasicene_masne_kiseline: 0,
      sum_Dijetalna_vlakna: 0,
      sum_Ukupno_secera: 0,
      sum_Holesterol: 0,
      sum_Voda: 0,
      sum_Mononezasicene_masne_kiseline: 0,
      sum_Polinezasicene_masne_kiseline: 0,
      sum_VitaminC: 0,
      sum_VitaminB1_Tiamin: 0,
      sum_VitaminB2_Riboflavin: 0,
      sum_VitaminB3_Niacin: 0,
      sum_VitaminB5_Pantotenska_kiselina: 0,
      sum_VitaminB6_Piridoksin: 0,
      sum_VitaminB9_Folati: 0,
      sum_VitaminB12_Kobalamin: 0,
      sum_VitaminA: 0,
      sum_VitaminD: 0,
      sum_VitaminE: 0,
      sum_VitaminK: 0,
      sum_Kalcijum_Ca: 0,
      sum_Zeljezo_Fe: 0,
      sum_Magnezijum_Mg: 0,
      sum_Fosfor_P: 0,
      sum_Kalijum_K: 0,
      sum_Natrijum_Na: 0,
      sum_Cink_Zn: 0,
      sum_Bakar_Cu: 0,
      sum_Mangan_Mn: 0,
      sum_Selen_Se: 0
    }
    for(let i = 1; i<n; i++)
    {
      if(matrix[i][column] != null)
      {        
        result.sum_kcal += matrix[i][column].sum_kcal;
        result.sum_UH += matrix[i][column].sum_UH;
        result.sum_PROTEINI += matrix[i][column].sum_PROTEINI;
        result.sum_MASTI += matrix[i][column].sum_MASTI;
        result.sum_Energetska_vrednost += matrix[i][column].sum_Energetska_vrednost;
        result.sum_Ukupno_proteina += matrix[i][column].sum_Ukupno_proteina;
        result.sum_Ukupno_ugljenih_hidrata += matrix[i][column].sum_Ukupno_ugljenih_hidrata;
        result.sum_Ukupno_masti += matrix[i][column].sum_Ukupno_masti;
        result.sum_od_toga_zasicene_masne_kiseline += matrix[i][column].sum_od_toga_zasicene_masne_kiseline;
        result.sum_Dijetalna_vlakna += matrix[i][column].sum_Dijetalna_vlakna;
        result.sum_Ukupno_secera += matrix[i][column].sum_Ukupno_secera;
        result.sum_Holesterol += matrix[i][column].sum_Holesterol;
        result.sum_Voda += matrix[i][column].sum_Voda;
        result.sum_Mononezasicene_masne_kiseline += matrix[i][column].sum_Mononezasicene_masne_kiseline;
        result.sum_Polinezasicene_masne_kiseline += matrix[i][column].sum_Polinezasicene_masne_kiseline;
        result.sum_VitaminC += matrix[i][column].sum_VitaminC;
        result.sum_VitaminB1_Tiamin += matrix[i][column].sum_VitaminB1_Tiamin;
        result.sum_VitaminB2_Riboflavin += matrix[i][column].sum_VitaminB2_Riboflavin;
        result.sum_VitaminB3_Niacin += matrix[i][column].sum_VitaminB3_Niacin;
        result.sum_VitaminB5_Pantotenska_kiselina += matrix[i][column].sum_VitaminB5_Pantotenska_kiselina;
        result.sum_VitaminB6_Piridoksin += matrix[i][column].sum_VitaminB6_Piridoksin;
        result.sum_VitaminB9_Folati += matrix[i][column].sum_VitaminB9_Folati;
        result.sum_VitaminB12_Kobalamin += matrix[i][column].sum_VitaminB12_Kobalamin;
        result.sum_VitaminA += matrix[i][column].sum_VitaminA;
        result.sum_VitaminD += matrix[i][column].sum_VitaminD;
        result.sum_VitaminE += matrix[i][column].sum_VitaminE;
        result.sum_VitaminK += matrix[i][column].sum_VitaminK;
        result.sum_Kalcijum_Ca += matrix[i][column].sum_Kalcijum_Ca;
        result.sum_Zeljezo_Fe += matrix[i][column].sum_Zeljezo_Fe;
        result.sum_Magnezijum_Mg += matrix[i][column].sum_Magnezijum_Mg;
        result.sum_Fosfor_P += matrix[i][column].sum_Fosfor_P;
        result.sum_Kalijum_K += matrix[i][column].sum_Kalijum_K;
        result.sum_Natrijum_Na += matrix[i][column].sum_Natrijum_Na;
        result.sum_Cink_Zn += matrix[i][column].sum_Cink_Zn;
        result.sum_Bakar_Cu += matrix[i][column].sum_Bakar_Cu;
        result.sum_Mangan_Mn += matrix[i][column].sum_Mangan_Mn;
        result.sum_Selen_Se += matrix[i][column].sum_Selen_Se;
      }
    }
    return result;
  }

  const ShowStatusMatrix = () => {
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
    auxiliaryMatrix[0][5] = "- od toga zasićene masne kiseline(g)";
    auxiliaryMatrix[0][6] = "Dijetalna vlakna(g)";
    auxiliaryMatrix[0][7] = "Ukupno šećera(g)";
    auxiliaryMatrix[0][8] = "Holesterol(mg)";
    auxiliaryMatrix[0][9] = "Voda(g)";
    auxiliaryMatrix[0][10] = "Mononezasićene masne kiseline(g)";
    auxiliaryMatrix[0][11] = "Polinezasićene masne kiseline(g)";
    auxiliaryMatrix[0][12] = "Vitamin C(mg)";
    auxiliaryMatrix[0][13] = "Vitamin B1, Tiamin(mg)";
    auxiliaryMatrix[0][14] = "Vitamin B2, Riboflavin(mg)";
    auxiliaryMatrix[0][15] = "Vitamin B3, Niacin(mg)";
    auxiliaryMatrix[0][16] = "Vitamin B5, Pantotenska kiselina(mg)";
    auxiliaryMatrix[0][17] = "Vitamin B6, Piridoksin(mg)";
    auxiliaryMatrix[0][18] = "Vitamin B9, Folati(mcg)";
    auxiliaryMatrix[0][19] = "Vitamin B12, Kobalamin(mcg)";
    auxiliaryMatrix[0][20] = "Vitamin A(IU)";
    auxiliaryMatrix[0][21] = "Vitamin D(IU)";
    auxiliaryMatrix[0][22] = "Vitamin E(IU)";
    auxiliaryMatrix[0][23] = "Vitamin K(mcg)";
    auxiliaryMatrix[0][24] = "Kalcijum Ca(mg)";
    auxiliaryMatrix[0][25] = "Zeljezo Fe(mg)";
    auxiliaryMatrix[0][26] = "Magnezijum Mg(mg)";
    auxiliaryMatrix[0][27] = "Fosfor P(mg)";
    auxiliaryMatrix[0][28] = "Kalijum K(mg)";
    auxiliaryMatrix[0][29] = "Natrijum Na(g)";
    auxiliaryMatrix[0][30] = "Cink Zn(mg)";
    auxiliaryMatrix[0][31] = "Bakar Cu(mg)";
    auxiliaryMatrix[0][32] = "Mangan Mn(mg)";
    auxiliaryMatrix[0][33] = "Selen Se(mcg)";
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
          auxiliaryMatrix[i][5] = result.sum_od_toga_zasicene_masne_kiseline;
          auxiliaryMatrix[i][6] = result.sum_Dijetalna_vlakna;
          auxiliaryMatrix[i][7] = result.sum_Ukupno_secera;
          auxiliaryMatrix[i][8] = result.sum_Holesterol;
          auxiliaryMatrix[i][9] = result.sum_Voda;
          auxiliaryMatrix[i][10] = result.sum_Mononezasicene_masne_kiseline;
          auxiliaryMatrix[i][11] = result.sum_Polinezasicene_masne_kiseline;
          auxiliaryMatrix[i][12] = result.sum_VitaminC;
          auxiliaryMatrix[i][13] = result.sum_VitaminB1_Tiamin;
          auxiliaryMatrix[i][14] = result.sum_VitaminB2_Riboflavin;
          auxiliaryMatrix[i][15] = result.sum_VitaminB3_Niacin;
          auxiliaryMatrix[i][16] = result.sum_VitaminB5_Pantotenska_kiselina;
          auxiliaryMatrix[i][17] = result.sum_VitaminB6_Piridoksin;
          auxiliaryMatrix[i][18] = result.sum_VitaminB9_Folati;
          auxiliaryMatrix[i][19] = result.sum_VitaminB12_Kobalamin;
          auxiliaryMatrix[i][20] = result.sum_VitaminA;
          auxiliaryMatrix[i][21] = result.sum_VitaminD;
          auxiliaryMatrix[i][22] = result.sum_VitaminE;
          auxiliaryMatrix[i][23] = result.sum_VitaminK;
          auxiliaryMatrix[i][24] = result.sum_Kalcijum_Ca;
          auxiliaryMatrix[i][25] = result.sum_Zeljezo_Fe;
          auxiliaryMatrix[i][26] = result.sum_Magnezijum_Mg;
          auxiliaryMatrix[i][27] = result.sum_Fosfor_P;
          auxiliaryMatrix[i][28] = result.sum_Kalijum_K;
          auxiliaryMatrix[i][29] = result.sum_Natrijum_Na;
          auxiliaryMatrix[i][30] = result.sum_Cink_Zn;
          auxiliaryMatrix[i][31] = result.sum_Bakar_Cu;
          auxiliaryMatrix[i][32] = result.sum_Mangan_Mn;
          auxiliaryMatrix[i][33] = result.sum_Selen_Se;
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

  const calcPercentOfAllValues = (value) => {
    const tmp = Math.round(value / sumOfAllValues * 100);
    return "(" + tmp + "%)";
  }

  const typographyByVitamin = (nameOfVitamin, sumOfVitamin, jedinica) => (
  <Typography>{nameOfVitamin}:<Input
        edge="end"
        aria-label="comments"
        name={"" + sumOfVitamin + ""}
        type="number"
        value={sumOfVitamin}
        disabled
        sx={{width: "50%", ml: 2}}
        endAdornment={<InputAdornment position="end">{calcPercentOfAllValues(sumOfVitamin)} {jedinica}</InputAdornment>}
        /></Typography>
  )

  const statusMatrixPresentation = (indexMin, indexMax) => (
  <table className="tableStatus">
    <tbody>
      {statusMatrix.map((row, rowIndex) => (
        rowIndex===0? <tr className="teStatusFirstRow" key={rowIndex}>
          <td className="energyValue" key='0'>Energetska vrednost korisnika</td>
          <td className="teStatus" key='1'><Typography align="center">{statusMatrix[rowIndex][indexMin]}</Typography></td>
          <td className="teStatus" key='2'><Typography align="center">{statusMatrix[rowIndex][indexMin+1]}</Typography></td>
          <td className="teStatus" key='3'><Typography align="center">{statusMatrix[rowIndex][indexMin+2]}</Typography></td>
          <td className="teStatus" key='4'><Typography align="center">{statusMatrix[rowIndex][indexMin+3]}</Typography></td>
          <td className="teStatus" key='5'><Typography align="center">{statusMatrix[rowIndex][indexMin+4]}</Typography></td>
        </tr> :
        <tr className="teStatus" key={rowIndex}>
          {row.map((column, columnIndex) => (
            rowIndex===1 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            rowIndex===2 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            rowIndex===3 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            rowIndex===4 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            rowIndex===5 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            rowIndex===6 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            rowIndex===7 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
            columnIndex >= indexMin && columnIndex < indexMax && <td className="teStatus" key={rowIndex*10 + columnIndex}>
              {statusMatrix[rowIndex][columnIndex]?
              <Typography>
                  {statusMatrix[rowIndex][columnIndex]}
              </Typography>
              : <Typography>0</Typography>}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
  )

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
      {hiddenForm && personOnADietPlan.Uloga === "Korisnik" && personOnADietPlan.BMI && <Button onClick={ShowStatusMatrix} sx={{mt: 3, mb:3, ml:"78%"}} variant="contained" component="label">VIDI NEDELJNI STATUS</Button>}
      {hiddenForm && thisIsForNutritionist && <Button onClick={ReturnToFirstPage} sx={{mt: 3, ml:"78%"}} variant="contained" component="label">VRATI SE NA PRETHODNU STRANU</Button>}
      {!hiddenForm && <Stack direction="row" spacing={2} sx={{m:5, ml: "5%"}} id="swingBox" className='swing-in-top-fwd'>
        <Stack direction="column" spacing={2}><Autocomplete
        disablePortal
        id="combo-box-demo"
        options={recipes.map((option) => option.Naslov)}
        sx={{ width: 300 }}
        value={chosenRecipe ? chosenRecipe.Naslov : null}
        onChange={(event, newValue) => {autocompleteOnChange(newValue);}}
        renderInput={(params) => <TextField {...params} label="Recepti" />}
        />
        {chosenRecipe && 
              <Typography>Ukupno:<Input
              edge="end"
              aria-label="comments"
              name="numberOfServings"
              type="number"
              value={numberOfServings}
              sx={{width: "33%", ml: 2}}
              onChange={(event) => calculatePercent(event)}
              inputProps={{ min: 1, max: 50, step: "1" }}
              endAdornment={<InputAdornment position="end">Porcija</InputAdornment>}
              /></Typography>}
        <Button onClick={saveARecipeForASpecificMeal} className='swing-in-top-fwd' sx={{ width: 300 }} variant="contained" component="label">Sacuvaj</Button>
        <Stack direction="column" spacing={3} sx={{ width: 680, m: 5 }}>
          {chosenRecipe &&
          <Box>
            <Stack direction="row" spacing={3}>
            <Box>
              <Typography>Kalorija:<Input
              edge="end"
              aria-label="comments"
              name="sumKcal"
              type="number"
              value={sumKcal}
              disabled
              sx={{width: "50%", ml: 2}}
              endAdornment={<InputAdornment position="end">{calcPercentOfAllValues(sumKcal)} kcal</InputAdornment>}
              /></Typography>
              <Typography>Ugljenih hidrata:<Input
              edge="end"
              aria-label="comments"
              name="sumUH"
              type="number"
              value={sumUH}
              disabled
              sx={{width: "50%", ml: 2}}
              endAdornment={<InputAdornment position="end">{calcPercentOfAllValues(sumUH)} g</InputAdornment>}
              /></Typography>
              <Typography>Proteina:<Input
              edge="end"
              aria-label="comments"
              name="sumProteini"
              type="number"
              value={sumProteini}
              disabled
              sx={{width: "50%", ml: 2}}
              endAdornment={<InputAdornment position="end">{calcPercentOfAllValues(sumProteini)} g</InputAdornment>}
              /></Typography>
              <Typography>Masti:<Input
              edge="end"
              aria-label="comments"
              name="sumMasti"
              type="number"
              value={sumMasti}
              disabled
              sx={{width: "50%", ml: 2}}
              endAdornment={<InputAdornment position="end">{calcPercentOfAllValues(sumMasti)} g</InputAdornment>}
              /></Typography>
              {typographyByVitamin("Dijetalna vlakna", sumDijetalna_vlakna, "g")}
              {typographyByVitamin("Ukupno šećera", sumUkupno_secera, "g")}
              {typographyByVitamin("Holesterol", sumHolesterol, "mg")}
              {typographyByVitamin("Voda", sumVoda, "g")}
              {typographyByVitamin("Kalcijum Ca", sumKalcijum_Ca, "mg")}
            </Box>
            <Box>
                {typographyByVitamin("- od toga zasićene masne kiseline", sumod_toga_zasicene_masne_kiseline, "g")}
                {typographyByVitamin("Mononezasićene masne kiseline", sumMononezasicene_masne_kiseline, "g")}
                {typographyByVitamin("Polinezasićene masne kiseline", sumPolinezasicene_masne_kiseline, "g")}
                {typographyByVitamin("Vitamin A", sumVitaminA, "IU")}
                {typographyByVitamin("Vitamin B1, Tiamin", sumVitaminB1_Tiamin, "mg")}
                {typographyByVitamin("Vitamin B2, Riboflavin", sumVitaminB2_Riboflavin, "mg")}
                {typographyByVitamin("Vitamin B3, Niacin", sumVitaminB3_Niacin, "mg")}
                {typographyByVitamin("Vitamin B5, Pantotenska kiselina", sumVitaminB5_Pantotenska_kiselina, "mg")}
                {typographyByVitamin("Vitamin B6, Piridoksin", sumVitaminB6_Piridoksin, "mg")}
                {typographyByVitamin("Vitamin B9, Folati", sumVitaminB9_Folati, "mcg")}
                {typographyByVitamin("Vitamin B12, Kobalamin", sumVitaminB12_Kobalamin, "mcg")}
                {typographyByVitamin("Vitamin C", sumVitaminC, "mg")}
                {typographyByVitamin("Vitamin D", sumVitaminD, "IU")}
                {typographyByVitamin("Vitamin E", sumVitaminE, "IU")}
                {typographyByVitamin("Vitamin K", sumVitaminK, "mcg")}
                {typographyByVitamin("Zeljezo Fe", sumZeljezo_Fe, "mg")}
                {typographyByVitamin("Magnezijum Mg", sumMagnezijum_Mg, "mg")}
                {typographyByVitamin("Fosfor P", sumFosfor_P, "mg")}
                {typographyByVitamin("Kalijum K", sumKalijum_K, "mg")}
                {typographyByVitamin("Natrijum Na", sumNatrijum_Na, "g")}
                {typographyByVitamin("Cink Zn", sumCink_Zn, "mg")}
                {typographyByVitamin("Bakar Cu", sumBakar_Cu, "mg")}
                {typographyByVitamin("Mangan Mn", sumMangan_Mn, "mg")}
                {typographyByVitamin("Selen Se", sumSelen_Se, "mcg")}
            </Box>
            </Stack>
          </Box>}
        </Stack></Stack>
        {chosenRecipe &&
        <Card className='swing-in-top-fwd' sx={{ width: 500, height: 470 }}>
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
                    <Chip label={generateLabelName(x)} sx={{m:0.5}} variant="outlined" color="primary" avatar={<Avatar src={x.Slika} alt="X" />} />
                  ).slice(0,3)}</Box>
                  
                </CardActions>
            </Card>}
        </Stack>}
      </Box>}
      {formWithStatusMatrix && personOnADietPlan.Uloga === "Korisnik" &&
      <div className="sheet">
        <Stack direction="column" spacing={5}>
          <table className="tableStatus">
            <tbody>
              {statusMatrix.map((row, rowIndex) => (
                rowIndex===0? <tr className="teStatusFirstRow" key={rowIndex}>
                  <td className="energyValue" key='0'>Energetska vrednost korisnika</td>
                  <td className="teStatus" key='1'><Typography align="center">{statusMatrix[rowIndex][1]}</Typography></td>
                  <td className="teStatus" key='2'><Typography align="center">{statusMatrix[rowIndex][2]}</Typography></td>
                  <td className="teStatus" key='3'><Typography align="center">{statusMatrix[rowIndex][3]}</Typography></td>
                  <td className="teStatus" key='4'><Typography align="center">{statusMatrix[rowIndex][4]}</Typography></td>
                </tr> :
                <tr className="teStatus" key={rowIndex}>
                  {row.map((column, columnIndex) => (
                    rowIndex===1 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    rowIndex===2 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    rowIndex===3 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    rowIndex===4 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    rowIndex===5 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    rowIndex===6 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    rowIndex===7 && columnIndex===0? <td className="teStatusColumn" key={rowIndex*10 + columnIndex}><Typography align="center">{statusMatrix[rowIndex][columnIndex]}</Typography></td> :
                    columnIndex < 5 && <td className="teStatus" key={rowIndex*10 + columnIndex}>
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
                      : <Typography>0</Typography>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {statusMatrixPresentation(5, 10)}
          {statusMatrixPresentation(10, 15)}
          {statusMatrixPresentation(15, 20)}
          {statusMatrixPresentation(20, 25)}
          {statusMatrixPresentation(25, 30)}
          {statusMatrixPresentation(30, 34)}
        </Stack>
      </div>}
    </Box>
  );
};