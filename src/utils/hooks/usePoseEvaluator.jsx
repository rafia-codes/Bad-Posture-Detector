import { useState, useEffect } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { checkPosture } from "../poseUtils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";

export function usePoseEvaluator(videoRef, canvasRef, skeletonCanvasRef = null, showOverlay = true) {
  const [postureStatus, setPostureStatus] = useState(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

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

      // PiP Skeleton Drawing
      if (results.poseLandmarks && skeletonCanvasRef?.current) {
        const pipCtx = skeletonCanvasRef.current.getContext("2d");
        const width = skeletonCanvasRef.current.width;
        const height = skeletonCanvasRef.current.height;

        pipCtx.save();
        pipCtx.clearRect(0, 0, width, height);
        pipCtx.fillStyle = "black";
        pipCtx.fillRect(0, 0, width, height);

        const scaled = results.poseLandmarks.map((lm) => ({
          x: lm.x * width,
          y: lm.y * height,
        }));

        drawConnectors(pipCtx, scaled, POSE_CONNECTIONS, {
          color: "lime",
          lineWidth: 2,
        });

        drawLandmarks(pipCtx, scaled, {
          color: "white",
          radius: 3,
        });

        pipCtx.restore();
      }

      // Overlay Mode Drawing (draw only if PiP is not used and overlay toggle is ON)
      if (results.poseLandmarks && !skeletonCanvasRef && showOverlay) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "lime",
          lineWidth: 2,
        });

        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "white",
          radius: 3,
        });
      }

      // Posture evaluation
      if (results.poseLandmarks) {
        const posture = checkPosture(results.poseLandmarks);
        setPostureStatus(posture);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [videoRef, canvasRef, skeletonCanvasRef, showOverlay]);

  return postureStatus;
}
