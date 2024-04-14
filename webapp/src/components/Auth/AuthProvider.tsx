import { ReactNode, useState, useEffect, createContext } from "react";
import { useRestApi } from "../../sharedHooks/useRestApi";

export const USER_KEY = "userKey";

export enum AuthStatusCode {
  SUCCESS = "Success",
  FAILURE = "Failure",
  INVALID = "Invalid",
}

// TODO: Add more context later
export type AuthContextType = {
  userId: string | null,
  userType: string | null,
  isLoggedIn: boolean,
  setUserId: (id: string) => void,
  setUserType: (type: string) => void,
  setIsLoggedIn: (state: boolean) => void,
  login: (username: string, password: string) => Promise<AuthStatusCode>,
  logout: () => void,
}

// TODO: Investigate the type issue later
const AuthContextDefault: AuthContextType = {
  userId: null,
  userType: null,
  isLoggedIn: false,
  setUserId: (_id) => _id,
  setUserType: (_type) => _type,
  setIsLoggedIn: (_state) => _state,
  login: () => new Promise(() => AuthStatusCode.INVALID),
  logout: () => {},
}

export const AuthContext = createContext(AuthContextDefault);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const {getFormatedUrl} = useRestApi();
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect for persistent log in (until log out or local storage is cleared)
  useEffect(() => {
    const user = localStorage.getItem(USER_KEY);
    
    if (!user) {
      return;
    }

    const userData = JSON.parse(user);

    if(userData.isLoggedIn) {
      setIsLoggedIn(true);
      setUserType(userData.userType);
      setUserId(userData.userId);
    }
  }, [])

  const login = async (username: string, password:string) => {
    const status = await fetch(getFormatedUrl('user/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
    .then(response => response.json())
    .then(data => { 
      if (data.status == AuthStatusCode.SUCCESS) {
        console.log('The user has successfully logged in');
        setUserId(data.id);
        setUserType(data.type);
        setIsLoggedIn(true);
        localStorage.setItem(USER_KEY, JSON.stringify({
          userId: data.id,
          userType: data.type,
          isLoggedIn: true,
        }))
        setIsLoggedIn(true);
        return AuthStatusCode.SUCCESS;
      } else if (data.status == AuthStatusCode.FAILURE) {
        console.log("Incorrect password has been entered");
        return AuthStatusCode.FAILURE;
      } else {
        console.log("Invalid login information has been entered");
        return AuthStatusCode.INVALID
      }
    });

    return status;
  }

  // Clears the user data from the browser to emulate a log out
  const logout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUserId(null);
      localStorage.setItem(USER_KEY, JSON.stringify({
        userId: null,
        userType: null,
        isLoggedIn: false,
      }))

      // Force Refresh the page
      location.reload();
    }
  }


  const AuthContextValue:AuthContextType = {
    userId,
    userType,
    isLoggedIn,
    setUserId,
    setUserType,
    setIsLoggedIn,
    login,
    logout
  };

  return <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
}