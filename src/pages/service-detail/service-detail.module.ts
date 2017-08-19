import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceDetailPage } from './service-detail';

@NgModule({
  declarations: [
    ServiceDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceDetailPage),
  ],
  exports: [
    ServiceDetailPage
  ]
})
export class ServiceDetailPageModule {}
