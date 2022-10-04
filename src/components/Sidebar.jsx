import React from 'react'
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import { theme } from "../theme";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideRightBar, unhiddenRightBar } from './../redux/rightbar/actions';

function changeHeight() {
  document.getElementsByClassName("myDiv")[0].style.height = "100vmax";
  window.scrollTo(0, 0);
}

const Sidebar = ({setMode, mode}) => {
  let dispatch = useDispatch();

  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();


  const changeHidden = () => {
    setHidden(!hidden);
  };

  // #region navigate
  const navigateToHome = () => {
    navigate('/');
    dispatch(unhiddenRightBar());
    changeHeight();
  };
  const navigateToDashboard = () => {
    navigate('/dashboard');
    dispatch(hideRightBar());
    changeHeight();
  };
  const navigateToNews = () => {
    navigate('/news');
    dispatch(unhiddenRightBar());
    changeHeight();
  };
  const navigateToAddingPatient = () => {
    changeHidden();
    navigate('/newpatient');
    dispatch(unhiddenRightBar());
    changeHeight();
  };
  const navigateToAddingRecipe = () => {
    changeHidden();
    navigate('/newrecipe');
    dispatch(unhiddenRightBar());
    changeHeight();
  };
  const navigateToAddingFoodSchedule = () => {
    changeHidden();
    navigate('/newfoodschedule');
    dispatch(hideRightBar());
    changeHeight();
  };
  const navigateToAddingDiet = () => {
    changeHidden();
    navigate('/newdiet');
    dispatch(unhiddenRightBar());
    changeHeight();
  };
  const navigateToAchievements = () => {
    navigate('/achievements');
    dispatch(hideRightBar());
    changeHeight();
  };
  const navigateToSettings = () => {
    navigate('/settings');
    dispatch(unhiddenRightBar());
    changeHeight();
  };
  // #endregion
  return (
    <Box 
    bgcolor={theme.palette.secondary.main}
    flex={0.9}
    padding={2}
    sx={{display:{xs:"none", sm: "block"}}}>
      <Box position="fixed">
        <List component="nav" aria-label="main mailbox folders">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Početna strana" onClick={navigateToHome}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Moji pacijenti" onClick={navigateToDashboard}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <NewspaperIcon />
            </ListItemIcon>
            <ListItemText primary="Recepti" onClick={navigateToNews}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Dodaj" onClick={changeHidden}/>
          </ListItemButton>
          <>{hidden && <List style={{
                              left: "15px"
                            }}>
              <Divider style={{
                              width: "200px"
                            }} />
              <ListItemButton>
                <ListItemIcon>
                  <PersonAddAltOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Novog pacijenta" onClick={navigateToAddingPatient}/>
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <MenuBookOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Novi recept" onClick={navigateToAddingRecipe}/>
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <EventNoteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Respored ishrane" onClick={navigateToAddingFoodSchedule}/>
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <MedicationLiquidOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Novu dijetu" onClick={navigateToAddingDiet}/>
              </ListItemButton>
              <Divider style={{
                              width: "200px"
                            }} />
              </List>}</>
          <ListItemButton>
            <ListItemIcon>
              <EmojiEventsIcon />
            </ListItemIcon>
            <ListItemText primary="Postignuća" onClick={navigateToAchievements}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Podešavanja" onClick={navigateToSettings}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <Switch onChange={e=>setMode(mode==="light" ? "dark" : "light")}/>
          </ListItemButton>
        </List>
        <Divider />
        <List component="nav" aria-label="secondary mailbox folder">
          <ListItemButton>
            <ListItemText primary="Trash" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Spam" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  )
}
export default Sidebar;