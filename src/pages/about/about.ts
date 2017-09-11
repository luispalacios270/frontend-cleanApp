import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { AreaPrividerProvider } from '../../providers/area-privider/area-privider';
import { Chart } from 'chart.js'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  @ViewChild('myChart') pieChart;

  summary: any;
  noSelected: boolean = false;
  service: any = null;
  areas: Array<any>;
  percentage: number;
  counts: number = 0;
  countsTotal: number = 0;

  /*constructor(public navCtrl: NavController) {

  }*/

  constructor(public navCtrl: NavController, public servicesProvider: ServicesProvider, public areaPrividerProvider: AreaPrividerProvider, private storage: Storage) {
    // this.init();
  };

  updateSummary() {
    this.storage.get('currentService').then(val => {
      console.log("valor", val);
      if (val != null) {
        this.servicesProvider.getServiceById(val).then((result: any) => {
          this.servicesProvider.getSummary(val, result.clientId).then((result: any) => {
            console.log(result);
            this.areas = result.result.areas;
            this.service = result.result.service;
            this.createChart();

          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }
      /*this.servicesProvider.getServicesAreas(val)
        .then((result: Array<object>) => {
          console.log("resultado completos", result);
          this.areas = result;
          this.getItemsPerArea();
        })
        .catch(err => console.log(err));
    } else {

    }*/

    });

  }

  init() {
    this.updateSummary();
  }





  getItemsPerArea() {
    this.countsTotal = 0;
    this.counts = 0;
    this.areas.forEach((item: any, index: number) => {
      item.items.forEach((subItem: any, subIndex: any) => {
        this.countsTotal++;
        if (subItem.finished)
          this.counts++;
        if (subIndex + 1 == item.items.length && index + 1 === this.areas.length) {
          if (this.countsTotal !== 0)
            this.percentage = Math.ceil((this.counts / this.countsTotal) * 100);
          else {
            this.percentage
          }
        }
      });
    })
  };

  createChart() {
    var ctx = document.getElementById("myChart");

    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ["Terminado", "Pendiente"],
        datasets: [{          
          data: [this.service.done, (this.service.total - this.service.done)],
          backgroundColor: [
            // 'rgba(255, 99, 132, 0.2)',
            'rgba(103, 143, 2, 0.2)',
            'rgba(255, 99, 132, 0.2)'
            // 'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(103, 143, 2, 1)',
            'rgba(255, 99, 132, 1)'
            // 'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      }/*,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }*/
    });
  }

 /*  ionViewDidLoad() {
    this.init();

  } */

  ionViewDidEnter() {
    this.init();
  }

/*   getPercentage() {


  } */

}
