import { test, expect } from '@playwright/test';

test('user journey', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle('Corum users');
  await expect(page).toHaveURL('http://localhost:5173/login')
  // register
  await page.getByText('Don\'t have an account yet? Register!').click()
  await expect(page).toHaveURL('http://localhost:5173/register')
  await page.getByLabel('Email').fill('test@test.com')
  await page.getByLabel('Password').fill('12345678')
  await page.getByLabel('First name').fill('John')
  await page.getByLabel('Last name').fill('Doe')
  await page.getByLabel('Date of birth').fill('01/01/2020')
  await page.getByText('Register').click();
  await expect(page).toHaveURL('http://localhost:5173/home')
  // user list
  await expect(page.getByText('test@test.com')).toBeVisible();
  await expect(page.getByText('John')).toBeVisible();
  await expect(page.getByText('Doe')).toBeVisible();
  await expect(page.getByText('Update')).toBeVisible();
  await expect(page.getByTestId('delete-button')).toBeVisible();
  // add user
  await expect(page.getByText('Add user')).toBeVisible();
  await page.getByText('Add user').click()
  await expect(page).toHaveURL('http://localhost:5173/add')
  await page.getByLabel('Email').fill('test2@test.com')
  await page.getByLabel('First name').fill('Elinor')
  await page.getByLabel('Last name').fill('Dashwood')
  await page.getByLabel('Date of birth').fill('02/02/2020')
  await page.getByText('Add user').click();
  await expect(page).toHaveURL('http://localhost:5173/home')
  await expect(page.locator('tbody tr')).toHaveCount(2)
  await expect(page.getByText('Elinor')).toBeVisible();
  await expect(page.getByText('Dashwood')).toBeVisible();
  // sort & filter
  await expect(page.locator('tbody tr').first().getByText('Elinor')).toBeVisible();
  await page.getByText('First name').click();
  await expect(page.locator('tbody tr').first().getByText('Elinor')).toBeVisible();
  await page.getByText('First name').click();
  await expect(page.locator('tbody tr').first().getByText('John')).toBeVisible();
  await page.getByPlaceholder('Search').fill('Doe')
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(1)
  await expect(page.locator('tbody tr').first().getByText('John')).toBeVisible();
  await page.getByPlaceholder('Search').clear()
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(2)
  // update user
  await page.getByText('Update').first().click()
  await page.getByLabel('Last name').fill('Smith')
  await page.getByText('Update').click()
  await expect(page).toHaveURL('http://localhost:5173/home')
  await expect(page.getByText('Smith')).toBeVisible();
  // delete user
  await page.getByTestId('delete-button').first().click()
  await expect(page.getByText('Are you sure you want to delete this user?')).toBeVisible();
  await expect(page.getByTestId('delete-user-modal').getByText('test2@test.com')).toBeVisible();
  await expect(page.getByTestId('delete-user-modal').getByText('Elinor Dashwood')).toBeVisible();
  await page.getByText('Yes, confirm').click()
  await expect(page).toHaveURL('http://localhost:5173/home')
  await expect(page.getByTestId('delete-user-modal')).toBeHidden();
  await expect(page.getByText('Dashwood')).toBeHidden();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  // logout
  await page.getByTestId('AccountCircleIcon').click()
  await page.getByText('Logout').click()
  await expect(page).toHaveURL('http://localhost:5173/login')
});
