import axios from 'axios';
import {showAlert} from "./alert.js";

export const login = async (email, password) => {
    try{
        const res = await axios({
            method: "POST",
            url: `/api/v1/users/login`,
            data:{
                email,
                password,
            }
        });
        if (res.data.status === "success"){
            showAlert('success',"Logged in successfully");
            window.setTimeout(() => {
                location.assign("/");
            }, 1500);
        }
    }catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const logout = async()=>{
    try{
        const res = await axios({
            method: "GET",
            url: `/api/v1/users/logout`,
        });
        if (res.data.status === 'success'){
            showAlert('success','Logged out successfully');
            window.setTimeout(() => {
                location.assign('/login');
            }, 1500);
        }
    } catch(err){
        showAlert('error','Error logging out! Try again');
    }
}


export const signup = async (name, email,role, password, confirmPassword) => {
    try{
        const res = await axios({
            method: "POST",
            url: `/api/v1/users/signup`,
            data: {
                name,
                email,
                role,
                password,
                confirmPassword,
            }
        });
        if (res.data.status === "success"){
            showAlert('success','Signed up successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}