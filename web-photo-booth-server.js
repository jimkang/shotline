var restify = require('restify');
var queueShot = require('./queue-shot');

function respond(req, res, next) {
  if (!req.params.targetURL) {
    next(new restify.BadRequestError('Missing name parameter.'));
    return;
  }

  var windowSize = {
    width: req.query.width ? req.query.width : 1024,
    height: req.query.height ? req.query.height : 768
  };
debugger;
  queueShot(req.params.targetURL, windowSize, renderResult);

  function renderResult(error, renderStream) {
    debugger;
    if (error) {
      next(error);
    }
    else {
      renderStream.on('error', next);
      renderStream.on('end', next);
      renderStream.pipe(res);
    }
  }
}

function respondHead(req, res, next) {
  res.writeHead(
    200, 
    {
      'content-type': 'image/png'
    }
  );
  res.end();
  next();
}

function WebPhotoBoothServer(opts) {
  var server = restify.createServer({
    name: 'web-photo-booth-server'
  });
  server.use(restify.CORS());
  server.use(restify.queryParser());

  server.get('/shoot/:targetURL', respond);
  server.head('/shoot/:targetURL', respondHead);

  return server;
}

module.exports = WebPhotoBoothServer;
