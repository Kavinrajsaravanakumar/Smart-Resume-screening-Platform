import Joi from 'joi';

export const candidateQuerySchema = Joi.object({
  search: Joi.string().trim().max(100),
  skills: Joi.string().trim().max(500),
  education: Joi.string().trim().max(100),
  minExperience: Joi.number().integer().min(0).max(60),
  minScore: Joi.number().integer().min(0).max(100),
  limit: Joi.number().integer().min(1).max(100),
  lastKey: Joi.string().trim()
});

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});
