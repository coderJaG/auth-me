const express = require('express');
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last Name is required'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists()
        .isLength({ min: 4 })
        .withMessage('Username is required with at least 4 characters'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email address'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
]

router.post('/', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    
    //check if user already exists
    const getUser = await User.findOne({
        where: {
            [Op.or]: [{ email: email }, { username: username }],
        },
        attributes: ['email', 'username']
    });

    if (getUser) {
        if (getUser.email === email && getUser.username === username) {
            const err = new Error('User already exiists');
            err.status = 500;
            err.title = 'User already exists';
            err.errors = {
                "email": 'User with that email already exists',
                "username": 'User with that username already exists'
            };
            return next(err);
        } else if (getUser.email === email) {
            const err = new Error('User already exiists');
            err.status = 500;
            err.title = 'User already exists';
            err.errors = { "email": 'User with that email already exists' };
            return next(err);
        }
        else if (getUser.username === username) {
            const err = new Error('User already exiists');
            err.status = 500;
            err.title = 'User already exists';
            err.errors = { "username": 'User with that username already exists' };
            return next(err);
        };
    };
    //create user
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    });

});



module.exports = router;