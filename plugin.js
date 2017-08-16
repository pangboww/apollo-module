import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import { addGraphQLSubscriptions } from 'subscriptions-transport-ws'

Vue.use(VueApollo)

export default ({ isClient, isServer, app, route, beforeNuxtRender }) => {
  const providerOptions = {
    clients: {}
  }
  const networkInterface = require('<%= options.networkInterface %>').default
  let defaultClient
  if (isServer) {
    defaultClient = new ApolloClient({
      networkInterface,
      ssrMode: true
    })
  } else {
    const wsClient = require('<%= options.wsClient %>').default
    defaultClient = new ApolloClient({
      networkInterface: addGraphQLSubscriptions(networkInterface, wsClient),
      initialState: window.__NUXT__.apollo.defaultClient,
      ssrForceFetchDelay: 100
    })
  }

  providerOptions.defaultClient = defaultClient

  app.apolloProvider = new VueApollo(providerOptions)

  if (isServer) {
    beforeNuxtRender(async ({ Components, nuxtState }) => {
      await app.apolloProvider.prefetchAll({ route }, Components)
      nuxtState.apollo = app.apolloProvider.getStates()
  })
  }
}