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
    this.element.addEventListener('load', () => {
      this.element.dispatchEvent(new CustomEvent('resize', { bubbles: true }))
    })

    this.updateRect()
    this.update(0)
  }

  onVirtualScroll(e) {
    this.state.x = e.detail.x
    this._animationFrame && cancelIdleCallback(this._animationFrame)
    this._animationFrame = requestIdleCallback(() => {
      this.update(this.state.x)
    })
  }

  update(x) {
    const isNear =
      x > this.state.rect.left - 800 && x < this.state.rect.right + 1920 * 5

    const isInsideViewport =
      x > this.state.rect.left && x < this.state.rect.right

    if (!isNear) return

    if (this.element.naturalWidth !== 0 && this.element.naturalHeight !== 0) {
      this.element.style.width = this.element.offsetWidth + 'px'
      this.element.style.height = this.element.offsetHeight + 'px'
    }

    this.element.onload = () => {
      if (!isInsideViewport) {
        this.element.style.transition = 'none'
      }

      this.element.removeAttribute('data-src')
      this.element.style.width = ''
      this.element.style.height = ''
    }

    this.element.setAttribute('src', this.element.getAttribute('data-src'))
    window.removeEventListener('resize', this.updateRect)
    document.body.removeEventListener('virtualscroll', this.onVirtualScroll)
  }

  updateRect() {
    const { left, right } = this.element.getBoundingClientRect()

    this.state.rect = {
      left: left + this.state.x - window.innerWidth,
      right: right + this.state.x
    }
  }
}

export default Image
