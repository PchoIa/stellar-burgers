import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import type { RootState } from '../store';

type TOrdersState = {
  feed: TOrder[];
  userOrders: TOrder[];
  selectedOrder: TOrder | null;
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feed: [],
  userOrders: [],
  selectedOrder: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const getError = (error: unknown) =>
  (error as Error).message || 'Не удалось загрузить заказы';

export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('orders/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);

    if (!response.orders[0]) {
      return rejectWithValue('Заказ не найден');
    }

    return response.orders[0];
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      });
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Заказ не найден';
      });
  }
});

export const { clearSelectedOrder } = ordersSlice.actions;
export const selectOrders = (state: RootState) => state.orders;
export const selectFeed = (state: RootState) => state.orders.feed;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectSelectedOrder = (state: RootState) =>
  state.orders.selectedOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export default ordersSlice.reducer;
