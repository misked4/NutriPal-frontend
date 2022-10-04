import axios from 'axios'

export const getAllGroceries = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API}/groceries`);
    //console.log("getAllGroceries");
    return response.data;
}

export const getGroceriesByName = async (name) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/groceries/${name}`);
    //console.log("getGroceriesByName");
    //console.log(response.data);
    return response.data;
}