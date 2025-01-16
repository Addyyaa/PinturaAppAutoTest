import { $ } from '@wdio/globals';
import Page from './page';

class LoginPage extends Page {
    public get inintalPravicyAgreeButton() {
        return $('id=com.ost.pintura:id/btn_custom_privacy_sure')
        ;
    }

    public get inintalPravicyDegreeButton() {
        return $('id=btn_custom_privacy_cancel');
    }

    public get initalRegionButton() {
        return $('//android.webkit.WebView[@text="pages/area[2]"]/android.view.View[1]/android.view.View');
    }

    public get initalLanguageButton() {
        return $('//android.webkit.WebView[@text="pages/area[2]"]/android.view.View[2]/android.view.View');
    }

    public get initalConfirmButton() {
        return $('//android.webkit.WebView[@text="pages/area[2]"]/android.view.View[2]/following-sibling::android.widget.TextView');
    }

    public get initalSearchInput() {
        return $('//android.webkit.WebView[@text="pages/area[2]"]/android.view.View[2]/android.view.View');
    }

    public get initailRegionSearchIcon() {
        return $('//android.view.View[@resource-id="easy-input"]');
    }

    public get initailLanguageSelect() {
        return $('//android.webkit.WebView[@text="pages/area[2]"]/android.view.View[2]/android.view.View');
    }

    public get initailLanguageEn() {
        return $('//android.widget.TextView[@text="English"]');
    }

    public get initailLanguageZh() {
        return $('(//android.widget.TextView[@text="简体中文"])[2]');
    }

    public get initailFinalConfirmButtonEn() {
        return $('//android.widget.TextView[@text="Confirm"]');
    }

    public get initailFinalConfirmButtonZh() {
        return $('//android.widget.TextView[@text="确定"]');
    }

    public get accountInput() {
        return $('(//android.widget.EditText)[1]');
    }

    public get passwordInput() {
        return $('(//android.widget.EditText)[2]');
    }

    public get loginButton() {
        return $('//android.widget.TextView[@text="登录" or @text="Login"]');
    }

    public get loginPravicyToast() {
        return $('//android.widget.TextView[@text="同意并登录" or @text="Agree and Log In"]');
    }

    public get loginPravicyToastCancel() {
        return $('//android.widget.TextView[@text="取消" or @text="Cancel"]');
    }
    
    public get loginWithEmailButton() {
        return $('//android.widget.TextView[@text="邮箱登录" or @text="E-mail"]');
    }

    public get loginWithPhoneButton() {
        return $('//android.widget.TextView[@text="手机登录" or @text="Phone"]');
    }

    public get loginWithCodeButton() {
        return $('//android.widget.TextView[@text="验证码登录" or @text="Code"]');
    }

    public get skipButton1zh() {
        return $('//android.widget.TextView[@text="Skip" or @text="下一步"]')
    }
    
    
    


}

export default new LoginPage();