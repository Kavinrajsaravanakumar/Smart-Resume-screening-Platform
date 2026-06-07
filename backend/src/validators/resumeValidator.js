import Joi from 'joi';

export const uploadRequestSchema = Joi.object({
  requiredSkills: Joi.string().max(500).allow('', null)
});
