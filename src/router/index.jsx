import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './../pages/Home';
import ProtectedRoutes from './../pages/Entry/ProtectedRoutes';
import { Dashboard } from './../pages/Dashboard';
import { News } from './../pages/News';
import { Achievements } from './../pages/Achievements';
import { Settings } from './../pages/Settings';
const Router = () => {
    return(
    <Routes>
        <Route path={"/home"} element={<Home />} />
        <Route path={"/dashboard"} element={<Dashboard/>}/>
        <Route path={"/news"} element={<News/>}/>
        <Route path={"/achievements"} element={<Achievements/>}/>
        <Route path={"/settings"} element={<Settings/>} />
    </Routes>
    );
}

export default Router;