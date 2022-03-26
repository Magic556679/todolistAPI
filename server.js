const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandler = require('./errorHandler');
const todos = []

const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };
  let body = ''
  req.on('data', chunk => {
    body += chunk
  });
  if(req.url === '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos
    }));
    res.end();
  } else if (req.url === '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        let title = JSON.parse(body).title;
        if( title !== undefined) {
          let todo = {
            "title": title,
            "id": uuidv4()
          };
          todos.push(todo)
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos
          }));
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      }
    })
  } else if (req.url === '/todos' && req.method == 'DELETE') {
    todos.length = 0
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    req.on('end', () => {
      try {
        let id = req.url.split('/').pop();
        let index = todos.findIndex(item => item.id == id)
        if( index !== -1) {
          todos.splice(index, 1);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos
          }));
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      }
    })
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        let title = JSON.parse(body).title
        let id = req.url.split('/').pop();
        let index = todos.findIndex(item => item.id == id)
        if( index !== -1 && title !== undefined) {
          todos[index].title = title
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos
          }));
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      }
    })
  } else if(req.url === '/todos' && req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorHandler(res);
  };
}
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3003);