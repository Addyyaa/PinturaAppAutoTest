export const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': '13',
    'appium:deviceName': 'xiaomi',
    'appium:appPackage': 'com.ost.pintura',
    'appium:appActivity': 'io.dcloud.PandoraEntry'
};

export const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities,
}; 