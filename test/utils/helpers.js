'use strict'

const range = require('lodash/range')
const isEqual = require('lodash/isEqual')

exports.orderedFinish = (n, callback) => {
  const r = range(1, n + 1)
  const finishs = []

  return (i) => {
    finishs.push(i)
    if (finishs.length === n) {
      if (!isEqual(r, finishs)) {
        return callback(new Error('Invalid finish order: ' + finishs))
      }
      callback()
    }
  }
}

exports.countToFinish = (n, callback) => {
  let pending = n

  return () => {
    pending--
    if (pending === 0) {
      callback()
    } else if (pending < 0) {
      callback(new Error('too many finishes, expected only ' + n))
    }
  }
}
