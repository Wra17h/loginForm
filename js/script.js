'use strict';

const authBlock = document.querySelector('.auth');
const authForm = document.querySelector('.auth-form');
const authSubmitBtn = document.querySelector('.auth-form__button');
const authFormEmail = document.querySelector('.auth-form__input-email');
const authFormPassword = document.querySelector('.auth-form__input-pass');
const authFormError = document.querySelector('.auth-form__error');

async function login({
	email,
	password
}) {
	const url = "https://us-central1-mercdev-academy.cloudfunctions.net/login";
	const params = {
		headers: {
			"Content-Type": "application/json"
		},
		method: "post",
		body: JSON.stringify({
			email,
			password
		})
	};

	const reponse = await fetch(url, params);
	const json = await reponse.json();

	if (reponse.ok) {
		return json;
	} else {
		throw new Error(json.error);
	}
}

async function tryLogin(event) {
	event.preventDefault();

	const authFormData = new FormData(authForm);
	const email = authFormData.get("email");
	const password = authFormData.get("password");

	disableLoginForm();
	hideLoginError();

	try {
		const user = await login({
			email,
			password
		});
		showUserProfile(user);
	} catch (error) {
		showLoginError(error.message);
	} finally {
		enableLoginForm();
	}
}

function showLoginValidationError() {
	authFormEmail.classList.add("auth-form__input--invalid");
	authFormPassword.classList.add("auth-form__input--invalid");
}

function hideLoginValidationError() {
	authFormEmail.classList.remove(".auth-form__input--invalid");
	authFormPassword.classList.remove(".auth-form__input--invalid");
}

function showLoginError(message) {
	authFormError.innerText = message;
	authFormError.removeAttribute("hidden");
	showLoginValidationError();
}

function hideLoginError() {
	authFormError.setAttribute("hidden", "true");
	hideLoginValidationError();
}

function disableLoginForm() {
	authFormEmail.setAttribute("disabled", "true");
	authFormPassword.setAttribute("disabled", "true");
	authSubmitBtn.setAttribute("disabled", "true");
}

function enableLoginForm() {
	authFormEmail.removeAttribute("disabled");
	authFormPassword.removeAttribute("disabled");
	authSubmitBtn.removeAttribute("disabled");
}

authForm.addEventListener("submit", tryLogin);
authFormEmail.addEventListener("input", hideLoginValidationError);
authFormPassword.addEventListener("input", hideLoginValidationError);

const userProfile = document.querySelector(".user-profile");
const userProfileName = document.querySelector(".user-profile__name");
const userProfileAvatar = document.querySelector(".user-profile__avatar");
const userProfileLogoutButton = document.querySelector(".user-profile__logout");

function showUserProfile(user) {
	authBlock.setAttribute("hidden", "true");

	userProfileName.innerText = user.name;
	userProfileAvatar.setAttribute("src", user.photoUrl);
	userProfile.removeAttribute("hidden");
}

function logout() {
	window.location.reload();
}


userProfileLogoutButton.addEventListener("click", logout);