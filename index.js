const path = require('path')

module.exports = function nuxtApollo(moduleOptions) {
  const options = Object.assign({}, this.options.apollo, moduleOptions)
  // options.networkInterface = options.networkInterface
  // options.wsClient = options.wsClient
  // console.log(options)

  const networkInterface = options.networkInterface
  const wsClient = options.wsClient
  if (!networkInterface) throw new Error('[Apollo module] No network interfaces found in apollo configuration')
  if (!wsClient) throw new Error('[Apollo module] No ws client found in apollo configuration')


  // Add plugin for vue-apollo
  this.addPlugin({
    src: path.join(__dirname, 'plugin.js'),
    options: options
  })

  // Add vue-apollo and apollo-client in vendor
  this.addVendor(['vue-apollo', 'apollo-client', 'subscriptions-transport-ws'])

  // Add graphql loader
  this.extendBuild((config) => {
    config.resolve.extensions = config.resolve.extensions.concat('.graphql', '.gql')
  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    use: 'graphql-tag/loader'
  })
})
}
