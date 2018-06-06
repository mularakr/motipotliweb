importScripts('https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.12.0/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': '14691279328'
});
const messaging = firebase.messaging();
self.addEventListener('notificationclick', e => {
    let found = false;
    let f = clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
    })
        .then(function (clientList) {
            for (let i = 0; i < clientList.length; i ++) {
                if (clientList[i].url === e.notification.data.click_action) {
                    // We already have a window to use, focus it.
                    found = true;
                    clientList[i].focus();
                    break;
                }
            }
            if (! found) {
            	console.log(e.notification.data.click_action);
                clients.openWindow(e.notification.data.click_action).then(function (windowClient) {});
            }
        });
    e.notification.close();
    e.waitUntil(f);
});

// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message today', payload);
    // Customize notification here

    return self.registration.showNotification(payload.data.title,
        Object.assign({data: payload.data, timeToLive: 10}, payload.data));

});

/*const messaging = firebase.messaging();
 
 messaging.setBackgroundMessageHandler(function(payload) {

	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	// Customize notification here  

	var notificationTitle = 'Background Message Title';
	var notificationOptions = {
		body: 'Background Message body.',
		icon: '/firebase-logo.png',
		click_action: 'localhost:4200/'
	};

	//return self.registration.showNotification(notificationTitle,notificationOptions);
	const promiseChain = clients.matchAll({
												type: 'window',
												includeUncontrolled: true
                                            })
                                    .then((windowClients) => {
										
										for (let i = 0; i < windowClients.length; i++) {
											const windowClient = windowClients[i];
											windowClient.postMessage(payload);
                                        }
									})
							       	.then(() => {
										return self.registration.showNotification(notificationTitle,
										notificationOptions);
                                    });
	  return promiseChain;
	  
}); */