import Layout from "../components/layouts/Layout";
//Styles
import styles from "../styles/Product.module.css";
//Components
import DetallesProducto from "../components/layouts/DetallesProducto";
import useProductos from "../hooks/useProductos";

const Populares = () => {
  const { productos } = useProductos("votos");
  return (
    <div>
      <Layout>
        <div className={styles.listado_productos}>
          <div className={styles.contenedor}>
            <ul className={styles.bg_white}>
              {productos.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Populares;
