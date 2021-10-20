import { NextFunction, Request, Response } from 'express'
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from 'http-status'
import CustomError from '../plugins/customError'
import { isValidObjectId, Model } from 'mongoose'

export default class Generic {
  private Model: Model<any>
  private attributes: Array<string>

  constructor(Model: Model<any>, attributes: Array<string>) {
    this.Model = Model
    this.attributes = attributes
  }

  private setFilter = (entrada: any, defaultFilter: any): any => {
    if (typeof entrada == 'undefined') return defaultFilter
    return Object.assign(entrada, defaultFilter)
  }

  private getAyuntamiento = (param): boolean => {
    if (typeof param != 'undefined' && typeof param.ayuntamientoID != 'undefined') {
      return param.ayuntamientoID
    }
    return false
  }
  
  all = async (req: Request, res: Response, next: NextFunction) => {
    const ayuntamiento = this.getAyuntamiento(res.locals)
    if (!ayuntamiento) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    await this.Model
      .find(this.setFilter(req.body.search, { ayuntamiento } ))
      .select( req.body.select || {})
      .sort( req.body.sort || {})
      .limit( req.body.limit || 0)
      .skip( req.body.skip || 0)
      .populate( req.body.populate || '')
      .then(value => {
        if (!value)
          return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
        res.send(value)
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  count = async (req: Request, res: Response, next: NextFunction) => {
    const ayuntamiento = this.getAyuntamiento(res.locals)
    if (!ayuntamiento) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    await this.Model.find({ ayuntamiento }).countDocuments()
      .then(value => {
        res.send({ total: value })
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }
  create = async (req: Request, res: Response, next: NextFunction) => {
    const ayuntamiento = this.getAyuntamiento(res.locals)
    if (!ayuntamiento) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    if (typeof req != 'undefined' && typeof req.user != 'undefined' && req.user['ayuntamiento'] != ayuntamiento) {
      return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED)) 
    }
    let input = this.attributes.reduce((obj, key) => {
      if (req.body[key]) obj[key] = req.body[key]
      return obj
    }, { ayuntamiento })
    let obj = new this.Model(input)
    await obj.save()
      .then(value => res.send(value))
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }
  byId = async (req: Request, res: Response, next: NextFunction) => {
    const ayuntamiento = this.getAyuntamiento(res.locals)
    if (!ayuntamiento) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    if (isValidObjectId(req.params.id)) {
      await this.Model.findOne({ _id : req.params.id, ayuntamiento })
      .then(value => {
        if (!value) return next(new CustomError({ name: 'not_found', message: 'The given ID was not found.' }, NOT_FOUND))
        res.send(value)
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
    } else {
      await this.Model.findOne({ url : req.params.id, ayuntamiento })
      .then(value => {
        if (!value) return next(new CustomError({ name: 'not_found', message: 'The given ID was not found.' }, NOT_FOUND))
        res.send(value)
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
    }
  }
  update = async (req: Request, res: Response, next: NextFunction) => {
    const ayuntamiento = this.getAyuntamiento(res.locals)
    if (!ayuntamiento) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    if (typeof req != 'undefined' && typeof req.user != 'undefined' && req.user['ayuntamiento'] != ayuntamiento) {
      return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED)) 
    }
    await this.Model.findOne({ _id : req.params.id, ayuntamiento })
      .then(async (value) => {
        if (!value) return next(new CustomError({ name: 'not_found', message: 'The given ID was not found.' }, NOT_FOUND))
        Object.assign(value, req.body)
        await value.save()
          .then(value => res.send(value))
          .catch(error => next(new CustomError(error, BAD_REQUEST)))
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }
  delete = async (req: Request, res: Response, next: NextFunction) => {
    const ayuntamiento = this.getAyuntamiento(res.locals)
    if (!ayuntamiento) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    if (typeof req != 'undefined' && typeof req.user != 'undefined' && req.user['ayuntamiento'] != ayuntamiento) {
      return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED)) 
    }
    await this.Model.deleteOne({ _id: req.params.id, ayuntamiento })
      .then(value => {
        // if (!value) return next(new CustomError({ name: 'not_found', message: 'The given ID was not found.' }, NOT_FOUND))
        res.send(value)
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }
}