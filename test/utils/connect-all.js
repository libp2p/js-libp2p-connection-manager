'use strict'

const eachSeries = require('async/eachSeries')
const without = require('lodash/without')

module.exports = (nodes, callback) => {
  eachSeries(
    nodes,
    (node, cb) => {
      eachSeries(
        without(nodes, node),
        (otherNode, cb) => node.dial(otherNode.peerInfo, cb),
        cb
      )
    },
    callback
  )
}
