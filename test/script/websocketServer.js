import { WebSocketServer, WebSocket } from 'ws';

export class WSDataManager {
    /**
     * 初始化 WebSocket 服务器管理器
     * 创建 WebSocket 服务器并设置事件监听
     */
    constructor() {
        // 存储消息的队列
        this.messageQueue = [];
        // 等待消息的 Promise 解析器数组
        this.waitingResolvers = [];
        // 消息订阅者回调函数数组
        this.subscribers = [];
        // 最后接收到的消息
        this.lastMessage = null;
        
        const wss = new WebSocketServer({ port: 12345 });
        
        wss.on('connection', (ws) => {
            console.log('新客户端已连接');
            
            ws.on('message', (data) => {
                console.log('服务端收到消息:', data.toString());
                
                try {
                    // 解析接收到的数据
                    const receivedData = JSON.parse(data.toString());
                    
                    // 广播消息给所有连接的客户端
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            // 确保发送的是格式化的 JSON 消息
                            client.send(JSON.stringify({ 
                                type: 'BROADCAST', 
                                data: receivedData,
                                timestamp: Date.now()
                            }));
                        }
                    });
                    
                    this.lastMessage = receivedData;
                    this.handleNewMessage(receivedData);
                    this.subscribers.forEach(callback => callback(receivedData));
                } catch (error) {
                    console.error('消息处理错误:', error);
                }
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

    /**
     * 处理新接收到的消息
     * 如果有等待的解析器，直接发送消息给解析器
     * 否则将消息存入队列
     * @param {any} data - 接收到的消息数据
     */
    handleNewMessage(data) {
        if (this.waitingResolvers.length > 0) {
            const resolver = this.waitingResolvers.shift();
            resolver?.(data);
        } else {
            this.messageQueue.push(data);
        }
    }

    /**
     * 等待并返回下一条消息
     * 如果消息队列中有消息，立即返回
     * 否则等待新消息到达
     * @returns {Promise<any>} 返回消息数据的 Promise
     */
    async waitForNextMessage() {
        if (this.messageQueue.length > 0) {
            return this.messageQueue.shift();
        }
        
        return new Promise(resolve => {
            this.waitingResolvers.push(resolve); // 需要注意的是，这种情况返回的是Promise对象，需要使用await来获取结果
        });
    }

    /**
     * 订阅消息
     * @param {Function} callback - 接收消息的回调函数
     * @returns {Function} 返回取消订阅的函数
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        console.log('有新的subscribers====',this.subscribers)
        // 返回取消订阅的函数
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    /**
     * 获取最后一条接收到的消息
     * @returns {any} 最后一条消息数据
     */
    getLastMessage() {
        return this.lastMessage;
    }
}

export const wsManager = new WSDataManager();