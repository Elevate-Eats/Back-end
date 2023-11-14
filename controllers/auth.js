const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const shortid = require('shortid');
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.login = async (req, res)=>{
    try {
        console.log(req.body.email);
        console.log(req.body.password);
        const {email,password}=req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^.{8,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'true', message: 'invalid email format' });
        };
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'true', message: 'invalid password format' });
        };
        if (!email || !password) {
            return res.status(400).json({ status: 'invalid input' });
        }
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results)=>{
            console.log(results);
            if (!results || !await bcrypt.compare(password, results[0].password)){
                res.status(401).json({
                    error: true,
                    message: 'Email or Password is incorrect'
                })
            } else  {
                const id = results[0].id;
                const email = results[0].email;
                const nickname = results[0].nickname;
                const role = results[0].role;
                const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                }
                res.cookie('userSave', token, cookieOptions);
                res.status(200).json({
                    error: false,
                    message: 'successful login',
                    token: token,
                    nickname : nickname
                });
            }
        })
    } catch (err) {
        console.log(err);
        console.log('Login handler Error');
        return res.status(501).json(
            {message : 'server error for login',
            error : true,
        })
    }
}
exports.register = (req, res) => {
    try {
        console.log(req.body);
        const apikey=req.headers.apikey;
        const { name, nickname, email, password, passwordConfirm } = req.body;
        if(apikey!=process.env.API_KEY){
            return res.status(400).json({ error: 'true', message: 'API_KEY Invalid' });
        }
        console.log(req.body.name); 
        console.log(req.body.nickname);
        console.log(req.body.email);
        console.log(req.body.password);
        console.log(req.body.passwordConfirm);

        const passwordConfirmRegex = /^.{8,}$/;
        const nameRegex = /^.{1,}$/;
        const nicknameRegex = /^.{1,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const roleRegex = /^[1-3]$/;
        const passwordRegex = /^.{8,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'true', message: 'invalid email format' });
        };
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'true', message: 'invalid password format' });
        };
        if (!nameRegex.test(name)) {
            return res.status(400).json({ error: 'true', message: 'invalid name format' });
        };
        if (!roleRegex.test(name)) {
            return res.status(400).json({ error: 'true', message: 'invalid name format' });
        };
        if (!passwordConfirmRegex.test(passwordConfirm)) {
            return res.status(400).json({ error: 'true', message: 'invalid passwordConfirm format' });
        };
    if (!nicknameRegex.test(nickname)) {
        return res.status(400).json({ error:'true', message: 'invalid nickname format' });
    };

        db.query('SELECT email from user WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.log(err);
            } else {
                if (results.length > 0) {
                    return res.status(503).json({
                        error: true,
                        message: 'email already used'
                    })
                } else if (password != passwordConfirm) {
                    return res.status(504).json({
                        error: true,
                        message: 'password do not match'
                    })
                }
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO user SET ?', { name: name, email: email, password: hashedPassword, nickname: nickname }, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.status(200).json({
                        error: false,
                        message: 'account registered'
                    });
                }
            })
        })
        // res.send("Form submitted");
    } catch (err) {
        console.log(err);
        console.log('Register handler Error')
    return res.status(501).json(
            {message : 'server error for register',
            error : true,
        })
    }
}

