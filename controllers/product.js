const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Pool } = require('pg');

const db = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

exports.addProduct = async (req, res) => {
    try {
        const authorizationHeader = res.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const { companyid } = decoded;
        const schema = Joi.object({
            name: Joi.string().min(1).required(),
            basePrice: Joi.number().required()
        })
    } catch (err) {
        console.log('addProduct Error');
        console.log(err);
        return res.status(500).json({error: true, message: 'Failed to add Product'});
    }
}
