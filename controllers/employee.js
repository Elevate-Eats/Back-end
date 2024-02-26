const express = require('express');
const Joi = require('joi');
const { Pool } = require('pg');
const jwt =require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const shortid = require('shortid');
const db = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

exports.showAllEmployee = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const { companyid } = decoded; // Assuming companyId is directly available in the decoded object
        const { search, limit, Employee } = req.query;
        db.query('SELECT * FROM employees WHERE companyId = $1', [companyid], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: true, message: 'Failed to fetch employee data' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ error: true, message: 'employee not found' });
            }
            let employeeData = results.rows.map((employee) => {
                const {
                    id, name, salary, bonus, EmployeeId
                } = employee;
                return {
                    id, name, salary, bonus, EmployeeId
                };
            });
            if (search) {
                employeeData = employeeData.filter((employee) => employee.name.toLowerCase().startsWith(
                    search.toLowerCase(),
                ));
            }
            if (limit) {
                employeeData = employeeData.slice(0, Number(limit));
            }
            if (Employee) {
                employeeData = employeeData.filter((employee) => employee.EmployeeId === Employee)
            }
            return res.status(200).json({
                error: false,
                message: 'employee data retrieved successfully',
                employeeData,
            });
        });
    } catch (err) {
        console.log('showEmployee Error:');
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to retrieve employee data' });
    }
    return console.log('showEmployee controller executed');
};

exports.createEmployee = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const { companyid } = decoded; // Assuming companyId is directly available in the decoded object
        const schema = Joi.object({
            name: Joi.string().min(1).required(),
            salary: Joi.number().required(),
            bonus: Joi.number().required(),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                error: true,
                message: 'Validation error',
                details: error.details.map((x) => x.message),
            });
        }
        const {
            name, salary, bonus
        } = value;
        db.query('INSERT INTO employees (name, salary, bonus, companyId) VALUES ($1,$2,$3,$4)', [name, salary, bonus, companyid], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: true,
                    message: 'failed to add Employee',
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Employee added',
            });
        });
    } catch (err) {
        console.log('addEmployee Error:');
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed addEmployee' });
    }
    return console.log('createEmployee controller executed');
}
exports.showSingleEmployee= (req,res)=>{
    try {
        const { id } = req.body;
        db.query('SELECT * FROM employees WHERE id = $1', [id], (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: true, message: 'Failed to fetch employee data' });
          }
    
          if (results.rows.length === 0) {
            return res.status(404).json({ error: true, message: 'employee not found' });
          }
    
          const {
            name, address, manager,
          } = results.rows[0];
          const employeeData = {
            id, name, address, manager,
          };
    
          return res.status(200).json({
            error: false,
            message: 'employee data retrieved successfully',
            employeeData,
          });
        });
      } catch (err) {
        console.log('showSingleEmployee Error:');
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to retrieve Employee data' });
      }
      return console.log('showSingleEmployee controller executed');
}

exports.updateEmployee = async (req, res) => {
    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().min(1).required(),
        salary: Joi.number().required(),
        bonus: Joi.number().required(),
        branchId: Joi.number()
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            error: true,
            message: 'Validation error',
            details: error.details.map((x) => x.message),
        });
    }
    const {
        id, name, salary, bonus, branchId
    } = value;
    db.query('UPDATE employees SET name = $2, salary = $3, bonus = $4, branchId= $5 WHERE id=$1', [id, name, salary, bonus, branchId], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'failed to update Employee',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Employee updated',
      });
    });
    return console.log('updateEmployee controller executed');
  };
  
exports.deleteEmployee = async (req, res) => {
    try {
      const { employeeId } = req.body;
      db.query('DELETE FROM employees WHERE id = $1 ', [employeeId], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: true,
            message: 'failed to delete Employee',
          });
        }
        return res.status(200).json({
          error: false,
          message: 'Employee deleted',
        });
      });
    } catch (err) {
      console.log('deleteEmployee Error:');
      console.log(err);
      return res.status(500).json({ error: true, message: 'Failed addBranch' });
    }
    return console.log('deleteEmployee controller executed');
  };
  