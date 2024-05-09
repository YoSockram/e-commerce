const express = require("express");

const users_api = require("./user.controller");

const users_app = express();

const users_port = 3010;

const cors = require('cors');

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