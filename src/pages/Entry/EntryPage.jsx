import './EntryPage.css';
import { useState, useEffect } from 'react';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register, login, reset } from "../../features/auth/authSlice";
import { Navigate, useNavigate } from 'react-router-dom';
import { isFulfilled } from '@reduxjs/toolkit';
import Spinner from '../../components/Spinner';

const EntryPage = () => {
  const [pov, setPov] = useState({currentView: "singUp"});

  //#region Register
  const [formData, setFormData] = useState({
    Ime: '',
    Prezime: '',
    Email: '',
    Lozinka: '',
    Lozinka2: ''
  });
  const { Ime, Prezime, Email, Lozinka, Lozinka2 } = formData;
  
  //const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.auth)

  useEffect(()=>{
    if(isError){
      toast.error(message);
    }
    if(isSuccess || user){ //or user who are already logged in
      //navigate('/');
      console.log("SUCCESS!! :)");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]) //dodaj navigate
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value,
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()
    if(pov.currentView==="singUp")
    {
      if(Lozinka !== Lozinka2){
        toast.error('Passwords do no match')
      } else {
        const userData = {
          Ime, Prezime, Email, Lozinka
        };
        dispatch(register(userData));
      }
    }
    if(pov.currentView==="logIn")
    {
      const email = Email;
      const password = Lozinka;
      const userData = {
        email, password
      };
      dispatch(login(userData));
    }
  }

  //#endregion

  

  const changeView = (view) => {
    setPov({
      currentView: view
    })
  };

  const currentView = () => {
    if(pov.currentView==="singUp")
    {
        return (
          <form onSubmit={onSubmit} name="registerForm">
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="name">Ime:</label>
                  <input type="text" id="Ime" name="Ime" value={Ime} placeholder="Unesite ime" onChange={onChange} required/>
                </li><li>
                  <label htmlFor="lasname">Lasname:</label>
                  <input type="text" id="Prezime" name="Prezime" value={Prezime} placeholder="Unesite prezime" onChange={onChange} required/>
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="Email" name="Email" value={Email} placeholder="Unesite svoj Email" onChange={onChange} required/>
                </li>
                <li>
                  <label htmlFor="password">Lozinka:</label>
                  <input type="password" id="Lozinka" name="Lozinka" value={Lozinka} placeholder="Unesite svoju lozinku" onChange={onChange} required/>
                </li>
                <li>
                  <label htmlFor="password">Potvrdite lozinku:</label>
                  <input type="password" id="Lozinka2" name="Lozinka2" value={Lozinka2} placeholder="Potvrdite lozinku:" onChange={onChange} required/>
                </li>
              </ul>
            </fieldset>
            <button type="submit">Submit</button>
            <button type="button" onClick={ () => changeView("logIn")}>Have an Account?</button>
          </form>
        ) //break
    }
    else if(pov.currentView==="logIn"){
      return(<form onSubmit={onSubmit} name="loginForm">
        <h2>Welcome Back!</h2>
        <fieldset>
          <legend>Log In</legend>
          <ul>
            <li>
              <label htmlFor="email">Email:</label>
              <input type="email" id="Email" name="Email" value={Email} placeholder="Unesite vas email" onChange={onChange} required/>
            </li>
            <li>
              <label htmlFor="password">Password:</label>
              <input type="password" id="Lozinka" name="Lozinka" value={Lozinka} placeholder="Unesite vasu lozinku" onChange={onChange} required/>
            </li>
            <li>
              <i/>
              <a onClick={ () => changeView("PWReset")}>Forgot Password?</a>
            </li>
          </ul>
        </fieldset>
        <button type="submit">Login</button>
        <button type="button" onClick={ () => changeView("signUp")}>Create an Account</button>
      </form>)
    }
    else if(pov.currentView==="PWReset"){
      return (
        <form>
        <h2>Reset Password</h2>
        <fieldset>
          <legend>Password Reset</legend>
          <ul>
            <li>
              <em>A reset link will be sent to your inbox!</em>
            </li>
            <li>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" required/>
            </li>
          </ul>
        </fieldset>
        <button>Send Reset Link</button>
        <button type="button" onClick={ () => changeView("logIn")}>Go Back</button>
      </form>
      )
    }
  };
  return (
    <section id="entry-page">
      {currentView()}
    </section>
  )
};
export default EntryPage;
//ReactDOM.render(<EntryPage/>, document.getElementById("App"))