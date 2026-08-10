import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import type { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loading: false,
  error: null
};

const saveTokens = (data: { accessToken: string; refreshToken: string }) => {
  localStorage.setItem('refreshToken', data.refreshToken);
  setCookie('accessToken', data.accessToken);
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

const getError = (error: unknown) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return 'Ошибка авторизации';
};

export const register = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const login = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    saveTokens(response);
    return response.user;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(getError(error));
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(data);
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error) {
      return rejectWithValue(getError(error));
    } finally {
      clearTokens();
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheckFinished: (state) => {
      state.isAuthChecked = true;
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload || 'Ошибка выхода';
      })
      .addCase(fetchUser.rejected, (state, action) => {
        clearTokens();
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload || 'Ошибка авторизации';
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('user/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('user/') &&
          action.type.endsWith('/rejected') &&
          action.type !== logout.rejected.type &&
          action.type !== fetchUser.rejected.type,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Ошибка авторизации';
        }
      );
  }
});

export const { authCheckFinished, clearUserError } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export default userSlice.reducer;
