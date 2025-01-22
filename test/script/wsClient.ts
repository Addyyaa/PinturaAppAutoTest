// websocket-client.ts
import WebSocket from 'ws';

// 定义消息类型（根据实际业务需求扩展）
type MessageType = {
  [token: string]: any; // 可以是任意结构，建议根据业务定义具体类型
  // type: string;       // 示例：强制要求消息包含 type 字段
};

export default class WebSocketClient {
  private url: string;
  private client: WebSocket | null = null;
  private messageQueue: MessageType[] = [];
  private waitingResolvers: Array<(message: MessageType) => void> = [];

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 连接到 WebSocket 服务端
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new WebSocket(this.url);

      // 连接成功
      this.client.on('open', () => {
        console.log('WebSocket 连接成功');
        resolve();
      });

      // 连接错误
      this.client.on('error', (error) => {
        console.error('WebSocket 连接错误:', error);
        reject(error);
      });

      // 接收消息
      this.client.on('message', (data: WebSocket.Data) => {
        try {
          console.log("收到消息====",data)
          const message: MessageType = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('消息解析失败:', error);
        }
      });
    });
  }

  /**
   * 处理收到的消息
   * @param message - 解析后的消息对象
   */
  private handleMessage(message: MessageType): void {
    if (this.waitingResolvers.length > 0) {
      const resolver = this.waitingResolvers.shift();
      resolver?.(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  /**
   * 等待下一条消息
   * @param timeout - 超时时间（毫秒），默认 5 秒
   * @returns 消息数据 Promise
   */
  async waitForNextMessage(timeout: number = 5000): Promise<MessageType> {
    // 如果队列中有消息，直接返回
    if (this.messageQueue.length > 0) {
      return this.messageQueue.shift()!;
    }

    // 等待新消息或超时
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`等待消息超时（${timeout}ms）`));
      }, timeout);

      // 将 resolve 函数存入等待队列
      this.waitingResolvers.push((message) => {
        clearTimeout(timer);
        resolve(message);
      });
    });
  }

  /**
   * 发送消息到服务端
   * @param message - 要发送的消息对象
   */
  send(message: MessageType): void {
    if (!this.client || this.client.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接');
    }
    this.client.send(JSON.stringify(message));
  }

  /**
   * 关闭连接
   */
  close(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }
}