import { useState, useEffect } from "react";
import { Pose } from "@mediapipe/pose";
import { checkPosture } from "../poseUtils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";

export const useVideoPose = (videoRef, canvasRef, skeletonCanvasRef) => {
  const [postureStatus, setPostureStatus] = useState(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !skeletonCanvasRef?.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      const skeletonCtx = skeletonCanvasRef.current.getContext("2d");

      // Draw raw video frame
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasCtx.restore();

      // Draw skeleton pose
      skeletonCtx.save();
      skeletonCtx.clearRect(0, 0, 640, 480);
      skeletonCtx.fillStyle = "black";
      skeletonCtx.fillRect(0, 0, 640, 480);

      if (results.poseLandmarks) {
        drawConnectors(skeletonCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "lime",
          lineWidth: 3,
        });

        drawLandmarks(skeletonCtx, results.poseLandmarks, {
          color: "white",
          radius: 4,
        });

        const posture = checkPosture(results.poseLandmarks);
        setPostureStatus(posture);
      }

      skeletonCtx.restore();
    });

    // Evaluate frame on play
    const processFrame = async () => {
      if (videoRef.current.paused || videoRef.current.ended) return;
      await pose.send({ image: videoRef.current });
      requestAnimationFrame(processFrame);
    };

    videoRef.current.onplay = () => {
      requestAnimationFrame(processFrame);
    };

    return () => {
      videoRef.current.onplay = null;
    };
  }, [videoRef, canvasRef, skeletonCanvasRef]);

  return postureStatus;
};
