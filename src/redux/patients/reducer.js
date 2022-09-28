import * as types from "../actionType";

const initialState = {
    users: [],
    oneUser: {}, //mora biti OneUser,vec imamo User u Auth
    validEmail : false,
    loading: true
}

const usersReducers = (state = initialState, action) => {
    switch(action.type){
        case types.GET_PATIENTS:
            return{
                ...state,
                users: action.payload,
                loading: false,
                validEmail: false,
            }
        case types.DELETE_PATIENT:
            return{
                ...state,
                loading: false,
                validEmail: false,
            }
        case types.ADD_ADDITIONAL_INFO_PATIENT:
            return{
                ...state,
                loading: false,
                validEmail: false,
            }
        case types.SET_TRUE_VALID_EMAIL:
            return{
                ...state,
                validEmail: true
            }
        case types.SET_FALSE_VALID_EMAIL:
            return{
                ...state,
                validEmail: false
            }
        default:
            return state;
    }
};

export default usersReducers;