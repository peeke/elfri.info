import clampNumber from './util/clampNumber'

class VirtualScroller {
  constructor(element) {
    this.element = element
    this.state = {
      x: 0
    }

    window.addEventListener('resize', () => this.updateScrollMax())
    window.addEventListener('mousewheel', e => this.onMouseWheel(e))

    this.updateScrollMax()
  }

  set x(x) {
    this.state.x = clampNumber(x, 0, this.state.scrollMax)
  }

  get x() {
    return this.state.x
  }

  onMouseWheel(e) {
    e.preventDefault()
    this.x += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    this.animationFrame && cancelAnimationFrame(this.animationFrame)
    this.animationFrame = requestAnimationFrame(() => this.update())
  }

  update() {
    Array.from(this.element.children).forEach(child => {
      child.style.transform = `translateX(${-this.x}px)`
    })

    this.element.dispatchEvent(
      new CustomEvent('virtualscroll', {
        detail: { x: this.x },
        bubbles: true
      })
    )
  }

  updateScrollMax() {
    this.state.scrollMax =
      Array.from(this.element.children).reduce(
        (sum, child) => sum + child.scrollWidth,
        0
      ) - window.innerWidth
  }
}

export default VirtualScroller
