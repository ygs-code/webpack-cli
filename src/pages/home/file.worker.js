// 异步渲染canvas
self.onmessage = (e) => {
  let frameCount = 0;
  let canvasB = e.data.canvas;
  let ctxWorker = canvasB.getContext("2d");
  drawCanvas({
    canvasB,
    ctxWorker,
    frameCount,
  });
};

function drawCanvas({canvasB, ctxWorker, frameCount}) {
  frameCount++;
  ctxWorker.clearRect(0, 0, ctxWorker.canvas.width, ctxWorker.canvas.height);
  ctxWorker.fillStyle = "#000000";
  ctxWorker.beginPath();
  ctxWorker.arc(
    150,
    150,
    20 * Math.sin(frameCount * 0.05) ** 2,
    0,
    2 * Math.PI
  );
  ctxWorker.fill();
  /* 之后可以通过cancelAnimationFrame将动画取消 */
  let frameId = self.requestAnimationFrame(() => {
    drawCanvas({
      canvasB,
      ctxWorker,
      frameCount,
    });
  });
  console.log(1);
}

// export default  drawCanvas
