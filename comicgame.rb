# -*- coding: UTF-8 -*-
require "sinatra"

class Comicgame < Sinatra::Base
  get "/" do
    File.read(File.join("index.html"))
  end
end
