import { TypedUseSelectorHook, useDispatch as _useDispatch, useSelector as _useSelector } from "react-redux";
import { AppDispatch, AppState } from "./store";

export const useDispatch = () => _useDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<AppState> = _useSelector;
