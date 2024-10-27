import React, {useEffect, useRef, memo} from "react";
import Worker from "./file.worker.js";
import "./index.scss";

const fib = (n) => {
  if (n <= 1) {
    return 1;
  }
  return fib(n - 1) + fib(n - 2);
};

// 定义 worker thread来渲染 canvasTwo （语法为webpack本地的写法）
// const canvasWorker = new Worker("./worker.js");

const canvasWorker = new Worker();

export default memo(() => {
  const canvasOneRef = useRef(null);
  const canvasTwoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasOneRef.current;
    const ctx = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(150, 150, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
      ctx.fill();
      // 动画渲染
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    const transfercanvasWorker =
      canvasTwoRef.current.transferControlToOffscreen();
    canvasWorker.onmessage = function (e) {
      console.log("Message from worker:", e.data);
    };

    canvasWorker.onerror = function (error) {
      console.error("Worker error:", error);
    };

    // canvasWorker.postMessage('Start working!');
    canvasWorker.postMessage(
      {
        canvas: transfercanvasWorker,
      },
      [transfercanvasWorker]
    );

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const alertFib = () => {
    console.log(fib(40));
  };

  return (
    <div className="container">
      <div>
        <canvas ref={canvasOneRef} width={300} height={300} />
        <span>正常渲染Canvas</span>
      </div>
      <div>
        <canvas ref={canvasTwoRef} width={300} height={300} />
        <span>离屏渲染Canvas</span>
      </div>
      <button onClick={alertFib}>求解斐波那契数列</button>
    </div>
  );
});
