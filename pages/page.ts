import { browser } from '@wdio/globals'

/**
* 基础页面类,包含所有移动应用页面共享的方法和功能
*/
export default class Page {
    /**
    * 启动应用
    */
    public async open () {
        // 应用会根据 wdio.conf.ts 中的配置自动启动
        await browser.pause(3000); // 可选：等待应用完全加载
    }

    /**
    * 常用的移动端操作方法
    */
    protected async swipeUp(percentage = 0.8) {
        const { height } = await browser.getWindowSize();
        const anchor = Math.round(height * percentage);
        await browser.touchAction([
            { action: 'press', y: anchor },
            { action: 'moveTo', y: height * 0.2 },
            'release'
        ]);
    }
}
