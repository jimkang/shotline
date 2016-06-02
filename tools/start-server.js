var WebPhotoBoothServer = require('../web-photo-booth-server');

var port = 5678;
var server = WebPhotoBoothServer({});
server.listen(port, reportReady);

function reportReady(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log('%s listening at %s', server.name, server.url);
  }
}
