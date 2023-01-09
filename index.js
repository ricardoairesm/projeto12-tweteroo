import express from 'express'

const server = express()

server.get("/hello", (request, response) => {
  response.send("Meu primeiro servidor, yay!")
})

server.listen(5003, () => {
  console.log('Xablauuuuu')
})