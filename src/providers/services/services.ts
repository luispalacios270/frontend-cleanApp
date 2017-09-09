import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../appSettings'
// import { Headers, RequestOptions } from '@angular/http'
import 'rxjs/add/operator/map';


@Injectable()
export class ServicesProvider {

  link: string;
  modelEndPoint: string = '/services';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  };

  updateService(serviceId, serviceObject) {
    let end_point: string = '/' + serviceId;
    return new Promise((resolve, reject) => {
      this.http.patch(this.link + this.modelEndPoint + end_point, serviceObject, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }

  generatePDF(service, signatureClient, signatureInspector, clientName) {
    let end_point: string = '/generatePDF';
    let data: object = {
      service: service,
      signatureClient: signatureClient,
      signatureInspector: signatureInspector,
      aprobationName: clientName
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint + end_point, data, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }

  deleteService(serviceId: string) {
    let end_point: string = '/' + serviceId;
    return new Promise((resolve, reject) => {
      this.http.delete(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  };

  getServicesWithClients() {
    let end_point: string = '?filter=';
    let data = {
      include: "client"
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .timeout(3000)
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });

  }

  getServicesWithClientsFinished() {
    let end_point: string = '?filter=';
    let data = {
      where: {
        finished: true
      },
      include: "client"
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });

  }

  getServicesWithClientsNoFinished() {
    let end_point: string = '?filter=';
    let data = {
      where: {
        finished: false
      },
      include: "client"
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });

  }

  getServices(/*user: object*/) {
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint)
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });
  };

  createServiceArea(serviceId: string, areaData: any) {
    let end_point = '/' + serviceId + '/areas'
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint + end_point, JSON.stringify(areaData), this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result),
        err => reject(err));
    });
  };

  createNewServices(serviceData: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint, serviceData, this.options)
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });
  };

  getServiceById(serviceId: string) {
    let end_point = '/' + serviceId;
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });

  }

  getSummary(serviceId, clientId) {
    let end_point = '/getSummary?serviceId=' + serviceId
      + '&clientId=' + clientId;
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point)
        .map(res => res.json())
        .subscribe(res => resolve(res),
        err => reject(err));
    });

  }

  getServicesAreas(serviceId: string) {
    let end_point = '/' + serviceId + '/areas?filter=';
    let data = {
      include: 'items'
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data))
        .map(res => res.json())
        .subscribe(res => resolve(res),
        err => reject(err));
    });

  };
}
