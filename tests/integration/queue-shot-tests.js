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
    },
    expected: {}
  },
  {
    name: 'animated-gif',
    imageConcept: {
      imgurl: 'https://67.media.tumblr.com/8df6cc88c7cdb1aab0ef8749e91b983a/tumblr_inline_o66spiQOEh1rjllea_540.gif',
      concept: 'test',
      width: 600,
      height: 768
    },
    expected: {}
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
  for (var i = 0; i < multiplier; ++i) {
    testCases.forEach(startGet);
  }
  
  var numberOfResults = 0;

  function startGet(testCase) {
    queueShot(
      getLinkFindingURLForImageConcept(testCase.imageConcept),
      testCase.imageConcept,
      checkFinding
    );

    function checkFinding(error, renderStream) {
      t.ok(!error, 'No error while getting image stream.');

      var base64Image = '';
      renderStream.on('data', saveToBase64Image);
      renderStream.on('end', checkImage);
      renderStream.on('error', passError);

      function saveToBase64Image(data) {
        base64Image += data.toString('base64');
      }

      function checkImage() {
        validateResult(base64Image, t, testCase, 'simultaneous', count);
      }

      function passError(error) {
        console.log(error, error.stack);
        t.ok(!error, 'No error from render stream.');
      }
    }
  }

  function count() {
    numberOfResults += 1;
    if (numberOfResults === testCases.length * multiplier) {
      t.end();
    }
  }
}

function validateResult(base64Image, t, testCase, prefix, done) {
  t.ok(base64Image.length > 0, 'Result has a base64Image string.');
  var filename = 'test-image-output/' + prefix + '-' + testCase.name.replace(/[\s\:\/]/g, '-') +
    '-' + imageCounter + '.png';
  imageCounter += 1;
  console.log('Writing out', filename);
  console.log('You need to use your human eyes to visually inspect it.');
  fs.writeFile(filename, base64Image, 'base64', done);
}

function getLinkFindingURLForImageConcept(imageConceptResult) {
  var url = baseLinkRenderURL + encodeURIComponent(imageConceptResult.imgurl);
  url += '/desc/' + imageConceptResult.concept;
  url += '/width/' + imageConceptResult.width + '/height/' + imageConceptResult.height;
  return url;
}
