import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { rootReducers, RootState } from "./redux/reducers";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loginState', 'fileListState', 'userInfoState', 'uploadFileState'],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    });
  }
});

export const persistor = persistStore(store);

const makeStore = () => {
  return store;
};

export type AppState = RootState;
export type AppDispatch = typeof store.dispatch;
export type ThunkAppDispatch = ThunkDispatch<AppState, void, Action>;

export const wrapper = createWrapper(makeStore, { debug: false });
