import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import './Profile.css'
import { PestControl } from '@mui/icons-material';
import { useRef } from 'react';
import { getAllDiets, uloadPhotoIfWeAlreadyDontHave, updateUserAndHisAdditionalInfo } from './APIcalls';
import { NewFoodSchedule } from '../Food_schedule/NewFoodSchedule';
import { changeHeightToPercentage } from '../../Common';

export const Profile = ({ person }) => {
    var dateFromSql = '';
    const { user } = useSelector((state) => state.auth);
    const [ userInterface, setUserInterface ] = useState({});
    const { Ime, Prezime, Email, Lozinka, Datum_rodjenja, Uloga, Telefon, Adresa, Slika, Pol, Cloudinary_public_id, Dodatne_info_Id, Visina, Tezina, Cilj_ishrane, DijetaId, PotrosnjaKalorija } = userInterface;
    const [wrongPassword, setWrongPassword] = useState(false);
    const [password1, setPassword1] = useState(null);
    const [diets, setDiets] = useState([]);
    const [disableEditing, setDisableEditing] = useState(true);
    const [previewSource, setPreviewSource] = useState();
    const [page1, setPage1] = useState(true);
    const [firstImage, setFirstImage] = useState();
    const [imageCame, setImageCame] = useState(false);

    useEffect(()=>{
        if(person)
        {
            setUserInterface(person);           
            setPreviewSource(person.Slika);
            setFirstImage(person.Slika);
        }
        else 
        {
            setUserInterface(user[0]);
            setPreviewSource(user[0].Slika);
            setFirstImage(user[0].Slika);
        }
        changeHeightToPercentage();
        getAllDiets()
            .then((resp) =>  {
                setDiets(resp);
            })
            .catch((error) => console.log(error));
        
    },[]);

    useEffect(()=>{
        if(imageCame===true)
        {
            updateUserAndHisAdditionalInfo(userInterface);
        }        
    },[imageCame]);

    const handleChange = (prop) => (event) => {
        if(prop === 'password1'){
            setPassword1(event.target.value);
            if(event.target.value === userInterface.Lozinka){                
                setWrongPassword(false);
            }
            else setWrongPassword(true);
        }
        if(prop === 'password2'){
            setUserInterface({ ...userInterface , Lozinka: event.target.value });
        }
        else setUserInterface({ ...userInterface , [prop]: event.target.value });
    };

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
        uloadPhotoIfWeAlreadyDontHave(jsonObj)
          .then((resp) => {
            setUserInterface({ ...userInterface, Cloudinary_public_id: resp.data.public_id, Slika: resp.data.secure_url});
            setImageCame(true);
        })
          .catch((error) => console.log(error));
          //console.log(basicInfo);
      }

    const enableOrDisableEditing = () => {
        setDisableEditing(!disableEditing);
    }

    const saveAll = () => {
        if(firstImage !== previewSource)
        {
            uploadImageFunction();
        }
        setImageCame(true);
        setDisableEditing(true);
    }

    return (
    <Box flex={4} p={2}>
        {page1?
        <div>
        {userInterface && <div className="middle-content">
            <div className="profile-settings">
                <div className="user-main-info">
                    <div className="image-container">
                        <img src={previewSource} className="profile-picture"/>                        
                        <div className="img-change-overlay">
                            <input title="Izaberite svoju profilnu sliku" type="file" name="image" onChange={handleFileInputChange} className="profile-picture img-change-overlay" disabled={disableEditing}/>
                            <span className="overlay-txt"><i className="fa-sharp fa-solid fa-pen"></i></span>
                        </div>
                    </div>
                    <div className="main-info">
                        <span className="user-Name">{Ime} {Prezime}</span>
                        <span className="is-Admin">{Uloga}</span>
                    </div>
                    <button className="btn-change-lg" onClick={enableOrDisableEditing}>Izmeni</button>
                    {Uloga==="Korisnik" && user[0].Uloga==="Nutricionista" && <button className="btn-change-lg" onClick={() => setPage1(false)}>Nedeljni plan ishrane</button>}
                </div>
                <div className="form-container">
                    <div className="title">Osnovne informacije</div>
                    <div className="form-text"><span className="info"><i className="fa-solid fa-circle-info"></i>&nbsp; Za izmenu podataka, klikni na dugme 'Izmeni'</span></div>
                <form>
                    <div className="user-details">
                        <div className="input-box">
                            <span className="details">Ime</span>
                            <input name="Ime" id="Ime" placeholder="Ime" defaultValue={Ime} onChange={handleChange('Ime')} required className="inputDisabled" disabled={disableEditing}/>
                        </div>
                        <div className="input-box">
                            <span className="details">Prezime</span>
                            <input type="text" name="Prezime" id="Prezime" placeholder="Prezime" value={Prezime} onChange={handleChange('Prezime')} required className="inputDisabled" disabled={disableEditing}/>
                        </div>
                        <div className="input-box">
                            <span className="details">Datum rođenja</span>
                            <input type="text" name="Datum_rodjenja" id="Datum_rodjenja" required value={sqlToJsDate(Datum_rodjenja)} onChange={handleChange('Datum_rodjenja')} disabled className="inputDisabled"/>
                        </div>
                        <div className="input-box">
                            <span className="details">Email</span>
                            <input type="text" name="Email" id="Email" placeholder="Email" value={Email} onChange={handleChange('Email')} disabled required className="inputDisabled"/>
                        </div>
                        <div className="input-box">
                            <span className="details">Broj telefona</span>
                            <input type="text" name="Telefon" id="Telefon" placeholder="Broj telefona" value={Telefon} onChange={handleChange('Telefon')}  className="inputDisabled" disabled={disableEditing}/>
                        </div>
                        <div className="input-box">
                            <span className="details">Adresa</span>
                            <input type="text" name="Adresa" id="Adresa" placeholder="Adresa" value={Adresa} onChange={handleChange('Adresa')} className="inputDisabled" disabled={disableEditing}/>
                        </div></div>
                        <div className="title">Izmeni lozinku</div>
                        <div className="user-details password-change">
                            <div className="input-box">
                                {wrongPassword? <span className="details" color="red">Uneli ste pogresan password</span> : <span className="details">Trenutna lozinka</span>}
                                <input type="password" name="password1" id="password1" placeholder="Unesi trenutnu lozinku" onChange={handleChange('password1')} disabled={disableEditing}/>
                            </div>
                            <div className="input-box">
                                <span className="details">Nova lozinka</span>
                                <input type="password" name="password2" id="password2" placeholder="Unesi novu lozinku" onChange={handleChange('password2')} disabled={wrongPassword || password1===null? true : false}/>
                            </div>
                        </div>
                        <div className="gender-details">
                            <input type="radio" name="gender" id="dot-1" disabled checked={Pol=='M'? true : false} className="radioInputName"/>
                            <input type="radio" name="gender" id="dot-2" disabled checked={Pol=='F'? true : false} className="radioInputName"/>
                            <span className="gender-title">Pol</span>
                            <div className="category">
                                <label htmlFor="dot-1">
                                <span className="dot one"></span>
                                <span className="gender">Muški</span>
                            </label>
                            <label htmlFor="dot-2">
                                <span className="dot two"></span>
                                <span className="gender">Ženski</span>
                            </label>
                            </div>
                        </div>
                        {Uloga==="Korisnik" && <div> <div className="title additional">Dodatne informacije</div>
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">Visina</span>
                                <input type="number" name="Visina" id="Visina" placeholder="Visina" onChange={handleChange('Visina')} value={Visina} disabled={disableEditing}/>
                            </div>
                            <div className="input-box">
                                <span className="details">Težina</span>
                                <input type="number" name="Tezina" id="Težina" placeholder="Težina" onChange={handleChange('Tezina')} value={Tezina} disabled={disableEditing}/>
                            </div>
                            <div className="input-box">
                                <span className="details">Broj kalorija koje korisnik trosi na dan</span>
                                <input type="number" name="PotrosnjaKalorija" id="PotrosnjaKalorija" placeholder="Potrosnja Kalorija" onChange={handleChange('PotrosnjaKalorija')} value={PotrosnjaKalorija} disabled={disableEditing}/>
                            </div>
                            <div className="input-box">
                                <span className="details">Moj cilj je</span>
                                <select onChange={handleChange('Cilj_ishrane')} className="inputDisabled" disabled={disableEditing || user[0].Uloga!=="Nutricionista"}>
                                    <option key='1' selected={Cilj_ishrane==="Smanjenje telesne mase"? true: false}>Smanjenje telesne mase</option>
                                    <option key='2' selected={Cilj_ishrane==="Zadržavanje telesne mase"? true: false}>Zadržavanje telesne mase</option>
                                    <option key='3' selected={Cilj_ishrane==="Povecanje telesne mase"? true: false}>Povecanje telesne mase</option>
                                </select>
                            </div>
                            <div className="input-box">
                                <span className="details">Dijeta</span>
                                <select onChange={handleChange('DijetaId')} className="inputDisabled" disabled={disableEditing || user[0].Uloga!=="Nutricionista"}>
                                    {diets && diets.map((diet) => (
                                        <option key={diet.id} value={diet.id} selected={diet.id===DijetaId? true : false}>{diet.Naziv}</option>
                                    ))}
                                </select>
                            </div>
                        </div> </div>}
                        {Uloga==="Admin" && <div> <div className="title additional">Admin only</div>
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">Tip korisnika</span>
                                <select onChange={handleChange('Uloga')} className="inputDisabled" disabled={disableEditing}>
                                    <option key='1' selected={Uloga==="Korisnik"? true : false} value="Korisnik">Korisnik</option>
                                    <option key='2' selected={Uloga==="Nutricionista"? true : false} value="Nutricionista">Nutricionista</option>
                                    <option key='3' selected={Uloga==="Admin"? true : false} value="Admin">Admin</option>
                                </select>
                            </div>
                        </div> </div>}
                   
                </form>
                {!disableEditing && <div className="update-button">
                        <button className="btn-change-lg" onClick={saveAll}>Sačuvaj promene</button>
                    </div>}
            </div>
            </div>
        </div>
        }
        </div> : <div><NewFoodSchedule personOnADietPlan={userInterface}/><button className="btn-change-lg" onClick={()=>setPage1(true)}>Vrati se na profil</button></div>
        }
    </Box>
    )
}

function sqlToJsDate(sqlDate){
    if(sqlDate){
        //sqlDate in SQL DATETIME format ("yyyy-mm-ddThh:mm:ss.msZ")
        var sqlDateArr1 = sqlDate.split("-");
        //format of sqlDateArr1[] = ['yyyy','mm','ddThh:mm:msZ']
        var sYear = sqlDateArr1[0];
        var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
        var sqlDateArr2 = sqlDateArr1[2].split("T");
        //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.msZ']
        var sDay = sqlDateArr2[0];
        var sqlDateArr3 = sqlDateArr2[1].split(":");
        //format of sqlDateArr3[] = ['hh','mm','ss.msZ']
        var sHour = sqlDateArr3[0];
        var sMinute = sqlDateArr3[1];
        var sqlDateArr4 = sqlDateArr3[2].split(".");
        //format of sqlDateArr4[] = ['ss','msZ']
        var sSecond = sqlDateArr4[0];
        var finaldate = new Date(sYear,sMonth,sDay);
        return finaldate.toGMTString().replace('GMT', '');
    }
}