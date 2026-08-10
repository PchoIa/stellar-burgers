import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { forgotPassword } from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err: string) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
