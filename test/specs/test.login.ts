import LoginPage from '../../pages/login.page';
import * as testData from '../data/test-data.json' assert { type: 'json' };

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
            await browser.pause(700)
            await button.waitForDisplayed({ timeout: 5000 })
            await button.getAttribute('clickable') === 'true'
            await button.click();
            await LoginPage.initalRegionButton.click()
            const { width, height } = await browser.getWindowSize();
            console.log('width====',width);
            console.log('height====',height);
            const searchIcon = LoginPage.initailRegionSearchIcon
            await searchIcon.waitForDisplayed({ timeout: 5000 })
            await browser.actions([
                browser.action('pointer').move(width * 0.463, height * 0.3588) // 只能通过坐标点击选择语言，使用元素高概率性出现选择了中文结果切换成了英文模式
                .down()
                .up()
            ])
            await browser.keys(testData.login.case1.region)
            const regionText = $(`//android.widget.TextView[contains(@text, '${testData.login.case1[expectkey as keyof typeof testData.login.case1]}')]`)
            await regionText.waitForDisplayed({ timeout: 5000 })
            await regionText.click() // 选择地区
            await LoginPage.initailLanguageSelect.click() // 选择语言
            const languages = expectkey === 'expect' ? LoginPage.initailLanguageZh : LoginPage.initailLanguageEn
            console.log('languages====',expectkey)
            const text = await languages.getText()
            console.log('text====',text)
            await browser.actions([
                browser.action('pointer').move(width * 0.501, height * 0.87333)
                .down()
                .up()
            ])
            const finalConfirmButton = expectkey === 'expect' ? LoginPage.initailFinalConfirmButtonZh : LoginPage.initailFinalConfirmButtonEn
            await finalConfirmButton.click()
        })

        it('正常登录-case2', async () => {
            if (testData.login.case2.account.includes('@')) {
                const loginWithEmailButton = LoginPage.loginWithEmailButton
                await loginWithEmailButton.waitForDisplayed({ timeout: 5000 })
                await loginWithEmailButton.click()
            } else {
                const loginWithPhoneButton = LoginPage.loginWithPhoneButton
                await loginWithPhoneButton.waitForDisplayed({ timeout: 5000 })
                await loginWithPhoneButton.click()
            }
            const accountInput = LoginPage.accountInput
            await accountInput.waitForDisplayed({ timeout: 5000 })
            await accountInput.addValue(testData.login.case2.account)
            const passwordInput = LoginPage.passwordInput
            await passwordInput.waitForDisplayed({ timeout: 5000 })
            await passwordInput.click()
            await passwordInput.addValue(testData.login.case2.password)
            await LoginPage.loginButton.click()
            const loginPravicyToast = LoginPage.loginPravicyToast
            await loginPravicyToast.click()
            await LoginPage.skipButton1zh.isExisting()
        })
        
    })

})