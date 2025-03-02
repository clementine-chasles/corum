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
  // update user
  await page.getByText('Update').click()
  await page.getByLabel('Last name').fill('Smith')
  await page.getByText('Update').click()
  await expect(page).toHaveURL('http://localhost:5173/home')
  await expect(page.getByText('Smith')).toBeVisible();
  // delete user
  await page.getByTestId('delete-button').click()
  await expect(page.getByText('Are you sure you want to delete this user?')).toBeVisible();
  await expect(page.getByTestId('delete-user-modal').getByText('test@test.com')).toBeVisible();
  await expect(page.getByTestId('delete-user-modal').getByText('John Smith')).toBeVisible();
  await page.getByText('Yes, confirm').click()
  await expect(page).toHaveURL('http://localhost:5173/home')
  await expect(page.getByTestId('delete-user-modal')).toBeHidden();
  await expect(page.getByText('Smith')).toBeHidden();
  await expect(page.locator('tbody tr')).toBeHidden();
  // logout
  await page.getByTestId('AccountCircleIcon').click()
  await page.getByText('Logout').click()
  await expect(page).toHaveURL('http://localhost:5173/login')
});
