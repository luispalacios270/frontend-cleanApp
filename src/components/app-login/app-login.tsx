import { Component } from "@stencil/core";

@Component({
  tag: "app-login",
  styleUrl: "app-login.scss"
})
export class AppHome {
  render() {
    return [
      <ion-content>
        <ion-card id="container-login">
          <ion-card-content>
            <div col-md-4 offset-md-4 col-6 offset-3>
              <img src="assets/images/logo.png" />
            </div>
            <form>
              <ion-list>
                <ion-item>
                  <ion-label />
                  <ion-input type="text" />
                </ion-item>

                <div class="error-input item-md" />
                <div class="error-input item-md" />

                <ion-item>
                  <ion-label />
                  <ion-input type="password" />
                </ion-item>

                <div class="error-input item-md" />
              </ion-list>

              <div class="error-user item-md" />
              <div padding>
                <ion-row align-items-center>
                  <ion-col col-12>
                    <button ion-button color="primary" />
                  </ion-col>
                </ion-row>
              </div>
            </form>

            <div padding>
              <ion-col col-12>
                <ion-item>
                  <ion-label />
                  <ion-select>
                    <ion-option value="en">English</ion-option>
                    <ion-option value="es">Español</ion-option>
                  </ion-select>
                </ion-item>
              </ion-col>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-content>
    ];
  }
}
