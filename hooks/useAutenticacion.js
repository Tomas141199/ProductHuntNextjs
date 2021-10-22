import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function useAutenticacion() {
  const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        guardarUsuarioAutenticado(user);
      } else {
        guardarUsuarioAutenticado(user);
      }
    });
    return unsuscribe;
    //eslint-disable-next-line
  }, []);

  return usuarioAutenticado;
}

export default useAutenticacion;
