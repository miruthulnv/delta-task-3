import { login,logout } from './login.js';
import '@babel/polyfill';

console.log('Hello from the client side');

const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#inputEmail').value;
    const password = document.querySelector('#inputPassword').value;
    login(email,password);
});

logoutBtn?.addEventListener('click',logout);