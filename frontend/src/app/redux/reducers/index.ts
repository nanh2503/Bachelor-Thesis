import { combineReducers } from "redux";
import loginReducer, { LoginState } from "../slices/loginSlice";

export type RootState = {
    loginState: LoginState;
}

export const rootReducers = combineReducers<RootState>({
    loginState: loginReducer
});
