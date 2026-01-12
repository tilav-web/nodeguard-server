import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
    transports: ["websocket"],
})

export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log("WebSocket server initialized");
    }

    handleConnection(client: Socket) {
        const worker_key = client.handshake.auth.worker_key;
        if (!worker_key) {
            client.disconnect();
            console.log(`Client disconnected due to missing worker_key: ${client.id}`);
            return;
        }

        

    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }
}