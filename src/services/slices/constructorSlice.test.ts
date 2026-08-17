import { TIngredient } from '@utils-types';
import constructorReducer, {
  addIngredient,
  clearConstructor,
  closeOrderModal,
  createOrder,
  moveIngredient,
  removeIngredient
} from './constructorSlice';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'https://example.test/bun.png',
  image_large: 'https://example.test/bun-large.png',
  image_mobile: 'https://example.test/bun-mobile.png'
};

const filling: TIngredient = {
  ...bun,
  _id: 'filling-1',
  name: 'Тестовая начинка',
  type: 'main'
};

const sauce: TIngredient = {
  ...bun,
  _id: 'sauce-1',
  name: 'Тестовый соус',
  type: 'sauce'
};

const getStateWithIngredients = () => {
  let state = constructorReducer(undefined, addIngredient(bun));

  state = constructorReducer(state, addIngredient(filling));
  state = constructorReducer(state, addIngredient(sauce));

  return state;
};

describe('burger constructor reducer', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  test('добавляет булку и начинку', () => {
    const state = getStateWithIngredients();

    expect(state.bun).toMatchObject(bun);
    expect(state.bun?.id).toEqual(expect.any(String));
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toMatchObject(filling);
    expect(state.ingredients[1]).toMatchObject(sauce);
  });

  test('удаляет начинку по id', () => {
    const stateWithIngredients = getStateWithIngredients();
    const ingredientId = stateWithIngredients.ingredients[0].id;

    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(sauce);
  });

  test('перемещает начинку', () => {
    const state = constructorReducer(
      getStateWithIngredients(),
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients[0]).toMatchObject(sauce);
    expect(state.ingredients[1]).toMatchObject(filling);
  });

  test('очищает конструктор', () => {
    const state = constructorReducer(
      {
        ...getStateWithIngredients(),
        orderModalData: { number: 12345, name: 'Тестовый бургер' }
      },
      clearConstructor()
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
    expect(state.orderModalData).toBeNull();
  });

  test('закрывает модальное окно заказа', () => {
    const state = constructorReducer(
      {
        ...getStateWithIngredients(),
        orderModalData: { number: 12345, name: 'Тестовый бургер' }
      },
      closeOrderModal()
    );

    expect(state.orderModalData).toBeNull();
  });

  test('обрабатывает createOrder.pending', () => {
    const state = constructorReducer(
      {
        ...getStateWithIngredients(),
        error: 'Предыдущая ошибка'
      },
      createOrder.pending('request-id', ['bun-1', 'filling-1', 'bun-1'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обрабатывает createOrder.fulfilled и очищает конструктор', () => {
    const state = constructorReducer(
      getStateWithIngredients(),
      createOrder.fulfilled(
        { number: 12345, name: 'Тестовый бургер' },
        'request-id',
        ['bun-1', 'filling-1', 'bun-1']
      )
    );

    expect(state).toMatchObject({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: { number: 12345, name: 'Тестовый бургер' }
    });
  });

  test('обрабатывает createOrder.rejected', () => {
    const state = constructorReducer(
      {
        ...getStateWithIngredients(),
        orderRequest: true
      },
      createOrder.rejected(
        null,
        'request-id',
        ['bun-1', 'filling-1', 'bun-1'],
        'Ошибка создания заказа'
      )
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });
});
