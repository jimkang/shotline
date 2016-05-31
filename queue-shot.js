var webshot = require('webshot');
var randomId = require('idmaker').randomId;

var phantom = require('phantom-render-stream');
var render = phantom({
  pool: 1,
  format: 'png',
  expects: 'go-for-it'
});

// var maxSimultaneousWebshots = 1;
// var webshotsInProgress = 0;

// var webshotQueue = [];

// function queueWebshot(url, windowSize, callback) {
//   var queueItem = {
//     url: url,
//     windowSize, windowSize,
//     id: randomId(4),
//     callback: callback
//   };
//   webshotQueue.push(queueItem);
// }

// function runNextWebshotInQueue() {
//   if (webshotQueue.length < 1) {
//     console.log('No more webshots in queue!');
//   }
//   else if (webshotsInProgress < maxSimultaneousWebshots) {
//     console.log('Pulling webshot off of queue.');
//     var queueItem = webshotQueue.shift();
//     runWebshot(queueItem.id, queueItem.url, queueItem.windowSize, queueItem.callback);
//   }
//   else {
//     console.log(
//       'Not pulling off of queue.', 
//       webshotsInProgress, 'webshots in progress.',
//       maxSimultaneousWebshots, 'max.',
//       'webshotQueue size:', webshotQueue.length
//     );
//   }
// }

function queueShot(url, windowSize, done) {
  // queueWebshot(url, windowSize, done);
  // runNextWebshotInQueue();
  var renderOpts = {
    width: windowSize.width,
    height: windowSize.height
  };
  var base64Image = '';
  var renderStream = render(url, renderOpts);

  renderStream.on('data', saveToBase64Image);
  renderStream.on('end', passImage);
  renderStream.on('error', passError);

  function saveToBase64Image(data) {
    base64Image += data.toString('base64');
  }

  function passImage() {
    var result = {
      base64Image: base64Image
    };

    // console.log('Completed webshot for', queueId, url);
    // console.log('webshotsInProgress', webshotsInProgress);
    // console.log('webshotQueue size:', webshotQueue.length);

    done(null, result);
  }

  function passError(error) {
    done(error);
  }  
}

// function runWebshot(queueId, url, windowSize, done) {
//   webshotsInProgress += 1;
//   console.log('running webshot for', queueId, url);
//   console.log('webshotsInProgress', webshotsInProgress);

//   var base64Image = '';

//   var webshotOpts = {
//     windowSize: windowSize,
//     shotSize: {
//       width: 'all',
//       height: 'all'
//     },
//     streamType: 'png',
//     takeShotOnCallback: true,
//     errorIfStatusIsNot200: true,
//     errorIfJSException: true,
//     timeout: 10 * 1000
//   };

//   var renderStream =  webshot(url, webshotOpts);
//   renderStream.on('data', saveToBase64Image);
//   renderStream.on('end', passImage);
//   renderStream.on('error', passError);

//   function saveToBase64Image(data) {
//     base64Image += data.toString('base64');
//   }

//   function passImage() {
//     var result = {
//       base64Image: base64Image
//     };

//     webshotsInProgress -= 1;

//     console.log('Completed webshot for', queueId, url);
//     console.log('webshotsInProgress', webshotsInProgress);
//     console.log('webshotQueue size:', webshotQueue.length);

//     done(null, result);
//     runNextWebshotInQueue();
//   }


module.exports = queueShot;
