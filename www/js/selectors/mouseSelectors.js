
export const mouseToGrid = ({width, height}, ev, canvas) => {
  if (!canvas) return;
  const sqWidth = canvas.getBoundingClientRect().width / width;
  const sqHeight = canvas.getBoundingClientRect().height / height;

  return {
    x: Math.floor(ev.offsetX / sqWidth),
    y: Math.floor(ev.offsetY / sqHeight),
  };
}
