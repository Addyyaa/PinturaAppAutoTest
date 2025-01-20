import { $ } from '@wdio/globals';
import Page from './page';

class MyProfilePage extends Page {
    public get skipButton1zh() {
        return $('//android.widget.TextView[@text="Skip" or @text="跳过"]')
    }

    public get ignoreButton() {
        return $('//android.widget.TextView[@text="忽略" or @text="Ignore"]')
    }

    public get MyButton() {
        return $('(//android.widget.TextView[@text="我的" or @text="My profile"])[1]')
    }

    public get HomeButton() {
        return $('//android.widget.TextView[@text="屏幕组" or @text="Screens"]')
    }

    public get CanavasButton() {
        return $('//android.widget.TextView[@text="图库" or @text="Canvas"]')
    }

    public get settingCenterButton() {
        return $('//android.widget.TextView[@text="Settings" or @text="设置中心"]')
    }

    public get messageButton() {
        return $('//android.widget.TextView[@text="Message Center" or @text="消息中心"]')
    }

    public get friendButton() {
        return $('(//android.widget.TextView[@text="Friends" or @text="好友"])[2]')
    }

    public get firmwareUpdateButton() {
        return $('//android.widget.TextView[@text="Firmware Update" or @text="固件升级"]')
    }

    public get personalProfileButton() {
        return $('//android.widget.TextView[@text="Edit Profile" or @text="编辑资料"]')
    }

    public get logoutButton() {
        return $('//android.widget.TextView[@text="退出登录" or @text="Sign Out"]')
    }

    public get logoutConfirmButton() {
        return $('//android.widget.TextView[@text="确定退出" or @text="Confirm"]')
    }

    public get logoutCancelButton() {
        return $('//android.widget.TextView[@text="取消" or @text="Cancel"]')
    }

    
    
    
    


}

export default new MyProfilePage();