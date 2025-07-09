import React, { useRef, useState } from "react";
import { usePoseEvaluator } from "../utils/hooks/usePoseEvaluator";

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showOverlay, setShowOverlay] = useState(true);

  const postureStatus = usePoseEvaluator(videoRef, canvasRef, null, showOverlay);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />

      <div className="mt-4 flex items-center gap-2">
        <input
          id="showOverlay"
          type="checkbox"
          checked={showOverlay}
          onChange={(e) => setShowOverlay(e.target.checked)}
          className="h-4 w-4 text-blue-600"
        />
        <label htmlFor="showOverlay" className="text-sm text-gray-800">
          Show Skeleton Overlay
        </label>
      </div>

      <div className="relative w-fit">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="border border-gray-300"
        />
      </div>

      {postureStatus && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow text-sm">
          <p>
            <strong>Back:</strong>{" "}
            {postureStatus.backStraight ? "✅ Straight" : "❌ Bent"}
          </p>
          <p>
            <strong>Head:</strong>{" "}
            {postureStatus.headTilted ? "❌ Tilted" : "✅ Straight"}
          </p>
          <p>
            <strong>Knee:</strong>{" "}
            {postureStatus.kneeOverToe ? "❌ Over Toe" : "✅ Correct"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
