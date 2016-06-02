test:
	node tests/integration/queue-shot-tests.js
	node tests/integration/http-tests.js

try-server:
	node tools/start-server.js

pushall:
	git push origin master
	npm publish

