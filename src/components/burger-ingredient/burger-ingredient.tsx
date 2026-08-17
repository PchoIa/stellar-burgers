import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  addIngredient,
  selectConstructor
} from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();

    const dispatch = useAppDispatch();
    const constructorState = useAppSelector(selectConstructor);

    const bun = constructorState?.bun ?? null;
    const constructorIngredients = constructorState?.ingredients ?? [];
    const count =
      (bun?._id === ingredient._id ? 2 : 0) +
      constructorIngredients.filter((item) => item._id === ingredient._id)
        .length;

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        handleDragStart={(event) =>
          event.dataTransfer.setData('ingredientId', ingredient._id)
        }
      />
    );
  }
);
