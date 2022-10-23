import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Divider, Typography } from '@mui/material';
import html2pdf from 'html2pdf.js';
import { getAllDataForWeekSchedule, getAllDataForRecipe } from './APIcalls';
import './ClientWeekSchedule.css';
import { Stack } from '@mui/system';

const n = 7;
const m = 8;

export const ClientWeekSchedule = () => {
    const { user } = useSelector((state) => state.auth);
    const [addInfo, setAddInfo] = useState({});
    const [nutritionist, setNutritionist] = useState({});
    const [allDataArrived, setAllDataArrived] = useState(false);
    const [fullMatrix, setFullMatrix] = useState(Array.from({length: n},()=> Array.from({length: m}, () => null)));
    const [allRecipesWithoutDuplicate, setAllRecipesWithoutDuplicate] = useState([]);
    const [allRecipesSetted, setAllRecipesSetted] = useState(false);
    
    var arrayOfRecipe = [];

    const generatePdf = () => {
        var element = document.getElementById("element");
        html2pdf(element, {
        margin:       2,
        filename:     'Moj_nedeljni_plan_ishrane.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true, backgroundColor: null },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { before: '.groceryClass', after: ['#groceryClass'], avoid: 'groceryClass' }
        });
    }

    useEffect(()=>{
        getAllDataForWeekSchedule(user[0].KreatorId, user[0].id, user[0].Cilj_ishrane) //nutritionist, matrix
          .then(result=>{
            setFullMatrix(result.matrix);
            setNutritionist(result.nutritionist);
            setAllDataArrived(true);
          })
          .catch(e=>console.log(e));
    },[]);

    useEffect(()=>{
        if(fullMatrix[0][0]!=null)
        {
            for(let i = 1; i<7; i++)
            {
                for(let j = 1; j<8; j++)
                {
                    if(fullMatrix[i][j]!=null)
                    {
                        if(!arrayOfRecipe.find(x=>x.chosenRecipe == fullMatrix[i][j].chosenRecipe && x.numberOfServings == fullMatrix[i][j].numberOfServings))
                            {
                                let obj = {
                                    chosenRecipe: fullMatrix[i][j].chosenRecipe,
                                    numberOfServings: fullMatrix[i][j].numberOfServings
                                }
                                arrayOfRecipe.push(obj);
                            }
                        //if(!allRecipesWithoutDuplicate.includes(fullMatrix[i][j].chosenRecipe))
                        //    setAllRecipesWithoutDuplicate(allRecipesWithoutDuplicate => [...allRecipesWithoutDuplicate, fullMatrix[i][j].chosenRecipe]);
                    }
                }
            }
            console.log(arrayOfRecipe);
            populateArrayOfRecipeWithData(arrayOfRecipe);
        }
    },[fullMatrix])

    const populateArrayOfRecipeWithData = (recipes) => {
        if(allRecipesSetted==false)
        {
            recipes.forEach(recipeWithNoOfServings => {
                getAllDataForRecipe(recipeWithNoOfServings.chosenRecipe)
                    .then(result=>{
                        let obj = {
                            recipe: result,
                            numberOfServings: recipeWithNoOfServings.numberOfServings
                        }
                        console.log(obj);
                        setAllRecipesWithoutDuplicate(allRecipesWithoutDuplicate => [...allRecipesWithoutDuplicate, obj]);
                })
                .catch(e=>console.log(e));
            });            
            setAllRecipesSetted(true);
        }
    }

    const calculateQuantity = (newValue, oldValueOfNumbersOfServings, quantity) => {
        const oldValue = oldValueOfNumbersOfServings;
        const percent = (newValue-oldValue)/Math.abs(oldValue) * 100;
        
        var finalQuantity = percent==0? quantity : (quantity*(percent+100))/100;
        finalQuantity = Math.round(finalQuantity*100);
        return finalQuantity;
    }
  

    return (
        <Box flex={4} p={2} id="element">
        {allDataArrived && <div>
            <Typography sx={{ fontStyle: 'Bold', mr:"25%", m:2 }} variant="h5">Vas izabrani nutricionista: {nutritionist.Ime} {nutritionist.Prezime}</Typography>
            <table className="tableSchedule">
            {fullMatrix.map((row, rowIndex) => (
              rowIndex===0?
              <thead key={8}> 
                <tr key={rowIndex}>
                    <th key='0'></th>
                    <th key='1'><Typography align="center">{fullMatrix[rowIndex][1]}</Typography></th>
                    <th key='2'><Typography align="center">{fullMatrix[rowIndex][2]}</Typography></th>
                    <th key='3'><Typography align="center">{fullMatrix[rowIndex][3]}</Typography></th>
                    <th key='4'><Typography align="center">{fullMatrix[rowIndex][4]}</Typography></th>
                    <th key='5'><Typography align="center">{fullMatrix[rowIndex][5]}</Typography></th>
                    <th key='6'><Typography align="center">{fullMatrix[rowIndex][6]}</Typography></th>
                    <th key='7'><Typography align="center">{fullMatrix[rowIndex][7]}</Typography></th>
                </tr>
              </thead> :
              <tbody key={rowIndex*rowIndex}>
                <tr key={rowIndex}>
                    {row.map((column, columnIndex) => (
                    rowIndex===1 && columnIndex===0? <td key={rowIndex*10 + columnIndex}><Typography align="center">Dorucak</Typography></td> :
                    rowIndex===2 && columnIndex===0? <td key={rowIndex*10 + columnIndex}><Typography align="center">Jutarnja uzina</Typography></td> :
                    rowIndex===3 && columnIndex===0? <td key={rowIndex*10 + columnIndex}><Typography align="center">Rucak</Typography></td> :
                    rowIndex===4 && columnIndex===0? <td key={rowIndex*10 + columnIndex}><Typography align="center">Popodnevna uzina</Typography></td> :
                    rowIndex===5 && columnIndex===0? <td key={rowIndex*10 + columnIndex}><Typography align="center">Vecera</Typography></td> :
                    rowIndex===6 && columnIndex===0? <td key={rowIndex*10 + columnIndex}><Typography align="center">Obrok pred spavanje</Typography></td> :
                    <td data-title={fullMatrix[0][columnIndex]} key={rowIndex*10 + columnIndex}>
                        {fullMatrix[rowIndex][columnIndex]? <div className="tdClassName">{fullMatrix[rowIndex][columnIndex].chosenRecipeName} ({fullMatrix[rowIndex][columnIndex].numberOfServings} porcija)</div> : <Typography>-</Typography>}
                    </td>
                    ))}
                </tr>
              </tbody>
            ))}
            </table>
        </div>}
        {allRecipesSetted && allRecipesWithoutDuplicate.map((data, index) => (
            <Box sx={{m:4}} id="groceryClass" className="groceryClass">
                <Typography sx={{ fontStyle: 'italic', ml:"25%" }} variant="h4" width="50%">{data.recipe.recipeData.Naslov} ({data.numberOfServings} porcija)</Typography>
                <Box width="50%">
                    <Typography variant="h5" sx={{ml:"10%"}} width="50%">Nacin spremanja recepta: </Typography>
                    <Typography variant="subtitle2" sx={{ml:"15%", border: 0.5}} width="50%">{data.recipe.recipeData.Opis}</Typography>
                </Box>
                <Box width="50%">
                    <Typography variant="h5" sx={{ml:"10%"}} width="50%">Sastojci: </Typography>
                    {data.recipe.allGroceries.map((grocery, index)=>(
                        <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle2" sx={{ml:"15%"}} width="50%">- {grocery.Naziv}</Typography>
                            <Typography variant="subtitle2" sx={{ml:"15%"}} width="50%">{calculateQuantity(data.numberOfServings, data.recipe.recipeData.Broj_porcija, grocery.Kolicina)} gr</Typography>
                        </Stack>
                    ))}
                </Box>
                <Divider/>
            </Box>
        ))}
        <Button onClick={()=>{generatePdf()}}>PDF</Button>
        </Box>
    )
}