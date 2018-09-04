import clampNumber from './util/clampNumber'

class VirtualScroller {
  constructor(element) {
    this.element = element
    this.state = {
      x: 0,
      dx: 0,
      fastScrolling: false
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

  set fastScrolling(bool) {
    if (this.state.fastScrolling === bool) return
    this.state.fastScrolling = bool

    this.element.setAttribute(
      'data-fast-scrolling',
      String(this.state.fastScrolling)
    )
  }

  get fastScrolling() {
    return this.state.x
  }

  onMouseWheel(e) {
    console.log(e)
    e.preventDefault()
    const x = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    this.state.dx += x
    this.x += x
    this.animationFrame && cancelAnimationFrame(this.animationFrame)
    this.animationFrame = requestAnimationFrame(() => this.update())
  }

  update() {
    this.fastScrolling = Math.abs(this.state.dx) > 85
    this.state.dx = 0

    Array.from(this.element.children).forEach(child => {
      child.style.transform = `translate3d(${-this.x}px, 0, 0)`
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
