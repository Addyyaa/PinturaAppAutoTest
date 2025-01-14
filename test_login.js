import { remote } from 'webdriverio';
import { wdOpts } from './wdio.conf.ts';
import { expect } from 'chai';
import wdio from 'webdriverio';
import { describe } from 'mocha';

let driver;

before(() => {
    driver = wdio.remote(wdOpts);
})

after(async () => {
    await driver.deleteSession();
    await driver.quit();
});

describe('登录相关测试', async () => {
    
})