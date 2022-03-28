import express from 'express'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import path from 'path'
import users from './routers/users/index.mjs'
import products from './routers/products/index.mjs'

const app = express()
const port = 3000
const filename = fileURLToPath(import.meta.url)

const dirname = path.dirname(filename)

const basePath = path.join(dirname, 'public/templates')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use('/users', users)
app.use('/products', products)

app.use('/', (req, res) => {
  res.sendFile(`${basePath}/index.html`)
})

app.use((req, res) => {
  res.status(404).sendFile(`${basePath}/404.html`)
})

app.listen(port, () => console.log(chalk.blueBright(`running on port ${port}`)))
