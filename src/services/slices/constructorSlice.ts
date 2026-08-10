import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../store';

type TOrderData = { number: number; name: string } | null;

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrderData;
  error: string | null;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrderData,
  string[],
  { rejectValue: string }
>('constructor/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось оформить заказ'
    );
  }
});

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const [item] = state.ingredients.splice(action.payload.fromIndex, 1);
      state.ingredients.splice(action.payload.toIndex, 0, item);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || action.error.message || 'Ошибка заказа';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;
export const selectConstructor = (state: RootState) => state.burgerConstructor;
export default constructorSlice.reducer;
