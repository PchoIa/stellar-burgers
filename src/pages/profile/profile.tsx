import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectUser, updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();

  const { user, error: updateUserError } = useAppSelector(selectUser);
  const profileUser = user || { name: '', email: '' };

  const [formValue, setFormValue] = useState({
    name: profileUser.name,
    email: profileUser.email,
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: profileUser.name,
      email: profileUser.email,
      password: ''
    });
  }, [profileUser.name, profileUser.email]);

  const isFormChanged =
    formValue.name !== profileUser.name ||
    formValue.email !== profileUser.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const updatedFields: Partial<{
      name: string;
      email: string;
      password: string;
    }> = {};

    if (formValue.name !== profileUser.name) {
      updatedFields.name = formValue.name;
    }

    if (formValue.email !== profileUser.email) {
      updatedFields.email = formValue.email;
    }

    if (formValue.password) {
      updatedFields.password = formValue.password;
    }

    try {
      const updatedUser = await dispatch(updateUser(updatedFields)).unwrap();

      setFormValue({
        name: updatedUser.name,
        email: updatedUser.email,
        password: ''
      });
    } catch {
      return;
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: profileUser.name,
      email: profileUser.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
