import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementUIProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
  handleDragStart: (event: DragEvent<HTMLLIElement>) => void;
  handleDrop: (event: DragEvent<HTMLLIElement>) => void;
};
import { DragEvent } from 'react';
