import React, { createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    userObserver();
  }, []);

  const createUser = async (email, password, displayName) => {
    try {
      let userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName,
      });
      navigate("/");
      toastSuccessNotify("Registered successfully!");
      console.log(currentUser.displayName);
    } catch (error) {
      toastErrorNotify(error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      let userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/");
      toastSuccessNotify("Signed in successfully!");
      // console.log(userCredential)
    } catch (error) {
      toastErrorNotify(error.message);
    }
  };

  const logOut = () => {
    signOut(auth);
    toastSuccessNotify("Signed out successfully!");
  };

  const userObserver = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, photoURL } = user;
        setCurrentUser({ email, displayName, photoURL });
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        console.log(currentUser);
        // ...
      } else {
        // User is signed out
        // ...
        console.log("logged out");
        setCurrentUser(false);
      }
    });
  };

  const signUpProvider=()=>{
    const provider = new GoogleAuthProvider();

    const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result)
      navigate("/")
    }).catch((error) => {
      toastErrorNotify(error)
    });
   }

  const values = { createUser, signIn, logOut, currentUser,signUpProvider };
  return (
    <AuthContext.Provider value={values}>{children} </AuthContext.Provider>
  );


};

// export const useAuthContext=()=>{
//     useContext(AuthContext)
// }

export default AuthContextProvider;
