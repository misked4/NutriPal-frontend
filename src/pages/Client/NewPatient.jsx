import React, { useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabPanel } from '@mui/lab';
import { TabContext } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { changePage } from '../../redux/newPatient/actions';

import { BasicInfoComponent } from './BasicInfoComponent';
import { AnthropometricParameters } from './AnthropometricParameters';
import { PhysicalActivities } from './PhysicalActivities';
import { NewFoodSchedule } from '../Food_schedule/NewFoodSchedule';
import { Typography } from '@mui/material';

export const NewPatient = () => {
  let dispatch = useDispatch();
  const { page, createdUser } = useSelector((state) => state.newPatient);
  const [ createdUserTrue, setCreatedUserTrue ] = useState(false);

  const handleChange = (e, newValue) => {
    dispatch(changePage(newValue));
  };

  useEffect(() => {
    if(createdUser!=null)
    {    
      console.log("EVO GA UCITAN"); 
      setCreatedUserTrue(true);
      //setCreatedUserTrue(true);
    }
    else console.log("jos nije ucitan")
  },[createdUser]);

  return (
    <Box flex={4} p={2}>
      <TabContext value={page}>
        <Tabs
          value={page}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Osnovne informacije" value="1" disabled={true}/>
          <Tab label="Antropometrijski parametri" value="2" disabled={true}/>
          <Tab label="Intenzitet fizike aktivnosti" value="3" disabled={true}/>
          <Tab label="Nedeljni plan ishrane" value="4" disabled={true}/>
          <Tab label="Alergeni" value="5" disabled={true}/>
          <Tab label="Dijete" value="6" disabled={true}/>
        </Tabs>
        <TabPanel value="1"><BasicInfoComponent /></TabPanel>
        <TabPanel value="2"><AnthropometricParameters /></TabPanel>
        <TabPanel value="3"><PhysicalActivities /></TabPanel>
        <TabPanel value="4">{createdUserTrue? <Box><NewFoodSchedule personOnADietPlan={createdUser} /></Box>: <Typography>LOADING</Typography>}</TabPanel>
        <TabPanel value="5">Alergeni</TabPanel>
        <TabPanel value="6">Dijete</TabPanel>
      </TabContext>
    </Box>
  ); //disabled={true} na liniji sa Tab!! <NewFoodSchedule personOnADietPlan={userForWeeklyPlan[0]} />
}
