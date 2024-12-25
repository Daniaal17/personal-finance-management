import io from "socket.io-client";
import { environmentUrls } from "../constants";

export const socket = io(environmentUrls.file_url);

export const ConnectSocket = () => socket.connect();

export const DisconnectSocket = () => socket.disconnect();

