const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const shortid = require('shortid');
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.addbranch = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            console.log(results);
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                res.status(401).json({
                    error: true,
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;
                const email = results[0].email;
                const nickname = results[0].nickname;
                const role = results[0].role;
                const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                }
                res.cookie('usersSave', token, cookieOptions);
                res.status(200).json({
                    error: false,
                    message: 'successful login',
                    token: token,
                    nickname: nickname
                });
            }
        })
    } catch (err) {
        console.log(err);
        console.log('Login handler Error');
        return res.status(501).json(
            {
                message: 'server error for login',
                error: true,
            })
    }
}