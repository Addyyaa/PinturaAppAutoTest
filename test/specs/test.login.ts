import { expect } from '@wdio/globals';
import LoginPage from '../../pages/login.page';
import { Key } from 'webdriverio'
import * as testData from '../data/test-data.json' assert { type: 'json' };
import { execute } from 'webdriverio/build/commands/browser';

describe('登录模块测试', () => {
    let expectkey: string;
    before(() => {
       // 可以对数据进行一些初始化操作

       // 设置语言模式
       const language = 'zh';
       expectkey = language === 'zh' ? 'expect' : 'expect_en';
    })
    
    describe('登录测试', () => {
        it('初始化语言和地区', async () => {
            const button = LoginPage.inintalPravicyAgreeButton;
            await button.waitForDisplayed({ timeout: 5000 })
            await browser.pause(1000)
            await button.click();
            await LoginPage.initalRegionButton.click()
            const { width, height } = await browser.getWindowSize();
            console.log('width====',width);
            console.log('height====',height);
            const searchIcon = LoginPage.initailRegionSearchIcon
            await searchIcon.waitForDisplayed({ timeout: 5000 })
            await browser.actions([
                browser.action('pointer').move(width * 0.463, height * 0.3588)
                .down()
                .up()
            ])
            await browser.keys(testData.login.case1.region)
            const regionText = $(`//android.widget.TextView[contains(@text, '${testData.login.case1[expectkey as keyof typeof testData.login.case1]}')]`)
            await regionText.waitForDisplayed({ timeout: 5000 })
            await regionText.click()
        })
        
    })

})