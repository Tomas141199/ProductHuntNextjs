import { useRouter } from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { FireContext } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Error404 from "../../components/layouts/404";
import Layout from "../../components/layouts/Layout";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
//import Image from "next/image";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import styles from "../../styles/Product.module.css";
import Boton from "../../components/ui/Boton";

const Titulo = styled.h1`
  margin-top: 5rem;
  text-align: center;
`;

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const TituloComentario = styled.h2`
  margin: 2rem 0;
`;

const ContenedorVoto = styled.div`
  margin-top: 5rem;
`;

const TextoVoto = styled.p`
  text-align: center;
`;

const ComentarioUsuario = styled.span`
  font-weight: bold;
`;

const ComentarioMensaje = styled.p`
  border: 1px solid #e1e1e1;
  padding: 2rem;
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //State del componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);
  //Routing para obtener el id actual
  const router = useRouter();
  // context de firebase
  const { fire, usuario } = useContext(FireContext);

  const {
    query: { id },
  } = router;

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const docRef = doc(fire.db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          guardarProducto(docSnap.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
    //eslint-disable-next-line
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";
  //extraer los datos del producto
  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administracion y validacion de los votos

  const votarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    //Verificacion del voto del usuario actual
    if (haVotado.includes(usuario.uid)) return;

    //Obtencion y reucuento de los votos
    const nuevoTotal = votos + 1;

    //Almacenamiento del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //Actualizacion DB
    const productoRef = doc(fire.db, "productos", id);
    await updateDoc(productoRef, {
      votos: nuevoTotal,
      haVotado: nuevoHaVotado,
    });
    //Actualizacion State
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });

    guardarConsultarDB(true); // Hay un voto por lo que consulta la base de datos
  };

  //Funciones para crear comentario
  const comentarioChange = (e) => {
    guardarComentario({ ...comentario, [e.target.name]: e.target.value });
  };

  // Identifica si el comentario el creador del producto
  const esCreador = (id) => {
    return creador.id === id;
  };

  const agregarComentario = async (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("/login");
    }
    //Informacion extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //Copia de los comentarios y carga al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizacion de la BD
    const productoRef = doc(fire.db, "productos", id);
    await updateDoc(productoRef, {
      comentarios: nuevosComentarios,
    });

    //Actualizacion del state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    guardarConsultarDB(true);
  };

  //Funcion que revisa que el creador del producto sea el mismo que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;
    return creador.id === usuario.uid;
  };

  const eliminarProducto = async () => {
    if (!usuario || creador.id !== usuario.uid) {
      return router.push("/login");
    }
    try {
      await deleteDoc(doc(fire.db, "productos", id));
      router.push("/");
    } catch (e) {
      consolo.log(e);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className={styles.contenedor}>
            <Titulo>{nombre}</Titulo>

            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlimagen} alt={nombre} />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}

                <TituloComentario>Comentarios</TituloComentario>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li key={`${comentario.usuarioId}-${i}`}>
                        <ComentarioMensaje>
                          {comentario.mensaje}
                        </ComentarioMensaje>
                        <p>
                          Escrito por:{" "}
                          <ComentarioUsuario>
                            {comentario.usuarioNombre}
                          </ComentarioUsuario>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <ContenedorVoto>
                  <TextoVoto>{votos} Votos</TextoVoto>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </ContenedorVoto>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
