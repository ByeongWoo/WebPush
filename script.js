// State variables
let pushToken = "";
let resData = "";
let resNoti = "";
// let url = "http://localhost:8080";
let url = "https://0123-183-101-208-60.ngrok-free.app";
let notification = null;
let eventMsg = "";
let permissionMsg = "";

let getTokenBtn = "";
let getUnsubscribeBtn = "";
let pushTokenElem = "";
let handleNotiBtn = "";
let handleNotiAllBtn = "";
let resNotiElem = "";
let handleSubmitBtn = "";
let resDataElem = "";
let notificationPopup = "";
let popupImage = "";
let popupIcon = "";
let popupTitle = "";
let popupBody = "";
let closePopupBtn = "";
let eventMsgElem = "";
let permissionMsgElem = "";
let makePWAbtn = "";
let installPrompt = "";

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  getTokenBtn = document.getElementById("getTokenBtn");
  getUnsubscribeBtn = document.getElementById("getUnsubscribeBtn");
  pushTokenElem = document.getElementById("pushToken");
  handleNotiBtn = document.getElementById("handleNotiBtn");
  //handleNotiAllBtn = document.getElementById("handleNotiAllBtn");
  resNotiElem = document.getElementById("resNoti");
  handleSubmitBtn = document.getElementById("handleSubmitBtn");
  resDataElem = document.getElementById("resData");
  notificationPopup = document.getElementById("notificationPopup");
  popupImage = document.getElementById("popupImage");
  //popupIcon = document.getElementById("popupIcon");
  popupTitle = document.getElementById("popupTitle");
  popupBody = document.getElementById("popupBody");
  closePopupBtn = document.getElementById("closePopupBtn");
  //eventMsgElem = document.getElementById("eventMsg");
  permissionMsgElem = document.getElementById("permissionMsg");
  makePWAbtn = document.getElementById("makePWA");
  installPrompt = document.getElementById("installPrompt");

  // Event listeners
  getTokenBtn.addEventListener("click", getToken);
  getUnsubscribeBtn.addEventListener("click", getUnsubscribe);
  handleNotiBtn.addEventListener("click", handleNoti);
  //handleNotiAllBtn.addEventListener("click", handleNotiAll);
  handleSubmitBtn.addEventListener("click", handleSubmit);
  closePopupBtn.addEventListener("click", closePopup);
  makePWAbtn.addEventListener("click", makePWA);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  window.deferredPrompt = event;
});

window.addEventListener("appinstalled", (event) => {
  console.log("appinstalled", event);

  window.deferredPrompt = null;
});

// Functions
function handleMessage(event) {
  console.log("event.data = ", event.data);
  if (event.data) {
    // 서버에서 푸시 전송시 발생하는 이벤트
    if (event.data.type === "pushEvent") {
      setNotification({
        title: event.data.payload.title || "Web Push",
        body: event.data.payload.body || "Web Push",
        image: event.data.payload.image || "img/icon.png",
        // icon: event.data.payload.icon || "img/icon.png",
      });
    }
    // 알림을 클릭시 발생하는 이벤트
    if (event.data.push === "push") {
      console.log("알림 클릭 이벤트");
    }
  }
}

function setEventMsg(msg) {
  eventMsg = msg;
  eventMsgElem.innerText = eventMsg;
}

function setPermissionMsg(msg) {
  permissionMsg = msg;
  permissionMsgElem.innerText = permissionMsg;
}

function setNotification(data) {
  notification = data;
  displayNotificationPopup();
}

function displayNotificationPopup() {
  popupImage.src = notification.image;
  //popupIcon.src = notification.icon;
  popupTitle.innerText = notification.title;
  popupBody.innerText = notification.body;
  notificationPopup.style.display = "block";
}

function closePopup() {
  notification = null;
  notificationPopup.style.display = "none";
}

async function getSWRegistration() {
  return await navigator.serviceWorker.ready;
}

// 구독 해지
async function getUnsubscribe() {
  try {
    const swRegistration = await getSWRegistration();
    const currentSubscription =
      await swRegistration.pushManager.getSubscription();
    if (currentSubscription) {
      await currentSubscription.unsubscribe();
      window.location.reload();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
// 구독
async function getToken() {
  try {
    //const swRegistration = await navigator.serviceWorker.ready;
    const swRegistration = await getSWRegistration();
    swRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          "BDCuwEJaNg8f8UtTnD4yylmCuWsTCxxVoA-VXWExkxtCDC8U4yadV3aEUptbMvid_ctsDevpP-0NH40V-6AfW8k",
      })
      .then(function (pushSubscription) {
        //console.log(pushSubscription);
        pushToken = JSON.stringify(pushSubscription);
        pushTokenElem.innerText = pushToken;
        // 알림 허용 이벤트 처리 및 토큰 값을 사용하는 코드를 여기에 작성할 수 있습니다.
      })
      .catch(function (error) {
        console.log("토큰을 받아오지 못했습니다.", error);
      });
  } catch (error) {
    console.log("토큰을 받아오지 못했습니다.", error);
  }
}
// 구독 정보 저장
async function handleSubmit() {
  if (!pushToken) {
    alert("토큰을 받아오지 못했습니다. 토큰 값을 확인해주세요.");
    return;
  }
  try {
    const response = await axios.post(`${url}/api/v1/pushset`, pushToken, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const data = response.data;
      resData = data.resultMsg;
      resDataElem.innerText = resData;
      console.log("저장 응답:", data);
      //window.location.reload();
      // 여기에서 응답 데이터를 처리하도록 코드를 작성하세요.
    } else {
      console.log("저장 응답이 실패했습니다.", response.status);
    }
  } catch (error) {
    console.log("저장 응답에 실패했습니다.", error);
  }
}
// 알림 받기
async function handleNoti(e) {
  if (!pushToken) {
    alert("토큰을 받아오지 못했습니다. 토큰 값을 확인해주세요.");
    return;
  }
  try {
    const response = await axios.post(`${url}/api/v1/send2`, pushToken, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const data = response.data;
      //resNoti = data.resultMsg;
      //resNotiElem.innerText = resNoti;
      console.log("알림 응답:", data);
      // 여기에서 응답 데이터를 처리하도록 코드를 작성하세요.
    } else {
      console.log("알림 응답이 실패했습니다.", response.status);
    }
  } catch (error) {
    console.log("알림 응답에 실패했습니다.", error);
  }
}

async function makePWA(e) {
  // PWA 설치
  installPrompt.style.display = "block";
}

document.getElementById("installPwaBtn").addEventListener("click", async () => {
  console.log("👍", "butInstall-clicked");
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log("👍", "userChoice", result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
  // Hide the install button.
});

/**
 * 알림 요청
 * getPermission() 또는 getToken() 실행시 새로고침 필요(브라우저,PWA가 사이트 변화를 인식하도록 새로고침 한다)
 * permission === granted 면 실행안해도 됨
 *
 */
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        console.log("알림 권한이 허용되었습니다.");
        window.location.reload(); // 알림이 허용 되면 새로고침하여 서비스워커를 재등록
      } else if (permission === "denied") {
        console.log("알림 권한이 거부되었습니다.");
      }
    });
  }
}

window.navigator.serviceWorker.addEventListener("message", handleMessage);

window.addEventListener("beforeunload", function () {
  window.navigator.serviceWorker.removeEventListener("message", handleMessage);
});
