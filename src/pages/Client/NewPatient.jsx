import * as React from 'react';
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

export const NewPatient = () => {
  let dispatch = useDispatch();
  const { page } = useSelector((state) => state.newPatient);

  const handleChange = (e, newValue) => {
    dispatch(changePage(newValue));
  };

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
          <Tab label="Alergeni" value="4" disabled={true}/>
          <Tab label="Dijete" value="5" disabled={true}/>
        </Tabs>
        <TabPanel value="1"><BasicInfoComponent /></TabPanel>
        <TabPanel value="2"><AnthropometricParameters /></TabPanel>
        <TabPanel value="3"><PhysicalActivities /></TabPanel>
        <TabPanel value="4">Alergeni</TabPanel>
        <TabPanel value="5">Dijete</TabPanel>
      </TabContext>
    </Box>
  ); //disabled={true} na liniji sa Tab!!
}
