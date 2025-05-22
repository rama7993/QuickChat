const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email":
        "Please enter a valid email address in the format 'example@domain.com'.",
      "any.required": "Email is required.",
    }),
  // password: Joi.string()
  //   .min(8)
  //   .pattern(/[0-9]/, "number")
  //   .pattern(/[!@#$%^&*(),.?":{}|<>]/, "symbol")
  //   .required()
  //   .messages({
  //     "string.min": "Password must be at least 8 characters long.",
  //     "string.pattern.name": "Password must include at least one {#name}.",
  //     "any.required": "Password is required.",
  //   }),
}).unknown(true); //to allow other keys like firstName, lastName, etc.

const validateUser = (req) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Combine all error messages into one string
    throw new Error(error.details.map((d) => d.message).join(", "));
  }
};

module.exports = { validateUser };
