const express = require(`express`);

const fs = require(`fs`);

const app = express();

const port = 8080;

const server = app.listen(port, () => {
    console.log(`Servidor escuchando el puerto: ${port}`);
});

server.on("error", error => console.log(`Error en el servidor: ${error}`));

app.get(`/productos`, async (req, res) => {
    let productos = await container.getAll();
    res.send(productos);
})

app.get(`/productosRandom`, async (req, res) => {
    let productos = await container.getAll();
    let randomNum = Math.floor(Math.random() * productos.length);
    res.send(productos[randomNum]);
})

class Contenedor{
    constructor(fileName){
        this.fileName = fileName;
    }

    async save(obj){
        try{
            let contenido = await fs.promises.readFile(this.fileName, `utf-8`)
            let data = JSON.parse(contenido);
            obj = {...obj, id: 1};
            if(data != `` && data != `[]`){
                data.push(obj);
                await fs.promises.writeFile(this.fileName, JSON.stringify(data));
            } else {
                let array = [];
                array.push(obj);
                await fs.promises.writeFile(this.fileName, JSON.stringify(array));
            }
        }
        catch (error){
            console.log(`Hubo un error ${error}`);
        }
    }

    async getByID(id){
        try {
            let contenido = await fs.promises.readFile(this.fileName, `utf-8`);
            let array = JSON.parse(contenido);
            if(array.find((element) => {element.id == id}) !== undefined){
                return array.find((element) => {element.id == id});
            } else {
                console.log(`No se encontró un elemento con id ${id}`);
            }
        }
        catch (error){
            console.log(`Hubo un error: ${error}`);
        }
    }

    async getAll(){
        try {
            let contenido = await fs.promises.readFile(this.fileName, `utf-8`)
            return JSON.parse(contenido);
        }
        catch (error){
            console.log(`Hubo un error: ${error}`);
        }
    }

    async deleteByID(id){
        try{
            let contenido = await fs.promises.readFile(this.fileName, `utf-8`)
            let data = JSON.parse(contenido);
            let filtrado = data.filter((el) => el.id !== id);
            await fs.promises.writeFile(this.fileName, filtrado);
            return `El item con id ${id} ha sido eliminado.`;
        }
        catch (error){
            console.log(`Hubo un error: ${error}`);
        }

    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.fileName, `[]`);
            return `Se borraron todos los items.`;
        }
        catch (error){
            console.log(`Hubo un error: ${error}`);
        }
    }
}

let container = new Contenedor("./productos.txt");