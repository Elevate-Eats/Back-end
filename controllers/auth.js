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

exports.login = async (req, res) => {
    try {
        console.log(req.body.email);
        console.log(req.body.password);
        const apikey = req.headers.apikey;
        if (apikey != process.env.API_KEY) {
            return res.status(400).json({ error: 'true', message: 'API_KEY Invalid' });
        }
        const { email, password } = req.body;
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
exports.register = (req, res) => {
    try {
        console.log(req.body);
        const apikey = req.headers.apikey;
        const { company, name, nickname, role, email, password, passwordConfirm } = req.body;
        if (apikey != process.env.API_KEY) {
            return res.status(400).json({ error: 'true', message: 'API_KEY Invalid' });
        }
        console.log(req.body.company);
        console.log(req.body.name);
        console.log(req.body.nickname);
        console.log(req.body.email);
        console.log(req.body.password);
        console.log(req.body.passwordConfirm);
        console.log(req.body.role);

        const passwordConfirmRegex = /^.{8,}$/;
        const nameRegex = /.+/;
        const nicknameRegex = /^.{1,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const roleRegex = /^(general_manager|area_manager|store_manager)$/;
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
        if (!roleRegex.test(role)) {
            return res.status(400).json({ error: 'true', message: 'invalid role format' });
        };
        if (!passwordConfirmRegex.test(passwordConfirm)) {
            return res.status(400).json({ error: 'true', message: 'invalid passwordConfirm format' });
        };
        if (!nicknameRegex.test(nickname)) {
            return res.status(400).json({ error: 'true', message: 'invalid nickname format' });
        };
        //Pelajarin lagi ini, kalau misal company di awal mah bisa, tapi ribet kalo udah cuma bisa via gm yang daftar

        db.query('SELECT name from companies WHERE name= ?', [company], async (err, results) => {
            if (err) {
                console.log(err);
            } else {
                if (results.length > 0) {
                    return res.status(503).json({
                        error: true,
                        message: 'company name already used'
                    })
                }
            }
            db.query('INSERT INTO companies SET ?', { name: company }, async (err, results) => {
                if (err) {
                    console.log(err);
                }

                db.query('SELECT id FROM companies WHERE name = ?', [company], async (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: true, message: 'Server error' });
                    }

                    if (results.length === 0) {
                        // Company not found
                        return res.status(404).json({ error: true, message: 'Company not found' });
                    }
                    const companyId = results[0].id;
                    db.query('SELECT email from users WHERE email = ?', [email], async (err, results) => {
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
                        const branch_access_test = '{all}';
                        db.query('INSERT INTO users SET ?', { name: name, email: email, branch_access: branch_access_test, password: hashedPassword, nickname: nickname, company_id: companyId, role: role }, (err, results) => {
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
                })
            })
        })
        // res.send("Form submitted");
    } catch (err) {
        console.log(err);
        console.log('Register handler Error')
        return res.status(501).json(
            {
                message: 'server error for register',
                error: true,
            })
    }
}
exports.logout = (req, res) => {
    res.cookie('usersSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        message: 'account logout'
    });
}

