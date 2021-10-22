//React
import { useState, useEffect, useContext } from "react";
import Layout from "../components/layouts/Layout";

//Firebase
import { FireContext } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const useProductos = (orden) => {
  const [productos, guardarProductos] = useState([]);
  const { fire, usuario } = useContext(FireContext);

  useEffect(() => {
    const obtenerProductos = async () => {
      //Consulta a firebase
      const q = query(collection(fire.db, "productos"), orderBy(orden, "desc"));

      //Snapshot
      const querySnapshot = await getDocs(q);

      manejarSnapShot(querySnapshot);
    };
    obtenerProductos();
    //eslint-disable-next-line
  }, []);

  function manejarSnapShot(querySnapshot) {
    const productos = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    guardarProductos(productos);
  }

  return {
    productos,
  };
};

export default useProductos;
