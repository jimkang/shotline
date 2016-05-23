HOMEDIR = $(shell pwd)
SMUSER = noderunner
PRIVUSER = root
SERVER = sprigot-droplet
SSHCMD = ssh $(SMUSER)@$(SERVER)
PRIVSSHCMD = ssh $(PRIVUSER)@$(SERVER)
PROJECTNAME = shotline
APPDIR = /var/www/$(PROJECTNAME)

test:
	node tests/integration/queue-shot-tests.js

run-test-remote:
	rm -rf test-image-output
	$(SSHCMD) "cd $(APPDIR) && make test && \
	tar zcvf test-image-output.tgz test-image-output"
	scp $(SMUSER)@$(SERVER):$(APPDIR)/test-image-output.tgz .
	tar zxvf test-image-output.tgz

pushall: update-remote
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(SMUSER)@$(SERVER):/var/www/ --exclude node_modules/ --exclude data/
	$(SSHCMD) "cd $(APPDIR) && npm install"

restart-remote:
	$(PRIVSSHCMD) "service $(PROJECTNAME) restart"

set-permissions:
	#$(PRIVSSHCMD) "chmod +x $(APPDIR)/$(PROJECTNAME).js && \
	#chmod 777 -R $(APPDIR)/data/"

update-remote: sync set-permissions restart-remote

install-service:
	#$(PRIVSSHCMD) "cp $(APPDIR)/$(PROJECTNAME).service /etc/systemd/system && \
	#systemctl daemon-reload"

set-up-directories:
	$(PRIVSSHCMD) "mkdir -p $(APPDIR) && chown -R noderunner:robots $(APPDIR)"

initial-setup: set-up-directories sync set-permissions install-service
