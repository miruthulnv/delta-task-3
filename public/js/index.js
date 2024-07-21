import {login, logout,signup} from './login.js';
import {likeSong, updateStatus} from './like.js';
import '@babel/polyfill';
import {addPlaylist, addSong,removeSong} from "./playlist.js";


console.log('Hello from the client side');
const loginForm = document.querySelector('.login-form > .form');
const logoutBtn = document.querySelector('.nav__element--logout');
const signupForm = document.querySelector('.signup-form > .form');
const likeBtn = document.querySelector('.song__like--button');
const searchBtn = document.querySelector('.searchbox__button');
const searchInput = document.querySelector('.searchbox__input');
const modalForm = document.getElementById('modalForm');
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

modalForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const songId = window.location.href.split('/').pop();
    console.log('Form submitted');
    // Get list of all the check boxes chosen in that form
    const checkboxes = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(el=> el.value);
    const uncheckboxes = [...document.querySelectorAll('input[type="checkbox"]:not(:checked)')].map(el=> el.value);
    await checkboxes.forEach(el => {
           addSong(el, songId);
           // Add songs to all these playlists
    });
    await uncheckboxes.forEach(el => {
        // Remove songs from all these playlists
        removeSong(el,songId);
    });
    // Get the input text given by user

    const inputText = document.getElementById('newPlaylist').value;
    if (inputText!== '') {
        const playlistId = await addPlaylist(inputText);
        // Create a new playlist with input text and add song to that
        await addSong(playlistId, songId);
    }
});

