import React from 'react'
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import GroupIcon from '@mui/icons-material/Group';
import { theme } from "../theme";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideRightBar, unhiddenRightBar } from './../redux/rightbar/actions';
import './Rightbar.css'

const Sidebar = ({setMode, mode}) => {
  const { user } = useSelector((state) => state.auth);

  let dispatch = useDispatch();

  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();


  const changeHidden = () => {
    setHidden(!hidden);
  };

  
  const closeRightbar = () => {
    setTimeout(function(){
      dispatch(hideRightBar());
    }, 1200);
    var element = document.getElementById('swingRight');
    if (element && element.classList.contains('slide-in-right')) {
      element.classList.remove('slide-in-right');      
      element.classList.add('slide-out-right');
    }
  }

  // #region navigate
  const navigateToHome = () => {
    navigate('/');
    dispatch(unhiddenRightBar());
  };
  const navigateToMyClients = () => {
    navigate('/myclients');
    closeRightbar();
  };
  const navigateToNews = () => {
    navigate('/news');
    dispatch(unhiddenRightBar());
  };
  const navigateToAddingPatient = () => {
    changeHidden();
    navigate('/newpatient');
    dispatch(unhiddenRightBar());
  };
  const navigateToAddingRecipe = () => {
    changeHidden();
    navigate('/newrecipe');
    closeRightbar();
  };
  const navigateToAddingFoodSchedule = () => {
    changeHidden();
    navigate('/newfoodschedule');
    closeRightbar();
  };
  const navigateToAddingDiet = () => {
    changeHidden();
    navigate('/newdiet');
    dispatch(unhiddenRightBar());
  };
  const navigateToMyFoodSchedule = () => {
    navigate('/myfoodschedule');
    closeRightbar();
  }
  const navigateToAchievements = () => {
    navigate('/achievements');
    closeRightbar();
  };
  const navigateToSettings = () => {
    navigate('/settings');
    closeRightbar();
  };
  const navigateToMyProfile = () => {
    navigate('/profile');
    closeRightbar();
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
          {user[0].Uloga === 'Nutricionista' && <ListItemButton>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Moji klijenti" onClick={navigateToMyClients}/>
          </ListItemButton>}
          <ListItemButton>
            <ListItemIcon>
              <NewspaperIcon />
            </ListItemIcon>
            <ListItemText primary="Recepti" onClick={navigateToNews}/>
          </ListItemButton>
          {(user[0].Uloga === 'Nutricionista' || user[0].Uloga === 'Admin') && <ListItemButton>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Dodaj" onClick={changeHidden}/>
          </ListItemButton>}
          <>{hidden && <List style={{
                              left: "15px"
                            }}>
              <Divider style={{
                              width: "200px"
                            }} />
              {user[0].Uloga === 'Nutricionista' && <ListItemButton>
                <ListItemIcon>
                  <PersonAddAltOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Novog klijenta" onClick={navigateToAddingPatient}/>
              </ListItemButton>}
              {user[0].Uloga === 'Nutricionista' && <ListItemButton>
                <ListItemIcon>
                  <MenuBookOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Novi recept" onClick={navigateToAddingRecipe}/>
              </ListItemButton>}
              {user[0].Uloga === 'Nutricionista' && <ListItemButton>
                <ListItemIcon>
                  <EventNoteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Respored ishrane" onClick={navigateToAddingFoodSchedule}/>
              </ListItemButton>}
              {user[0].Uloga === 'Admin' && <ListItemButton>
                <ListItemIcon>
                  <MedicationLiquidOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Novu dijetu" onClick={navigateToAddingDiet}/>
              </ListItemButton>}
              <Divider style={{
                              width: "200px"
                            }} />
              </List>}</>
            {user[0].Uloga === 'Korisnik' && <ListItemButton>
            <ListItemIcon>
              <EventNoteOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Moj nedeljni jelovnik" onClick={navigateToMyFoodSchedule}/>
          </ListItemButton>}
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Podešavanja" onClick={navigateToMyProfile}/>
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
/**
          <ListItemButton>
            <ListItemIcon>
              <EmojiEventsIcon />
            </ListItemIcon>
            <ListItemText primary="Postignuća" onClick={navigateToAchievements}/>
          </ListItemButton> */