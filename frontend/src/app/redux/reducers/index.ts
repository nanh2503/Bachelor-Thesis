import { combineReducers } from "redux";
import loginSlice, { LoginState } from "../slices/loginSlice";

export type AppState = {
    loginState: LoginState;
}

export const rootReducers = combineReducers<AppState>({
    loginState: loginSlice
})