import styled from "@emotion/styled";
import { async } from "@firebase/util";
import Router from "next/router";
import { useState } from "react";
const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;

const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url("/static/img/buscar.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -9999px;
  &:hover {
    cursor: pointer;
  }
`;

const Form = styled.form`
  position: relative;
`;

const Buscar = () => {
  const [busqueda, guardarBusqueda] = useState("");

  const buscarProducto = async (e) => {
    e.preventDefault();

    if (busqueda.trim() === "") return;

    //Redireccion del usuario
    Router.push({
      pathname: "/buscar",
      query: { q: busqueda },
    });
  };

  return (
    <Form onSubmit={buscarProducto}>
      <InputText
        type="text"
        placeholder="Buscar Productos"
        onChange={(e) => guardarBusqueda(e.target.value)}
      />
      <InputSubmit type="submit">Buscar</InputSubmit>
    </Form>
  );
};

export default Buscar;
