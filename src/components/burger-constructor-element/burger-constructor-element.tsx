import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
      }
    };

    const handleClose = () => dispatch(removeIngredient(ingredient.id));
    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
        handleDragStart={(event) =>
          event.dataTransfer.setData('constructorIndex', String(index))
        }
        handleDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const fromIndex = Number(
            event.dataTransfer.getData('constructorIndex')
          );
          if (Number.isInteger(fromIndex) && fromIndex !== index) {
            dispatch(moveIngredient({ fromIndex, toIndex: index }));
          }
        }}
      />
    );
  }
);
