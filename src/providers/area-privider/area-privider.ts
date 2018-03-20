import { providerParent } from '../providerParent'
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
/* import { AppSettings } from '../../appSettings'
import 'rxjs/add/operator/map'; */


@Injectable()
export class AreaPrividerProvider extends providerParent {
  /* link: string;
  modelEndPoint: string = '/areas';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers }); */

  modelEndPoint: string = '/areas';

  constructor(
    public http: Http
  ) {
    super(http);
  }





  /*getItems() {
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint)
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });
  };*/

  getItems(areaId: string) {
    let completeEndPoint: string = `${this.link + this.modelEndPoint}/${areaId}/items`;
    return this.getData(completeEndPoint);
  };

  createArea(area: object) {
    let completeEndPoint: string = `${this.link + this.modelEndPoint}`;
    return this.postData(completeEndPoint, area);
  }

  deleteArea(area: any) {
    if (!area && !area.id) return;
    let completeEndPoint: string = `${this.link + this.modelEndPoint}/${area.id}`;
    return this.deleteData(completeEndPoint);
  }

  updateArea(area: any) {
    if (!area && !area.id) return;
    let completeEndPoint: string = `${this.link + this.modelEndPoint}/${area.id}`;
    return this.patchData(completeEndPoint, area);

  }

  getAllInfoClient(clientId: string) {
    let end_point: string = "?filter="
    let data: object = {
      where: {
        clientId: clientId
      },
      include: {
        relation: "items",
        scope: {
          include: "furniture"
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data), this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }

  createItems(areaId: string, item: any) {
    let end_point: string = '/' + areaId + '/items';
    let url: string = this.link + this.modelEndPoint + end_point;
    return new Promise((resolve, reject) => {
      this.http.post(url, item, this.options)
        .map(res => res.json())
        .subscribe(res => resolve(res),
        err => reject(err));
    });
  };
}
