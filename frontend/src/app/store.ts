import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { persistStore, persistReducer } from 'redux-persist';
import createIndexedDBStorage from 'redux-persist-indexeddb-storage';
import loginReducer from './redux/slices/loginSlice';
import fileListReducer from './redux/slices/fileSlice';
import userInfoReducer from './redux/slices/userInfoSlice';
import uploadFileReducer from './redux/slices/uploadFileSlice';
import storage from 'redux-persist/lib/storage';

// IndexedDB storage setup
const indexedDBStorage = createIndexedDBStorage({
  name: "myAppDB",
  storeName: "reduxPersist",
  version: 1,
});

// Separate persist configs for localStorage and IndexedDB
const persistConfigLocalStorage = {
  key: 'root',
  storage,
  whitelist: ['loginState', 'userInfoState'],
};

const persistConfigIndexedDB = {
  key: 'indexedDB',
  storage: indexedDBStorage,
  whitelist: ['fileListState', 'uploadFileState'],
};

// Separate reducers for localStorage and IndexedDB
const localStorageReducers = combineReducers({
  loginState: loginReducer,
  userInfoState: userInfoReducer,
});

const indexedDBReducers = combineReducers({
  fileListState: fileListReducer,
  uploadFileState: uploadFileReducer,
});

// Persist reducers
const persistedLocalStorageReducer = persistReducer(persistConfigLocalStorage, localStorageReducers);
const persistedIndexedDBReducer = persistReducer(persistConfigIndexedDB, indexedDBReducers);

// Combine persisted reducers
const combinedReducer = combineReducers({
  localStorage: persistedLocalStorageReducer,
  indexedDB: persistedIndexedDBReducer,
});

// Create store
export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
});

// Persist store
export const persistor = persistStore(store);

const makeStore = () => store;

export type AppState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(makeStore, { debug: false });
