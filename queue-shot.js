var webshot = require('webshot');
var randomId = require('idmaker').randomId;
var defaults = require('lodash.defaults');

function QueueShot(createOpts) {
  var maxSimultaneousWebshots;

  if (createOpts) {
    maxSimultaneousWebshots = createOpts.maxSimultaneousWebshots;
  }

  if (!maxSimultaneousWebshots) {
    maxSimultaneousWebshots = 1;
  }

  var webshotsInProgress = 0;
  var webshotQueue = [];

  function queueWebshot(opts, callback) {
    var queueItem = defaults({}, opts);
    queueItem.id = randomId(4);
    queueItem.callback = callback;
    webshotQueue.push(queueItem);
  }

  function runNextWebshotInQueue() {
    if (webshotQueue.length < 1) {
      console.log('No more webshots in queue!');
    }
    else if (webshotsInProgress < maxSimultaneousWebshots) {
      console.log('Pulling webshot off of queue.');
      var queueItem = webshotQueue.shift();
      runWebshot(queueItem, queueItem.callback);
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

  function queueShot(opts, done) {
    queueWebshot(opts, done);
    runNextWebshotInQueue();
  }

  function runWebshot(opts, done) {
    webshotsInProgress += 1;
    console.log('running webshot for', opts.id, opts.url);
    console.log('webshotsInProgress', webshotsInProgress);

    var webshotOpts = {
      windowSize: opts.windowSize,
      shotSize: {
        width: 'all',
        height: 'all'
      },
      streamType: 'png',
      takeShotOnCallback: opts.takeShotOnCallback,
      errorIfStatusIsNot200: true,
      errorIfJSException: true,
      timeout: 20 * 1000
    };

    var renderStream = webshot(opts.url, webshotOpts);
    renderStream.on('end', adjustQueue);

    done(null, renderStream);

    function adjustQueue() {
      webshotsInProgress -= 1;

      console.log('Completed webshot for', opts.id, opts.url);
      console.log('webshotsInProgress', webshotsInProgress);
      console.log('webshotQueue size:', webshotQueue.length);

      runNextWebshotInQueue();
    }
  }

  return queueShot;
}

module.exports = QueueShot;
