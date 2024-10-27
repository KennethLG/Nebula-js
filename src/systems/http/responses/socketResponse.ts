export interface PlayerSocket {
    xVel: {
        x: number;
        y: number;
    };
    yVel: {
        x: number;
        y: number;
    };
    position: {
        x: number;
        y: number;
    },
    id: string;
    key: string;
    keyState: boolean;
    socketId: string;
}

export interface SocketResponse<T = any> {
    status: "Ok" | "Error";
    message: string;
    data: T;
}

export interface MatchFoundResponse {
    seed: string;
    id: string;
    players: PlayerSocket[];
}

export interface PlayerUpdatedResponse {
    player: PlayerSocket;
}