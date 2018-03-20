import { Component, ViewChild } from "@angular/core";
import { NavController } from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import { Storage } from "@ionic/storage";
import { AreaPrividerProvider } from "../../providers/area-privider/area-privider";
import { Chart } from "chart.js";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "page-about",
  templateUrl: "about.html"
})
export class AboutPage {
  summary: any;
  noSelected = false;
  service: any = null;
  areas: any[];
  percentage: number;
  counts = 0;
  countsTotal = 0;

  constructor(
    public navCtrl: NavController,
    public servicesProvider: ServicesProvider,
    public areaPrividerProvider: AreaPrividerProvider,
    private storage: Storage,
    private translate: TranslateService
  ) {}

  updateSummary(): void {
    this.storage.get("currentService").then(val => {
      if (val != null) {
        this.servicesProvider
          .getServiceById(val)
          .then((result: any) => {
            this.servicesProvider
              .getSummary(val, result.clientId)
              .then((result: any) => {
                this.areas = result.result.areas;
                this.service = result.result.service;
                this.createChart();
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
    });
  }

  init(): void {
    this.updateSummary();
  }

  getItemsPerArea(): void {
    this.countsTotal = 0;
    this.counts = 0;
    this.areas.forEach((item: any, index: number) => {
      item.items.forEach((subItem: any, subIndex: any) => {
        this.countsTotal++;
        if (subItem.finished) this.counts++;
        if (
          subIndex + 1 == item.items.length &&
          index + 1 === this.areas.length
        ) {
          if (this.countsTotal !== 0)
            this.percentage = Math.ceil(this.counts / this.countsTotal * 100);
          else {
            this.percentage;
          }
        }
      });
    });
  }

  createChart(): void {
    let finishedMessage: string;
    let unfinishedMessage: string;

    this.translate
      .get("summary.finished")
      .subscribe(lang => (finishedMessage = lang));
    this.translate
      .get("summary.unfinished")
      .subscribe(lang => (unfinishedMessage = lang));

    const ctx = document.getElementById("myChart");

    const myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [finishedMessage, unfinishedMessage],
        datasets: [
          {
            data: [this.service.done, this.service.total - this.service.done],
            backgroundColor: [
              "rgba(103, 143, 2, 0.2)",
              "rgba(255, 99, 132, 0.2)"
            ],
            borderColor: ["rgba(103, 143, 2, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1
          }
        ]
      }
    });
  }

  ionViewDidEnter(): void {
    this.init();
  }
}
