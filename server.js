var restify = require('restify');
var getResult = require('./get-result');

function respond(req, res, next) {
  if (!req.params.name) {
    next(new restify.BadRequestError('Missing name parameter.'));
    return;
  }

  var opts = {
    base: req.params.name
  };

  getResult(opts, renderResult);

  function renderResult(error, result) {
    if (error) {
      next(error);
    }
    else {
      res.json(result);
      next();
    }
  }
}

function respondHead(req, res, next) {
  res.writeHead(
    200, 
    {
      'content-type': 'application/json'
    }
  );
  res.end();
  next();
}

var server = restify.createServer();
server.use(restify.CORS());

server.get('/something/:id', respond);
server.head('/something/:id', respondHead);

server.listen(8080, function reportServerUp() {
  console.log('%s listening at %s', server.name, server.url);
});
