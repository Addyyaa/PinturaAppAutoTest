import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    /**
     * 获取闪烁警告消息
     */
    public get flashAlert () {
        return $('#flash').getText();
    }
}

export default new SecurePage();
