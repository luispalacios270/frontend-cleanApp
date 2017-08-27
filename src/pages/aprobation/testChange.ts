import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AprobationPage } from './aprobation';

@NgModule({
  declarations: [
    AprobationPage,
  ],
  imports: [
    IonicPageModule.forChild(AprobationPage),
  ],
  exports: [
    AprobationPage
  ]
})
export class AprobationPageModule {}
