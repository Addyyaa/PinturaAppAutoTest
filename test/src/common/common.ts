import serverConfig from '../../data/serverConfig.json' assert { type: "json" };
import apiConfig from '../../data/api.json' assert { type: "json" };
import { expect } from '@wdio/globals';

// 1. 先声明函数类型
type GenerateScreenInfoType = (token: string) => Promise<ScreenDetail[]>;

// 2. 使用这个类型声明全局变量
declare global {
    var generateScreenInfo: GenerateScreenInfoType;
}

interface ScreenDetail {
  screenId: string;
  groupId: string;
  groupName: string;
  hasStorage: boolean;
}

export async function generateScreenInfo(token: string): Promise<ScreenDetail[]> {
    const screenDetails: ScreenDetail[] = [];
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
    const promises = screenInfo.map(async (item: any) => {
      // 遍历内部的screenList
      const innerPromises = item.screenList.map(async (screen: any) => {
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
  
    async function getScreenStorage(screenId: string) {
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

// 全局挂载
globalThis.generateScreenInfo = generateScreenInfo;


