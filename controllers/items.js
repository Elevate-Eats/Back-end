const Joi = require('joi');

// Import function helpers
const { selectItems } = require('../db/func/item/selectItems');
const { insertItems } = require('../db/func/item/insertItems');
const { updateItems } = require('../db/func/item/updateItems');
const { deleteItems } = require('../db/func/item/deleteItems');

// Show All Items for a Transaction
exports.showItems = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      transactionId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const { transactionId } = value;
    // Read from DB
    const itemData = await selectItems(transactionId);
    // Not Found
    if (itemData.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Item Data Fetch: No Data Found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Item Data Fetch: Succeed',
      itemData,
    });
  } catch (err) {
    // Server Error
    console.error('Show All Items Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show All Items',
    });
  }
};

// Add New Items
exports.addItems = async (req, res) => {
  try {
    // Validation
    const schema = Joi.array().items(Joi.object({
      count: Joi.number().min(1).required(),
      menuId: Joi.number().min(1).required(),
      pricingCategory: Joi.string().required(),
      transactionId: Joi.number().min(1).required(),
      price: Joi.number().min(1).required(),
      totalPrice: Joi.number().min(1).required(),
      category: Joi.string().required(),
    })).min(1).required();

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Insert to DB
    await insertItems(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Create Item: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Add Items Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Add Items',
    });
  }
};

// Delete Items
exports.deleteItems = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      itemIds: Joi.array().items(Joi.number()).required(),
    });
    console.log('schema', req.body);
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Delete on DB
    await deleteItems(value.itemIds);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete Item: Succeed',
    });
  } catch (err) {
    console.error('Delete Items Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Items',
    });
  }
};

// Update Items
exports.updateItems = async (req, res) => {
  try {
    // Validation
    const schema = Joi.array().items(Joi.object({
      id: Joi.number().min(1).required(),
      count: Joi.number().min(1).required(),
      pricingcategory: Joi.string().required(),
      price: Joi.number().min(1).required(),
      totalPrice: Joi.number().min(1).required(),
    })).min(1).required();

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Update on DB
    await updateItems(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Update Items: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Update Items Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Items',
    });
  }
};
