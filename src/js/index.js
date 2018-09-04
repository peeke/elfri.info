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
    console.log(element.getAttribute('data-module'))
    const Component = components[element.getAttribute('data-module')]
    if (Component) return new Component(element)
  }
)
