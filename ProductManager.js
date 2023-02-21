import { promises as fs, existsSync, writeFileSync } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    VerificoExistencia = () => {
 
        !existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    };

    async addProduct(title, description, price, thumbnail, code, stock) {
        const prodObj = { title, description, price, thumbnail, code, stock };

 
        if (Object.values(prodObj).includes("") || Object.values(prodObj).includes(null)) {
            console.log("Complete los campos, no pueden estar vacio");
        } else {
            this.VerificoExistencia();
            try {
          
                const read = await fs.readFile(this.path, "utf-8");
                let data = JSON.parse(read);
      
                if (data.some((elem) => elem.code === prodObj.code)) {
                    throw "Codigo de producto existente, intente otro";
                } else {
                    let newID;
                    !data.length ? (newID = 1) : (newID = data[data.length - 1].id + 1);
               
                    data.push({ ...prodObj, id: newID });
           
                    await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getProducts() {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(read);
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
 

    async getProductById(id) {
        this.VerificoExistencia();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const found = data.find((prod) => prod.id === id);
            if (!found) {
                throw "Id no encontrado";
            } else {
      
                return found;
            } 
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock) {
        this.VerificoExistencia();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            if (data.some((prod) => prod.id === id)) {
                const index = data.findIndex((prod) => prod.id === id);
                data[index].title = title;
                data[index].description = description;
                data[index].price = price;
                data[index].thumbnail = thumbnail;
                data[index].code = code;
                data[index].stock = stock;
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "Id no encontrado";
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProduct(id) {
        this.VerificoExistencia();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const index = data.findIndex((prod) => prod.id === id);
            if (index !== -1) {
                data.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "Id no encontrado";
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default ProductManager;

// prueba

//const Probador = new ProductManager("./database.json");

//Probador.addProduct("Tracker Chevrolet", "Tracker Chevrolet", 500, "Sin imagen", "abc123", 25);
 
//Probador.getProducts();
//Probador.getProductByID(1);
//Probador.deleteProduct(3)
