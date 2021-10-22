import "../styles/globals.css";
import fire, { FireContext } from "../firebase";
import useAutenticacion from "../hooks/useAutenticacion";

function MyApp({ Component, pageProps }) {
  const usuario = useAutenticacion();
  return (
    <FireContext.Provider value={{ fire, usuario }}>
      <Component {...pageProps} />
    </FireContext.Provider>
  );
}

export default MyApp;
