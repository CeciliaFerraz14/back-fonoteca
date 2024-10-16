import express from "express";
import cors from "cors";
import { leerDiscos, agregarDisco, editarDisco,  borrarDisco, actualizarEstado} from "./db.js";

const servidor = express();

servidor.use(cors());
servidor.use(express.json());


servidor.get("/discos", async(peticion,respuesta)=>{

    try{
        let discos = await leerDiscos();
        respuesta.json(discos);
    }catch (error){
        respuesta.status(500);
        respuesta.json(error);
    };

});

servidor.post("/discos/nueva", async(peticion,respuesta)=>{
    try{
        
        if(peticion.body.disco && peticion.body.disco.trim() != ""){
            let {disco} = peticion.body;

            let id = await agregarDisco(disco);

            return respuesta.json({id});

        }

    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });

    }
});

servidor.delete("/discos/borrar/:id",async(peticion,respuesta)=>{
    try{
        let{id} = peticion.params;
        let cantidad = await borrarDisco(id);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });

    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor al borrar" });

    }
});

servidor.put("/discos/editar/:id",async(peticion,respuesta)=>{
    try{
        if(peticion.body.disco && peticion.body.disco.trim() != ""){
        let {disco} = peticion.body;

        let cantidad = await editarDisco(peticion.params.id,disco);

        return respuesta.json({ resultado : cantidad ? "ok" : "ko" });

    }

}catch(error){

    respuesta.status(500);

    respuesta.json({ error : "error en el servidor al editar el disco" });

}
});

servidor.put("/discos/actualizar/estado/:id",async(peticion,respuesta)=>{
    try {
        const { favorito } = peticion.body; // Cambiamos para obtener el estado favorito
        const discoId = peticion.params.id;

        // Verificamos si se ha enviado el estado de favorito
        if (typeof favorito === 'boolean') {
            let cantidad = await actualizarEstado(discoId, favorito); // Se asume que editarDisco ahora maneja el estado de favorito

            return respuesta.json({ resultado: cantidad ? "ok" : "ko" });
        } else {
            return respuesta.status(400).json({ error: "El estado de favorito debe ser un booleano" });
        }
    } catch (error) {
        console.error(error); // Agregar logs para depuración
        respuesta.status(500).json({ error: "error en el servidor al editar el disco" });
    }
});
        















servidor.listen(4000);