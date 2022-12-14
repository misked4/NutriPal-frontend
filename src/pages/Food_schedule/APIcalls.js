import axios from 'axios'

export const getAllRecipesForNutri = async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipes/${userId}`);
    return response.data;
}

export const getRecipeWithHisFullGroceries = async (recipeId) => { // TODO: change api call
    const response = await axios.get(`${process.env.REACT_APP_API}/fullgroceries/${recipeId}`);
    return response.data;
}

export const postWeeklyMenu = async (fullData) => {
    console.log(" BREEE fulldata");
    console.log(fullData);
    const response = await axios.post(`${process.env.REACT_APP_API}/weeklymenu`, fullData);
    return response.data;
}

export const getWeeklyMenu = async (nutritionistId, patientId, goal) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/weeklymenu?nutritionistId=${nutritionistId}&patientId=${patientId}&goal=${goal}`);
    return response.data;
}

export const getAdditionalInfoForPatient = async (id) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/addinfo/${id}`);
    return response.data[0];
}

export const getDiet = async (dietId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/diet/${dietId}`)
    //console.log(response.data);
    return response.data[0];
}