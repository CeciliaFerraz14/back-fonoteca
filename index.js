import express from "express";
import cors from "cors";
import { leerDiscos, agregarDisco, editarDisco, estadoDisco, borrarDisco} from "./db.js";

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











servidor.listen(4000);