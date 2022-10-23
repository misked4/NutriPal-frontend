import * as types from "../actionType";

const initialState = {
    basicInfo: {},
    additionalInfo: {},
    activities: [],
    allergens: [],
    diet: {},
    page: "1",
    allDone: false,
    createdUser: null,
    validEmail : undefined,
    loading: true
}

const newPatientReducers = (state = initialState, action) => {
    switch(action.type){
        case types.BASIC_INFO_ADDED:
            return{
                ...state,
                basicInfo: action.payload,
                loading: false
            }
        case types.ADDITIONAL_INFO_ADDED:
            return{
                ...state,
                additionalInfo: action.payload,
                loading: false
            }
        case types.CHANGE_PAGE:
            return{
                ...state,
                page: action.payload
            }
        case types.CHECK_EMAIL:
            return{
                ...state,
                validEmail: action.payload
            }
        case types.GET_ACTIVITIES:
        return{
            ...state,
            activities: action.payload
        }
        case types.DONE_ADDING_NEW_PATIENT:
        return{
            state: initialState,
            createdUser: action.payload,
            page: "4",
            loading: false
        }
        case types.IMAGE_UPLOAD:
            return{
                ...state,
                basicInfo: { ...state.basicInfo, Cloudinary_public_id: action.payload.public_id, Slika: action.payload.secure_url},
                loading: false
            }
        default:
            return state;
    }
};

export default newPatientReducers;