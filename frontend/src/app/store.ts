import { configureStore } from '@reduxjs/toolkit';
import { rootReducers } from './redux/reducers';

export const store = configureStore({
    reducer: rootReducers,
     middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    })
  }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;