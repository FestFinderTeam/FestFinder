import { createContext, useContext, useEffect, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const AuthContext = createContext<{
    signIn: (arg1:JSON) => void;
    signOut: () => void;
    session?: JSON | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV === "production") {
        if (!value) {
            throw new Error(
                "useSession must be wrapped in a <SessinoProvider/>"
            );
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {

    const [[isLoading, session], setSession] = useStorageState("session");

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                "241797999690-5d7gqo37970apjob9en4so1stfgkqhjm.apps.googleusercontent.com",
        });
    }, []);
    return (
        <AuthContext.Provider
            value={{
                signIn: (sessionData: JSON ) => {
                    // Perform sign-in logic here

                    setSession(sessionData);
                },
                signOut: async () => {
                    try {
                        await GoogleSignin.revokeAccess()
                        await GoogleSignin.signOut();
                    }catch (err) {
                        
                    }
                    setSession(null);

                },
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
