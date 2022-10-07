import './EntryPage.css';
import { useState, useEffect } from 'react';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register, login, reset, loading } from "./auth/authSlice";
import { uploadImage } from "./auth/authService";
import { Navigate, useNavigate } from 'react-router-dom';
import { isFulfilled } from '@reduxjs/toolkit';
import { CircularProgress } from '@mui/material';
import { Avatar, Box } from '@mui/material';

const EntryPage = () => {
  const [pov, setPov] = useState({currentView: "singUp"});

  //#region Register
  //const [selectedFile, setSelectedFile] = useState('');
  const [previewSource, setPreviewSource] = useState();
  const [formData, setFormData] = useState({
    Ime: '',
    Prezime: '',
    Email: '',
    Lozinka: '',
    Lozinka2: '',
    Datum_rodjenja: '1997-04-16',
    Uloga: 'Korisnik',
    Telefon: '062',
    Slika: '',
    Dodatne_info_Id: null,
    Adresa: 'adresa',
    Pol: 'M',
    Cloudinary_public_id: null
  });
  const { Ime, Prezime, Email, Lozinka, Lozinka2, Slika, Cloudinary_public_id } = formData;
  
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

  useEffect(()=>{
    if(formData.Cloudinary_public_id!==null)
    {
      if(Lozinka !== Lozinka2){
        toast.error('Passwords do no match')
      } else dispatch(register(formData));
    }
  }, [formData.Cloudinary_public_id]) //dodaj navigate
  
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
      if(!previewSource) {toast.error('Niste uneli svoju profilnu sliku'); return;}
      uploadImageFunction(previewSource);
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

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //convert image to URL
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    }    
  }

  const uploadImageFunction = async(base64EncodedImage) => {
    const body = JSON.stringify({
      data: base64EncodedImage
    });
    const jsonObj = JSON.parse(body);
    dispatch(loading());
    uploadImage(jsonObj)
      .then(result=>{
          setFormData({ ...formData, Cloudinary_public_id: result.public_id, Slika: result.secure_url});
      })
      .catch(e=>console.log(e));
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
            <h2>Dodaj nalog!</h2>
            <fieldset>
              <legend>Kreitanje naloga</legend>
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
              </ul>{previewSource && (<Box
                                  component="img"
                                  sx={{
                                    height: "50%",
                                    width: "50%",
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                    ml: "50%"
                                  }}
                                  src={previewSource}
                                />)}
              <input type="file" name="image" onChange={handleFileInputChange}/>              
            </fieldset>
            {isLoading? <Box sx={{ ml:"50%" }}><CircularProgress /></Box> : <button type="submit">Sačuvaj</button>}
            
            <button type="button" onClick={ () => changeView("logIn")}>Već imam nalog?</button>
          </form>
        ) //break
    }
    else if(pov.currentView==="logIn"){
      return(<form onSubmit={onSubmit} name="loginForm">
        <h2>Dobrošli nazad!</h2>
        <fieldset>
          <legend>Uloguj se!</legend>
          <ul>
            <li>
              <label htmlFor="email">E-mail:</label>
              <input type="email" id="Email" name="Email" value={Email} placeholder="Unesite vas email" onChange={onChange} required/>
            </li>
            <li>
              <label htmlFor="password">Šifra:</label>
              <input type="password" id="Lozinka" name="Lozinka" value={Lozinka} placeholder="Unesite vasu lozinku" onChange={onChange} required/>
            </li>
            <li>
              <i/>
              <a onClick={ () => changeView("PWReset")}>Forgot Password?</a>
            </li>
          </ul>
        </fieldset>
        <button type="submit">Uloguj me</button>
        <button type="button" onClick={ () => changeView("signUp")}>Kreiraj novi nalog</button>
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