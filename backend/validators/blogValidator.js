import Joi from "joi";

export const createBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).required()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  content: Joi.string().min(20).required()
    .messages({
      'string.min': 'Content must be at least 20 characters long'
    }),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional()
    .messages({
      'array.max': 'Cannot add more than 10 tags',
      'string.max': 'Each tag cannot exceed 30 characters'
    }),
  coverImage: Joi.string().uri().optional().allow("")
    .messages({
      'string.uri': 'Cover image must be a valid URL'
    }),
  isPublished: Joi.boolean().optional()
});

export const updateBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200)
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  content: Joi.string().min(20)
    .messages({
      'string.min': 'Content must be at least 20 characters long'
    }),
  tags: Joi.array().items(Joi.string().max(30)).max(10)
    .messages({
      'array.max': 'Cannot add more than 10 tags',
      'string.max': 'Each tag cannot exceed 30 characters'
    }),
  coverImage: Joi.string().uri().allow("")
    .messages({
      'string.uri': 'Cover image must be a valid URL'
    }),
  isPublished: Joi.boolean()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const togglePublishSchema = Joi.object({
  isPublished: Joi.boolean().required()
    .messages({
      'boolean.base': 'isPublished must be a boolean value'
    })
});
