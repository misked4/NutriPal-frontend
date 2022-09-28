import * as types from "../actionType";

const initialState = {
    rightbarState: true
}

const rightbarReducer = (state = initialState, action) => {
    switch(action.type){
        case types.RIGTBAR_VISIBILITY:
            return{
                ...state,
                rightbarState: action.payload
            }
        default:
            return state;
    }
}

export default rightbarReducer;