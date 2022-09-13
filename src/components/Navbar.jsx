import React from 'react'
import { AppBar, Box, Toolbar, Badge, InputBase, Typography, styled, Avatar, Menu, MenuItem } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
//---ovo je za pribavljanje informacija iz state
import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false); //default je closed
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    console.log("LOGOUT");
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  }
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h5" sx={{display:{xs:"none",sm:"block"}}}>
          Nutripal
        </Typography>
        <FastfoodIcon sx={{display:{xs:"block",sm:"block"}}}/>
        <Search>
          <InputBase placeholder="search..."></InputBase></Search>
        <Icons>
          <Badge badgeContent={4} color="error" max={999}>
            <EmailIcon/>
          </Badge>
          <Badge badgeContent={4} color="error" max={999}>
            <NotificationsIcon color="blue"/>
          </Badge>
          <Avatar onClick={e=>setOpen(true)} sx={{width:30, height:30}} src="https://www.google.com/search?q=zena&sxsrf=ALiCzsbTBgTXeDg0H1-DjnIM_CQem4ed8Q:1662043903514&source=lnms&tbm=isch&sa=X&ved=2ahUKEwik9-CD7PP5AhV5RvEDHTLlAdUQ_AUoAXoECAEQAw&biw=1536&bih=754&dpr=1.25#imgrc=FpW_Df_YQhkVWM"/>
          <Typography variant="span">{user[0].Ime} {user[0].Prezime}</Typography>
        </Icons>
        <UserBoxForMobile>
          <Avatar onClick={e=>setOpen(true)} sx={{width:30, height:30}} src="https://www.google.com/search?q=zena&sxsrf=ALiCzsbTBgTXeDg0H1-DjnIM_CQem4ed8Q:1662043903514&source=lnms&tbm=isch&sa=X&ved=2ahUKEwik9-CD7PP5AhV5RvEDHTLlAdUQ_AUoAXoECAEQAw&biw=1536&bih=754&dpr=1.25#imgrc=FpW_Df_YQhkVWM"/>
          <Typography variant="span">{user[0].Ime}</Typography>
        </UserBoxForMobile>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open} //default is depending on state
        onClose={(e)=>setOpen(false)} //when you click somewhere else it closing itselfs
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <StyledToolbar><AccountCircleIcon /><MenuItem>Moj profil</MenuItem></StyledToolbar>
        <StyledToolbar><SendOutlinedIcon/><MenuItem>Moje objave</MenuItem></StyledToolbar>
        <StyledToolbar><AssignmentIcon/><MenuItem>Info o licenci</MenuItem></StyledToolbar>
        <StyledToolbar><LogoutIcon/><MenuItem onClick={onLogout}>Odjavi se</MenuItem></StyledToolbar>
      </Menu>
    </AppBar>
  );
};


const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent:"space-between"
});

const Search = styled("div")(({theme}) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "40%"
}));

const Icons = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  display: "none",
  alignItems:"center",
  gap: "20px",
  [theme.breakpoints.up('sm')]: {
    display: "flex"
  } //ovim smo rekli da ako je veci od 600px(od sm-small),onda ce da se prikazuje,a ako ne onda je "None"
}));

const UserBoxForMobile = styled(Box)(({theme}) => ({
  display: "flex",
  alignItems:"center",
  gap: "10px",
  [theme.breakpoints.up('sm')]: {
    display: "none"
  }
}));

export default Navbar;
//position=stic, iako skrolujemo ostaje na poziciji

/**<Autocomplete
  disablePortal
  id="combo-box-demo"
  options={top100Films} //lista
  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Movie" />}
/> */