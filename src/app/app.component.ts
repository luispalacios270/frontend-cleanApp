import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

const availablesLanguage = ['en', 'es'];

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    private storage: Storage
  ) {}

  async selectCorrectLang(): Promise<void> {
    const lang = await this.storage.get('currentLang');

    if (lang) {
      this.translate.use(lang);
      return;
    }

    this.translate.addLangs(availablesLanguage);

    const isBrowserLangInLangsAvailables = this.translate
      .getLangs()
      .filter(lang => lang === this.translate.getBrowserLang())[0];

    const defaultLang = isBrowserLangInLangsAvailables
      ? isBrowserLangInLangsAvailables
      : availablesLanguage[0];

    this.translate.setDefaultLang(defaultLang);
    await this.translate.use(defaultLang);
  }

  async selectInitPage(): Promise<void> {
    const currentUser = await this.storage.get('currentUser');
    this.rootPage = currentUser ? 'HomePage' : 'login';
  }

  async ngOnInit(): Promise<void> {
    await this.selectInitPage();
    await this.selectCorrectLang();
    await this.platform.ready();

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    await this.selectCorrectLang();
  }
}
