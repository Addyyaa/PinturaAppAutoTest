import { $ } from '@wdio/globals';
import Page from './page';

class NativePage extends Page {
    public get clearNotificationButton() {
        return $('id=com.android.systemui:id/dismiss_view')
        ;
    }

    public get codeSms() {
        return $('//android.widget.TextView[contains(@text,"请勿泄露于他人")]')
    }
}

export default new NativePage();

