import './polyfills/requestIdleCallback'
import '../../node_modules/custom-event-polyfill/polyfill'

import Item from './Item'
import Image from './Image'
import Shadow from './Shadow'
import VirtualScroller from './VirtualScroller'

const components = {
  Item,
  Image,
  Shadow,
  VirtualScroller
}

const instances = [].slice
  .call(document.querySelectorAll('[data-module]'))
  .map(element => {
    const Component = components[element.getAttribute('data-module')]
    if (Component) return new Component(element)
  })
