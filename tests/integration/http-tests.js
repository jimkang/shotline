var test = require('tape');
var server = require('../../shotline-server');
var request = require('request');
var fs = require('fs');

var test = require('tape');
var queueShot = require('../../queue-shot');
var fs = require('fs');

var imageCounter = 0;
var baseLinkRenderURL = 'http://jimkang.com/link-finding/#/thing/';
var maxLinkWidth = 56;
var linkHeight = 64;
var linkMarginLeft = 32;

var testCases = [
  {
    name: 'valid-image',
    imageConcept: {
      imgurl: 'http://assets.wholefoodsmarket.com/www/blogs/whole-story/post-images/strawberry_geometric.png',
      concept: 'test',
      width: 768,
      height: 768
    }
  },
  {
    name: 'animated-gif',
    imageConcept: {
      imgurl: 'https://67.media.tumblr.com/8df6cc88c7cdb1aab0ef8749e91b983a/tumblr_inline_o66spiQOEh1rjllea_540.gif',
      concept: 'test',
      width: 600,
      height: 768
    }
  },
  {
    name: 'Blank https://twitter.com/linkfinds/status/730341827883192320',
    imageConcept: {
      imgurl: 'http://vignette2.wikia.nocookie.net/p__/images/a/a6/Mort_Goldman.png/revision/latest?cb=20150524125305&path-prefix=protagonist',
      concept: 'test',
      width: 480,
      height: 640
    }
  }
];

console.log('You need to watch processes to make sure there\'s no more than maxSimultaneousWebshots pairs of phantomjs processes during the simultaneous tests!');
test('Simultaneous request test', testSimultaneous);

function testSimultaneous(t) {
  var multiplier = 3;
  var numberOfResults = 0;

  var serverOpts = {
    port: 6660
  };

  var serverBaseURL = 'http://localhost:' + serverOpts.port + '/shotline/shoot/';

  server.start(serverOpts, startRequests);

  function startRequests(error) {
    t.ok(!error, 'No error while starting server.');
    if (error) {
      console.log(error);
    }

    for (var i = 0; i < multiplier; ++i) {
      testCases.forEach(startGet);
    }
  }
  
  function startGet(testCase) {
    var url = serverBaseURL;
    url += encodeURIComponent(getLinkFindingURLForImageConcept(testCase.imageConcept));
    url += '?width' + testCase.imageConcept.width;
    url += '&height' + testCase.imageConcept.height;

    var reqOpts = {
      method: 'GET',
      url: url
    };
    var reqStream = request(reqOpts, accountForReturn);
    reqStream.on('error', checkError);
    reqStream.on('end', count);

    var filename = 'test-image-output/' + prefix + '-' + testCase.name.replace(/[\s\:\/]/g, '-') +
      '-' + imageCounter + '.png';
    imageCounter += 1;
    console.log('Starting write of', filename);
    console.log('You need to use your human eyes to visually inspect it when it\'s done.');
    reqStream.pipe(fs.createWriteStream(filename));

    function checkError(error) {
      t.fail('No error while getting image.');
      if (error) {
        console.log(error, error.stack);
      }
    }
  }

  function count() {
    numberOfResults += 1;
    if (numberOfResults === testCases.length * multiplier) {
      server.stop();
      t.end();
    }
  }
}

function getLinkFindingURLForImageConcept(imageConceptResult) {
  var url = baseLinkRenderURL + encodeURIComponent(imageConceptResult.imgurl);
  url += '/desc/' + imageConceptResult.concept;
  url += '/width/' + imageConceptResult.width + '/height/' + imageConceptResult.height;
  return url;
}
