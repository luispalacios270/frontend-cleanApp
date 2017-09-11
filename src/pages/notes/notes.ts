import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ItemInspectionProvider } from '../../providers/item-inspection/item-inspection';

/**
 * Generated class for the NotesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  furniture: any;

  originalFurniture: any;

  // furnitureTmp: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public inspectionProvider: ItemInspectionProvider, public toast: ToastController) {
    // this.furniture = navParams.get("furniture");
    this.originalFurniture = navParams.get("furniture");
    this.furniture = { ...this.originalFurniture };
  }


  closeModal() {
    this.viewCtrl.dismiss();
  }

  updateNotes() {
    // console.log(this.furniture);
    let tmp = {
      notesActionPlan: this.furniture.notesActionPlan,
      notesAdministrator: this.furniture.notesAdministrator,
      notesClient: this.furniture.notesClient,
      notesInspector: this.furniture.notesInspector
    }

    this.inspectionProvider.updateFurnitureInspection(this.furniture.id, tmp)
      .then(result => {
        // console.log("resultado de actualización de notas", result)
        this.toast.create({
          message: "Cambios realizados correctamente",
          duration: 3000,
          position: 'bottom center'
        }).present();
        // this.originalFurniture = this.furniture;
        this.originalFurniture.notesActionPlan= this.furniture.notesActionPlan;
        this.originalFurniture.notesAdministrator= this.furniture.notesAdministrator;
        this.originalFurniture.notesClient= this.furniture.notesClient;
        this.originalFurniture.notesInspector= this.furniture.notesInspector;
        this.viewCtrl.dismiss(this.originalFurniture);
        // this.viewCtrl.dismiss(this.furniture);

      })
      .catch(err => console.log(err));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
  }
}
