shotline
==================

A queued service for taking snapshots of web pages that will only allow n shots to be taken at a time so as to not overwhelm your tiny VPS or Pi or what not.

Installation
------------

- Install [PhantomJS](http://phantomjs.org) globally on your server.
- Clone this repo.
- Edit the environment variables at the top of the Makefile to reflect your server.
- Run `make sync`. During the `npm install` that this will trigger, there may be a failure when webshot attempts to use the global PhantomJS. That's OK. It'll stil be able to use it when it actually runs, in my experience.

Usage
-----

    make run

Tests
-----

Run tests locally with `make test`. Run tests on your server with `make run-test-remote`, then open your local test-image-output directory to visually verify that the screenshots are valid.

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
