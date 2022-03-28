import { Router } from 'express'

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)

const dirname = path.dirname(filename)

const basePath = path.join(dirname, '../../public/templates/users')

const users = Router()

users.get('/add', (req, res) => {
  res.sendFile(`${basePath}/cadastro.html`)
})

users.get('/list', (req, res) => {
  const readUsers = fs.readFileSync('users.json', 'utf-8')

  const parserUsers = JSON.parse(readUsers)
  res.statusCode = 200
  res.setHeader('Content-type', 'text/html;charset=utf-8')
  return res.end(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
  
      <meta name="referrer" content="origin" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Lista de usuários</title>
      <link rel="stylesheet" href="/styles/users.css" />
      <link rel="stylesheet" href="/styles/general.css" />
     
    </head>
    <body>
      <h2>Lista de Usuários</h2>
      <ul style="margin:10px;">
       ${parserUsers.data
         .map(
           (item, index) =>
             `<li style="margin:2px;padding:10px;" key=${index}>${item.name}<li>`,
         )
         .toString()
         .replaceAll(/,/g, '<li></li>')}
         
      </ul>
      <div class="buttonBack">
        <a href="/" rel="noreferrer" referrerpolicy="origin">
          voltar a home
        </a>
      </div>
      
    </body>
  </html>`)
})

users.post('/save', (req, res) => {
  const dataBody = req.body

  if (typeof dataBody.age !== Number && dataBody.age === '') {
    res.writeHead(302, { Location: '/users/add' })
    return res.end()
  }
  try {
    const readUsers = fs.readFileSync('users.json', 'utf-8')
    const parserUsers = JSON.parse(readUsers)
    parserUsers.data.push(dataBody)
    const data = JSON.stringify(parserUsers)
    fs.writeFileSync('users.json', data)
    res.writeHead(302, { location: '/users/list' })
    return res.end()
  } catch (error) {
    console.log(error)
  }
})

export default users
