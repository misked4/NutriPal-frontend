import usersReducers from "./patients/reducer";
import authReducer from "../pages/Entry/auth/authSlice";
import newPatientReducers from "./newPatient/reducer";
import rightbarReducer from "./rightbar/reducer";

const rootReducer = ({
    reducer: {
        auth: authReducer,
        patients: usersReducers,
        newPatient: newPatientReducers,
        rightbar: rightbarReducer
    }
})

export default rootReducer;