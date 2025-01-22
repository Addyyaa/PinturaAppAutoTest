import LoginPage from '../../pages/login.page';
import HomePage from '../../pages/home.page';
import MyProfilePage from '../../pages/myProfile.page';
import NativePage from '../../pages/native.page';
import * as testData from '../data/test-data.json' assert { type: 'json' };
import WebSocketClient from '../script/wsClient';


describe('登录模块测试', () => {
    let language: 'zh' | 'en';
    let expectkey: 'expect' | 'expect_en';
    let wsClient: WebSocketClient;
    
    before(async () => {
        language = 'zh';  // 现在 TypeScript 知道这是合法的值
        expectkey = language === 'zh' ? 'expect' : 'expect_en';
        try {
            wsClient = new WebSocketClient('ws://localhost:12345');
            await wsClient.connect()
        } catch (error) {
            console.error('WebSocket 连接错误:', error);
        }
    })

    after(() => {
        wsClient.close()
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
            const loginIgnoreButton = HomePage.ignoreButton
            if (await loginIgnoreButton.waitForDisplayed({timeout: 5000})) {
                console.log('有新的固件可以升级，点击忽略')
                await loginIgnoreButton.click()
            } else {
                console.log('没有新的固件可以升级，跳过新手引导')
            }



            await HomePage.skipButton1zh.isExisting()
            await HomePage.skipButton1zh.click()
            // 进入我的界面，执行退出登录操作
            const myButton = MyProfilePage.MyButton
            await myButton.click()
            await HomePage.skipButton1zh.isExisting()
            await HomePage.skipButton1zh.click()
            await MyProfilePage.settingCenterButton.click()
            await MyProfilePage.logoutButton.click()
            await MyProfilePage.logoutConfirmButton.click()
        })

        it('未注册的账号进行登录-case3', async () => {
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
            await accountInput.addValue(testData.login.case3.account)
            const passwordInput = LoginPage.passwordInput
            await passwordInput.waitForDisplayed({ timeout: 5000 })
            await passwordInput.click()
            await passwordInput.addValue(testData.login.case3.password)
            await LoginPage.loginButton.click()
            const loginWithNoRegisterAccountTip = LoginPage.loginWithNoRegisterAccountTip
            await loginWithNoRegisterAccountTip.waitForDisplayed({ timeout: 5000 }) //期望值已填写在元素中了
        })

        it('密码格式错误-case4', async () => {
            await LoginPage.accountInput.click()
            await LoginPage.accountInput.addValue(testData.login.case4.account)
            const passwordInput = LoginPage.passwordInput
            await passwordInput.waitForDisplayed({ timeout: 5000 })
            await passwordInput.click()
            await passwordInput.addValue(testData.login.case4.password)
            await LoginPage.loginButton.click()
            // const loginWithInCorrectPasswordTip = LoginPage.loginWithInCorrectPasswordTip
            const pageSource = await browser.getPageSource()
            if (pageSource.includes(testData.login.case4[expectkey as keyof typeof testData.login.case4])) {
                expect(true).toBe(true)
            } else {
                expect(true).toBe(false) // 提示的内容与期望不一致
            }
            // await loginWithInCorrectPasswordTip.waitForDisplayed({ timeout: 5000 })  //元素因未知原因一直定位不出来。但是打印出来是有的。 还是用手动判断吧
        })

        it('密码错误-case6', async () => {
            await LoginPage.accountInput.click()
            await LoginPage.accountInput.addValue(testData.login.case6.account)
            const passwordInput = LoginPage.passwordInput
            await passwordInput.waitForDisplayed({ timeout: 5000 })
            await passwordInput.click()
            await passwordInput.addValue(testData.login.case6.password)
            await LoginPage.loginButton.click()
            const pageSource = await browser.getPageSource()
            const expectValue = testData.login.case6[expectkey as keyof typeof testData.login.case6]
            if (pageSource.includes(expectValue)) {
                expect(true).toBe(true)
            } else {
                expect(true).toBe(false) // 提示的内容与期望不一致
            }
        })
        
        it('使用手机号登录-case7', async () => {
            const loginWithPhoneButton = LoginPage.loginWithPhoneButton
            await loginWithPhoneButton.waitForDisplayed({ timeout: 5000 })
            await loginWithPhoneButton.click()
            await LoginPage.accountInput.click()
            await LoginPage.accountInput.addValue(testData.login.case7.account)
            const passwordInput = LoginPage.passwordInput
            await passwordInput.waitForDisplayed({ timeout: 5000 })
            await passwordInput.click()
            await passwordInput.addValue(testData.login.case7.password)
            await LoginPage.loginButton.click()
            const homePageButton = HomePage.HomeButton
            await homePageButton.waitForDisplayed({ timeout: 5000 })
        })

        it('退出登录', async () => {
            const myButton = MyProfilePage.MyButton
            await myButton.click()
            await MyProfilePage.settingCenterButton.click()
            await MyProfilePage.logoutButton.click()
            await MyProfilePage.logoutConfirmButton.click()
        })

        it('使用验证码登录-case8', async () => {
            const loginWithCodeButton = LoginPage.loginWithCodeButton
            await loginWithCodeButton.waitForDisplayed({ timeout: 5000 })
            await loginWithCodeButton.click()
            await LoginPage.accountInput.click()
            await LoginPage.accountInput.addValue(testData.login.case8.account)
            // 清空通知栏防止之前的信息干扰
            await browser.openNotifications()
            const clearNotificationButton = NativePage.clearNotificationButton
            if (await clearNotificationButton.waitForDisplayed({ timeout: 1000 })) {
                await clearNotificationButton.click()
            }
            const getCodeButton = LoginPage.getCodeButton
            await getCodeButton.waitForDisplayed({ timeout: 5000 })
            await getCodeButton.click()
            // 打开通知栏获取验证码
            await browser.openNotifications()
            const codeSms = NativePage.codeSms
            await codeSms.waitForDisplayed({ timeout: 20000 })
            const codeSmsText = await codeSms.getText()
            const code = codeSmsText.match(/证码为：(\d{6})/)
            if (code) {
                console.log('code====',code[1], Array.isArray(code))
                // 点击空白处关闭通知栏
                await browser.actions([
                    browser.action('pointer').move(1,1)
                    .down()
                    .up()
                ])
                console.log('codeSmsText====',codeSmsText)
                const codeInput = LoginPage.codeInput
                await codeInput.waitForDisplayed({ timeout: 5000 })
                await codeInput.click()
                await browser.keys(code[1])
                await LoginPage.loginButton.click()
                const homePageButton = HomePage.HomeButton
                await homePageButton.waitForDisplayed({ timeout: 5000 })
            } else {
                expect(true).toBe(false)
            }
        })

        it.only('调试', async () => {
            console.log('开始调试...');
            console.log("wsClient====",wsClient)
            const msg = await wsClient.waitForNextMessage(100000);
            console.log("msg====",msg)
        })
    })


})