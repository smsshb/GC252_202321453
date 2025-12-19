class Tile {
  pos = [0, 0];
  size = [1, 1];
  neighbors = [null, null, null, null];
  // t, l, b, r
  state = false;
  binaryState = "0000";
  tileImgIdx = 0;

  constructor(x, y, w, h, state = false) {
    this.pos[0] = x;
    this.pos[1] = y;
    this.size[0] = w;
    this.size[1] = h;
    this.state = state;
  }

  setNeighbor(t, l, b, r) {
    this.neighbors[0] = t;
    this.neighbors[1] = l;
    this.neighbors[2] = b;
    this.neighbors[3] = r;
  }

  computeStates() {
    let binaryString = "";
    this.neighbors.forEach((aNeighbor) => {
      // if(aNeighbor) {
      //     binaryString += aNeighbor.state ? "1" : "0";
      // } else {
      //     binaryString += "0";
      // }
      binaryString += aNeighbor?.state ? "1" : "0";
    });
    this.binaryState = binaryString;
    this.tileImgIdx = parseInt(binaryString, 2);
  }

  isHovered(mx, my) {
    return (
      mx >= this.pos[0] &&
      mx <= this.pos[0] + this.size[0] &&
      my >= this.pos[1] &&
      my <= this.pos[1] + this.size[1]
    );
  }

  toggleState() {
    this.state = !this.state;
  }

  render(tileImgs) {
    const [x, y] = this.pos;
    const [w, h] = this.size;
    const cx = x + w / 2;
    const cy = y + h / 2;
    // push();
    // translate(cx, cy);
    // if (this.state) {
    //   circle(0, 0, Math.min(w, h));
    // }
    // pop();
    if (this.state) {
      image(
        tileImgs[this.tileImgIdx],
        this.pos[0],
        this.pos[1],
        this.size[0],
        this.size[1]
      );
    }
    push();
    translate(cx, cy);
    noStroke();
    if (this.state) {
      fill("white");
      circle(0, 0, w / 4);
    }
    fill("red");
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.binaryState.charAt(0), 0, -h / 3);
    text(this.binaryState.charAt(1), -w / 3, 0);
    text(this.binaryState.charAt(2), 0, h / 3);
    text(this.binaryState.charAt(3), w / 3, 0);
    pop();
  }
}
