import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../appSettings';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ServicesProvider {
  link = AppSettings.API_ENDPOINT;
  modelEndPoint = '/services';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http, public storage: Storage) {}

  updateService(serviceId: string, serviceObject) {
    const end_point = `/${serviceId}`;
    return new Promise((resolve, reject) => {
      this.http
        .patch(
          this.link + this.modelEndPoint + end_point,
          serviceObject,
          this.options
        )
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  generatePDF(service, signatureClient, signatureInspector, clientName) {
    return new Promise((resolve, reject) => {
      this.storage.get('currentLang').then(lang => {
        const end_point = '/generatePDF';

        const data = {
          service: service,
          signatureClient: signatureClient,
          signatureInspector: signatureInspector,
          aprobationName: clientName,
          language: lang
        };

        this.http
          .post(this.link + this.modelEndPoint + end_point, data, this.options)
          .map(res => res.json())
          .subscribe(result => resolve(result), err => reject(err));
      });
    });
  }

  deleteService(serviceId: string) {
    const end_point = '/' + serviceId;
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getServicesWithClients() {
    const end_point = '?filter=';
    const data = {
      include: 'client'
    };
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .timeout(3000)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getServicesWithClientsFinished(supervisorId: string) {
    let end_point = '?filter=';
    let data = {
      where: {
        finished: true,
        supervisorId: supervisorId
      },
      include: 'client'
    };
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getServicesWithClientsNoFinished(userId: string) {
    let end_point = '?filter=';
    let data = {
      where: {
        finished: false,
        supervisorId: userId
      },
      include: 'client'
    };
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getServices(/*user: object*/) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  createServiceArea(serviceId: string, areaData: any) {
    let end_point = '/' + serviceId + '/areas';
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.link + this.modelEndPoint + end_point,
          JSON.stringify(areaData),
          this.options
        )
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  createNewServices(serviceData: object) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.link + this.modelEndPoint, serviceData, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getServiceById(serviceId: string) {
    let end_point = '/' + serviceId;
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getSummary(serviceId, clientId) {
    let end_point =
      '/getSummary?serviceId=' + serviceId + '&clientId=' + clientId;
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point)
        .map(res => res.json())
        .subscribe(res => resolve(res), err => reject(err));
    });
  }

  getServicesAreas(serviceId: string) {
    let end_point = '/' + serviceId + '/areas?filter=';
    let data = {
      include: 'items'
    };
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe(res => resolve(res), err => reject(err));
    });
  }
}
