var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
var isStaging = process.env.NODE_ENV === 'staging'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: (isProduction || isStaging)
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: (isProduction || isStaging)
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
