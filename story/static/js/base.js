var sound = 0;
var userRegex = /^[a-zA-Z-_0-9]{1,16}$/;

document.addEventListener("DOMContentLoaded", function () {
	mute();
	if (typeof InstallTrigger !== 'undefined') {
		console.warn("Ops there's no scrollbar for firefox. Use chrome for pretty UI")
	}
});


function mute() {
	if (sound < 3) {
		sound ++;
	} else {
		sound = 0
	}
	var btn = document.getElementById("muteBtn");
	switch (sound) {
		case 0:
			btn.className = 'icon-volume-off';
			break;
		case 1:
			btn.className = 'icon-volume-1';
			break;
		case 2:
			btn.className = 'icon-volume-2';
			break;
		case 3:
			btn.className = 'icon-volume-3	';
			break;
	}
}

function checkAndPlay(element) {
	if (element.readyState && sound) {
		element.pause();
		// TODO currentType is not set sometimes
		element.currentTime = 0;
		switch (sound) {
			case 1:
				element.volume = 0.15;
				break;
			case 2:
				element.volume = 0.4;
				break;
			case 3:
				element.volume = 1;
		}
		element.play();
	}
}

(function () {
	var cookies;
	function readCookie(name, c, C, i) {
		if (cookies) {
			return cookies[name];
		}
		c = document.cookie.split('; ');
		cookies = {};
		for (i = c.length - 1; i >= 0; i--) {
			C = c[i].split('=');
			cookies[C[0]] = C[1];
		}
		var cookie = cookies[name];
		var length = cookie.length -1;
		// if cookie is wrapped with quotes (for ex api)
		if (cookie[0] == '"' && cookie[length] == '"') {
			cookie = cookie.substring(1, length);
		}
		return cookie;
	}
	window.readCookie = readCookie; // or expose it however you want
})();


function doPost(url, params, callback) {
	var r = new XMLHttpRequest();
	r.onreadystatechange = function () {
		if (r.readyState == 4) {
			if (r.status == 200) {
				console.log(getDebugMessage("POST {} in: {};", url, r.response));
				callback(r.response);
			} else {
				console.error(getDebugMessage("POST {} in: {}, status:", url, r.response, r.status));
			}
		}
	};
	var data = new FormData();
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			data.append(key, params[key]);
		}
	}
	r.open("POST", url, true);
	r.setRequestHeader("X-CSRFToken", window.readCookie("csrftoken"));
	console.log(getDebugMessage("POST {} out: {}", url, JSON.stringify(params)));
	r.send(data);
}


/** Formats message for debug,
 * Usage getDebugMessage("{} is {}", 'war', 'bad');
 * out: war is bad
 *  */
function getDebugMessage() {
	var now = new Date();
	// first argument is format, others are params
	for (var i = 1; i < arguments.length; i++) {
		arguments[0] = arguments[0].replace('{}', arguments[i]);
	}
	var time = [now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()].join(':');
	return time + ': ' + arguments[0];
}