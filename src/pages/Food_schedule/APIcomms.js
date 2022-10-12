import axios from 'axios'

export const getAllRecipesForNutri = async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipes/${userId}`);
    return response.data;
}

export const getRecipeWithHisGroceries = async (recipeId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/fullrecipe/${recipeId}`);
    return response.data;
}