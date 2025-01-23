// websocket-client.js
import WebSocket from 'ws';

export default class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.client = null;
    this.messageQueue = [];
    this.waitingResolvers = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.client = new WebSocket(this.url);

      this.client.on('open', () => {
        console.log('WebSocket 连接成功');
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('WebSocket 连接错误:', error);
        reject(error);
      });

      this.client.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('消息解析失败:', error);
        }
      });
    });
  }

  handleMessage(message) {
    if (this.waitingResolvers.length > 0) {
      const resolver = this.waitingResolvers.shift();
      if (resolver) {
        resolver(message);
      }
    } else {
      this.messageQueue.push(message);
    }
  }

  async waitForNextMessage(timeout = 5000) {
    if (this.messageQueue.length > 0) {
      return this.messageQueue.shift();
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`等待消息超时（${timeout}ms）`));
      }, timeout);

      this.waitingResolvers.push((message) => {
        clearTimeout(timer);
        resolve(message);
      });
    });
  }

  send(message) {
    if (!this.client || this.client.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接');
    }
    this.client.send(JSON.stringify(message));
  }

  close() {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }
}

// 添加测试代码
async function test() {
  console.log('开始测试 WebSocket 客户端');
  const wsClient = new WebSocketClient('ws://localhost:12345');
  
  try {
    await wsClient.connect();
    // 持续监听服务端响应
    while (true) {
      const msg = await wsClient.waitForNextMessage(10000);
      console.log('收到消息:', msg);
    }
  } catch (error) {
    console.error('测试出错:', error);
  }
}

// 运行测试
test();
