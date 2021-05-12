const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');

///////////////////////////////

const uri = process.env.MONGO_URL || "mongodb://localhost/express-demo";
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

//////////////////////////////
//connect to mongodb
// mongoose.connect(uri, { useNewUrlParser: true }, { useUnifiedTopology: true }, { useFindAndModify: false });

//mongoose.Promise = global.Promise;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')

const commentRoutes = require('./api/routes/comments');
const conversationRoutes = require('./api/routes/conversations');
const postRoutes = require('./api/routes/posts');
const profileRoutes = require('./api/routes/profiles');

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
app.use('/comments', express.static('uploads/comments'));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);
app.use('/conversations', conversationRoutes);
app.use('/posts', postRoutes);
app.use('/profiles', profileRoutes);
app.use('/', (req, res, next) => {
    res.status(200).json({
        message: "API Server is working."
    })
})


app.use(error_handler.throws);
app.use(error_handler.shows);

module.exports = app;