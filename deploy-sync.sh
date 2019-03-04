#!/bin/sh

# while true; do
#   inotifywait -r -e modify,create,delete /home/madcatzx/projects/tangerine-nest/
#   rsync -a --progress --exclude 'node_modules' --exclude '.idea' ~/Projects/tangerine-nest/ madcatzx@tangerine.local:/home/madcatzx/projects/tangerine-nest/
# done

notifyloop . rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  madcatzx@tangerine.local:/home/madcatzx/projects/tangerine-nest

