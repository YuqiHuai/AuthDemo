const express = require('express')
const app = express()
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const auth = require('./routes/verifyToken');
const port = 3000

let dbStatus = false;

//Connect to DB
mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true},
    (err) => {
        if(err) {
            dbStatus = false;
        } else {
            dbStatus = true;
            app.use('/v1/user', authRoute);
        }
    }
);

app.use(express.json());


//Route Middlewares

app.get('/health', (req, res) => {
    res.send(
        {
            status: true,
            db: dbStatus
        }
    );
});


app.get('/v1/verify', auth, (req, res) => {
    res.send(
        {
            message: 'verified',
            user: req.user
        }
    );
});


app.listen(port, () => console.log(`auth app listening on port ${port}!`))