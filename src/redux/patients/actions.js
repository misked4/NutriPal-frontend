import * as types from "../actionType";
import axios from "axios";

const getUsers = (users) => ({
    type: types.GET_PATIENTS,
    payload: users,
})
const addInfoDeleted = () => ({
    type: types.DELETE_PATIENT
})
const patientAdded = () => ({
    type: types.ADD_ADDITIONAL_INFO_PATIENT
})
const setTrueValidEmail = () => ({
    type: types.SET_TRUE_VALID_EMAIL
})
const setFalseValidEmail = () => ({
    type: types.SET_FALSE_VALID_EMAIL
})

export const loadPatientsAction = (creatorId) => {
    return function (dispatch) {
        axios
        .get(`${process.env.REACT_APP_API}/patients/${creatorId}`)
        .then((resp) => {
            console.log("resResponse from loadPatientsAction",resp);
            dispatch(getUsers(resp.data));
        })
        .catch((error) => console.log(error));
    }
}

export const searchPatientsAction = (creatorId, searchWord) => {
    return function (dispatch) {
        axios
        .post(`${process.env.REACT_APP_API}/patients/${creatorId}?search=${searchWord}`)
        .then((resp) => {
            console.log("resResponse from searchPatientsAction",resp);
            dispatch(getUsers(resp.data));
        })
        .catch((error) => console.log(error));
    }
}

export const deletePatientAction = (creatorId, infoId) => {
    return function (dispatch) {
        axios
        .delete(`${process.env.REACT_APP_API}/patient/${infoId}`)
        .then((resp) => {
            console.log("resResponse from deletePatientAction",resp);
            dispatch(addInfoDeleted());
            dispatch(loadPatientsAction(creatorId));
        })
        .catch((error) => console.log(error));
    }
}

export const addPatientAction = (creatorId, info) => {
    const additionalInfo = {
        Visina: info.Visina,
        Tezina: info.Tezina,
        PotrosnjaKalorija: info.PotrosnjaKalorija,
        KreatorId: info.KreatorId,
        DijetaId: info.DijetaId
    };
    const userInfo = {
        Ime: info.Ime,
        Prezime: info.Prezime,
        Email: info.Email,
        Lozinka: info.Lozinka,
        Dodatne_info_Id: info.Dodatne_info_Id
    };
    return function (dispatch) {
        axios
        .post(`${process.env.REACT_APP_API}/patient`, additionalInfo)
        .then((resp) => {
            console.log("Response from addPatientAction: ",resp);
            console.log("last added "+ resp.data[0].lastAdded);
            userInfo.Dodatne_info_Id = resp.data[0].lastAdded;
            dispatch(patientAdded());
            dispatch(registerUser(creatorId, userInfo));
        })
        .catch((error) => console.log(error));
    }
}

export const registerUser = (creatorId, userInfo) => {
    console.log("CREATOR ID "+creatorId);
    console.log("USER INFO " + userInfo.Dodatne_info_Id);
    return function (dispatch) {
        axios
        .post(`${process.env.REACT_APP_API}/user`, userInfo)
        .then((resp) => {
            console.log("resResponse from registerUser: ",resp);
            dispatch(loadPatientsAction(creatorId));
        })
        .catch((error) => console.log(error));
    }
}

export const checkEmailAction = (email) => {
    return function (dispatch) {
        axios
        .get(`${process.env.REACT_APP_API}/useremail/?email=${email}`)
        .then((resp) => {
            console.log("Response from checkEmailAction: ",resp);
            dispatch(setTrueValidEmail());
        })
        .catch((error) => 
        {
            console.log(error);
            dispatch(setFalseValidEmail());
        });
    }
}