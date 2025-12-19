class Cell {
  pos = [0, 0];
  size = [0, 0];
  state = false;
  nextState = false;
  neighbors = [null, null, null, null, null, null, null, null];

  constructor(x, y, w, h, state = false) {
    this.pos = [x, y];
    this.size = [w, h];
    this.state = state;
  }

  setNeighbors(tl, t, tr, r, br, b, bl, l) {
    this.neighbors[0] = tl;
    this.neighbors[1] = t;
    this.neighbors[2] = tr;
    this.neighbors[3] = r;
    this.neighbors[4] = br;
    this.neighbors[5] = b;
    this.neighbors[6] = bl;
    this.neighbors[7] = l;
  }

  computeNextState() {
    const livingCnt = this.neighbors.filter((aNeighbor) => {
      return aNeighbor?.state;
    }).length;
    if (livingCnt < 2) {
      this.nextState = false;
    } else if (livingCnt > 3) {
      this.nextState = false;
    } else if (livingCnt === 3) {
      this.nextState = true;
    } else {
      this.nextState = this.state;
    }
  }
  updateState() {
    this.state = this.nextState;
  }

  isHovered(mX, mY) {
    return (
      mX >= this.pos[0] &&
      mX <= this.pos[0] + this.size[0] &&
      mY >= this.pos[1] &&
      mY <= this.pos[1] + this.size[1]
    );
  }

  toggleState() {
    this.state = !this.state;
  }

  render(isHovered = false) {
    strokeWeight(2);
    stroke(isHovered ? "red" : 200);
    if (this.state) {
      fill(0);
    } else {
      noFill();
    }
    rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
  }
}
