const Joi = require('joi');

exports.addTransaction = async () => {
  try {
    const schema = Joi.object({
      transactiondate: Joi.string().required(),
      discount: Joi.number().required(),
      status: Joi.number().required(),
      paymentmethod: Joi.number().required(),
    });
    console.log(schema);
  } catch (err) {
    console.log(err);
  }
};
