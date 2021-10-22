import Layout from "../components/layouts/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DetallesProducto from "../components/layouts/DetallesProducto";
import useProductos from "../hooks/useProductos";
import styles from "../styles/Product.module.css";

const Buscar = () => {
  const router = useRouter();

  const {
    query: { q },
  } = router;

  //Todos los productos

  const { productos } = useProductos("creado");
  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    guardarResultado(filtro);
  }, [q, productos]);

  console.log(q);

  return (
    <Layout>
      <h1>Buscar</h1>
      <div className={styles.listado_productos}>
        <div className={styles.contenedor}>
          <ul className={styles.bg_white}>
            {resultado.map((producto) => (
              <DetallesProducto key={producto.id} producto={producto} />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Buscar;
