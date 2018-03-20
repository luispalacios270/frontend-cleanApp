import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { ServiceDetailPage } from "../pages/service-detail/service-detail";
import { ItemDetailPage } from "../pages/item-detail/item-detail";
import { EditServicePage } from "../pages/edit-service/edit-service";
import { NotesPage } from "../pages/notes/notes";
import { AprobationPage } from "../pages/aprobation/aprobation";
import { PicturePage } from "../pages/picture/picture";
import { SignaturePage } from "../pages/signature/signature";
import { CreateUserPage } from "../pages/create-user/create-user";
import { CreateAreasPage } from "../pages/create-areas/create-areas";
import { CreateItemPage } from "../pages/create-item/create-item";
import { PopoverPage } from "../pages/home-buttons/home-popover.component";

import { IonicStorageModule } from "@ionic/storage";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { UserServiceProvider } from "../providers/user-service/user-service";
import { HttpModule, Http } from "@angular/http";
import { ServicesProvider } from "../providers/services/services";
import { AreaPrividerProvider } from "../providers/area-privider/area-privider";
import { ItemProvider } from "../providers/item/item";
import { NotePrividerProvider } from "../providers/note-privider/note-privider";
import { FilesProvider } from "../providers/files/files";

import { Toast } from "@ionic-native/toast";
import { Dialogs } from "@ionic-native/dialogs";
import { ClientProvider } from "../providers/client/client";
import { Camera } from "@ionic-native/camera";
import { SignaturePadModule } from "angular2-signaturepad";
import { ItemInspectionProvider } from "../providers/item-inspection/item-inspection";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { SocialSharing } from "@ionic-native/social-sharing";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    // LoginPage,
    ServiceDetailPage,
    ItemDetailPage,
    EditServicePage,
    NotesPage,
    AprobationPage,
    PicturePage,
    SignaturePage,
    CreateUserPage,
    CreateAreasPage,
    CreateItemPage,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp, {
      menuType: "overlay"
    }),
    IonicStorageModule.forRoot(),
    SignaturePadModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    // LoginPage,
    ServiceDetailPage,
    ItemDetailPage,
    EditServicePage,
    NotesPage,
    AprobationPage,
    PicturePage,
    SignaturePage,
    CreateUserPage,
    CreateAreasPage,
    CreateItemPage,
    PopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserServiceProvider,
    ServicesProvider,
    AreaPrividerProvider,
    ItemProvider,
    NotePrividerProvider,
    ItemProvider,
    Toast,
    Dialogs,
    ClientProvider,
    Camera,
    SignaturePadModule,
    FilesProvider,
    ItemInspectionProvider,
    SocialSharing
  ]
})
export class AppModule {}
