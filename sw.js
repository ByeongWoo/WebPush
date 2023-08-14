// 서비스워커 파일은 브라우저, PWA 가 ON 상태일때 동작

// 서비스 워커가 설치되었을 때 이전 버전의 워커가 여전히 대기 상태로 남아있는 것을 방지하고,
// 최신 버전의 워커가 빠르게 활성화되도록 할 수 있습니다.
self.addEventListener("install", (event) => {
	console.log("install");
	self.skipWaiting();
});

// 푸시 서비스를 통해 알림이 오면 실행됨
self.addEventListener("push", (event) => {
	// if (!(self.Notification && self.Notification.permission === "granted")) {
	// 	return;
	// }

	if (Notification.permission !== "granted") {
		return;
	}

	const data = event.data?.json() ?? {};
	console.log("push:", data);
	const title = data.title || "Web Push";
	const message = data.body || "Web Push Test";
	const image = data.image || "img/ai.png";
	//const icon = data.icon || "img/cat.png";

	const options = {
		title: title,
		body: message,
		image: image,
		custNo: '1234567890',
		startNum: '5274',
		endNum: '3192',
		// icon: icon,
	};

	event.waitUntil(
		self.registration.showNotification(title, options).then(() => {
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage({
						type: "pushEvent", // pushEvent 값을 postMessage()로 전달
						payload: {
							title: title,
							body: options.body,
							image: options.image,
							// icon: options.icon,
						},
					});
				});
			});
		})
	);
});

// 알림을 클릭하는 경우 실행
self.onnotificationclick = (event) => {
	console.log("onnotificationclick : ", event.notification.tag);
	event.notification.close();

	const pushValue = "push";

	event.waitUntil(
		clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (
						client.url === "https://venerable-cascaron-63d5c2.netlify.app" &&
						"focus" in client
					) {
						client.focus();
						client.postMessage({ push: pushValue }); // push 값을 postMessage()로 전달
						return;
					}
				}
				if (clients.openWindow) {
					clients.openWindow("https://venerable-cascaron-63d5c2.netlify.app");
				}
			})
	);
};
