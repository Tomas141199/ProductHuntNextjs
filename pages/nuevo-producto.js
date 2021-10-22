import React, { useState, useContext } from "react";
import Layout from "../components/layouts/Layout";
import Router, { useRouter } from "next/Router";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import { FireContext } from "../firebase";
//Firebase storage
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import Error404 from "../components/layouts/404";

const NuevoProducto = () => {
  //State de las imagenes
  const [urlimagen, guardarUrlImagen] = useState("");
  //State de los errores
  const [error, guardarError] = useState(false);

  //Context de firebase
  const { fire, usuario } = useContext(FireContext);

  // hook de routing para redireccionar
  const router = useRouter();

  const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    imagen: "",
    url: "",
    descripcion: "",
  };

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  async function crearProducto() {
    //Si el usuario no esta autenticado
    if (!usuario) {
      return router.push("/login");
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado: [],
    };

    //Insercion en la base de datos
    fire.addProducto(producto);

    //Redireccionar al usuario
    return router.push("/");
  }

  async function onChangedImage(event) {
    //Carga de la imagen al almacenamiento de firebase
    //url de descarga de la imagen
    const file = event.target.files[0];
    const storage = getStorage();
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/*",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "productos/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          guardarUrlImagen(downloadURL);
        });
      }
    );
  }

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1 className="text-align-center">Nuevo Producto</h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General </legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre Empresa o Compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    id="imagen"
                    name="imagen"
                    type="file"
                    onChange={(event) => onChangedImage(event)}
                    accept="image/*"
                  />
                </Campo>
                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL de tu producto"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error} </Error>}

              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
