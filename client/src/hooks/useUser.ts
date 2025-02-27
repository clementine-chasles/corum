import {useCookies} from "react-cookie";
import jwt from 'jsonwebtoken'

function useUser() {
    const [token, setToken] = useCookies(['jwt'])
    const decodedToken = jwt.decode(token?.jwt)
    const logIn = (jwt: string) => {
        setToken('jwt', jwt);
    }
    return {
        isLoggedIn: token && Date.now() <= decodedToken?.exp * 1000,
        logIn,
        ...decodedToken
    }
}

export default useUser