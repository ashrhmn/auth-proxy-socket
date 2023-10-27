import { socket } from "@/services/socket";
import React, { useEffect } from "react";

const SocketComponent = () => {
  const onMessage = (message: any) => {
    console.log(message);
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    socket.on("message", onMessage);
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message", onMessage);
    };
  }, []);
  return <div>SocketComponent</div>;
};

export default SocketComponent;
