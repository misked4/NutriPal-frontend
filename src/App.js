import Sidebar from "./components/Sidebar";
import { Feed } from "./components/Feed";
import { Rightbar } from "./components/Rightbar";
import Navbar from "./components/Navbar";
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { Stack } from "@mui/system";
import { useState } from 'react';
import { createTheme } from "@mui/material";
import { BrowserRouter } from 'react-router-dom';
import Views from "./router/index";
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import ProtectedRoutes from "./pages/Entry/ProtectedRoutes";
import EntryPage from './pages/Entry/EntryPage';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { News } from './pages/News';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { Navigate } from 'react-router-dom';
import { Carte } from './pages/Food/Carte';

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

  
  return (
    <BrowserRouter>
      <Routes>
        <Route element = {<ProtectedRoutes/>} >
            <Route path={"/"} element={
                      <ThemeProvider theme={theme}>
                        <Box sx={{backgroundColor:theme.palette.tan.main}}>
                          <Navbar/>
                          <Stack direction="row" spacing={2} justifyContent="space-between" height={600}>
                            <Sidebar setMode={setMode} mode={mode}/>
                            <Outlet/>
                            <Rightbar/>
                          </Stack>
                        </Box>
                      </ThemeProvider>
            }>
              <Route index element={<Home />} />
              <Route path={"/home"} element={<Home />} />
              <Route path={"/dashboard"} element={<Dashboard/>}/>
              <Route path={"/news"} element={<News/>}/>
              <Route path={"/achievements"} element={<Achievements/>}/>
              <Route path={"/settings"} element={<Settings/>} />
              <Route path={"/createcarte"} element={<Carte/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
