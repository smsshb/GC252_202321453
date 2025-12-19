class Cell {
  pos = [0, 0];
  size = [0, 0];
  state = "R";
  neighbors = [null, null, null, null, null, null, null, null];
  nextState = "R";

  //랜덤 상대 고르기
  static rule(neightbors, currentState) {
    const randomNeighbor = () => {
      const existingNeighbors = neightbors.filter((neighbor) => neighbor);
      const randomIdx = Math.floor(random(existingNeighbors.length));
      return existingNeighbors[randomIdx];
    };

    //가위바위보 먹고먹히기
    const isPredetor =
      currentState === "R"
        ? randomNeighbor().state === "P"
        : currentState === "P"
        ? randomNeighbor().state === "S"
        : randomNeighbor().state === "R";
    if (isPredetor) {
      return randomNeighbor().state;
    }
    return currentState;
  }

  constructor(pos, size, state = "R") {
    this.pos = pos;
    this.size = size;
    this.state = state;
  }

  setNeighbors(neighbors) {
    this.neighbors = neighbors;
  }

  computeNextState() {
    this.nextState = Cell.rule(this.neighbors, this.state);
  }

  updateState() {
    this.state = this.nextState;
  }

  //클릭하면 칸 바뀌도록
  toggleState() {
    this.state = this.state === "R" ? "P" : this.state === "P" ? "S" : "R";
  }

  isHovered(mouseX, mouseY) {
    return (
      mouseX >= this.pos[0] &&
      mouseX < this.pos[0] + this.size[0] &&
      mouseY >= this.pos[1] &&
      mouseY < this.pos[1] + this.size[1]
    );
  }

  render(isHovered = false) {
    noFill();
    if (isHovered) {
      stroke("black");
    } else {
      stroke("lightgray");
    }
    rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);

    noStroke();
    if (this.state === "R") {
      fill("#04ffee");
    } else if (this.state === "P") {
      fill("#f2aad3");
    } else {
      fill("#4e360f");
    }
    rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
  }
}
