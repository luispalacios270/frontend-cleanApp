import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FilesProvider } from '../../providers/files/files';
import * as globalVariables from '../../global'




/**
 * Generated class for the PicturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html',
})
export class PicturePage implements OnInit {

  fileList: Array<object>;
  ext: string = globalVariables.API_ENDPOINT;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public navParams: NavParams,
    public files: FilesProvider,
    public viewCtrl: ViewController
  ) { }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    let futnitureId = this.params.get("furnitureId");
    futnitureId = futnitureId.id;
    let isBeforePic = this.params.get("isBeforePic");
    if (isBeforePic)
      this.files.getBeforePics(futnitureId)
        .then((result: Array<object>) => {
          console.log("Pictures", result);
          this.fileList = result;
        })
        .catch(err => console.log(err))
    else {
      this.files.getAfterPics(futnitureId)
        .then((result: Array<object>) => {
          console.log("Pictures", result);
          this.fileList = result;
        })
        .catch(err => console.log(err))
    }
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad PicturePage');
  // }

  closeModal() {
    this.viewCtrl.dismiss();
  }



}
