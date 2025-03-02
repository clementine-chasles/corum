import { useCookies } from 'react-cookie';
import * as jwt from 'jsonwebtoken';

function useUser() {
  const [token, setToken] = useCookies(['jwt']);
  const decodedToken = jwt.decode(token?.jwt) as { exp: number };
  const logIn = (jwt: string) => {
    setToken('jwt', jwt);
  };
  const logOut = () => {
    setToken('jwt', undefined);
  };
  return {
    isLoggedIn: token && Date.now() <= decodedToken?.exp * 1000,
    logIn,
    logOut,
    token: token?.jwt,
  };
}

export default useUser;
