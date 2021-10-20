import { UNAUTHORIZED, BAD_REQUEST, NO_CONTENT } from 'http-status'
import CustomError from '../plugins/customError'
import { sign } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/user'
import { RoleModel } from '../models/role'

export default class Auth {
  constructor() {}
  
  login = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof res.locals != 'undefined' && typeof res.locals.ayuntamientoID != 'undefined') {
      Object.assign(req.body, {ayuntamiento: res.locals.ayuntamientoID})
    }
    UserModel.findOne(req.body)
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_parameter', message:'Invalid name and password.'}, UNAUTHORIZED))
      RoleModel.findById(user.role)
        .then( role => {
          if (!role) return next(new CustomError({name:'invalid_parameter', message:'Invalid role.'}, UNAUTHORIZED))
          let exp = Math.floor(Date.now() / 1000) + (60 * 30)
          let userJSON = user.toJSON()
          let data = { ...userJSON, permissions: role['permissions'], exp}
          const token = sign(data, process.env.SECRET || '')
          res.send({token: token})
        })
        .catch(error => next(new CustomError(error, BAD_REQUEST)))
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  user = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof res.locals != 'undefined' && typeof res.locals.ayuntamientoID != 'undefined' &&typeof req['user'] != 'undefined') {
      if (res.locals.ayuntamientoID != req['user']['ayuntamiento']){
        return next(new CustomError({name:'invalid_parameter', message:'Invalid token.'}, UNAUTHORIZED))
      }
    }
    res.send({user: req['user']})
  }

  logout = async (req: Request, res: Response) => {
    res.status( NO_CONTENT ).send({ status: 'OK' })
  }
}
