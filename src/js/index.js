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

const instances = Array.from(document.querySelectorAll('[data-module]')).map(
  element => {
    const Component = components[element.getAttribute('data-module')]
    if (Component) return new Component(element)
  }
)
