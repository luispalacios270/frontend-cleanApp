import { providerParent } from '../providerParent'
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http'
import { AppSettings } from '../../appSettings'
import 'rxjs/add/operator/map';

@Injectable()/*
export class ItemProvider  {

  link: string;
  modelEndPoint: string = '/items';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  }

  finishiIem(itemId: string) {
    let end_point = '/' + itemId;
    let data = {
      finished: true
    }
    return new Promise((resolve, reject) => {
      this.http.patch(this.link + this.modelEndPoint + end_point, data, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }

  getFurnitures(itemId: string, serviceId: string) {
    let end_point = '/' + itemId + '/furniture?filter=';
    let data = {
      include: {
        relation: 'furnitureInspections',
        scope: {
          where: { serviceId: serviceId }
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }

  createItemFurnitures(itemId: string, furniture: object) {
    let end_point = '/' + itemId + '/furniture';
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint + end_point, JSON.stringify(furniture), this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }
} */

export class ItemProvider extends providerParent {

  modelEndPoint: string = '/items';

  constructor(
    public http: Http
  ) {
    super(http);
  }

  finishiIem(itemId: string) {
    let end_point = '/' + itemId;
    let data = {
      finished: true
    }
    return new Promise((resolve, reject) => {
      this.http.patch(this.link + this.modelEndPoint + end_point, data, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }

  getFurnitures(itemId: string, serviceId: string) {
    let end_point = '/' + itemId + '/furniture?filter=';
    let data = {
      include: {
        relation: 'furnitureInspections',
        scope: {
          where: { serviceId: serviceId }
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }

  deleteItem(item: any) {
    if (!item && !item.id) return;
    const completeEndPoint = `${this.link + this.modelEndPoint}/${item.id}`
    return this.deleteData(completeEndPoint);
  }

  updateItem(item: any) {
    if (!item && !item.id) return;
    const completeEndPoint = `${this.link + this.modelEndPoint}/${item.id}`
    return this.patchData(completeEndPoint, item);
  }

  deleteItemFurniture(itemId: string, furniture: any) {
    const completeEndPoint = `${this.link + this.modelEndPoint}/${itemId}/furniture/${furniture.id}`
    return this.deleteData(completeEndPoint);
  }

  createItemFurnitures(itemId: string, furniture: object) {
    if (!itemId && !furniture) return;
    const completeEndPoint: string = `${this.link + this.modelEndPoint}/${itemId}/furniture`;
    return this.postData(completeEndPoint, furniture);
  }

  editItemFurniture(itemId: string, furniture: any) {
    if (!itemId && !furniture && !furniture.id) return;

    const completeEndPoint: string = `${this.link + this.modelEndPoint}/${itemId}/furniture/${furniture.id}`;

    return this.putData(completeEndPoint, furniture);
  }


  /* doLogin(user: object) {
    if (!user) return;
    const completeEndPoint: string = `${this.link + this.modelEndPoint}/login`
    return this.postData(completeEndPoint, user);
  }; */
}
