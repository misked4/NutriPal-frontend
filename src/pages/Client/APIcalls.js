import axios from 'axios'

export const checkEmailIfExist = async (Email) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/useremail/?email=${Email}`)
    //console.log(response.data);
    return response.data;
}

export const uloadPhotoIfWeAlreadyDontHave = async (jsonObj) => {
    const response = await axios.post(`${process.env.REACT_APP_API}/images/upload`, jsonObj)
    console.log(response.data);
    return response;
}