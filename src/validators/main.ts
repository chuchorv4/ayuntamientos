import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

export default class Main implements Validator {
  
 constructor() { }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      logo: Joi.string(),
      correo: Joi.string(),
      direccion: Joi.string(),
      telefono: Joi.string(),
      facebook: Joi.string(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      title: Joi.string(),
      logo: Joi.string,
      correo: Joi.string,
      direccion: Joi.string,
      telefono: Joi.string,
      facebook: Joi.string,
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}