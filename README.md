web-photo-booth
==================

A queued service for taking snapshots of web pages that will only allow n shots to be taken at a time so as to not overwhelm your tiny VPS or Pi or what not.

Installation
------------

    npm install web-photo-booth --save

Usage
-----

    var WebPhotoBoothServer = require('web-photo-booth-server');
    var server = WebPhotoBoothServer();
    server.listen(5678, startRequests);

    function reportReady(error) {
      if (error) {
        console.log(error);
      }
      else {
        console.log('%s listening at %s', server.name, server.url);
      }
    }

Then, make GET requests to your server like:

    http://localhost:5678/shoot/http%3A%2F%2Fgoogle.com?width=600&height=600

To get:

![google](https://cloud.githubusercontent.com/assets/324298/15732486/97fa5814-284b-11e6-8e1e-ed0aece495b7.png)

Or:

    http://localhost:5678/shoot/http%3A%2F%2Fwww.thisiscolossal.com%2F2014%2F07%2Felectric-objects-a-dedicated-computer-for-the-display-of-art%2F?width=320&height=568

To get:

![thisiscolossal](https://cloud.githubusercontent.com/assets/324298/15732501/aeb262d6-284b-11e6-93ce-16b4b17a8011.png)


You can also make the http request programmatically like so:

    var request = require('request');
    var fs = require('fs');

    var url = 'http://localhost:5678/shoot/';
    url += encodeURIComponent(targetURL);
    url += '?width=1600'
    url += '&height=3200';

    var reqOpts = {
      method: 'GET',
      url: url
    };
    var reqStream = request(reqOpts);
    reqStream.on('error', reportError);

    // Stream the http response to a file.
    var filename = 'shot.png';
    console.log('Starting write of', filename);
    reqStream.pipe(fs.createWriteStream(filename));

Tests
-----

Run tests locally with `make test`. The tests will report errors that can be detected programmatically, but you also need to open the `test-image-output` directory and visually inspect all of the images saved by the tests to make sure they are valid.

License
-------

The MIT License (MIT)

Copyright (c) 2016 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
