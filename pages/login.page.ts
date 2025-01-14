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
        return $('//android.widget.TextView[@text=""]');
    }

    public get accountInput() {
        return $('selector');
    }


}

export default new LoginPage();