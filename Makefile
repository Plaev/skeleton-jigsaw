##########################################
#   Skeleton Jigsaw
#   http://plaev.github.com
##########################################

NAME = game.min

# Google Closure Compiler Options
GCC_OPTION = --jscomp_off=internetExplorerChecks

#--compilation_level ADVANCED_OPTIMIZATIONS

publish: unify
	if test -d /Applications; then \
		sed -i '' 's/<script type="text\/javascript" src="lib\/impact\/impact.js"><\/script>//g' index.html; \
		sed -i '' 's/<script type="text\/javascript" src="lib\/game\/main.js"><\/script>//g' index.html; \
		sed -i '' 's/<!-- <script type="text\/javascript" src="game.min.js"><\/script> -->/<script type="text\/javascript" src="game.min.js"><\/script>/g' index.html; \
	else \
		sed -i 's/<script type="text\/javascript" src="lib\/impact\/impact.js"><\/script>//g' index.html;\
		sed -i 's/<script type="text\/javascript" src="lib\/game\/main.js"><\/script>//g' index.html;\
		sed -i 's/<!-- <script type="text\/javascript" src="game.min.js"><\/script> -->/<script type="text\/javascript" src="game.min.js"><\/script>/g' index.html;\
	fi

	scp -r index.html game.min.js media/ plaevgames@plaevteam.com:/home/plaevgames/plaevteam.com/skeleton-jigsaw/
	git checkout index.html

unify:
	./tools/bake.sh

check:
	find lib/game -name "*.js" -exec jshint {} \;

impact:
	if test -d /Applications; then \
		sed -i '' 's/\.php//g' lib/weltmeister/config.js; \
		sed -i '' 's/cd \.\.//g' tools/bake.sh; \
	else \
		sed -i 's/\.php//g' lib/weltmeister/config.js; \
		sed -i 's/cd \.\.//g' tools/bake.sh; \
	fi

