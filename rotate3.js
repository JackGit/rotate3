class Rotate3 {
  constructor (options = {}) {
    const defaultOptions = {
      object: null,
      eventTarget: document,
      onRotateStart: () => {},
      onRotate: () => {},
      onRotateEnd: () => {}
    }

    this.options = { ...defaultOptions, ...options }

    this.hasTouch = 'ontouchstart' in window
    this.events = {
      resize: 'onorientationchange' in window ? 'orientationchange' : 'resize',
      start: this.hasTouch ? 'touchstart' : 'mousedown',
      move: this.hasTouch ? 'touchmove' : 'mousemove',
      end: this.hasTouch ? 'touchend' : 'mouseup',
      cancel: this.hasTouch ? 'touchcancel' : 'mouseup'
    }

    this.object = options.object
    this.startPoint = null

    this.disabled = false

    this.init()
  }

  init () {
    this.bind()
  }

  bind () {
    const { start, move, end, resize } = this.events
    const { eventTarget } = this.options
    eventTarget.addEventListener(start, this.startHandler, { passive: false })
    eventTarget.addEventListener(move, this.moveHandler, { passive: false })
    eventTarget.addEventListener(end, this.endHandler)
    eventTarget.addEventListener(resize, this.resizeHandler)
  }

  unbind () {
    const { start, move, end, resize } = this.events
    const { eventTarget } = this.options
    eventTarget.removeEventListener(start, this.startHandler, { passive: false })
    eventTarget.removeEventListener(move, this.moveHandler, { passive: false })
    eventTarget.removeEventListener(end, this.endHandler)
    eventTarget.removeEventListener(resize, this.resizeHandler)
  }

  startHandler = e => {
    if (this.disabled) {
      return
    }

    e.preventDefault()

    e = this.hasTouch ? e.touches[0] : e
    this.startPoint = { x: e.clientX, y: e.clientY }

    this.options.onRotateStart()
  }

  moveHandler = e => {
    if (this.disabled || !this.startPoint) {
      return
    }

    e.preventDefault()

    e = this.hasTouch ? e.touches[0] : e

    const movingPoint = { x: e.clientX, y: e.clientY }
    const delta = {
      x: movingPoint.x - this.startPoint.x,
      y: movingPoint.y - this.startPoint.y
    }

    const speed = .4
    const deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        deg2Rad(delta.y * speed),
        deg2Rad(delta.x * speed),
        0,
        'XYZ'
      ))

    this.object.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.object.quaternion)

    this.startPoint = {
      x: e.clientX,
      y: e.clientY
    }
    this.options.onRotate()
  }

  endHandler = () => {
    if (this.disabled || !this.startPoint) {
      return
    }

    this.startPoint = null
    this.options.onRotateEnd()
  }

  resizeHandler = () => {}

  enable () {
    this.disabled = false
  }

  disable () {
    this.disabled = true
  }

  destroy () {
    this.unbind()
  }
}

// rad => deg
const rad2Deg = v => {
  return v * 180 / Math.PI
}

// deg => rad
const deg2Rad = v => {
  return v * Math.PI / 180
}
