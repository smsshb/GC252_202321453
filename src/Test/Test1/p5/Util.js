// ===== Util.js =====

// Constrain the vector to be at a certain range of the anchor
function constrainDistance(pos, anchor, constraint) {
  return p5.Vector.add(anchor, p5.Vector.sub(pos, anchor).setMag(constraint));
}

// Constrain the angle to be within a certain range of the anchor
function constrainAngle(angle, anchor, constraint) {
  if (abs(relativeAngleDiff(angle, anchor)) <= constraint) {
    return simplifyAngle(angle);
  }

  if (relativeAngleDiff(angle, anchor) > constraint) {
    return simplifyAngle(anchor - constraint);
  }

  return simplifyAngle(anchor + constraint);
}

// How many radians do you need to turn the angle to match the anchor?
function relativeAngleDiff(angle, anchor) {
  angle = simplifyAngle(angle + PI - anchor);
  anchor = PI;
  return anchor - angle;
}

// Simplify angle into [0, TWO_PI)
function simplifyAngle(angle) {
  while (angle >= TWO_PI) angle -= TWO_PI;
  while (angle < 0) angle += TWO_PI;
  return angle;
}

function lerpAngle(a, b, t) {
  const diff = atan2(sin(b - a), cos(b - a)); // 각도 차이를 -PI~PI로
  return a + diff * t;
}
