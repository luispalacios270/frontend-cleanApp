import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAreasPage } from './create-areas';

@NgModule({
  declarations: [
    CreateAreasPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAreasPage),
  ],
  exports: [
    CreateAreasPage
  ]
})
export class CreateAreasPageModule {}
