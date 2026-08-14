import { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import styles from './ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const ingredientData = useAppSelector(selectIngredients).find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  if (location.state?.background) {
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  return (
    <main className={styles.page}>
      <h1 className='text text_type_main-large'>Детали ингредиента</h1>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </main>
  );
};
