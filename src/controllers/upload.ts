import { NextFunction, Request, RequestHandler, Response } from 'express'
import multer from 'multer'
import { BAD_REQUEST, NOT_FOUND } from 'http-status'
import CustomError from '../plugins/customError'
import path from 'path'

export default class Uploader {

  private storage: multer.StorageEngine
  private uploader: RequestHandler
  private publicPath: string

  constructor (fieldName: string, pathDir: string, publicPath: string) {
    this.publicPath = publicPath
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, pathDir))
      },
      filename: function (req, file, cb) {
        let fileName = file.originalname.split('.')
        let fileExt = fileName[fileName.length - 1]
        let ayuntamientoID = (typeof req.user != 'undefined' && typeof req.user['ayuntamiento'] != 'undefined') ? req.user['ayuntamiento'] : ''
        let date = Date.now()
        cb(null, `${ ayuntamientoID }_${ date }${(Math.random() * 10000).toFixed().padStart(4,'0')}.${fileExt}`)
      }
    })
    const instance = multer({ storage: this.storage })
    this.uploader = instance.single(fieldName)
  }
  
  upload = (req: Request, res: Response, next: NextFunction) => {
    if (
      typeof res.locals == 'undefined' ||
      typeof res.locals.ayuntamientoID == 'undefined' ||
      typeof req.user == 'undefined' ||
      typeof req.user['ayuntamiento'] == 'undefined' ||
      res.locals.ayuntamientoID != req.user['ayuntamiento']
    ) {
      return next(new CustomError({ name: 'not_found', message: 'Not found.' }, NOT_FOUND))
    }
    this.uploader(req, res, (err) => {
      if (typeof err != 'undefined') {
        next(new CustomError(err, BAD_REQUEST))
      } else {
        res.send({
          success: 1,
          file: {
            url: `.${ this.publicPath }/${ req.file?.filename }`
          }
        })
      }
    })
  }
}