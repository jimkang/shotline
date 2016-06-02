var webshot = require('webshot');
var randomId = require('idmaker').randomId;

var maxSimultaneousWebshots = 1;
var webshotsInProgress = 0;

var webshotQueue = [];

function queueWebshot(url, windowSize, callback) {
  var queueItem = {
    url: url,
    windowSize, windowSize,
    id: randomId(4),
    callback: callback
  };
  webshotQueue.push(queueItem);
}

function runNextWebshotInQueue() {
  if (webshotQueue.length < 1) {
    console.log('No more webshots in queue!');
  }
  else if (webshotsInProgress < maxSimultaneousWebshots) {
    console.log('Pulling webshot off of queue.');
    var queueItem = webshotQueue.shift();
    runWebshot(queueItem.id, queueItem.url, queueItem.windowSize, queueItem.callback);
  }
  else {
    console.log(
      'Not pulling off of queue.', 
      webshotsInProgress, 'webshots in progress.',
      maxSimultaneousWebshots, 'max.',
      'webshotQueue size:', webshotQueue.length
    );
  }
}

function queueShot(url, windowSize, done) {
  queueWebshot(url, windowSize, done);
  runNextWebshotInQueue();
}

function runWebshot(queueId, url, windowSize, done) {
  webshotsInProgress += 1;
  console.log('running webshot for', queueId, url);
  console.log('webshotsInProgress', webshotsInProgress);

  var webshotOpts = {
    windowSize: windowSize,
    shotSize: {
      width: 'all',
      height: 'all'
    },
    streamType: 'png',
    // takeShotOnCallback: true,
    errorIfStatusIsNot200: true,
    errorIfJSException: true,
    timeout: 20 * 1000
  };

  debugger;
  var renderStream = webshot(url, webshotOpts);
  renderStream.on('end', adjustQueue);

  done(null, renderStream);

  function adjustQueue() {
    webshotsInProgress -= 1;

    console.log('Completed webshot for', queueId, url);
    console.log('webshotsInProgress', webshotsInProgress);
    console.log('webshotQueue size:', webshotQueue.length);

    runNextWebshotInQueue();
  }
}

module.exports = queueShot;
