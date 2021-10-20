import express from 'express'
import { connect } from 'mongoose'
import path from 'path'
import Middleware from './middleware'
import routes from './routes'

if (!process.env.PORT) process.exit(1)

const PORT: number = parseInt(process.env.PORT as string, 10)
const app = express()
const m = new Middleware()

connect(`mongodb://${ process.env.HOSTNAME_APP }:${ process.env.DB_PORT }/${ process.env.DATABASE }`)
  .then(() => console.log('\nConnected to MongoDB...'))
  .catch(err => {
    console.error('\nCould not connect to MongoDB...' + err)
    process.exit(1)
  })

app.use('/images', express.static(path.join(__dirname,'/public/images')))
app.use('/pdf', express.static(path.join(__dirname,'/public/pdf')))
app.use('/api/:ayuntamientoID', [... m.middlewares, routes, m.onNotFound ,m.showError])
app.use('/',[... m.middlewares, m.onNotFound ,m.showError])

const server = app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })

if (module['hot']) {
  module['hot'].accept();
  module['hot'].dispose(() => server.close());
}