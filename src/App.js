import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Outlet } from 'react-router-dom';

import Sidebar from "./components/Sidebar";
import { Rightbar } from "./components/Rightbar";
import Navbar from "./components/Navbar";
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { Stack } from "@mui/system";
import { createTheme } from "@mui/material";
import ProtectedRoutes from "./pages/Entry/ProtectedRoutes";
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { News } from './pages/News';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { NewPatient } from './pages/Client/NewPatient';
import { NewFoodSchedule } from './pages/Food_schedule/NewFoodSchedule';
import { NewDiet } from './pages/Diet/NewDiet';
import { NewRecipe } from './pages/Recipe/NewRecipe';
import './App.css'

function App() {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
        mode: mode,
        primary:{
            main: "#3C3431",
        },
        secondary:{
            main: "#E1C391",
        },
        tan: {
            main: "#705446",
        },
        beige: {
            main: "#E1C391",
        },
        cream:{
            main: "#FDF4E3",
        },
        ebony:{
            main: "#3C3431",
        },
        otherColor:{
            main: "#FDF4E3"
        } //#705446
      }
    });

  const { rightbarState } = useSelector(state => state.rightbar);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element = {<ProtectedRoutes/>} >
            <Route path={"/"} element={
                      <ThemeProvider theme={theme}>
                        <Box sx={{backgroundColor:theme.palette.tan.main}} >
                          <Navbar/>
                          <Stack className="myDiv" direction="row" spacing={2} justifyContent="space-between">
                            <Sidebar setMode={setMode} mode={mode}/>
                            <Outlet/>
                            {rightbarState && <Rightbar/>}
                          </Stack>
                        </Box>
                      </ThemeProvider>
            }>
              <Route index element={<Home />} />
              <Route path={"/home"} element={<Home />} />
              <Route path={"/dashboard"} element={<Dashboard/>}/>
              <Route path={"/news"} element={<News/>}/>

              <Route path={"/newpatient"} element={<NewPatient/>}/>
              <Route path={"/newrecipe"} element={<NewRecipe/>}/>
              <Route path={"/newfoodschedule"} element={<NewFoodSchedule/>}/>
              <Route path={"/newdiet"} element={<NewDiet/>}/>

              <Route path={"/achievements"} element={<Achievements/>}/>
              <Route path={"/settings"} element={<Settings/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
