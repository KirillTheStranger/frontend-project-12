import { useState, useMemo, useCallback } from 'react';
import AuthContext from './authContext.js';
import useGetToken from '../../hooks/useGetToken.js';

const AuthProvider = ({ children }) => {
  const token = useGetToken();
  const [authStatus, setAuthenticationStatus] = useState(!!token);

  const setAuthStatus = useCallback((status) => setAuthenticationStatus(status), []);
  const logOut = useCallback(() => {
    localStorage.clear();
    setAuthStatus(false);
  }, [setAuthStatus]);

  const contextValue = useMemo(
    () => ({ authStatus, setAuthStatus, logOut }),
    [authStatus, setAuthStatus, logOut],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
