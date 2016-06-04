var restify = require('restify');
var QueueShot = require('./queue-shot');

function WebPhotoBoothServer(opts) {
  var maxSimultaneousWebshots;

  if (opts) {
    maxSimultaneousWebshots = opts.maxSimultaneousWebshots;
  }

  var queueShot = QueueShot({
    maxSimultaneousWebshots: maxSimultaneousWebshots
  });

  var server = restify.createServer({
    name: 'web-photo-booth-server'
  });
  server.use(restify.CORS());
  server.use(restify.queryParser());

  server.get('/shoot/:targetURL', respond);
  server.head('/shoot/:targetURL', respondHead);

  return server;

  function respond(req, res, next) {
    if (!req.params.targetURL) {
      next(new restify.BadRequestError('Missing name parameter.'));
      return;
    }

    const queueShotOpts = {
      url: req.params.targetURL,
      windowSize: {
        width: req.query.width ? req.query.width : 1024,
        height: req.query.height ? req.query.height : 768
      },
      takeShotOnCallback: req.query.takeShotOnCallback === 'true'
    };

    queueShot(queueShotOpts, renderResult);

    function renderResult(error, renderStream) {
      if (error) {
        next(error);
      }
      else {
        renderStream.on('error', logError);
        renderStream.on('end', next);
        renderStream.pipe(res);
      }
    }

    function logError(error) {
      console.error(error, error.stack);
      next(error);
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
}

module.exports = WebPhotoBoothServer;
