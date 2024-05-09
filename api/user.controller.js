const mongoose = require('mongoose');

// Para no mostrar mensaje deprecay al iniciar la consola
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/tiendaPociones', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //   useCreateIndex: true
}).then(() => console.log('Conexión exitosa a la base de datos de usuarios'))
    .catch(err => console.error('Error al conectar a la base de datos: ', err));

const Schema = mongoose.Schema;

const userSchema = new Schema({
    rol: { type: String, required: true, default: 'Cliente' }
});

const Prueba = mongoose.model('user', userSchema);

const Users_api = {
    getUserRole: (req, res) => {
        console.log("Buscando rol del usuario " + req.params.id);
        const userId = req.params.id;
        Prueba.findOne({ _id: userId }, function (err, user) {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else {
                if (user) {
                    res.status(200).send(user);
                } else {
                    res.status(404).send('Usuario no encontrado');
                }
            }
        });
    },
    createUser: (req, res) => {
        console.log("Creando un nuevo usuario");
        const userData = req.body;
        const newUser = new Prueba(userData);
        newUser.save(function (err, user) {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else {
                res.status(201).send(user);
            }
        });
    },
    deleteUser: (req, res) => {
        console.log("Eliminando el usuario con id " + req.params.id);
        const userId = req.params.id;
        Prueba.deleteOne({ _id: userId }, function (err) {
            if (err) {
                console.error(err);
                res.status(200).json({ message: 'Error en el servidor' });
            } else {
                res.status(200).json({ message: 'Usuario eliminado con exito' });
            }
        });
    },
    getUsers: (req, res) => {
        console.log("Obteniendo todos los usuarios");
        Prueba.find({}, function (err, users) {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else {
                res.status(200).send(users);
            }
        });
    },
    listRole: (req, res) => {
        console.log("Buscando todos los usuarios del rol: " + req.params.role);
        const role = req.params.role;
        if (role === 'all') {
          Prueba.find((err, users) => {
            if (err) {
              res.status(500).send({ message: 'Error al buscar usuarios' });
            } else {
              res.status(200).send(users);
            }
          });
        } else {
          Prueba.find({ rol: role }, (err, users) => {
            if (err) {
              res.status(500).send({ message: 'Error al buscar usuarios' });
            } else {
              res.status(200).send(users);
            }
          });
        }
      }
}

module.exports = Users_api;