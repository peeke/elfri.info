class VirtualScroller {
  constructor(element) {
    this._element = element
    this._x = 0
    window.addEventListener('mousewheel', e => this.onMouseWheel(e))
  }

  onMouseWheel(e) {
    e.preventDefault()
    this._x += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    Array.from(this._element.children).forEach(child => {
      child.style.transform = `translateX(${-this._x}px)`
    })
  }
}

export default VirtualScroller
