import * as types from "../actionType";

const changeStateToRightbar = (visibility) => ({
    type: types.RIGTBAR_VISIBILITY,
    payload: visibility
})

export const hideRightBar = () => {
    return function (dispatch) {
        console.log("hideRightBar");
        dispatch(changeStateToRightbar(false));
    }
}

export const unhiddenRightBar = () => {
    return function (dispatch) {
        console.log("unhiddenRightBar");
        dispatch(changeStateToRightbar(true));
    }
}