import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    translate: TranslateService,
    private storage: Storage
  ) {
    this.storage.get("currentUser").then((currentUser: string) => {
      if (currentUser) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = "LoginPage";
      }
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      translate.setDefaultLang("es");
      this.storage.get("currentLang").then(lang => {
        if (lang) translate.use(lang);
        else translate.use("es");
      });

      // the lang to use, if the lang isn't available, it will use the current loader to get them
    });
  }
}
