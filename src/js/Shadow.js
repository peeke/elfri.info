import mapNumber from './util/mapNumber'

class Shadow {
  constructor(element) {
    this.element = element

    this.state = {
      x: 0
    }

    window.addEventListener('resize', () => this.updateRect())
    window.addEventListener('load', () => this.updateRect())
    document.body.addEventListener('virtualscroll', e =>
      this.onVirtualScroll(e)
    )

    this.updateRect()
    this.update(0)
  }

  onVirtualScroll(e) {
    this.state.x = e.detail.x
    this._animationFrame && cancelAnimationFrame(this._animationFrame)
    this._animationFrame = requestAnimationFrame(() =>
      this.update(this.state.x)
    )
  }

  update(x) {
    const isOutsideViewport =
      x < this.state.rect.left || x > this.state.rect.right

    if (isOutsideViewport) return

    const translation = mapNumber(
      x,
      this.state.rect.left,
      this.state.rect.right,
      100,
      -100
    )

    const opacity =
      (mapNumber(x, this.state.rect.left, this.state.rect.right, 0, 2) - 1) ** 2

    this.element.style.transform = `translateX(${translation}px)`
    this.element.style.opacity = (opacity / 4) * 3 + 0.25
  }

  updateRect() {
    const { left, right } = this.element.getBoundingClientRect()
    const offset = 300

    this.state.rect = {
      left: left + this.state.x - window.innerWidth - offset,
      right: right + this.state.x + offset
    }
  }
}

export default Shadow
