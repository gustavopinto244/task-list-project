console.log('Login page script loaded');

// To fade login form to register form
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toRegisterLink = document.getElementById('register-tab');
const toLoginLink = document.getElementById('login-tab');

toRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active', 'show');
    registerForm.classList.add('active', 'show');
    toRegisterLink.classList.add('active');
    toLoginLink.classList.remove('active');
});

toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active', 'show');
    loginForm.classList.add('active', 'show');
    toLoginLink.classList.add('active');
    toRegisterLink.classList.remove('active');
});