import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)

const dirname = path.dirname(filename)

const basePath = path.join(dirname, '../../public/templates/products')

const products = Router()

products.get('/add', (req, res) => {
  res.sendFile(`${basePath}/index.html`)
})

products.get('/list', (req, res) => {
  const readProducts = fs.readFileSync('products.json', 'utf-8')

  const parserProducts = JSON.parse(readProducts)

  const keys = Object.keys(parserProducts.data[0])

  console.log(keys)

  res.statusCode = 200
  res.setHeader('Content-type', 'text/html;charset=utf-8')
  return res.end(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
  
      <meta name="referrer" content="origin" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Lista de produtos</title>
      <link rel="stylesheet" href="/styles/products.css" />
      <link rel="stylesheet" href="/styles/users.css" />
      <link rel="stylesheet" href="/styles/general.css" />
     
    </head>
    <body>
      <h2>Lista de Produtos</h2>
      <div class="tableWidth">
        <table class="greyGridTable">
          <thead>
            <tr style="margin:2px;padding:10px;">
              ${keys
                .map((item, index) => `<td key=${index}>${item}</td>`)
                .toString()
                .replaceAll(/,/g, ' ')}
            </tr>
          <thead>
          <tbody>
            
              ${parserProducts.data
                .map(
                  (item, index) =>
                    `<tr style="margin:2px;padding:10px;" key=${index}><td ><a href="/products/list/${index}"><img src=${item.urlImage} alt=${item.name} width="80px" height="80px"/></a></td><td >${item.name}</td><td >${item.type}</td><td >${item.price}</td><td >${item.marca}</td><td >${item.modelo}</td><tr>`,
                )
                .toString()
                .replaceAll(/,/g, ' ')}
          
        </tbody>
      </table>
      <div>
       
         

      <div class="buttonBack">
        <a href="/" rel="noreferrer" referrerpolicy="origin">
          voltar a home
        </a>
      </div>
      
    </body>
  </html>`)
})

products.get('/list/:id', (req, res) => {
  const readProducts = fs.readFileSync('products.json', 'utf-8')

  const parserProducts = JSON.parse(readProducts)
  res.statusCode = 200
  res.setHeader('Content-type', 'text/html;charset=utf-8')
  return res.end(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
  
      <meta name="referrer" content="origin" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Detalhes do produto</title>
      <link rel="stylesheet" href="/styles/users.css" />
      <link rel="stylesheet" href="/styles/general.css" />
     
    </head>
    <body>
      
      <div  style="margin-bottom:30px;">
      ${parserProducts.data.map(
        (item, index) => `
        <div key=${index}>
          <h1 style="text-align:center;">${item.name}</h1>
          <div style="display:flex; align-items:center; justify-content:center;">
          <img src=${item.urlImage} alt=${item.name} style="max-width:500px;width:100%; height:500px; "/>
          </div>
          <div style="display:flex; flex-direction:column;align-items:center; justify-content:center; margin-bottom:20px;">
          <h3>tipo :<span style="font-weight:400;text-align:center;">  ${item.type}</span></h3>
          <h3>marca :<span style="font-weight:400;text-align:center;">  ${item.marca}</span></h3>
          <h3>modelo :<span style="font-weight:400;text-align:center;">  ${item.modelo}</span></h3>
          <div>
        </div>
      `,
      )}
      </div>
      <div class="buttonBack">
        <a href="/products/list" rel="noreferrer" referrerpolicy="origin">
          voltar aos produtos
        </a>
      </div>
      
    </body>
  </html>`)
})

products.post('/save', (req, res) => {
  const dataBody = req.body

  if (typeof dataBody.age !== Number && dataBody.age === '') {
    res.writeHead(302, { Location: '/products/add' })
    return res.end()
  }
  try {
    const readProducts = fs.readFileSync('products.json', 'utf-8')
    const parserProducts = JSON.parse(readProducts)
    parserProducts.data.push(dataBody)
    const data = JSON.stringify(parserProducts)
    fs.writeFileSync('products.json', data)
    res.writeHead(302, { location: '/products/list' })
    return res.end()
  } catch (error) {
    console.log(error)
  }
})

export default products
