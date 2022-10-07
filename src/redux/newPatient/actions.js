import * as types from "../actionType";
import axios from "axios";

const basicInfoAdded = (informations) => ({
    type: types.BASIC_INFO_ADDED,
    payload: informations
})
const additionalInfoAdded = (informations) => ({
    type: types.ADDITIONAL_INFO_ADDED,
    payload: informations
})
const changeCurrentPage = (page) => ({
    type: types.CHANGE_PAGE,
    payload: page
})
const setValidEmail = (validation) => ({
    type: types.CHECK_EMAIL,
    payload: validation
})
const getActivities = (allActivities) => ({
    type: types.GET_ACTIVITIES,
    payload: allActivities
})
const doneCreatingNewPatient = () => ({
    type: types.DONE_ADDING_NEW_PATIENT
})
const addPublicIdAndSecureUrl = (informations) => ({
    type: types.IMAGE_UPLOAD,
    payload: informations
})


export const addBasicInfo = (basicInformations) => {
    return function (dispatch) {
        console.log("BASIC INFO ADDED");
        dispatch(basicInfoAdded(basicInformations));
    }
}
export const addAdditionalInfo = (additionalInformations) => {
    return function (dispatch) {
        console.log("ADDITIONAL INFO ADDED");
        dispatch(additionalInfoAdded(additionalInformations));
    }
}

export const changePage = (page) => {
    return function (dispatch) {
        console.log("CHANGE PAGE TO " + page);
        dispatch(changeCurrentPage(page));
    }
}

export const checkEmailAction = (email) => {
    return function (dispatch) {
        axios
        .get(`${process.env.REACT_APP_API}/useremail/?email=${email}`)
        .then((resp) => {
            dispatch(setValidEmail(true));
        })
        .catch((error) => 
        {
            dispatch(setValidEmail(false));
        });
    }
}

export const getAllActivities = () => {
    return function (dispatch) {
        axios
        .get(`${process.env.REACT_APP_API}/activities`)
        .then((resp) => {            
            console.log(resp.data);
            dispatch(getActivities(resp.data));
        })
        .catch((error) => console.log(error));
    }
}

export const addPatientAction = (creatorId, additionalInfo, userInfo) => {
    return function (dispatch) {
        axios
        .post(`${process.env.REACT_APP_API}/patient`, additionalInfo)
        .then((resp) => {
            console.log("Response from addPatientAction: ",resp);
            console.log("last added "+ resp.data[0].lastAdded);
            const newUserInfo = Object.assign({},userInfo);
            newUserInfo.Dodatne_info_Id = resp.data[0].lastAdded;
            dispatch(registerUser(creatorId, newUserInfo));
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
            dispatch(doneCreatingNewPatient());
        })
        .catch((error) => console.log(error));
    }
}

export const uploadImage = (base64EncodedImage) => {
    return function (dispatch) {
        axios.post(`${process.env.REACT_APP_API}/images/upload`, base64EncodedImage)
            .then((resp) => {
                const info = {
                    public_id: resp.data.public_id,
                    secure_url: resp.data.secure_url
                }
                console.log(info);
                dispatch(addPublicIdAndSecureUrl(info));
            })
            .catch((error) => console.log(error));
    }
}