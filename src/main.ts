import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; //這裏使用非 sw 版
import { createApp } from "vue";
import App from "./App.vue";

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const messaging = getMessaging(firebaseApp);

createApp(App).mount("#app");

export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register(
            import.meta.env.MODE === "production"
              ? `${import.meta.env.BASE_URL}sw.js`
              : "/dev-sw.js?dev-sw",
            {
              type:
                import.meta.env.MODE === "production" ? "classic" : "module",
            }
          )
          .then(
            function (registration) {
              console.log(
                "Service worker registration succeeded:",
                registration
              );
              requestNewToken(registration);
            },
            /*catch*/ function (error) {
              console.log("Service worker registration failed:", error);
            }
          );
      } else {
        console.log("Service workers are not supported.");
      }
    }
  });
}

function requestNewToken(registration: ServiceWorkerRegistration) {
  getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration, //由於使用自行打包出的 /baseurl/sw.js 作爲 service worker，因此需要指定 serviceWorkerRegistration。
    //否則 FCM SDK 會使用 /firebase-messaging-sw.js 作爲 service worker，導致網站無法放在子目錄下
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("currentToken", currentToken);
        //token 傳遞給後端，後向 FCM 註冊 token 要訂閱的主題
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
}

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
});
