#!/bin/sh
rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  madcatzx@tangerine.local:/home/madcatzx/projects/tangerine-nest

while inotifywait -r -e modify,create,delete /directory; do
    rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  madcatzx@tangerine.local:/home/madcatzx/projects/tangerine-nest
done