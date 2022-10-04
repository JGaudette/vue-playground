import firebase from "firebase";
import {defineStore} from "pinia";

export const useMainStore = defineStore('main', {
  state: ()=> ({
    isDevelopment: process.env.NODE_ENV !== "production",
    currentUser: null,
    globalLoading: true,
    firebase: null,
    layout: "desktop"
  }),
  getters: {
    isMobile: (state) => state.layout === "mobile",
  },
  actions: {
    updateLayout(){
      let currentLayout = getCurrentLayout();

      if (currentLayout !== this.layout) {
        this.layout = layout;
      }
    },
    async loginEmailPass(val){
      let userCredential = await firebase.auth().signInWithEmailAndPassword(val.email, val.password);
      this.currentUser = userCredential.user;
    },
    async login(){
      let firebaseProvider = new firebase.auth.GoogleAuthProvider();
      let recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-area", {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved, you can proceed with phoneAuthProvider.verifyPhoneNumber(...).

          console.log("captcha solved");
          // onSolvedRecaptcha();
        },
      });

      this.firebase
        .auth()
        .signInWithPopup(firebaseProvider)
        .then((resp) => {
          this.currentUser = resp.user;
        })
        .catch((error) => {
          if (error.code == "auth/multi-factor-auth-required") {
            let resolver = error.resolver;
            console.log("HINT USED: " + JSON.stringify(resolver.hints[0]));

            var phoneInfoOptions = {
              multiFactorHint: resolver.hints[0],
              session: resolver.session,
            };

            var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

            // Send SMS verification code.
            return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier).then((verificationId) => {
              // verificationId will be needed for sign-in completion.
              let verificationCode = prompt("We sent you a code.  Please enter it here");
              var cred = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
              var multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);

              resolver.resolveSignIn(multiFactorAssertion).then((userCredential) => {
                this.currentUser = userCredential;
              });
            });
          } else if (error.code == "auth/wrong-password") {
            // Handle other errors such as wrong password.
          }
        });
    }
  }
})
