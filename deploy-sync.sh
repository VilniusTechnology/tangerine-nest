#!/bin/sh

alias run_rsync="rsync -avz --exclude '.*/' --exclude '.*' --progress --exclude 'node_modules' --exclude '.idea' --exclude 'mandarinas-settings' --exclude 'config/production/config.js' --exclude 'config/development/config.js' .  tangerine@shady.local:/home/tangerine/tangerine-nest"
run_rsync; fswatch -o . | while read f; do run_rsync; done
