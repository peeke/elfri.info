class Item {
  constructor(element) {
    this.element = element

    this.state = {
      x: 0,
      visible: null
    }

    window.addEventListener('resize', () => this.updateRect())
    document.body.addEventListener('virtualscroll', e =>
      this.onVirtualScroll(e)
    )

    this.updateRect()
    this.update(0)
  }

  set visible(bool) {
    if (this.state.visible === bool) return
    this.state.visible = bool

    this._idleCallback && cancelIdleCallback(this._idleCallback)
    if (bool) {
      this.element.style.visibility = ''
    } else {
      this._idleCallback = requestIdleCallback(() => {
        this.element.style.visibility = 'hidden'
      })
    }
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

    this.visible = !isOutsideViewport
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

export default Item
