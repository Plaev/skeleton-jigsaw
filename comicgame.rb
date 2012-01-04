# -*- coding: UTF-8 -*-
require "sinatra"

class Comicgame < Sinatra::Base
  set :public, File.expand_path(File.dirname(__FILE__))

  get "/" do
    File.read(File.join("index.html"))
  end
end
