##########################################
#   Plaev website
#   http://plaev.me
##########################################

prepare:
	@echo " ----> Preparing environment!"
	@gem install haml bluecloth

pages:
	@haml -e index.haml > index.html
	@echo " ----> Done!"
