import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import type { RootState } from '../store';

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось загрузить ингредиенты'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Ошибка загрузки';
      });
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export default ingredientsSlice.reducer;
