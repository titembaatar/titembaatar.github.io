import createApp from './app.js'

import firestoreService from './service.firestore.js'

const appConfig = {"apiKey":"AIzaSyD6bcHI_2bkGKcG-1A0usFwJ-aVi-N_cbY","authDomain":"momotarojeanspaint.firebaseapp.com","databaseURL":"https:\u002F\u002Fmomotarojeanspaint.firebaseio.com","projectId":"momotarojeanspaint","storageBucket":"momotarojeanspaint.appspot.com","messagingSenderId":"758411193582","appId":"1:758411193582:web:bb8239cfbd9f984d2217ff"}

export default async (ctx, inject) => {
  const { firebase, session } = await createApp(appConfig, ctx)

  let servicePromises = []

  if (process.server) {
    servicePromises = [
      firestoreService(session, firebase, ctx, inject),

    ]
  }

  if (process.client) {
    servicePromises = [
      firestoreService(session, firebase, ctx, inject),

    ]
  }

  const [
    firestore
  ] = await Promise.all(servicePromises)

  const fire = {
    firestore: firestore
  }

    inject('fireModule', firebase)
    ctx.$fireModule = firebase

  inject('fire', fire)
  ctx.$fire = fire
}

function forceInject (ctx, inject, key, value) {
  inject(key, value)
  const injectKey = '$' + key
  ctx[injectKey] = value
  if (typeof window !== "undefined" && window.$nuxt) {
  // If clause makes sure it's only run when ready() is called in a component, not in a plugin.
    window.$nuxt.$options[injectKey] = value
  }
}