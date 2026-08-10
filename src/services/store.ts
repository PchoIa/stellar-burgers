import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  user: userReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () =>
  dispatchHook<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export const useDispatch = useAppDispatch;
export const useSelector = useAppSelector;

export default store;
