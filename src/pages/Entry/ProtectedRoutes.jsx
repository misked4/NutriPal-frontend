import { Outlet } from "react-router-dom";
import EntryPage from './EntryPage';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


const ProtectedRoutes = () => {
    const {user, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.auth);
    const isAuth = (user != null || isSuccess);
    useEffect(()=>{
        if(isSuccess || user){ //or user who are already logged in
          //console.log("SUCCESS!! :)");
        }
      }, [user, isSuccess]) //dodaj navigate
    return isAuth ? <Outlet/> : <EntryPage/>
};

export default ProtectedRoutes;