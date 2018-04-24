import { Component } from '@stencil/core';
// import firebase from 'firebase';
// declare const firebase;

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.scss'
})
export class AppHome {
  // async performGoogleLogin(e: Event): Promise<void> {
  //   const provider = new firebase.auth.GoogleAuthProvider();

  //   try {
  //     const loginResult = await firebase.auth().signInWithPopup(provider);
  //     console.log(loginResult);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  render() {
    return [
      <ion-content>
        <ion-card id="container-login">
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col col-md-4 offset-md-4 col-6 offset-3>
                  {/* <img src="assets/images/logo.png" /> */}
                  <ion-skeleton-text width="30px" />
                </ion-col>
              </ion-row>
            </ion-grid>

            <form>
              <ion-list>
                <ion-item>
                  <ion-label position="floating"> Correo</ion-label>
                  <ion-input inputmode="email" />
                </ion-item>

                <div class="error-input item-md" />
                <div class="error-input item-md" />

                <ion-item>
                  <ion-label position="floating"> Contraseña </ion-label>
                  <ion-input inputmode="password" />
                </ion-item>

                <div class="error-input item-md" />
              </ion-list>

              <div class="error-user item-md" />

              {/* <div padding>
                <ion-row align-items-center>
                  <ion-col col-12>
                    <ion-button onClick={e => this.performGoogleLogin(e)}>
                      Te llevo esperando hace horas
                      <ion-icon name="logo-facebook" slot="start" />
                    </ion-button>
                  </ion-col>
                </ion-row>
              </div> */}
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
