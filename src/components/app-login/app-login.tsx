import { Component } from "@stencil/core";

declare const firebase;

@Component({
  tag: "app-login",
  styleUrl: "app-login.scss"
})
export class AppHome {
  async handleMouseDown(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const loginResult = await firebase.auth().signInWithPopup(provider);
      console.log(loginResult);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar class="toolbar-sp">
          <div class="toolbar-container">
            <img src="https://http2.mlstatic.com/ui/navigation/3.1.7/mercadolibre/logo__large_plus.png" />
            <input type="text" />
          </div>
          <div />
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-card
          onMouseDown={() => this.handleMouseDown()}
          class="login-card transition"
        >
          <ion-card-content>
            <p class="transition">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
              nisi eligendi asperiores sapiente dolores, quae at similique minus
              inventore perspiciatis eius. Ducimus libero labore quaerat
              architecto, hic aperiam dolorem quibusdam.
            </p>
          </ion-card-content>
        </ion-card>
      </ion-content>
    ];
  }
}
