import React from 'react'
import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register, login, reset, loading } from "./auth/authSlice";
import { uploadImage } from "./auth/authService";
import { CircularProgress, Box } from '@mui/material';
import DatePicker from 'react-date-picker';
import { Stack } from '@mui/system';

import './EntryPage.css';

const EntryPage = () => {
  const [pov, setPov] = useState({currentView: "signUp"});

  //#region Register
  const [previewSource, setPreviewSource] = useState();
  const [formData, setFormData] = useState({
    Ime: '',
    Prezime: '',
    Email: '',
    Lozinka: '',
    Lozinka2: '',
    Datum_rodjenja: '',
    Uloga: '',
    Telefon: '',
    Slika: '',
    Dodatne_info_Id: null,
    Adresa: '',
    Pol: 'M',
    Cloudinary_public_id: null
  });
  const { Ime, Prezime, Email, Lozinka, Lozinka2, Pol, Slika, Cloudinary_public_id } = formData;
  const [ dateFromForm, setDateFromForm ] = useState(new Date());
  
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
      } else {

        console.log(formData);

        dispatch(register(formData));
      }
    }
  }, [formData.Cloudinary_public_id]) //dodaj navigate
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value,
    }))
    console.log(formData);
  }
  const onSubmit = (e) => {
    e.preventDefault()
    if(pov.currentView==="signUp")
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
    
    console.log(formData);
    dispatch(loading());
    uploadImage(jsonObj)
      .then(result=>{
          console.log(formData);
          setFormData({ ...formData, Cloudinary_public_id: result.public_id, Slika: result.secure_url});
      })
      .catch(e=>console.log(e));
  }

  const changeDate = (newDate) => {
    const offset = newDate.getTimezoneOffset();
    const newDateWithZone = new Date(newDate.getTime() - (offset*60*1000));
    const dateString = newDateWithZone.toISOString().split('T')[0];
    setDateFromForm(newDate); //moramo da vratimo ono sto DataPicker prepoznaje, ne moze samo dateString
    setFormData({ ...formData, Datum_rodjenja: dateString});
  }
  //#endregion

  const changeView = (view) => {
    setPov({
      currentView: view
    })
  };

  const currentView = () => {
    if(pov.currentView==="signUp")
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
                <li>
                <label> Datum rodjenja:</label>
                  <DatePicker onChange={(date) => {
                                        const d = new Date(date);
                                        changeDate(d);
                                      }} value={dateFromForm} sx={{display:'flex'}}/>
                
                </li>
                <li>
                  <Stack direction='row' spacing={1} sx={{ml: 5}}>
                  <input type="radio" id="M" name="Pol" value="M" defaultChecked="true" onChange={onChange}/>
                  <label htmlFor="M">Muško</label>
                  <input type="radio" id="F" name="Pol" value="F" onChange={onChange}/>
                  <label htmlFor="F">Žensko</label>
                  </Stack>
                </li>
                <li>
                  <Stack direction='row' spacing={1} sx={{ml: 5}}>
                  <input type="radio" id="Korisnik" name="Uloga" value="Korisnik" defaultChecked="true" onChange={onChange}/>
                  <label htmlFor="M">Korisnik</label>
                  <input type="radio" id="Nutricionista" name="Uloga" value="Nutricionista" onChange={onChange}/>
                  <label htmlFor="F">Nutricionista</label>
                  </Stack>
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
              <a onClick={ () => changeView("PWReset")}>Zaboravili ste lozinku?</a>
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
        <h2>Obnovi lozinku</h2>
        <fieldset>
          <legend>Resetuj lozinku</legend>
          <ul>
            <li>
              <em>Reset link biće Vam poslat u inbox-u!</em>
            </li>
            <li>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" required/>
            </li>
          </ul>
        </fieldset>
        <button>Pošalji reset link</button>
        <button type="button" onClick={ () => changeView("logIn")}>Nazad</button>
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