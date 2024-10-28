import express from "express";
import cors from "cors";
import {
  leerDiscos,
  agregarDisco,
  editarDisco,
  borrarDisco,
  actualizarEstado,
} from "./db.js";

const servidor = express();
servidor.get('/favicon.ico', (peticion, respuesta) => respuesta.status(204).end()); //he añadido esta linea parae ignorar el problema de Favicon

servidor.use(cors());
servidor.use(express.json());

servidor.get("/discos", async (peticion, respuesta) => {
  try {
    let discos = await leerDiscos();
    respuesta.json(discos);
  } catch (error) {
    respuesta.status(500);
    respuesta.json(error);
  }
});

servidor.post("/discos/nueva", async (peticion, respuesta) => {
  try {
    if (peticion.body.disco && peticion.body.disco.trim() != "") {
      let { disco, artista, genero } = peticion.body;

      let id = await agregarDisco(disco, artista, genero);

      return respuesta.json({ id });
    }
  } catch (error) {
    respuesta.status(500);

    respuesta.json({ error: "error en el servidor" });
  }
});

servidor.delete("/discos/borrar/:id", async (peticion, respuesta) => {
  try {
    let { id } = peticion.params;
    let cantidad = await borrarDisco(id);

    respuesta.json({ resultado: cantidad ? "ok" : "ko" });
  } catch (error) {
    respuesta.status(500);

    respuesta.json({ error: "error en el servidor al borrar" });
  }
});

servidor.put("/discos/editar/:id", async (peticion, respuesta) => {
  let { disco, artista, genero } = peticion.body;
  try {
    if (
      peticion.body.disco &&
      peticion.body.disco.trim() != "" &&
      artista &&
      artista.trim() !== "" &&
      genero &&
      genero.trim() !== ""
    ) {
      let cantidad = await editarDisco(
        peticion.params.id,
        disco.trim(),
        artista.trim(),
        genero.trim()
      );

      return respuesta.json({ resultado: cantidad ? "ok" : "ko" });
    }
  } catch (error) {
    respuesta.status(500);

    respuesta.json({ error: "error en el servidor al editar el disco" });
  }
});

servidor.put("/discos/actualizar/estado/:id", async (peticion, respuesta) => {
  try {
    const { favorito } = peticion.body; 
    const discoId = peticion.params.id;

    if (typeof favorito === "boolean") {
      let cantidad = await actualizarEstado(discoId, favorito); 

      return respuesta.json({ resultado: cantidad ? "ok" : "ko" });
    } 
  } catch (error) {
    
    respuesta
      .status(500)
      .json({ error: "error en el servidor al editar el disco" });
  }
});

servidor.listen(4000);
