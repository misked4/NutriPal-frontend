import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Grid, List, ListItem, ListItemIcon, Checkbox, Paper, ListItemText, Autocomplete, TextField, IconButton, ListItemButton, Stack } from '@mui/material';
import { getAllGroceries, getGroceriesByName } from './APIcomms';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import './NewFoodSchedule.css'
//OPASNOST: ako klijent ubaci namirnicu,a drugi klijent pokusa da je ubaci u nedeljni plan ishrane
const n = 7;
const m = 8;
export const NewFoodSchedule = () => {
  const [matrix, setMatrix] = useState(Array.from({length: n},()=> Array.from({length: m}, () => null)));
  const [indexOfRow, setIndexOfRow] = useState(-1);
  const [indexOfColumn, setIndexOfColumn] = useState(-1);
  const [groceries, setGroceries] = useState([]);
  const [hiddenForm, setHiddenForm] = useState(true);

  function AfterSlideIn() {
    var element = document.getElementById("swingBox");
    console.log(element.className);
    
    if (element.classList.contains('swing-in-top-fwd')) {
      element.classList.remove('swing-in-top-fwd');      
      element.classList.add('swing-out-top-bck');
    }
    console.log(element.className);
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
    getAllGroceries()
      .then(data=>{
        setGroceries(data.map(oneGrocery=>{
          let currentGrocery = {id : oneGrocery.id, Naziv: oneGrocery.Naziv, Kolicina: 1 };
          return currentGrocery; 
        }));
        var startIndex = 0;
        var endIndex = 5;
        setLeft(data.slice([startIndex], [endIndex]).map(oneGrocery=>{
          let currentGrocery = {id : oneGrocery.id, Naziv: oneGrocery.Naziv, Kolicina: 1 };
          return currentGrocery; 
        }));
      })
      .catch(e=>console.log(e));
  },[]);

  const changeInput = (e) => {
    if(!e.target.value)
    {      
      var startIndex = 0;
      var endIndex = 10;
      setLeft(groceries.slice([startIndex], [endIndex]).map(oneGrocery=>{
        let currentGrocery = {id : oneGrocery.id, Naziv: oneGrocery.Naziv, Kolicina: 1 };
        return currentGrocery; 
      }));
    }
    else
    {
      getGroceriesByName(e.target.value)
        .then(data=>{
          setLeft(data.map(oneGrocery=>{
            let currentGrocery = {id : oneGrocery.id, Naziv: oneGrocery.Naziv, Kolicina: 1 };
            return currentGrocery; 
          }));
        })
        .catch(e=>console.log(e));
    }
  }

  const setAllArraysToInitialValues = () => {
    setChecked([]);
    setRight([]);
    var startIndex = 0;
    var endIndex = 10;
    setLeft(groceries.slice([startIndex], [endIndex]).map(oneGrocery=>{
      let currentGrocery = {id : oneGrocery.id, Naziv: oneGrocery.Naziv, Kolicina: 1 };
      return currentGrocery; 
    }));
  }

  const handleChange = (rowIndex, columnIndex, event) => {
    let copy = [...matrix];
    copy[rowIndex][columnIndex] = +event.target.value;
    setMatrix(copy);
  };

  const returnToNull = (rowIndex, columnIndex) => {
    let copy = [...matrix];
    copy[rowIndex][columnIndex] = null;
    setMatrix(copy);
    console.log(matrix);
  };

  const setIndexes = (rowIndex, columnIndex) => {
    setIndexOfRow(rowIndex);
    setIndexOfColumn(columnIndex);
    if(matrix[rowIndex][columnIndex]!=null) //ako vec imamo definisane namirnice za ovaj obrok
    {
      setRight(matrix[rowIndex][columnIndex]);
      const leftRight = intersection(left, right);
      setLeft(not(left, leftRight));
    }
    else 
      setAllArraysToInitialValues();
    setHiddenForm(false);
  }
  const save = () => {    
    AfterSlideIn();
    if(indexOfRow>0 && indexOfColumn>0 && indexOfRow <= n && indexOfColumn <= m)
    {
      let copy = [...matrix];
      copy[indexOfRow][indexOfColumn] = right;
      setMatrix(copy);
      console.log(matrix);
      setTimeout(function(){
        setHiddenForm(true);
      }, 1200);
      setIndexOfRow(-1);
      setIndexOfColumn(-1);
      
      const btn = document.getElementById(indexOfRow*10 + indexOfColumn);
      btn.textContent = 'IZMENI';
    }
    else{
      console.log("pogresni indexi");
      console.log("indexOfRow");
      console.log(indexOfRow);
      console.log("indexOfColumn");
      console.log(indexOfColumn);
    }
  }

  // #region bootstrap
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

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
    if(right.length!=0)
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
    if(right.length!=0)
    {
      for(var i = 0;i < leftChecked.length; i++){
        for(var j = 0;j < right.length; j++){
          console.log(leftChecked[i]);
          console.log(right[j]);
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

  const customList = (items, side) => (
    <Box>
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
      {items.map((value) => {
          const labelId = `transfer-list-item-${value.id}-label`;

          return (
            <ListItem
              key={value.id}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  {side==="left"? <InfoIcon /> : <SettingsIcon/>}
                </IconButton>
              }
              disablePadding
            >
                <ListItemButton role="listitem" button onClick={handleToggle(value)}>
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
                <ListItemText id={labelId} primary={value.Naziv} />
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
  // #endregion

  return (
    <Box flex={4} p={2}>
      <div className="sheet">
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
                  rowIndex===1 && columnIndex===0? <td className="tableEl"><Typography align="center">Dorucak</Typography></td> :
                  rowIndex===2 && columnIndex===0? <td className="tableEl"><Typography align="center">Jutarnja uzina</Typography></td> :
                  rowIndex===3 && columnIndex===0? <td className="tableEl"><Typography align="center">Rucak</Typography></td> :
                  rowIndex===4 && columnIndex===0? <td className="tableEl"><Typography align="center">Popodnevna uzina</Typography></td> :
                  rowIndex===5 && columnIndex===0? <td className="tableEl"><Typography align="center">Vecera</Typography></td> :
                  rowIndex===6 && columnIndex===0? <td className="tableEl"><Typography align="center">Obrok pred spavanje</Typography></td> :
                  <td className="tableEl" key={columnIndex}>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{width: "100%"}}
                      className="buttonWithoutRadius"   
                      id={rowIndex*10 + columnIndex}
                      onClick={()=>setIndexes(rowIndex, columnIndex)}                   
                    >&nbsp;DODAJ&nbsp;</Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenForm && <Button sx={{mt: 3, ml:"78%"}} variant="contained" component="label" className='swing-in-top-fwd'>POTVRDI CEO NEDELJNI JELOVNIK</Button>}
      {!hiddenForm && 
      <Stack direction="column" spacing={2} id='swingBox' className='swing-in-top-fwd' display="flex" justifyContent="center" alignItems="center">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item>{customList(left, "left")}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
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
        <Button
          variant="contained"
          component="label"  
          sx = {{width:"300px"}}
          onClick={()=>save()}                   
        >SACUVAJ</Button>        
      </Stack>
      }
    </Box>
  );
};

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}
