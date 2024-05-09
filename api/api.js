const express = require("express");

const item_controller = require("./items.controller");
const items_api = item_controller.Items_api;
const users_api = require("./user.controller");
const purchases_api = require("./purchases.controller");

const items_app = express();
const users_app = express();
const purchases_app = express();

const items_port = 3000;
const users_port = 3010;
const purchases_port = 3020;

const cors = require('cors');
const Purchases_api = require("./purchases.controller");

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

users_app.use(cors());
users_app.use(express.json());

users_app.get("/:id", users_api.getUserRole);
users_app.post("/", users_api.createUser);
users_app.delete("/:id", users_api.deleteUser);
users_app.get("/", users_api.getUsers);
users_app.get("/list/:role", users_api.listRole);

users_app.listen(users_port, () => {
    console.log("Arrancando la aplicacion de usuarios en el puerto " + users_port);
});

purchases_app.use(cors());
purchases_app.use(express.json());

purchases_app.get("/", purchases_api.getAllItems);
purchases_app.get("/:id", purchases_api.getItemById);
purchases_app.get("/filter/:type", purchases_api.filterItems);
purchases_app.post("/", purchases_api.compra);
purchases_app.get("/compra/:id", purchases_api.getCompras);
purchases_app.put("/:id", purchases_api.updateCompra);
purchases_app.delete("/:id", purchases_api.borrarCompra);

purchases_app.listen(purchases_port, () => {
    console.log("Arrancando la aplicacion de compras en el puerto " + purchases_port);
});