import {useCookies} from "react-cookie";
import jwt from 'jsonwebtoken'

function useUser() {
    const [token, setToken] = useCookies(['jwt'])
    const decodedToken = jwt.decode(token?.jwt) as { exp: number }
    const logIn = (jwt: string) => {
        setToken('jwt', jwt);
    }
    return {
        isLoggedIn: token && Date.now() <= decodedToken?.exp * 1000,
        logIn,
        token: token?.jwt,
        ...decodedToken
    }
}

export default useUser