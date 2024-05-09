const express = require("express");

const item_controller = require("./items.controller");
const items_api = item_controller.Items_api;

const items_app = express();

const items_port = 3000;

const cors = require('cors');

items_app.use(cors());
items_app.use(express.json());

items_app.get("/", items_api.find);
items_app.get("/:id", items_api.get);
items_app.post("/", items_api.create);
items_app.put("/", items_api.put);
items_app.delete("/:id", items_api.delete);
items_app.get("/filter/:type", items_api.filter);

items_app.listen(items_port, () => {
    console.log("Arrancando la aplicacion de artículos en el puerto " + items_port);
});