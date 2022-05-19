import axios from "axios";
import { createStore } from "vuex";
import firebase from "firebase";

export default createStore({
  state: {
    isDevelopment: process.env.NODE_ENV !== "production",
    currentUser: null,
    globalLoading: true,
    firebase: null,
  },
  mutations: {
    setIsConnected(state, val) {
      state.isConnected = val;
    },
    setConfig(state, val) {
      state.config = val;
    },
    setUser(state, val) {
      state.currentUser = val;
    },
    setGlobalLoading(state, val) {
      state.globalLoading = val;
    },
    setFirebase(state, val) {
      state.firebase = val;
    },
    setConnection(state, val) {
      state.connection = val;
    },
  },
  actions: {
    updateLayout: ({ commit, state }) => {
      let layout = getCurrentLayout();

      if (layout !== state.layout) {
        commit("setLayout", layout);
      }
    },
    setMailboxes: ({ commit }, val) => {
      commit("setMailboxes", val);
    },
    setEmails: ({ commit }, val) => {
      commit("setEmails", val);
    },
    setIsConnected: ({ commit }, val) => {
      commit("setIsConnected", val);
    },
    setConfig: ({ commit }, val) => {
      commit("setConfig", val);
    },
    setUser: async ({ commit }, val) => {
      commit("setUser", val);
    },
    setConnection: ({ commit }, val) => {
      commit("setConnection", val);
    },
    loginEmailPass: async ({ state, commit }, val) => {
      let userCredential = await firebase.auth().signInWithEmailAndPassword(val.email, val.password);
      commit("setUser", userCredential.user);
    },
    login: async ({ state, commit }) => {
      let firebaseProvider = new firebase.auth.GoogleAuthProvider();
      let recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-area", {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved, you can proceed with phoneAuthProvider.verifyPhoneNumber(...).

          console.log("captcha solved");
          // onSolvedRecaptcha();
        },
      });

      state.firebase
        .auth()
        .signInWithPopup(firebaseProvider)
        .then((resp) => {
          commit("setUser", resp.user);
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
                commit("setUser", userCredential);
              });
            });
          } else if (error.code == "auth/wrong-password") {
            // Handle other errors such as wrong password.
          }
        });
    },
    
    setGlobalLoading: async ({ commit }, val) => {
      commit("setGlobalLoading", val);
    },
    setFirebase: async ({ commit }, val) => {
      commit("setFirebase", val);
    },
  },
  getters: {
    isMobile: (state) => state.layout === "mobile",
  },
});
