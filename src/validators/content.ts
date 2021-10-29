import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

const objectId = require('joi-objectid')(Joi)

export default class Content implements Validator {
  
 constructor() { }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      content: Joi.string().required(),
      page: objectId().required(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      content: Joi.string().required(),
      page: objectId().required(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}