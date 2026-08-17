import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'https://example.test/ingredient.png',
  image_large: 'https://example.test/ingredient-large.png',
  image_mobile: 'https://example.test/ingredient-mobile.png'
};

describe('ingredients reducer', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      loading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      {
        items: [ingredient],
        loading: false,
        error: 'Предыдущая ошибка'
      },
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      items: [ingredient],
      loading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled([ingredient], 'request-id')
    );

    expect(state).toEqual({
      items: [ingredient],
      loading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(null, 'request-id', undefined, 'Ошибка сети')
    );

    expect(state).toEqual({
      items: [],
      loading: false,
      error: 'Ошибка сети'
    });
  });
});
