class Poly {
  constructor(options, q) {
    this.x = options.x
    this.y = options.y
    this.w = options.w
    this.h = options.h
    this.d = options.d

    this.shape = options.shape || 'rect'
    this.color = options.color || 0
    this.alpha = options.alpha || 255

    this.velocity_x = 0
    this.velocity_y = 0
    this.acceleration_x = random(-1, 1)
    this.acceleration_y = random(-1, 1)

    this.q = q || null
    this.current = null
  }

  draw() {
    let c = color(this.color)
    c.setAlpha(this.alpha)

    fill(c)
    noStroke()

    switch (this.shape) {
      case 'rect' :
        rectMode(CORNER)
        rect(this.x, this.y, this.w, this.h)
        break
      case 'circle' :
        ellipseMode(CENTER)
        ellipse(this.x + this.d / 2, this.y + this.d / 2, this.d)
        break
      case 'triangle' :
        triangle(
          this.x, this.y + this.h,
          this.x + (this.w / 2), this.y,
          this.x + this.w, this.y + this.h
        )
        break
      case 'triangle_left' :
        triangle(
          this.x, this.y,
          this.x, this.y + this.h,
          this.x + this.w, this.y + this.h
        )
        break
      case 'triangle_right' :
        triangle(
          this.x + this.w, this.y,
          this.x + this.w, this.y + this.h,
          this.x, this.y + this.h
        )
        break
    }
  }

  update() {
    if (this.current == null && this.q.length) {
      this.current = this.q.shift()
      this.current.start = millis()
      this.current.initial = {}
      this.current.diffs = {}

      for (const key of Object.keys(this.current.props)) {
        this.current.initial[key] = this[key]
        this.current.diffs[key] = this.current.props[key] - this[key]
      }
    }

    if (this.current == null) return

    let delta = millis() - this.current.start
    if (delta < this.current.delay) return

    let progress = Math.min(1, (delta - this.current.delay) / this.current.duration)

    for (const [key, target] of Object.entries(this.current.diffs)) {
      this[key] = progress * target + this.current.initial[key]
    }

    if (progress === 1) {
      this.current = null
    }
  }
}
