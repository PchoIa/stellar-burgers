import { FC, ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';

type TProtectedRouteProps = {
  children?: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const { isAuthenticated, isAuthChecked } = useAppSelector(selectUser);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';

    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};
