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

const purchaseSchema = new Schema({
    id_item: { type: Schema.Types.ObjectId, ref: 'Item' },
    id_user: { type: Schema.Types.ObjectId, ref: 'user' },
    nombre_item: { type: String, required: true },
    nombre_client: { type: String, required: true },
    cantidad: { type: Number, required: true },
    direccion: { type: String, required: true }
});

const itemSchema = new Schema({
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    nombre: { type: String, required: true, unique: true },
    duracion: { type: Number, required: true },
    arrojadiza: { type: Boolean, default: false },
    imagen: { type: String, required: false }
});

const Prueba = mongoose.model('purchase', purchaseSchema);
const items_controller = require('./items.controller');
const Items = items_controller.Item;

const Purchases_api = {
    getAllItems: (req, res) => {
        console.log("Buscando todos los objetos de la tienda");
        Items.find({}, function (err, data) {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else {
                res.status(200).send(data);
            }
        })
    },
    getItemById: (req, res) => {
        console.log("Buscando el objeto con id " + req.params.id);
        Items.find({ _id: req.params.id }, function (err, data) {
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
    filterItems: (req, res) => {
        console.log("Buscando objetos de la tienda mediante un filtro");
        const type = parseInt(req.params.type);
        switch (type) {
            case 1:
                Items.find({ nombre: req.query.nombre }, function (err, data) {
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
                    Items.find({ arrojadiza: true }, function (err, data) {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error en el servidor');
                        } else {
                            res.status(200).send(data);
                        }
                    });
                } else if (isArrojadiza === 'false') {
                    Items.find({ arrojadiza: false }, function (err, data) {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error en el servidor');
                        } else {
                            res.status(200).send(data);
                        }
                    });
                } else {
                    Items.find({}, function (err, data) {
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
                Items.find({ cantidad: { $gte: minCantidad, $lte: maxCantidad } }, function (err, data) {
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
                Items.find({ duracion: { $gte: minDuration, $lte: maxDuration } }, function (err, data) {
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
                Items.find({ precio: { $gte: minPrecio, $lte: maxPrecio } }, function (err, data) {
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
    compra: (req, res) => {
        const purchase = new Prueba({
            id_item: req.body.id_item,
            id_user: req.body.id_user,
            nombre_item: req.body.nombre_item,
            nombre_client: req.body.nombre_comprador,
            cantidad: req.body.cantidad,
            direccion: req.body.direccion
        });
        purchase.save((err, purchase) => {
            if (err) {
                res.status(500).send({ message: 'Error al guardar la compra' });
            } else {
                res.status(200).send({ message: 'Compra registrada correctamente', purchaseId: purchase._id });
            }
        });
    },
    getCompras: (req, res) => {
        console.log("Buscando compras con el filtro " + req.params.type);
        const type = parseInt(req.params.type);

        switch (type) {
            case 1:
                console.log("Valor id_cliente " + req.query.id_cliente);
                Prueba.aggregate([
                    { $match: { id_user: mongoose.Types.ObjectId(req.query.id_cliente) } },
                    {
                        $lookup: {
                            from: 'items',
                            localField: 'id_item',
                            foreignField: '_id',
                            as: 'item'
                        }
                    }
                ]).exec((err, purchases) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al obtener las compras' });
                    } else {
                        res.status(200).send({ message: 'Compras obtenidas correctamente', purchases });
                    }
                });
                break;

            case 2:
                Prueba.aggregate([
                    {
                        $match: {
                            nombre_client: req.query.nombre_cliente,
                            id_user: mongoose.Types.ObjectId(req.query.id_cliente)
                        }
                    },
                    {
                        $lookup: {
                            from: 'items',
                            localField: 'id_item',
                            foreignField: '_id',
                            as: 'item'
                        }
                    }
                ]).exec((err, purchases) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al obtener las compras' });
                    } else {
                        res.status(200).send({ message: 'Compras obtenidas correctamente', purchases });
                    }
                });
                break;

            case 3:
                let cantidad_minima = parseInt(req.query.cantidad_minima);
                let cantidad_maxima = parseInt(req.query.cantidad_maxima);
                Prueba.aggregate([
                    { $match: { id_user: mongoose.Types.ObjectId(req.query.id_cliente), cantidad: { $gte: cantidad_minima, $lte: cantidad_maxima } } },
                    {
                        $lookup: {
                            from: 'items',
                            localField: 'id_item',
                            foreignField: '_id',
                            as: 'item'
                        }
                    }
                ]).exec((err, purchases) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al obtener las compras' });
                    } else {
                        res.status(200).send({ message: 'Compras obtenidas correctamente', purchases });
                    }
                });
                break;

            case 4:

                break;


            default:
                break;
        }


    },
    getComprasByIdAndCantidad: (req, res) => {
        console.log("Buscando todas las compras del usuario con ID " + req.params.id + " y cantidad mayor a 5");
        const id_usuario = req.params.id;

    },
    updateCompra: (req, res) => {
        console.log("Actualizando una compra")
        Prueba.findOneAndUpdate({ _id: req.body._id },
            {
                _id: req.body._id,
                id_item: req.body.id_item,
                id_user: req.body.id_user,
                nombre_item: req.body.nombre_item,
                nombre_client: req.body.nombre_client,
                cantidad: req.body.cantidad,
                direccion: req.body.direccion

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
    },
    borrarCompra: (req, res) => {
        Prueba.findOneAndDelete({ _id: req.params.id }, function (err, deletedObj) {
            if (err) {
                console.error(err);
                res.status(500).send('Error al eliminar la compra');
            } else {
                if (deletedObj) {
                    console.log('Eliminado la compra con ID: ' + req.params.id);
                    res.status(200).json({ message: 'Compra eliminado correctamente' });
                } else {
                    console.log('No se encontró ninguna compra con id: ' + req.params.id);
                    res.status(404).json({ message: 'No se encontró ninguna compra con ese id' });
                }
            }
        });
    }
}

module.exports = Purchases_api;

/*
const Purchase = mongoose.model('Purchase');
Purchase.aggregate([
    {
        $lookup: {
            from: 'items', // nombre de la colección de artículos
            localField: 'id_item',
            foreignField: '_id',
            as: 'item'
        }
    }
]).exec((err, purchases) => {
    if (err) {
        // manejar el error
    } else {
        // hacer algo con las compras
        console.log(purchases);
    }
});
*/