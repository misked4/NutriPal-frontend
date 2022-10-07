import axios from 'axios'

export const getRecipePage = async (pageParam = 1, option = {}) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipes/?search=&page=${pageParam}`, option)
    //console.log(response.data);
    return response.data;
}

export const increaseLikes = async (RecipeId, UserId) => {
    const response = await axios.put(`${process.env.REACT_APP_API}/recipe/${RecipeId}?func=increase&userId=${UserId}`)
    //console.log(response.data);
    return response.data;
}

export const decreaseLikes = async (RecipeId, UserId) => {
    const response = await axios.put(`${process.env.REACT_APP_API}/recipe/${RecipeId}?func=decrease&userId=${UserId}`)
    console.log(response.data);
    return response.data;
}

export const searchIfLiked = async (RecipeId, UserId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipe/like/${RecipeId}?userId=${UserId}`)
    //console.log(response.data);
    return response.data;
}

export const returnUnseenLikes = async (UserId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipes/like/${UserId}`)
    //console.log(response.data);
    return response.data;
}

export const getRecipe = async (recipeId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipe/${recipeId}`)
    //console.log(response.data);
    return response.data;
}

export const setSeenAllNotifications = async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_API}/recipes/likes/${userId}`)
    //console.log(response.data);
    return response.data;
}

export const uploadImage = async (base64EncodedImage) => {
    console.log("UPLOADIMAGE");
    //console.log(base64EncodedImage.data);
    const response = await axios.post(`${process.env.REACT_APP_API}/images/upload`, base64EncodedImage);
    return response.data;
}