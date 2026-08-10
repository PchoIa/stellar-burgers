import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const loading = useAppSelector(selectIngredientsLoading);
  const error = useAppSelector(selectIngredientsError);

  useEffect(() => {
    if (!ingredients.length && !loading && !error) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, loading, error]);

  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);

    if (tab === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (tab === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (tab === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
