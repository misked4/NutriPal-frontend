import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabPanel } from '@mui/lab';
import { TabContext } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { Day } from './Day';

export const NewFoodSchedule = () => {
  let dispatch = useDispatch();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //const handleChange = (e, newValue) => {
  //  dispatch(changePage(newValue));
  //};

  return (
    <Box flex={4} p={2}  sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Ponedeljak" value="1"/>
          <Tab label="Utorak" value="2"/>
          <Tab label="Sreda" value="3"/>
          <Tab label="Cetvrtak" value="4"/>
          <Tab label="Petak" value="5"/>
          <Tab label="Subota" value="6"/>
          <Tab label="Nedelja" value="7"/>
        </Tabs>
        <TabPanel value="1"><Day/></TabPanel>
        <TabPanel value="2"><Day/></TabPanel>
        <TabPanel value="3"><Day/></TabPanel>
        <TabPanel value="4"><div>cetvrtak</div></TabPanel>
        <TabPanel value="5">Petak</TabPanel>
        <TabPanel value="6">Subota</TabPanel>
        <TabPanel value="7">Nedelja</TabPanel>
      </TabContext>
    </Box>
  ); //disabled={true} na liniji sa Tab!!
}
