class Image {
  constructor(element) {
    this.element = element
    this.updateBoundaries()
  }

  updateBoundaries() {
    this.boundaries = {}
  }
}

export default Image
