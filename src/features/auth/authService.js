import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user/';

// Register user
const register = async(userData) => {    
    console.log("register");
    const response = await axios.post(API_URL, userData)
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data;
}

// login user
const login = async(userData) => {
    console.log(`${API_URL}?email=${userData.email}&password=${userData.password}`);
    const response = await axios.get(`${API_URL}?email=${userData.email}&password=${userData.password}`);
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data;
}

// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    login,
    logout
}

export default authService;