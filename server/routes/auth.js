const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    // validate data
    const {error} = registerValidation().validate(req.body);
    if(error != undefined) {
        res.status(400).send({'message': error.details[0].message});
    } else {

        // validate user
        const emailExists = await User.findOne({email: req.body.email});
        if(emailExists) return res.status(400).send({'message': 'Email exists!'});

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
        try {
            const savedUser = await user.save();
            res.send({
                id: savedUser._id
            });
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

router.post('/login', async (req, res) => {
	// validate data
    const {error} = loginValidation().validate(req.body);
    if(error != undefined) {
        res.status(400).send({'message': error.details[0].message});
    } else {
        // validate user
        const user = await User.findOne({email: req.body.email});
        if(user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(validPassword) {
                // create and assign a token
                const token = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }, process.env.TOKEN_SECRET);
                res.header('access-token', token);
                res.status(200).send();
            } else {
                res.status(400).send({'message': 'Incorrect password!'});
            }
        } else {
            res.status(400).send({'message': 'User does not exist!'});
        }
    }
});

module.exports = router;
