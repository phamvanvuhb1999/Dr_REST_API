const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');

//connect to mongodb
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, { useUnifiedTopology: true }, { useFindAndModify: false });

//mongoose.Promise = global.Promise;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')

const error_handler = require('./error_handlers');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Enable Cross-Origin Resource Sharing for other brower can access REST APT
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin', 'X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/productImages', express.static('uploads/productImages'));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/', (req, res, next) => {
    res.status(200).json({
        message: "API Server is working."
    })
})


app.use(error_handler.throws);
app.use(error_handler.shows);

module.exports = app;