import { WebSocketServer } from 'ws';

export class WSDataManager {
    constructor() {
        this.messageQueue = [];
        this.waitingResolvers = [];
        this.subscribers = [];
        this.lastMessage = null;
        
        const wss = new WebSocketServer({ port: 12345 });
        
        wss.on('connection', (ws) => {
            console.log('新客户端已连接');
            
            ws.on('message', (data) => {
                this.lastMessage = data;
                this.handleNewMessage(data);
                this.subscribers.forEach(callback => callback(data));
            });

            ws.on('error', (error) => {
                console.error('WebSocket 错误:', error);
            });

            ws.on('close', () => {
                console.log('客户端连接已断开');
            });
        });

        wss.on('error', (error) => {
            console.error('WebSocket 服务器错误:', error);
        });

        wss.on('close', () => {
            console.log('WebSocket 服务器已关闭');
        });
    }

    handleNewMessage(data) {
        if (this.waitingResolvers.length > 0) {
            const resolver = this.waitingResolvers.shift();
            resolver?.(data);
        } else {
            this.messageQueue.push(data);
        }
    }

    async waitForNextMessage() {
        if (this.messageQueue.length > 0) {
            return this.messageQueue.shift();
        }
        
        return new Promise(resolve => {
            this.waitingResolvers.push(resolve);
        });
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    getLastMessage() {
        return this.lastMessage;
    }
}

export const wsManager = new WSDataManager();