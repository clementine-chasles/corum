import { useCookies } from 'react-cookie';
import { renderHook } from '@testing-library/react';
import useUser from './useUser';
import * as jwt from 'jsonwebtoken';

jest.mock('react-cookie', () => ({
  __esModule: true,
  useCookies: jest.fn(() => [[], jest.fn(), jest.fn()]),
}));

const mockedUseCookies = useCookies as jest.Mock<any>;

describe('useUser', () => {
  beforeEach(() => {
    mockedUseCookies.mockReset();
  });
  it('should return data when not logged in', () => {
    mockedUseCookies.mockReturnValue([{}, jest.fn()]);
    const { result } = renderHook(() => useUser());
    const { isLoggedIn, token } = result.current;
    expect(isLoggedIn).toBe(false);
    expect(token).toBeUndefined();
  });
  it('should return data when logged in', () => {
    const jwtToken = jwt.sign(
      {
        exp: (Date.now() + 1000) / 1000,
      },
      'secret',
    );
    mockedUseCookies.mockReturnValue([
      {
        jwt: jwtToken,
      },
      jest.fn(),
    ]);
    const { result } = renderHook(() => useUser());
    const { isLoggedIn, token } = result.current;
    expect(isLoggedIn).toBe(true);
    expect(token).toEqual(jwtToken);
  });
  it('should log in', () => {
    const jwtToken = jwt.sign(
      {
        exp: (Date.now() + 1000) / 1000,
      },
      'secret',
    );
    const setToken = jest.fn();
    mockedUseCookies.mockReturnValue([{}, setToken]);
    let { result } = renderHook(() => useUser());
    let { isLoggedIn, token, logIn } = result.current;
    expect(isLoggedIn).toBe(false);
    expect(token).toBeUndefined();
    logIn(jwtToken);
    expect(setToken).toBeCalledWith('jwt', jwtToken);
  });
  it('should log out', () => {
    const jwtToken = jwt.sign(
      {
        exp: (Date.now() + 1000) / 1000,
      },
      'secret',
    );
    const setToken = jest.fn();
    mockedUseCookies.mockReturnValue([
      {
        jwt: jwtToken,
      },
      setToken,
    ]);
    let { result } = renderHook(() => useUser());
    let { isLoggedIn, token, logOut } = result.current;
    expect(isLoggedIn).toBe(true);
    expect(token).toEqual(jwtToken);
    logOut();
    expect(setToken).toBeCalledWith('jwt', undefined);
  });
});
