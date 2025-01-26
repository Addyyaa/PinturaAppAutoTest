// websocket-client.js
import WebSocket from 'ws';
import apiConfig from '../data/api.json' assert { type: "json" };
import serverConfig from '../data/serverConfig.json' assert { type: "json" };
import { expect } from '@wdio/globals';

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
  let token = '';
  let groupResponse = [];
  
  try {
    await wsClient.connect();
    console.log('WebSocket 已连接');
    
    // 获取 token
    while (true) {
      const msg = await wsClient.waitForNextMessage(10000);
      if (msg && msg.data && msg.data['X-TOKEN']) {
        token = msg.data['X-TOKEN'];
        console.log('收到 token:', token);
        break;
      }
    }

    const screenInfo = await generateScreenInfo(token);
    while (true) {
      const msg = await wsClient.waitForNextMessage(10000);
      if (msg && msg.data && msg.data['groupResponse']) {
        groupResponse = msg.data['groupResponse'];
        break;
      }
    }

    function findStorageIndex() {
      for (const [index1, value1] of screenInfo.entries()) {
        if (value1.hasStorage) {
          for (const [index2, value2] of groupResponse.entries()) {
            if (value2.id === value1.groupId) {
              return {index:groupResponse.length - (index2 + 1), screenId: value1.screenId};
            }
          }
        }
      }
    }

    const groupIndex = findStorageIndex();
    console.log("groupResponse======>", groupResponse);
    console.log("groupIndex======>", groupIndex);
    


  } catch (error) {
    console.error('WebSocket 错误:', error);
  } finally {
    wsClient.close();
    console.log('WebSocket 已关闭');
  }
}

// 运行测试
test();


export async function generateScreenInfo(token) {
  const screenDetails = [];
  let screenInfo;

  const screenInfoUrl = `${serverConfig.protocal.http}://${serverConfig.host.test_cn}:${serverConfig.port}${apiConfig.OTARecord}`;
  const screenIn = await fetch(screenInfoUrl, {
      method: "GET",
      headers: {
          'X-TOKEN': token
      }
  });
  const screenDetail = await screenIn.json();
  if (screenIn.status === 200) {
      if (screenDetail.code === 20) {
          screenInfo = screenDetail.data;
      } else {
          console.log("未能获取到屏幕信息1");
          expect(true).toBe(false);
      }
  } else {
      console.log("未能获取到屏幕信息2");
      expect(true).toBe(false);
  }

  // 使用 Promise.all 等待所有异步操作完成
  const promises = screenInfo.map(async (item) => {
      // 遍历内部的 screenList
      const innerPromises = item.screenList.map(async (screen) => {
          const screenId = screen.screenId;
          const hasStorage = await getScreenStorage(screenId);
          screenDetails.push({
              screenId: screenId,
              groupId: item.id,
              groupName: item.name,
              hasStorage: hasStorage
          });
      });
      await Promise.all(innerPromises);
  });

  await Promise.all(promises);

  async function getScreenStorage(screenId) {
      const storageUrl = serverConfig.protocal.http + '://' + serverConfig.host.test_cn + ':' + serverConfig.port + apiConfig.screenApi.getScreenStorage + '/' + screenId;
      try {
          const response = await fetch(storageUrl, {
              method: "GET",
              headers: {
                  'X-TOKEN': token,
                  'Accept': 'application/json'
              }
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.data.totalStorage > 0) {
              return true;
          } else {
              return false;
          }
      } catch (fetchError) {
          console.error('Fetch 请求失败:', fetchError);
          return false;
      }
  }
  return screenDetails;
}
