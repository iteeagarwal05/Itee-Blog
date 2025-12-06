import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(3).max(50),
  bio: Joi.string().max(500),
  avatar: Joi.string().uri().allow(''),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
  dateOfBirth: Joi.date().max('now'),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipCode: Joi.string()
  }),
  socialLinks: Joi.object({
    github: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow(''),
    website: Joi.string().uri().allow(''),
    instagram: Joi.string().uri().allow('')
  })
});