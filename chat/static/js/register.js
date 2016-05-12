var loginForm;
var registerForm;
var recoverForm;
var showLoginEl;
var showRegisterEl;

var RegisterValidator = function () {
	var self = this;
	self.init = function() {
		self.fields = [self.username, self.email, self.repeatPassword, self.password, self.gender];
		for (var i =0; i < self.fields.length; i++) {
			var element = self.fields[i];
			var parentNode = element.input.parentNode;
			element.required = CssUtils.hasClass(parentNode, 'required');
			element.icon = parentNode.children[0];
			if (element.input.getAttribute('type') === 'password') {
				element.input.onkeyup = element.validate;
			} else {
				element.input.onchange = element.validate;
			}
			element.slider =  parentNode.children[parentNode.children.length-1];
			(function(element){
				if (element.input.id != 'id_sex') {
					element.slider.textContent = element.text;
				}
				element.input.onfocus = function() {
					CssUtils.removeClass(element.slider, 'closed');
				};
				/*FF doesn't support focusout*/
				element.input.onblur=  function() {
					CssUtils.addClass(element.slider, 'closed');
				};
			})(element);
		}
	};
	self.errorCls = 'error';
	self.successCls = 'success';
	self.warnCls = 'warn';
	self.allCls = [self.successCls, self.warnCls, self.errorCls];
	self.username = {
		input: $("rusername"),
		text: "Please select username",
		badUsernameText: "Username can only contain latin letters, numbers, dashes or underscore",
		validText: "Username is fine",
		validate: function () {
			var input = self.username.input;
			input.value = input.value.trim();
			var username = input.value;
			if (username === "") {
				self.setError(self.username, self.username.text);
			} else if (!USER_REGEX.test(username)) {
				self.setError(self.username, self.username.badUsernameText);
			} else {
				doPost('/validate_user', {username: username}, function (data) {
					if (data === RESPONSE_SUCCESS) {
						self.setSuccess(self.username);
					} else {
						self.setError(self.username, data);
					}
				}, null);
			}
		}
	};
	self.password = {
		input: $("rpassword"),
		text: "Come up with password",
		warnText: "Password is weak! Good one contains at least 5 characters, one big letter small letter and a digit",
		validText: "Password is good!",
		shortText: "Password is too short",
		passRegex : /^\S.+\S$/,
		passGoodRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/,
		validate: function() {
			var el = self.password;
			var pswd = el.input.value;
			if (pswd.length === 0) {
				self.setError(el, el.text);
			} else if (!el.passRegex.test(pswd)) {
				self.setError(el, el.shortText);
			} else if (!el.passGoodRegex.test(pswd) && pswd.length < 11) {
				self.setWarn(el);
			} else {
				self.setSuccess(el);
			}
			self.repeatPassword.validate();
		}
	};
	self.repeatPassword = {
		input: $("repeatpassword"),
		validText: "Passwords match",
		notMatchText: "Passwords don't match",
		text: "Repeat your password",
		validate: function () {
			var el = self.repeatPassword;
			var value = el.input.value;
			if (value == "") {
				self.setError(el, el.text);
			} else if (value !== self.password.input.value) {
				self.setError(el, el.notMatchText);
			} else {
				self.setSuccess(el);
			}
		}
	};
	self.gender = {
		input: $('id_sex'),
		validate : function() {
			CssUtils.addClass(self.gender.icon, self.successCls);
			self.gender.input.style.color ='#C7C7C7'
		}
	};
	self.email = {
		input: $("email"),
		validText: "Email is fine",
		text: "Specify your email. Though email is not required it will give you a lot of privileges!",
		validate: function () {
			var input = self.email.input;
			var element = self.email;
			var mail = input.value;
			input.setCustomValidity("");
			if (mail.trim() == ''){
				CssUtils.removeClass(element.icon, self.errorCls);
				CssUtils.removeClass(element.icon, self.successCls);
				element.input.setCustomValidity("");
				element.slider.textContent = element.text;
			} else if (!input.checkValidity()) {
				self.setError(self.email, input.validationMessage);
			} else {
				doPost('/validate_email', {'email': mail}, function (data) {
					if (data === RESPONSE_SUCCESS) {
						self.setSuccess(self.email);
					} else {
						self.setError(self.email, data);
					}
				}, null);
			}
		}
	};
	self.setError = function (element, errorText) {
		CssUtils.setOnOf(element.icon, self.errorCls, self.allCls);
		element.slider.textContent = errorText;
		element.input.setCustomValidity(errorText);
	};
	self.setWarn = function (element) {
		CssUtils.setOnOf(element.icon, self.warnCls, self.allCls);
		element.slider.textContent = element.warnText;
		element.input.setCustomValidity("");
	};
	self.setSuccess = function (element) {
		CssUtils.setOnOf(element.icon, self.successCls, self.allCls);
		element.input.setCustomValidity("");
		element.slider.textContent = element.validText;
	};
};

function showRegister() {
	CssUtils.showElement(registerForm);
	CssUtils.hideElement(loginForm);
	CssUtils.hideElement(recoverForm);
	CssUtils.removeClass(showRegisterEl, 'disabled');
	CssUtils.addClass(showLoginEl, 'disabled');
}

function showLogin() {
	CssUtils.hideElement(registerForm);
	CssUtils.showElement(loginForm);
	CssUtils.hideElement(recoverForm);
	CssUtils.removeClass(showLoginEl, 'disabled');
	CssUtils.addClass(showRegisterEl, 'disabled');
}

function showForgotPassword () {
		CssUtils.hideElement(registerForm);
		CssUtils.hideElement(loginForm);
		CssUtils.showElement(recoverForm);
		CssUtils.addClass(showLoginEl, 'disabled');
		CssUtils.addClass(showRegisterEl, 'disabled');
	}

onDocLoad(function () {
	loginForm = $('regLoginForm');
	registerForm = $('register-form');
	recoverForm = $('recoverForm');
	showLoginEl = $('showLogin');
	showRegisterEl = $('showRegister');
	var registerValidator = new RegisterValidator();
	registerValidator.init();
	showRegisterEl.onclick = showRegister;
	showLoginEl.onclick = showLogin;
	$('recoverPassword').onclick = showForgotPassword;
	var initType = getUrlParam('type');
	if (initType == 'login') {
		showLogin();
	} else if (initType == 'register') {
		showRegister();
	}
});

function register(event) {
	event.preventDefault();
	//ajaxShow(); TODO
	var callback = function (data) {
		//ajaxHide();
		if (data === RESPONSE_SUCCESS) {
			window.location.href = '/';
		} else {
			growlError(data);
		}
	};
	doPost('/register', null, callback, registerForm);
}


function restorePassword(event) {
	event.preventDefault();
	var form = recoverForm;
	//ajaxShow(); TODO
	var callback = function (data) {
		// if captcha is turned off
		if (typeof grecaptcha != 'undefined') {
			grecaptcha.reset();
		}
		//ajaxHide();
		if (data === RESPONSE_SUCCESS) {
			alert("Check your email. The verification password has been sent");
		} else {
			growlError(data);
		}
	};
	doPost('/send_restore_password', null, callback, form);
}