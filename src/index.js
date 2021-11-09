const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({ error: 'User not found!'})
  } 
  
  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExists = users.find(user => user.username === username)

  if(userExists) {
    return response.status(400).json({ error: 'User already exists!'})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).send(newUser);
});

app.get('/todos', checksExistsUserAccount,(request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount,(request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { title, deadline } = request.body;
  const { user } = request;

  if(!id) {
    return response.status(404).json({ error : 'ID not found!'})
  }

  const todoExists = user.todos.find(todo => todo.id === id)

  if(!todoExists) {
    return response.status(404).json({ error : 'Todo not found!'})
  }

  let newTodo = {}

  const newTodos = user.todos.map(todo => 
    {
      if(todo.id === id){
         newTodo = {
          ...todo,
          title,
          deadline
        }
      }

      return todo;
  })

  user.todos.push(newTodos);

  return response.status(200).json(newTodo)
  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  if(!id) {
    return response.status(404).json({ error : 'ID not found!'})
  }

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    return response.status(404).json({ error : 'Todo not found!'})
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  if(!id) {
    return response.status(404).json({ error : 'ID not found!'})
  }

  const todoExists = user.todos.find(todo => todo.id === id)

  if(!todoExists) {
    return response.status(404).json({ error : 'Todo not found!'})
  }

  const removedTodos = user.todos.filter(todo => todo.id !== id);

  user.todos = removedTodos;

  return response.status(204).send();
});

module.exports = app;