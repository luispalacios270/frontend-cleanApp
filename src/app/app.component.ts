import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Toast } from "@ionic-native/toast";
import { Dialogs } from "@ionic-native/dialogs";

// import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  /*rootPage: any = TabsPage;*/
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
        this.rootPage = LoginPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang("en");

      this.storage.get("currentLang").then(lang => {
        if (lang) translate.use(lang);
        else translate.use("en");
      });

      // the lang to use, if the lang isn't available, it will use the current loader to get them
    });
  }
}
