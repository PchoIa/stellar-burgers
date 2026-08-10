import { ReactNode, useEffect } from 'react';
import {
  Location,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useAppDispatch } from '../../services/store';
import { authCheckFinished, fetchUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import '../../index.css';
import styles from './app.module.css';

const AppLayout = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);

const ModalRoute = ({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) => {
  const navigate = useNavigate();

  return (
    <Modal title={title} onClose={() => navigate(-1)}>
      {children}
    </Modal>
  );
};

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background as Location | undefined;

  useEffect(() => {
    dispatch(fetchIngredients());
    if (localStorage.getItem('refreshToken')) {
      dispatch(fetchUser());
    } else {
      dispatch(authCheckFinished());
    }
  }, [dispatch]);

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route path='feed/:number' element={<OrderInfo />} />
          <Route path='ingredients/:id' element={<IngredientDetails />} />
          <Route element={<ProtectedRoute onlyUnAuth />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='profile'>
              <Route index element={<Profile />} />
              <Route path='orders' element={<ProfileOrders />} />
              <Route path='orders/:number' element={<OrderInfo />} />
            </Route>
          </Route>
          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalRoute title='Детали ингредиента'>
                <IngredientDetails />
              </ModalRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalRoute title='Информация о заказе'>
                <OrderInfo />
              </ModalRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalRoute title='Информация о заказе'>
                  <OrderInfo />
                </ModalRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
