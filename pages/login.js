import React, { useState } from "react";
import Layout from "../components/layouts/Layout";
import Router from "next/Router";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import fire from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const Login = () => {
  const [error, guardarError] = useState(false);

  const STATE_INICIAL = {
    email: "",
    password: "",
  };
  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      const usuario = await fire.login(email, password);
      console.log(usuario);
      Router.push("/");
    } catch (error) {
      console.log("Error al autenticar al usuario", error.message);
      guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1 className="text-align-center">Iniciar Sesion</h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Tu email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Tu password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Iniciar Sesion" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default Login;
