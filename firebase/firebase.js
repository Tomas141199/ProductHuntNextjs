import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

class Fire {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
  }

  //Registrar a un usuario
  async registrar(nombre, email, password) {
    const auth = getAuth();
    //Creacion del usuario en firebase
    const nuevoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    //Actualizacion del nombre del usuario
    updateProfile(auth.currentUser, { displayName: nombre })
      .then(() => {
        console.log("Perfil acutualizado");
        console.log(nuevoUsuario);
        return nuevoUsuario;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Inicia sesion del usuario
  async login(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //Cierra la sesion del usuario
  async cerrarSesion() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("cerraste sesion");
      })
      .catch((error) => {
        console.log("no cerraste sesion");
      });
  }

  async addProducto(producto) {
    const db = getFirestore();
    try {
      const docRef = await addDoc(collection(db, "productos"), producto);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

const fire = new Fire();
export default fire;
