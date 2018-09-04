class Image {
  constructor(element) {
    this.element = element

    this.state = {
      x: 0,
      visible: false
    }

    this.updateRect = this.updateRect.bind(this)
    this.onVirtualScroll = this.onVirtualScroll.bind(this)

    window.addEventListener('resize', this.updateRect)
    document.body.addEventListener('virtualscroll', this.onVirtualScroll)

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
    const isInsideViewport =
      x > this.state.rect.left && x < this.state.rect.right

    if (isInsideViewport) {
      this.element.onload = () => {
        this.element.removeAttribute('data-src')
      }
      this.element.setAttribute('src', this.element.getAttribute('data-src'))
      window.removeEventListener('resize', this.updateRect)
      document.body.removeEventListener('virtualscroll', this.onVirtualScroll)
    }
  }

  updateRect() {
    const { left, right } = this.element.getBoundingClientRect()
    const offset = 300

    this.state.rect = {
      left: left + this.state.x - window.innerWidth - offset,
      right: right + this.state.x + offset * 8
    }
  }
}

export default Image
