import { $ } from '@wdio/globals';
import Page from './page';

class HomePage extends Page {
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

    
    
    
    


}

export default new HomePage();