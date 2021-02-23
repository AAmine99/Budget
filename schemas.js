const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.categorySchema = Joi.object({
    category: Joi.object({
        name: Joi.string()
            .pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,15}$/)
            .trim()
            .required(),
    }).required()
})

module.exports.expenseSchema = Joi.object({
    expense: Joi.object({
        name: Joi.string()
            .pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,15}$/)
            .required(),
        category: Joi.string()
            .max(24)
            .required(),
        amount: Joi.number()
            .min(0)
            .max(1000000)
            .required(),
        date: Joi.date()
            .required(),
    }).required()
})
module.exports.registerSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,15}$/)
        .required(),
    password: Joi.string()
        .pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/)
        .required(),
    income: Joi.number()
        .min(0)
        .max(1000000)
        .required()
})

module.exports.loginSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,15}$/)
        .required(),
    password: Joi.string()
        .pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/)
        .required(),
})

module.exports.incomeSchema = Joi.object({
    income: Joi.object({
        amount: Joi.number()
            .min(0)
            .max(1000000)
            .required(),
        month: Joi.number()
            .min(0)
            .max(12)
            .required(),
    }).required()
})

