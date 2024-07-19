import {login, logout,signup} from './login.js';
import '@babel/polyfill';

console.log('Hello from the client side');

const loginForm = document.querySelector('.login-form > .form');
const logoutBtn = document.querySelector('.nav__element--logout');
const signupForm = document.querySelector('.signup-form > .form');

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#inputEmail').value;
    const password = document.querySelector('#inputPassword').value;
    login(email,password);
    // console.log(email,password);
});

logoutBtn?.addEventListener('click',logout);

signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#inputName').value;
    const email = document.querySelector('#inputEmail').value;
    const role = document.querySelector('#inputRole').value;
    const password = document.querySelector('#inputPassword').value;
    const passwordConfirm = document.querySelector('#inputPasswordConfirm').value;
    signup(name,email,role,password,passwordConfirm);
});