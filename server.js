const http = require('http');

const hostname = 'localhost';
const port = 3000;

const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} by method ${req.method}`);

  if (req.method === 'GET') {
    let fileUrl = req.url;
    if (fileUrl === '/') {
      fileUrl = '/index.html';
    }
    // converts relative path to absolute
    const filePath = path.resolve('./public' + fileUrl);

    //returns file ext of goven file
    const fileExt = path.extname(filePath);
    if (fileExt === '.html') {
      // checks if file can be accessed
      fs.access(filePath, err => {
        // error handling setup
        if (err) {
          res.statusCose = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end(`<html><body><h1>Error 404: ${req.Url} not found</h1></body></html>`);
          return;
        }
        // req is good 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        // reads chunks of file at a time instead of whole file lazy loading
        // then piped over to res object stream can use pipe to send info between streams res is stream and create read streeam is another
        // will end automatically so no need for end method
        fs.createReadStream(filePath).pipe(res);
      });
    } else {
      // error handling not an html file
      res.statusCose = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end(`<html><body><h1>Error 404: ${req.Url} not an HTML file</h1></body></html>`)
    }
  } else {
    // error handling catch all not found
    res.statusCose = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<html><body><h1>Error 404: ${req.method} not found</h1></body></html>`)
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})