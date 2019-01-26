const Joi = require('joi');

const inputSchema = Joi.object().keys({
	docs: Joi.array().items(Joi.object()).required(),
	options: Joi.object().keys({
		sheetName: Joi.string(),
		rowName: Joi.string(),
		properties: Joi.string(),
		a1Field: [Joi.string(), Joi.number()],
		sort: Joi.boolean(),
		removeBase: Joi.boolean()
	}).optional(),
	auth: Joi.object().keys({
		creds: Joi.object().required(),
		docKey: Joi.string().required()
	}).required(),
}).required();

exports.validate = o => Joi.validate(o, inputSchema);