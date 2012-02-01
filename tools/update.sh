#!/bin/bash

./bake.sh
if [ -d /Applications ]; then
	sed -i '' 's/<script type="text\/javascript" src="lib\/impact\/impact.js"><\/script>//g' ../index.html
	sed -i '' 's/<script type="text\/javascript" src="lib\/game\/main.js"><\/script>//g' ../index.html
	sed -i '' 's/<!-- <script type="text\/javascript" src="game.min.js"><\/script> -->/<script type="text\/javascript" src="game.min.js"><\/script>/g' ../index.html
else
	sed -i 's/<script type="text\/javascript" src="lib\/impact\/impact.js"><\/script>//g' ../index.html
	sed -i 's/<script type="text\/javascript" src="lib\/game\/main.js"><\/script>//g' ../index.html
	sed -i 's/<!-- <script type="text\/javascript" src="game.min.js"><\/script> -->/<script type="text\/javascript" src="game.min.js"><\/script>/g' ../index.html
fi

scp -r ../index.html ../game.min.js ../media/ plaevgames@plaevteam.com:/home/plaev/plaevteam.com/skeleton-jigsaw/
git checkout ../index.html
