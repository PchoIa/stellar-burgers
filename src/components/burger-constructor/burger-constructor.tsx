import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  clearConstructor,
  closeOrderModal,
  createOrder,
  addIngredient,
  selectConstructor
} from '../../services/slices/constructorSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const constructorState = useAppSelector(selectConstructor);
  const availableIngredients = useAppSelector(selectIngredients);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const ingredients = constructorState?.ingredients ?? [];
  const bun = constructorState?.bun ?? null;
  const constructorItems = {
    bun,
    ingredients
  };
  const orderRequest = constructorState?.orderRequest ?? false;
  const orderModalData = constructorState?.orderModalData ?? null;

  const onOrderClick = () => {
    if (!bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(
      createOrder([bun._id, ...ingredients.map((item) => item._id), bun._id])
    );
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
    dispatch(clearConstructor());
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();

    const ingredientId = event.dataTransfer.getData('ingredientId');
    const ingredient = availableIngredients.find(
      (item) => item._id === ingredientId
    );

    if (ingredient) {
      dispatch(addIngredient(ingredient));
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <div>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData as TOrder | null}
        onOrderClick={onOrderClick}
        closeOrderModal={handleCloseOrderModal}
        handleDrop={handleDrop}
      />
    </div>
  );
};
