import Lazyload from './Lazyload'
import VirtualScroller from './VirtualScroller'

const components = {
  Lazyload,
  VirtualScroller
}

const instances = Array.from(document.querySelectorAll('[data-module]')).map(
  element => {
    console.log(element.getAttribute('data-module'))
    const Component = components[element.getAttribute('data-module')]
    if (Component) return new Component(element)
  }
)
