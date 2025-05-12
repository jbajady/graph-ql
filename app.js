import { showApp, showlogin } from "./ui.js";
if (localStorage.getItem('jwt')) {
    showApp()
}else{
    showlogin()
}
// showlogin()