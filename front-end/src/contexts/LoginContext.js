import React, { useContext, useReducer, useEffect } from 'react';
// import { setLocalStorage } from "../helper/localStorage";

export const loginContext = React.createContext();

const initialValue = {
  isLogin: false,
  userData: {},
  loader: false,
  err: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_TOKEN_SAVED':
      if (action.data) {
        return {
          ...state,
          token: action.data
        };
      }
      break;
    case 'SET_USER_DATA':
      if (action.data) {
        localStorage.setItem('ud', JSON.stringify(action.data));

        return {
          userData: action.data,
          isLogin: true,
          loader: false
        };
      }
      return {
        ...state,
        userData: {},
        isLogin: false,
        loader: false
      };

    case 'LOGIN_ERR': {
      return { ...state, err: true, loader: false };
    }
    case 'LOGIN_LOADER': {
      return { ...state, loader: true };
    }

    default:
      return state;
  }
};

// TODO: get token from local storage

export function LoginProvider(props) {
  const [loginC, dispatchLogin] = useReducer(reducer, initialValue, () => {
    const localData = localStorage.getItem('loginC');
    return localData ? JSON.parse(localData) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem('loginC', JSON.stringify(loginC));
  }, [loginC]);

  return <loginContext.Provider value={{ loginC, dispatchLogin }} {...props} />;
}
