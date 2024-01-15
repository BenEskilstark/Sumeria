
export const setupSocket = (dispatch) => {
  let hostname = window.location.hostname;
  if (hostname == 'localhost') hostname += ':8000';

  let socket = {emit: () => {}, isSinglePlayer: true};
  try {
    socket = io(hostname);
    socket.on("action", dispatch);
  } catch (ex) {
    console.log(ex);
  }

  return socket;
}

export const dispatchToServer = (socket, action) => {
  try {
    socket.emit("dispatch", action);
  } catch (ex) {
    console.log(ex);
  }
}
