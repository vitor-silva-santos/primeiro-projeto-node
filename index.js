const express = require("express")
const uuid = require("uuid")

const porta = 3000
const app = express()
app.use(express.json())

/*
        - Query params => meusite.com/users?name=vitor&age=19 // FILTROS
        - Route params => /users/2 // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO, ex : /users/:id -> ':id' ele fala que vai receber um numero dinamico
        - Request Body => {"name": "Vitor", "age",19}

        - GET           => Buscar informação no back-end
        - POST          => Criar informação no back-end
        - PUT / PATCH   => Alterar / Atualizar infor. no back
        - DELETE        => Deletar infor. no back

        - Middleware    => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params
    
    const index = users.findIndex(user => user.id === id)
    
    if (index < 0) { 
        return response.status(404).json({erro:"User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()

}

app.get("/users", (request, response) => {
    return response.json(users)
})

app.post("/users", (request, response) => {
    const { name, age } = request.body
    const user = { id: uuid.v4(), name, age }
    users.push(user)
    return response.status(201).json(user)
})

app.put("/users/:id", checkUserId, (request, response) => {
    const id = request.userId
    const index = request.userIndex

    const {name, age} = request.body
    const updatedUser = {id, name, age}
    users[index] = updatedUser

    return response.json(updatedUser)
})


app.delete("/users/:id", checkUserId, (request, response) => {
    const index = request.userIndex
    users.splice(index, 1)
    return response.status(204).json()
})



app.listen(porta, () => {
    console.log(`Server started on port ${porta}`)
})