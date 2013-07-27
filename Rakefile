require 'highline/import'

task default: :setup

desc 'Setup local environment'
task :setup do
  local_impact_path = './lib/impact'
  if File.exist?(File.expand_path(local_impact_path))
    # TODO: run game
    next
  end

  default_path = '~/Downloads/Impact'
  impact_path = ask("Where is Impact.js located ?") { |p|
    p.default = default_path
  }

  expanded_impact_path = File.expand_path(impact_path)
  unless File.exist?(expanded_impact_path)
    say_red "Could not find Impact.js under #{expanded_impact_path}"
    next
  end

  impact_lib = "#{impact_path}/lib/impact"
  expanded_impact_lib = File.expand_path(impact_lib)
  say_green "Copying lib from #{expanded_impact_lib} to #{local_impact_path}"
  `cp -R #{expanded_impact_lib}/ #{local_impact_path}`


  weltmeister_lib = "#{impact_path}/lib/weltmeister"
  local_weltmeister_path = './lib/weltmeister'
  expanded_weltmeister_lib = File.expand_path(weltmeister_lib)
  say_green "Copying weltmeister from #{expanded_weltmeister_lib} to " +
    "#{local_weltmeister_path}"
  `cp -R #{expanded_weltmeister_lib}/ #{local_weltmeister_path}`
  # Remove the php references
  say_green "Removing PHP references from #{local_weltmeister_path}/config.js"
  `sed -i.bak 's/\.php//g' #{local_weltmeister_path}/config.js`

  weltmeister_html = "#{impact_path}/weltmeister.html"
  say_green "Copying weltmeister.html from #{weltmeister_html} to ."
  `cp #{weltmeister_html} .`
end


def say_green(message)
  say "<%= color('#{message}', :green) %>"
end

def say_red(message)
  say "<%= color('#{message}', :red) %>"
end

