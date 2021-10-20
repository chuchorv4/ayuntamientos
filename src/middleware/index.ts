import rateLimit from 'express-rate-limit'
import logger from 'morgan'
import compress from 'compression'
import crypto from 'crypto'
import helmet from 'helmet'
import { json, urlencoded, NextFunction, Request, Response } from 'express'
import { config } from 'dotenv'
import methodOverride from 'method-override'
import cors from 'cors'
import jwt from 'express-jwt'
import httpStatus from 'http-status'
import CustomError from '../plugins/customError'
config()

export default class Middleware {

  constructor() { }

  onNotFound = (req: Request, res: Response, next: NextFunction) => {
    next(new CustomError({name:'not_found', message: 'Route not found'}, httpStatus.NOT_FOUND))
  }

  showError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      name: err.name,
      message: err.message
    })
  }

  password = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password) req.body.password = crypto.createHmac('sha512', process.env.SECRET || '').update(req.body.password).digest('hex')
    next()
  }

  getParam = (req: Request, res: Response, next: NextFunction) => {
    res.locals = req.params
    next()
  }

  middlewares: Array<any> = [
    rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
    (process.env.ENV_APP == 'development') ? logger('dev') : [],
    compress(),
    helmet(),
    json(),
    urlencoded({extended: true}),
    methodOverride(),
    cors(),
    this.getParam
  ]

  auth: Array<any> = [
    jwt({ secret: process.env.SECRET || '', algorithms: ['HS256'] }),
  ]

}