import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import FirestoreService from '../services/firestore'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'
import RouterService from '@ember/routing/router-service'
import { getAuth } from 'firebase/auth';

export default class LoginController extends Controller {
    @service firestore!: FirestoreService
    @service router!: RouterService

    @tracked firebaseAuthUI!: firebaseui.auth.AuthUI

  @action setup(): void {
    const uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          return false
        },
        signInFailure: () => {
          console.log('firebase sign in failed')
        },
      },
    }

    if (!this.firebaseAuthUI) {
      const firebaseAuth = getAuth(this.firestore.app)
      const ui = new firebaseui.auth.AuthUI(firebaseAuth)
      this.firebaseAuthUI = ui
      ui.start('#firebaseui-auth-container', uiConfig)
    } else {
      this.firebaseAuthUI.reset()
      this.firebaseAuthUI.start('#firebaseui-auth-container', uiConfig)
    }
  }
}
