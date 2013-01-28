#!/usr/bin/env node

var findit = require('findit')
var path = require('path')
var gift = require('gift')
var http = require('http')
var npmconf = require('npmconf')
var log = require('npmlog')
var NpmClient = new require('npm-registry-client')
var readJson = require('read-package-json')

npmconf.load(function(err, conf) {
  client = new NpmClient(conf)
})

var finder = findit.find(process.cwd())
  , client = null
  , pending = 0
  , messages = []

finder.on('directory', function(dir) {
  if(path.basename(dir) === '.git') {
    pending++
    checkDirectory(dir, handleDirectoryCompletion)
  }
})

function handleDirectoryCompletion(msg) {
  messages.push(msg)
  if(messages.length === pending)
    printMessages()
}

function printMessages() {
  for(var i = 0; i < messages.length; i++) {
    var message = messages[i]
    log.log(message.level, message.prefix, message.text)
  }
}

function checkDirectory(dir, cb) {
  var workingdir = path.dirname(dir)
    , repo = gift(workingdir)
    , pkg = null
    , error = null

  var status = null
    , publishedVersion = null
    , currentVersion = null
    , lastCommit = null

  readPackageFile()
  getGitStatus()
  getLastCommit()

  function readPackageFile() {
    var file = path.join(workingdir, 'package.json')
    readJson(file, function(err, data) {
      if(err) return handleError(err)
      pkg = data
      getPublishedVersion()
      getCurrentVersion()
    })
  }

  function getPublishedVersion() {
    if(error) return
    if(!client) return setTimeout(getPublishedVersion, 200)
    client.get('/' + pkg.name, function(err, published) {
      if(err) return handleError(err)
      publishedVersion = published["dist-tags"].latest
      checkAllKnownVariables()
    })
  }

  function getLastCommit() {
    repo.commits("master", 1, function(err, data) {
      if(err) return handleError(err)
      lastCommit = data[0].message
      checkAllKnownVariables()
    })
  }

  function getCurrentVersion() {
    if(error) return
    if(!client) setTimeout(getCurrentVersion, 200)
    currentVersion = pkg.version
    checkAllKnownVariables()
  }

  function getGitStatus() {
    repo.status(function(err, data) {
      if(err) return handleError(err)
      status = data
      checkAllKnownVariables()
    })
  }

  function handleError(err) {
    error = err
    checkAllKnownVariables()
  }

  function checkAllKnownVariables() {
    if(error) {
      if(error.code === 'E404') return cb({
        level: 'warn',
        text: "not a published package",
        prefix: workingdir
      })
      cb({
        level: 'error',
        text: error,
        prefix: workingdir
      })
    } 
    else if(status && publishedVersion && lastCommit && currentVersion) {
      if(!status.clean) return cb({
        level: 'warn',
        text: "Git repository is not clean",
        prefix: workingdir
      })
      if(currentVersion !== publishedVersion) return cb({
        level: 'warn',
        text: ["Current version", currentVersion, "is not equal to published version", publishedVersion].join(' '),
        prefix: workingdir
      })
      if(lastCommit !== currentVersion) return cb({
         level: 'warn',
         text: ["Last commit is not a verson bump: ", '"', lastCommit, '"'].join(''),
         prefix: workingdir,
      })
      cb({
        level: 'info',
        text: "fully up to date",
        prefix: workingdir
      })
    }
  }
}
