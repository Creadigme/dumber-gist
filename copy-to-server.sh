#! /bin/bash --login

# Copy js before html files
scp client-app/output/* huocp@dumber.app:dumber-gist/client-app/output/
scp client-worker/worker-bundle* huocp@dumber.app:dumber-gist/client-worker/

scp client-app/favicon.ico huocp@dumber.app:dumber-gist/client-app/
scp client-worker/favicon.ico huocp@dumber.app:dumber-gist/client-worker/

scp client-app/index.html huocp@dumber.app:dumber-gist/client-app/
scp client-worker/index.html client-worker/boot-up-worker.html huocp@dumber.app:dumber-gist/client-worker/

scp server/dumber-cache/app.js huocp@dumber.app:dumber-gist/server/dumber-cache/
scp server/github-oauth/app.js huocp@dumber.app:dumber-gist/server/github-oauth/
scp server/request.js huocp@dumber.app:dumber-gist/server/
