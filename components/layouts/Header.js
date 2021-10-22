import React, { useContext } from "react";
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Link from "next/link";
import styled from "@emotion/styled";
import styles from "../../styles/Header.module.css";
import Boton from "../ui/Boton";
import { FireContext } from "../../firebase";

const ContenedorHeader = styled.div`
  max-width: 1400px;
  width: 95%;
  height: auto;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
`;

const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;
`;

const Header = () => {
  const { usuario, fire } = useContext(FireContext);
  return (
    <header className={styles.header}>
      <ContenedorHeader>
        <div className={styles.nav_items}>
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          {/* Buscador */}
          <Buscar />
          {/* Nav */}
          <Navegacion />
        </div>

        <div className={styles.auth_items}>
          {/* Menu de administracion */}
          {usuario ? (
            <>
              <p className={styles.mr}>Hola : {usuario.displayName} </p>

              <Boton bgColor="true" onClick={() => fire.cerrarSesion()}>
                Cerrar Sesion
              </Boton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Boton bgColor="true">Login</Boton>
              </Link>

              <Link href="/crear-cuenta">
                <Boton>Crear Cuenta</Boton>
              </Link>
            </>
          )}
        </div>
      </ContenedorHeader>
    </header>
  );
};

export default Header;
