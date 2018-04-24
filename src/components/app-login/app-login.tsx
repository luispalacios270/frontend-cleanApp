import { Component, State } from "@stencil/core";

declare const firebase;

@Component({
  tag: "app-login",
  styleUrl: "app-login.scss"
})
export class AppHome {
  @State() email: string;
  @State() password: string;

  handleEmailChange(e: Event | any): void {
    this.email = e.target.value;
  }

  handlePasswordChange(e: Event | any): void {
    this.password = e.target.value;
  }

  async performLogin(): Promise<void> {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);

      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return [
      <ion-content>
        <ion-card id="container-login">
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col col-md-4 offset-md-4 col-6 offset-3>
                  <img src="assets/images/logo.png" />
                </ion-col>
              </ion-row>
            </ion-grid>

            <form>
              <ion-list>
                <ion-item>
                  <ion-label position="floating"> Correo</ion-label>
                  <ion-input
                    onInput={event => this.handleEmailChange(event)}
                    inputmode="email"
                  />
                </ion-item>

                <div class="error-input item-md" />
                <div class="error-input item-md" />

                <ion-item>
                  <ion-label position="floating"> Contraseña </ion-label>
                  <ion-input
                    onInput={event => this.handlePasswordChange(event)}
                    inputmode="password"
                  />
                </ion-item>

                <div class="error-input item-md" />
              </ion-list>

              <div class="error-user item-md" />

              {/* <ion-col col-12> */}
              <ion-row justify-content="center">
                <ion-button onClick={() => this.performLogin()}>
                  Iniciar Sesión
                  {/* <ion-icon name="logo-facebook" slot="start" /> */}
                </ion-button>
              </ion-row>
              {/* </ion-col> */}
            </form>

            {/* <div padding>
              <ion-col col-12>
                <ion-item>
                  <ion-label> Esto es una prueba </ion-label>
                  <ion-select multiple>
                    <ion-select-option value="en">English</ion-select-option>
                    <ion-select-option value="es">Español</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>
            </div> */}
          </ion-card-content>
        </ion-card>
      </ion-content>
    ];
  }
}
