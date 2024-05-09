const mongoose = require('mongoose');

// Para no mostrar mensaje deprecay al iniciar la consola
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/tiendaPociones', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //   useCreateIndex: true
}).then(() => console.log('Conexión exitosa a la base de datos de artículos'))
    .catch(err => console.error('Error al conectar a la base de datos: ', err));

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    nombre: { type: String, required: true, unique: true },
    duracion: { type: Number, required: true },
    arrojadiza: { type: Boolean, default: false },
    imagen: { type: String, required: false }
});

const Prueba = mongoose.model('item', itemSchema);


const Items_api = {
    find: (req, res) => {
        Prueba.find({}, function (err, data) {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else {
                res.status(200).send(data);
            }
        })
    },
    get: (req, res) => {
        Prueba.find({ _id: req.params.id }, function (err, data) {
            if (err) {
                console.error(err);
                res.status(500).send("Error en el servidor");
            } else {
                if (data.length === 0) {
                    console.log("ID no encontrada");
                    res.status(404).send("Objeto no encontrado");
                } else {
                    console.log("Enviando datos con ID: " + req.params.id);
                    res.status(200).json(data);
                }
            }
        });
    },
    filter: (req, res) => {
        const type = parseInt(req.params.type);
        switch (type) {
            case 1:
                Prueba.find({ nombre: req.query.nombre }, function (err, data) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error en el servidor');
                    } else {
                        res.status(200).send(data);
                    }
                });
                break;
            case 2:
                const isArrojadiza = req.query.isArrojadiza;
                if (isArrojadiza === 'true') {
                    Prueba.find({ arrojadiza: true }, function (err, data) {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error en el servidor');
                        } else {
                            res.status(200).send(data);
                        }
                    });
                } else if (isArrojadiza === 'false') {
                    Prueba.find({ arrojadiza: false }, function (err, data) {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error en el servidor');
                        } else {
                            res.status(200).send(data);
                        }
                    });
                } else {
                    Prueba.find({}, function (err, data) {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error en el servidor');
                        } else {
                            res.status(200).send(data);
                        }
                    });
                }
                break;
            case 3:
                const minCantidad = req.query.minCantidad;
                const maxCantidad = req.query.maxCantidad;
                Prueba.find({ cantidad: { $gte: minCantidad, $lte: maxCantidad } }, function (err, data) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error en el servidor');
                    } else {
                        res.status(200).send(data);
                    }
                });
                break;
            case 4:
                const minDuration = req.query.minDuration;
                const maxDuration = req.query.maxDuration;
                Prueba.find({ duracion: { $gte: minDuration, $lte: maxDuration } }, function (err, data) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error en el servidor');
                    } else {
                        res.status(200).send(data);
                    }
                });
                break;
            case 5:
                const minPrecio = req.query.minPrecio;
                const maxPrecio = req.query.maxPrecio;
                Prueba.find({ precio: { $gte: minPrecio, $lte: maxPrecio } }, function (err, data) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error en el servidor');
                    } else {
                        res.status(200).send(data);
                    }
                });
                break;
            default:
                break;
        }
    },
    create: (req, res) => {
        const nuevoDato = new Prueba({
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            nombre: req.body.nombre,
            duracion: req.body.duracion,
            arrojadiza: req.body.arrojadiza,
            imagen: req.body.imagen
        });

        nuevoDato.save(function (err, datoGuardado) {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else {
                console.log('Nuevo dato guardado en la colección');
                res.status(201).json({ message: 'Nuevo dato guardado en la coleccion' });
            }
        });
    },
    delete: (req, res) => {
        Prueba.findOneAndDelete({ _id: req.params.id }, function (err, deletedObj) {
            if (err) {
                console.error(err);
                res.status(500).send('Error al eliminar el objeto');
            } else {
                if (deletedObj) {
                    console.log('Eliminado el objeto con ID: ' + req.params.id);
                    res.status(200).json({ message: 'Objeto eliminado correctamente' });
                } else {
                    console.log('No se encontró ningún objeto con id: ' + req.params.id);
                    res.status(404).json({ message: 'No se encontró ningún objeto con ese id' });
                }
            }
        });
    },
    put: (req, res) => {
        Prueba.findOneAndUpdate({ _id: req.body._id },
            {
                _id: req.body._id,
                nombre: req.body.nombre,
                precio: req.body.precio,
                cantidad: req.body.cantidad,
                arrojadiza: req.body.arrojadiza,
                imagen: req.body.imagen,
                duracion: req.body.duracion

            }, null, function (err, data) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error en el servidor');
                } else if (data) {

                    console.log("Actualizado");
                    res.status(201).json({ message: 'Actualizado con éxito.' });

                } else {
                    res.status(404).send('Id no existente');

                }
            });
    }

}

module.exports = {
    Items_api: Items_api,
    Item: Prueba
}