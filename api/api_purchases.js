const express = require("express");

const purchases_api = require("./purchases.controller");

const purchases_app = express();

const purchases_port = 3020;

const cors = require('cors');

purchases_app.use(cors());
purchases_app.use(express.json());

purchases_app.get("/", purchases_api.getAllItems);
purchases_app.get("/:id", purchases_api.getItemById);
purchases_app.get("/filter/:type", purchases_api.filterItems);
purchases_app.post("/", purchases_api.compra);
purchases_app.get("/compra/:type", purchases_api.getCompras);
purchases_app.put("/", purchases_api.updateCompra);
purchases_app.delete("/:id", purchases_api.borrarCompra);

purchases_app.listen(purchases_port, () => {
    console.log("Arrancando la aplicacion de compras en el puerto " + purchases_port);
});