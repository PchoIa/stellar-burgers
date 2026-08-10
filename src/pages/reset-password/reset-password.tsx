import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { resetPassword } from '../../services/slices/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err: string) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
