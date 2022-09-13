import React from 'react'
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { theme } from "../theme";
import {Routes, Route, useNavigate} from 'react-router-dom';
import { Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import { Button } from '@mui/material';
const Sidebar = ({setMode, mode}) => {
  const navigate = useNavigate();

  // #region navigate
  const navigateToHome = () => {
    navigate('/');
  };
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  const navigateToNews = () => {
    navigate('/news');
  };
  const navigateToCreateCarte = () => {
    navigate('/createcarte');
  };
  const navigateToAchievements = () => {
    navigate('/achievements');
  };
  const navigateToSettings = () => {
    navigate('/settings');
  };
  // #endregion
  return (
    <Box 
    bgcolor={theme.palette.secondary.main}
    flex={0.8}
    padding={2}
    sx={{display:{xs:"none", sm: "block"}}}>
      <Box position="fixed">
        <List component="nav" aria-label="main mailbox folders">
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" onClick={navigateToDashboard}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <NewspaperIcon />
            </ListItemIcon>
            <ListItemText primary="News" onClick={navigateToNews}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <CreateNewFolderIcon />
            </ListItemIcon>
            <ListItemText primary="Dodaj jelovnik" onClick={navigateToCreateCarte}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <EmojiEventsIcon />
            </ListItemIcon>
            <ListItemText primary="Achievements" onClick={navigateToAchievements}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" onClick={navigateToSettings}/>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" onClick={navigateToHome}/>
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