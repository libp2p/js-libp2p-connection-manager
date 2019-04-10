'use strict'

const waterfall = require('async/waterfall')

const createTempRepo = require('./create-temp-repo-nodejs')
const createLibp2pNode = require('./create-libp2p-node')

module.exports = (options, callback) => {
  waterfall([
    (cb) => createTempRepo(cb),
    (repo, cb) => {
      createLibp2pNode(options, (err, node) => cb(err, repo, node))
    }
  ], (err, repo, libp2pNode) => {
    callback(err, {
      repo: repo,
      libp2pNode: libp2pNode
    })
  })
}
