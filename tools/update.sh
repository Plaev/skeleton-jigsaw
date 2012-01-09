#!/bin/bash

./bake.sh
scp -r ../index.html ../game.min.js ../media/ plaev@plaevteam.com:/home/plaev/plaevteam.com/skeleton-jigsaw/
