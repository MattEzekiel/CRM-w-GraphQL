import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [cargando, setCargando] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = sessionStorage.getItem('token');
            const protectedRoutes = ['/iniciar-sesion', '/registro'];

            if (!token && !protectedRoutes.some(route => router.pathname.includes(route))) {
                await router.push("/iniciar-sesion");
            } else {
                await router.push("/");
            }

            setCargando(false);
        }

        autenticarUsuario();
        // eslint-disable-next-line
    }, []);

    return (
        <AuthContext.Provider value={{
            cargando,
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;