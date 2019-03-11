#!/bin/sh

rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  madcatzx@tangerine.local:/home/madcatzx/projects/tangerine-nest

notifyloop . rsync -avz --progress --exclude 'node_modules' --exclude '.idea' .  madcatzx@tangerine.local:/home/madcatzx/projects/tangerine-nest

