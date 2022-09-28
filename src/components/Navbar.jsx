import React, { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, Badge, InputBase, Typography, styled, Avatar, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Post from '../pages/Recipe/Post';
//---ovo je za pribavljanje informacija iz state

import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { returnUnseenLikes, getRecipe, setSeenAllNotifications } from '../pages/Recipe/APIcomms';
 
const Navbar = () => {
  const [openProfileInfo, setOpenProfileInfo] = useState(false);
  const [openNotificationsInfo, setOpenNotificationsInfo] = useState(false);
  const [currentOpenedRecipe, setCurrentOpenedRecipe] = useState({});
  const [unseen, setUnseen] = useState(true);
  //notifications is get by returnUnseenLikedRecipesQuery.sql file, so he defined what field we have in json
  const [notifications, setNotifications] = useState([]); 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    console.log("LOGOUT");
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    window.location.reload(false);
  }

  const [openNotifications, setOpenNotifications] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = (receptId) => {
      getRecipe(receptId)
        .then(data=>{
            setCurrentOpenedRecipe(data[0]);
            setOpenNotifications(true);
            console.log(data[0]);
        })
        .catch(e=>{
            console.log(e);
        });
      setSeenAllNotifications(user[0].id)
        .then(data=>{
            setUnseen(false);
            console.log("unseen=false");
        })
        .catch(e=>{
            console.log(e);
        });
  };

  const handleClose = () => {
    setOpenNotifications(false);
  };

  useEffect(()=>{
    returnUnseenLikes(user[0].id)
      .then(data=>{
          setNotifications(data);
          console.log(data);
      })
      .catch(e=>{
          console.log(e)
      });
  },[]);

  const menuItemNotification = notifications.length === 0 ?
    <StyledToolbar>
      <HeartBrokenIcon/>
        <MenuItem>Nemate notifikacija</MenuItem>
    </StyledToolbar>
    : notifications.map((notification, i) => {
    return <StyledToolbar key={notification.lajkReceptId}>
              <FavoriteIcon/>
                <MenuItem key={notification.lajkReceptId} onClick={()=>handleClickOpen(notification.receptId)}>
                  <Typography sx={{fontStyle: 'italic',fontWeight: 'bold'}}>{notification.Ime} {notification.Prezime} </Typography>
                  {" Vam je lajkovao recept sa nazivom "}
                  <Typography sx={{fontStyle: 'italic',fontWeight: 'bold'}}> {notification.Naslov}.</Typography>
                </MenuItem>
            </StyledToolbar>
  })

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h5" sx={{display:{xs:"none",sm:"block"}}}>
          BuddyNut
        </Typography>
        <FastfoodIcon sx={{display:{xs:"block",sm:"block"}}}/>
        <Search>
          <InputBase placeholder="search..."></InputBase>
        </Search>
        <Icons>
          <Badge badgeContent={4} color="error" max={999}>
            <EmailIcon/>
          </Badge>
          <Badge badgeContent={unseen && notifications.length} color="error" onClick={e=>setOpenNotificationsInfo(true)} max={999}>
            <NotificationsIcon color="blue"/>
          </Badge>
          <Avatar onClick={e=>setOpenProfileInfo(true)} sx={{width:30, height:30}} src="https://www.google.com/search?q=zena&sxsrf=ALiCzsbTBgTXeDg0H1-DjnIM_CQem4ed8Q:1662043903514&source=lnms&tbm=isch&sa=X&ved=2ahUKEwik9-CD7PP5AhV5RvEDHTLlAdUQ_AUoAXoECAEQAw&biw=1536&bih=754&dpr=1.25#imgrc=FpW_Df_YQhkVWM"/>
          <Typography variant="span">{user[0].Ime} {user[0].Prezime}</Typography>
        </Icons>
        <UserBoxForMobile>
          <Avatar onClick={e=>setOpenProfileInfo(true)} sx={{width:30, height:30}} src="https://www.google.com/search?q=zena&sxsrf=ALiCzsbTBgTXeDg0H1-DjnIM_CQem4ed8Q:1662043903514&source=lnms&tbm=isch&sa=X&ved=2ahUKEwik9-CD7PP5AhV5RvEDHTLlAdUQ_AUoAXoECAEQAw&biw=1536&bih=754&dpr=1.25#imgrc=FpW_Df_YQhkVWM"/>
          <Typography variant="span">{user[0].Ime}</Typography>
        </UserBoxForMobile>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={openProfileInfo} //default is depending on state
        onClose={(e)=>setOpenProfileInfo(false)} //when you click somewhere else it closing itselfs
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
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={openNotificationsInfo} //default is depending on state
        onClose={(e)=>setOpenNotificationsInfo(false)} //when you click somewhere else it closing itselfs
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItemNotification}
      </Menu>
        {currentOpenedRecipe && <Dialog
          fullScreen={fullScreen}
          open={openNotifications}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {currentOpenedRecipe.Ime+" "+currentOpenedRecipe.Prezime+" Vam je lajkovao sledecu objavu"}
          </DialogTitle>
          <DialogContent>
            <Post post={currentOpenedRecipe}></Post>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Procitao sam
            </Button>
          </DialogActions>
        </Dialog>}
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