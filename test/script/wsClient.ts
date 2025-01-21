import * as WebSocket from 'ws';

class WebSocketClient {
    private url: string;
    private socket: WebSocket | null;

    constructor(url: string) {
        this.url = url;
        this.socket = null;
    }

    // 连接 WebSocket
    connect(): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);

            this.socket.on('open', () => {
                console.log('WebSocket 连接已建立');
                resolve(this.socket as WebSocket); // 此时 socket 已连接，断言为非空
            });

            this.socket.on('message', (data: WebSocket.RawData) => {
                console.log('收到 WebSocket 消息:', data.toString());
            });

            this.socket.on('error', (err: Error) => {
                console.error('WebSocket 发生错误:', err);
                reject(err);
            });

            this.socket.on('close', () => {
                console.log('WebSocket 连接已关闭');
            });
        });
    }

    // 发送消息
    sendMessage(message: Record<string, unknown> | string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = typeof message === 'string' ? message : JSON.stringify(message);
            this.socket.send(data);
        } else {
            console.error('WebSocket 未连接，无法发送消息');
        }
    }

    // 关闭连接
    close(): void {
        if (this.socket) {
            this.socket.close();
            console.log('WebSocket 已关闭');
        }
    }
}

export default WebSocketClient;
