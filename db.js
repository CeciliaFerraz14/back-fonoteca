import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

function conectar() {
  return postgres({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

export function leerDiscos() {
  return new Promise(async (ok, ko) => {
    const conexion = conectar();

    try {
      let discos = await conexion`SELECT * FROM discos ORDER BY id ASC`;
      conexion.end();
      ok(discos);
    } catch (error) {
      ko({ error: "error en BBDD" });
    }
  });
}

export function agregarDisco(nombre, artista, genero) {
  return new Promise(async (ok, ko) => {
    const conexion = conectar();

    try {
      let [{ id }] =
        await conexion`INSERT INTO discos (nombre, artista, genero, favorito) VALUES (${nombre}, ${artista}, ${genero}, false) RETURNING id`;
      conexion.end();
      ok(id);
    } catch (error) {
      ko({ error: "error en BBDD" });
    }
  });
}

export function borrarDisco(id) {
  return new Promise(async (ok, ko) => {
    try {
      let conexion = await conectar();

      let resultado = await conexion`DELETE FROM discos WHERE id= ${id} `;

      conexion.end();

      ok(resultado);
    } catch (error) {
      ko({ error: "error en bbdd " });
    }
  });
}

export function editarDisco(id, nombre, artista, genero) {
  return new Promise(async (ok, ko) => {
    try {
      let conexion = await conectar();

      let resultado =
        await conexion`UPDATE discos SET nombre = ${nombre}, artista= ${artista}, genero = ${genero} WHERE id=${id}`;

      conexion.end();

      ok(resultado);
    } catch (error) {
      ko({ error: "error en bbdd " });
    }
  });
}

export function actualizarEstado(id, nuevoFavorito) {
  return new Promise(async (ok, ko) => {
    try {
      let conexion = await conectar();

      let resultado =
        await conexion`UPDATE discos SET favorito = ${nuevoFavorito} WHERE id = ${id}`;

      conexion.end();

      ok(resultado);
    } catch (error) {
      ko({ error: "error en bbdd " });
    }
  });
}
