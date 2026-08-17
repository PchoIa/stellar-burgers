import { expect, Page, test } from '@playwright/test';

const harPath = 'tests/hars/constructor.har';

const openConstructor = async (page: Page) => {
  await page.routeFromHAR(harPath, {
    url: '**/api/**',
    notFound: 'abort'
  });

  await page.goto('/');
  await expect(
    page.getByRole('link', { name: /Тестовая булка/ })
  ).toBeVisible();
};

const addIngredient = async (page: Page, name: string) => {
  const ingredientCard = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('link', { name: new RegExp(name) }) });

  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
};

test.describe('Конструктор бургера', () => {
  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    await openConstructor(page);
    await addIngredient(page, 'Тестовая булка');
    await addIngredient(page, 'Тестовая котлета');

    await expect(page.getByText('Тестовая булка (верх)')).toBeVisible();
    await expect(page.getByText('Тестовая булка (низ)')).toBeVisible();
    await expect(
      page.getByText('Тестовая котлета', { exact: true })
    ).toHaveCount(2);
  });

  test.describe('Модальное окно ингредиента', () => {
    test('открывает окно с данными выбранного ингредиента', async ({
      page
    }) => {
      await openConstructor(page);

      const ingredientCard = page.getByRole('listitem').filter({
        has: page.getByRole('link', { name: /Тестовая котлета/ })
      });

      await ingredientCard.getByRole('link').click();

      await expect(
        page.getByText('Детали ингредиента', { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText('Тестовая котлета', { exact: true }).last()
      ).toBeVisible();
      await expect(page.getByText('Калории, ккал')).toBeVisible();
    });

    test('закрывает окно по клику на крестик', async ({ page }) => {
      await openConstructor(page);

      const ingredientCard = page.getByRole('listitem').filter({
        has: page.getByRole('link', { name: /Тестовая котлета/ })
      });

      await ingredientCard.getByRole('link').click();
      await page.locator('#modals > div:first-child button').click();

      await expect(
        page.getByText('Детали ингредиента', { exact: true })
      ).not.toBeVisible();
    });

    test('закрывает окно по клику на оверлей', async ({ page }) => {
      await openConstructor(page);

      const ingredientCard = page.getByRole('listitem').filter({
        has: page.getByRole('link', { name: /Тестовая котлета/ })
      });

      await ingredientCard.getByRole('link').click();
      await page
        .locator('#modals > div:last-child')
        .click({ position: { x: 5, y: 5 } });

      await expect(
        page.getByText('Детали ингредиента', { exact: true })
      ).not.toBeVisible();
    });
  });

  test('оформляет заказ и очищает конструктор', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: '127.0.0.1',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    const userResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/auth/user') && response.status() === 200
    );

    await openConstructor(page);
    await userResponse;

    await addIngredient(page, 'Тестовая булка');
    await addIngredient(page, 'Тестовая котлета');
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345', { exact: true })).toBeVisible();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.locator('#modals > div:first-child button').click();

    await expect(page.getByText('12345', { exact: true })).not.toBeVisible();
  });
});
