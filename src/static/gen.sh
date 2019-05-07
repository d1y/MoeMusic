#/usr/bin/env bash

echo '```console' > README.md
tree >> README.md
echo '```' >> README.md