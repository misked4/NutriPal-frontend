import axios from 'axios'

export const getAllDataForWeekSchedule = async(nutritionistId, patientId, goal) => {
    const response = await axios.all([
        axios.get(`${process.env.REACT_APP_API}/user/${nutritionistId}`),
        axios.get(`${process.env.REACT_APP_API}/weeklymenu?nutritionistId=${nutritionistId}&patientId=${patientId}&goal=${goal}`),
      ])
      .then(axios.spread((data1, data2) => {
        // output of req.
        const nutritionist = data1.data[0];
        const matrix = data2.data;

        const result = {
            nutritionist: nutritionist,
            matrix: matrix
        }
        
        return result;
      }));
    return response;
}

export const getAllDataForRecipe = async(recipeId) => {
    const response = await axios.all([
        axios.get(`${process.env.REACT_APP_API}/recipe/${recipeId}`),
        axios.get(`${process.env.REACT_APP_API}/fullrecipe/${recipeId}`),
      ])
      .then(axios.spread((data1, data2) => {
        // output of req.
        const recipeData = data1.data[0];
        const allGroceries = data2.data;

        const result = {
            recipeData: recipeData,
            allGroceries: allGroceries
        }
        return result;
      }));
    return response;
}