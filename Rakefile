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
end


def say_green(message)
  say "<%= color('#{message}', :green) %>"
end

def say_red(message)
  say "<%= color('#{message}', :red) %>"
end

