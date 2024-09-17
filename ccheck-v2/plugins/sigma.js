// plugins/sigma.js
import Sigma from 'sigma';
import Graph from 'graphology';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('sigma', Sigma);
  nuxtApp.provide('graph', Graph);
});
