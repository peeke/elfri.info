import clampNumber from './util/clampNumber'

const DOM_DELTA_PIXEL = 0x00
const DOM_DELTA_LINE = 0x01
const DOM_DELTA_PAGE = 0x02
const LINE_DELTA =
  'getComputedStyle' in window
    ? parseInt(
        window.getComputedStyle(document.body).getPropertyValue('font-size')
      )
    : 16

const PAGE_DELTA = LINE_DELTA * 20

class VirtualScroller {
  constructor(element) {
    this.element = element
    this.state = {
      x: 0,
      dx: 0,
      touchX: 0,
      fastScrolling: false
    }

    window.addEventListener('resize', () => this.updateScrollMax())
    this.element.addEventListener('wheel', e => this.onMouseWheel(e), {
      passive: true
    })
    this.element.addEventListener('touchstart', e => this.onTouchStart(e), {
      passive: true
    })
    this.element.addEventListener('touchmove', e => this.onTouchMove(e))

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
    this.element.firstElementChild.style.transition = this.state.fastScrolling
      ? 'none'
      : ''
  }

  get fastScrolling() {
    return this.state.x
  }

  onMouseWheel(e) {
    const { x, y } = this.getDelta(e)
    const horizontal = Math.abs(x) > Math.abs(y)
    const dx = horizontal ? x : y

    this.state.dx += dx
    this.x += dx
    this.animationFrame && cancelAnimationFrame(this.animationFrame)
    this.animationFrame = requestAnimationFrame(() => this.update())
  }

  onTouchStart(e) {
    this.touchX = e.touches[0].pageX
  }

  onTouchMove(e) {
    const dx = this.touchX - e.touches[0].pageX
    this.touchX = e.touches[0].pageX

    this.state.dx += dx
    this.x += dx
    this.animationFrame && cancelAnimationFrame(this.animationFrame)
    this.animationFrame = requestAnimationFrame(() => this.update())
  }

  update() {
    this.fastScrolling = Math.abs(this.state.dx) > 85
    this.state.dx = 0

    // this.element.scrollLeft = this.x
    this.element.firstElementChild.style.transform = `translate3d(${-this
      .x}px, 0, 0)`

    this.element.dispatchEvent(
      new CustomEvent('virtualscroll', {
        detail: { x: this.x },
        bubbles: true
      })
    )
  }

  updateScrollMax() {
    this.state.scrollMax =
      [].slice
        .call(this.element.children)
        .reduce((sum, child) => sum + child.scrollWidth, 0) - window.innerWidth
  }

  getDelta(e) {
    switch (e.deltaMode) {
      case DOM_DELTA_PIXEL:
        return {
          x: e.deltaX,
          y: e.deltaY
        }
      case DOM_DELTA_LINE:
        return {
          x: e.deltaX * LINE_DELTA,
          y: e.deltaY * LINE_DELTA
        }
      case DOM_DELTA_PAGE:
        return {
          x: e.deltaX * PAGE_DELTA,
          y: e.deltaY * PAGE_DELTA
        }
    }
  }
}

export default VirtualScroller
