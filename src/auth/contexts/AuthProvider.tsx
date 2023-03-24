import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../../core/hooks/useLocalStorage";
import { useLogin } from "../hooks/useLogin";
import { useLogout } from "../hooks/useLogout";
import { UserInfo } from "../types/userInfo";

interface AuthContextInterface {
  hasRole: (roles?: string[]) => {};
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  userInfo?: UserInfo;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [_authKey, setAuthKey] = useLocalStorage<string>("authkey", "");

  const { isLoggingIn, login } = useLogin();
  const { isLoggingOut, logout } = useLogout();
  const userInfo: UserInfo = {email: "", firstName: "", id: "", job: "", lastName: "", progress: 0, role: ""}

  const hasRole = (_roles?: string[]) => {
    return true;
  };

  const handleLogin = async (email: string, password: string) => {
    return login({ email, password })
      .then((key: string) => {
        setAuthKey(key);
        return key;
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleLogout = async () => {
    return logout()
      .then((data) => {
        setAuthKey("");
        return data;
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <AuthContext.Provider
      value={{
        hasRole,
        isLoggingIn,
        isLoggingOut,
        login: handleLogin,
        logout: handleLogout,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
