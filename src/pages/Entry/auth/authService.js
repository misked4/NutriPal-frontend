import axios from 'axios';

// Register user
const register = async(userData) => {    
    console.log("register");
    console.log(userData);
    //console.log("register");
    const response = await axios.post(`${process.env.REACT_APP_API}/user`, userData)
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data;
}

// login user
const login = async(userData) => {
    //console.log(`${process.env.REACT_APP_API}/user/?email=${userData.email}&password=${userData.password}`);
    const response = await axios.get(`${process.env.REACT_APP_API}/user/?email=${userData.email}&password=${userData.password}`);
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data;
}

// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

const loading = () => {
    console.log("loading...");
}

// Upload image to cloud
export const uploadImage = async (base64EncodedImage) => {
    console.log("UPLOADIMAGE");
    //console.log(base64EncodedImage.data);
    const response = await axios.post(`${process.env.REACT_APP_API}/images/upload`, base64EncodedImage);
    return response.data;
}

const authService = {
    register,
    login,
    logout,
    loading
}

export default authService;