class Particle {
  pos;
  w;
  h;
  angle;
  colour;
  constructor(posX, posY, area, minSize = 4) {
    this.pos = createVector(posX, posY);
    this.w = random(minSize, area);
    this.h = area / this.w;
    this.angle = random(360);
    const paletteIdx = floor(random(palette.length));
    this.colour = palette[paletteIdx];
  }

  drawRect() {
    fill(this.colour);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(radians(this.angle));
    rect(-0.5 * this.w, -0.5 * this.h, this.w, this.h);
    pop();
  }
}
