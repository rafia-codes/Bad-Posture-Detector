
export function checkPosture(landmarks) {
  const results = {
    backStraight: true,
    headTilted: false,
    kneeOverToe: false,
  };

  if (!landmarks || landmarks.length < 33) return results;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftEar = landmarks[7];
  const rightEar = landmarks[8];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];

  const backAngle =
    Math.abs(leftShoulder.y - leftHip.y + rightShoulder.y - rightHip.y) / 2;
  if (backAngle < 0.15) {
    results.backStraight = true;
  } else {
    results.backStraight = false;
  }

  const headTilt =
    Math.abs(leftEar.x - leftShoulder.x + rightEar.x - rightShoulder.x) / 2;
  if (headTilt > 0.07) {
    results.headTilted = true;
  }

  if (leftKnee.y < leftAnkle.y - 0.05) {
    results.kneeOverToe = true;
  }

  return results;
}
