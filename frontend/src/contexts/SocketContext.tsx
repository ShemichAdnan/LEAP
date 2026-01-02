import React,{createContext,useContext,useEffect, useState} from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if(!currentUser){
            if(socket){
                socket.disconnect();    
                setSocket(null);
            }
            setConnected(false);
            return;
        }

        const socketInstance = io("http://localhost:4000", {
            withCredentials: true,
            transports: ['websocket'],
        });

        setSocket(socketInstance);

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socketInstance.on("connect", onConnect);
        socketInstance.on("disconnect", onDisconnect);

        return () => {
            socketInstance.off("connect", onConnect);
            socketInstance.off("disconnect", onDisconnect);
            socketInstance.disconnect();
        };
    }, [currentUser?.id]);

    return (
        <SocketContext.Provider value={{ socket,connected}}>
            {children}
        </SocketContext.Provider>
    );
};