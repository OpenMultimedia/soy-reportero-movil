#!/bin/env ruby
# encoding: utf-8

# INITIALIZATION
# Cambia el directorio de trabajo al directorio del Rakefile activo
verbose(false) { chdir File.dirname(Rake.application.rakefile) }
puts "Ejecutando Rakefile desde: #{Dir.pwd}" if verbose

# Se incluye la biblioteca de OpenMultimedia para construcción de proyectos que
# utilizan la biblioteca JavaScript basada en Closure
#require "./submodules/om-closure-tools/ombuilder/config"
#require "./submodules/om-closure-library/ombuilder/config"
#require "./submodules/snmp-closure-library/ombuilder/config"
require "./ombuilder/haml"
require "rake/clean"

require "ombuilder/include"
require "ombuilder/closure/project"
require "ombuilder/version_task"
require "ombuilder/builders/haml"

include OMBuilder::BuilderBase
include OMBuilder::HamlBuilder

INDEX_SOURCE = 'src/templates/index.haml'

INDEXES = {
  :android => 'src/www/index-android.html',
  :ios => 'src/www/index-ios.html'
}

PAGES = {
  :main => {},
  :select => {},
  :form => {},
  :list => {},
  :view => {},
  :mine => {}
}

INDEXES.each_pair do |platform, index_file|
  file index_file => FileList['./src/templates/_*.haml']

  file index_file => INDEX_SOURCE do |f|
    haml :source => INDEX_SOURCE,
      :target => index_file,
      :locals => {
        :debug => !!ENV['DEBUG'],
        :platform => platform,
        :pages => PAGES
      }
  end

  CLEAN.include index_file

  task (platform.to_s + '_www') => index_file

  task :default => index_file
end

task :android, [:operation, :install, :run] => :android_www do |t, args|
  args.with_defaults :operation => "release", :install => 'false', :run => 'false'

  install = Set['yes', 'y', 'si', 's', 'true', 't', '1'].include? args[:install].downcase

  run = Set['yes', 'y', 'si', 's', 'true', 't', '1'].include? args[:run].downcase

  command = [ Rake::Win32.windows? ? 'ant.bat' : 'ant', '-f', 'src/android/build.xml' ]

  command << args[:operation]

  command << 'install' if install

  system(*command)

  if install and run
    notice "Waiting to launch..."
    sleep 20
    system 'adb', 'shell', 'am',  'start', '-n', 'biz.openmultimedia.SoyReporteroMovil/.SoyReporteroMovil'
  end
end
