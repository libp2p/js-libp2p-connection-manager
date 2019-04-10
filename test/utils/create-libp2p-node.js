'use strict'

const TCP = require('libp2p-tcp')
const Multiplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const libp2p = require('libp2p')
const waterfall = require('async/waterfall')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')

const ConnManager = require('../../')

class Node extends libp2p {
  constructor (peerInfo) {
    const modules = {
      transport: [TCP],
      streamMuxer: [Multiplex],
      connEncryption: [SECIO]
    }

    super({
      peerInfo,
      modules,
      config: {
        peerDiscovery: {
          autoDial: false
        }
      }
    })

    // TODO: once libp2p 0.25 has been released this should be removed
    // It's are here to bridge the gap made by the circular dependency.
    // Ideally connection manager should be mocking libp2p instead of depending on it for testing.
    if (!this._switch.listeners('connection:start')) {
      this.on('peer:connect', (peer) => this.emit('connection:start', peer))
      this.on('peer:disconnect', (peer) => this.emit('connection:end', peer))
    }
  }
}

function createLibp2pNode (options, callback) {
  let node

  waterfall([
    (cb) => PeerId.create({bits: 1024}, cb),
    (id, cb) => PeerInfo.create(id, cb),
    (peerInfo, cb) => {
      peerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/0')
      node = new Node(peerInfo)
      // Replace the connection manager so we use source code instead of dep code
      node.connectionManager = new ConnManager(node, options)
      node.start(cb)
    }
  ], (err) => callback(err, node))
}

exports = module.exports = createLibp2pNode
exports.bundle = Node
