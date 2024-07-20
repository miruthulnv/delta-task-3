import {login, logout,signup} from './login.js';
import {likeSong, updateStatus} from './like.js';
import '@babel/polyfill';


console.log('Hello from the client side');

const loginForm = document.querySelector('.login-form > .form');
const logoutBtn = document.querySelector('.nav__element--logout');
const signupForm = document.querySelector('.signup-form > .form');
const likeBtn = document.querySelector('.song__like--button');
const searchBtn = document.querySelector('.searchbox__button');
const searchInput = document.querySelector('.searchbox__input');
const modal = document.getElementById("myModal");
const btn = document.getElementById("openModal");
const span = document.getElementsByClassName("close")[0];

likeBtn && updateStatus(likeBtn);

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

likeBtn?.addEventListener('click', ()=>likeSong(likeBtn));

searchBtn?.addEventListener('click', (e) => {
    // e.preventDefault();
    const query = document.querySelector('.searchbox__input').value;
    window.location.href = `/search?q=${query}`;
});

searchInput?.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

btn?.onclick = function() {
    modal.style.display = "block";
}