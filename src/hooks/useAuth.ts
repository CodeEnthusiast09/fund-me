import { useState, useEffect } from "react";
import { retrieveFromLocalStorage } from "lib/localStorage";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = retrieveFromLocalStorage("access_token");
      const expiration = retrieveFromLocalStorage("token_expiration");
      setIsLoggedIn(
        !!token && !!expiration && Date.now() < parseInt(expiration, 10)
      );
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return isLoggedIn;
}
