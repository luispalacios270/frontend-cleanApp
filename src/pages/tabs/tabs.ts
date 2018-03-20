import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ItemDetailPage } from '../item-detail/item-detail';
// import { HomePage } from '../home/home';
import { AprobationPage } from '../aprobation/aprobation';
import { Storage } from '@ionic/storage'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ItemDetailPage;
  tab2Root = AboutPage;
  tab3Root = AprobationPage;

  title: string = '';

  constructor(public storage: Storage) {
    this.storage.get("currentItem").then(val => {
      this.title = val.name;
    }).catch(err => console.log(err));
  }
}
