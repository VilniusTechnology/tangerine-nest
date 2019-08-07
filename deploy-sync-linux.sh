#!/bin/sh
rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  tangerine@tangerine.local:/home/tangerine/tangerine-nest

while inotifywait -r -e modify,create,delete /directory; do
    rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  tangerine@tangerine.local:/home/tangerine/tangerine-nest
done