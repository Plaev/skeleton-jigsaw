#!/bin/bash

./bake.sh
sed -i 's/<script type="text\/javascript" src="lib\/impact\/impact.js"><\/script>//g' ../index.html
sed -i 's/<script type="text\/javascript" src="lib\/game\/main.js"><\/script>//g' ../index.html
sed -i 's/<!-- <script type="text\/javascript" src="game.min.js"><\/script> -->/<script type="text\/javascript" src="game.min.js"><\/script>/g' ../index.html

scp -r ../index.html ../game.min.js ../media/ plaev@plaevteam.com:/home/plaev/plaevteam.com/skeleton-jigsaw/
git checkout ../index.html
