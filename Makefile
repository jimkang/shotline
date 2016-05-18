HOMEDIR = $(shell pwd)

pushall: 
	git push origin master && npm publish

test:
	node tests/integration/queue-shot-tests.js
