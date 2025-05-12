
import { fetchJWT, fetchUser } from "./api.js";
import { button, ce, div, input } from "./createelment.js";
import { queruser } from "./query.js";
export function showlogin() {
    document.body.innerHTML = '';
    const form = ce('form');
    form.className = 'login-form';
    const userInput = input('text', 'Username or Email');
    userInput.setAttribute('id', 'user');

    const passInput = input('password', 'Password');
    passInput.setAttribute('id', 'pass');

    const loginBtn = button('btn', 'Login');
    loginBtn.setAttribute('id', 'btnlogin');

    const errorDiv = ce('div', 'error', '');
    errorDiv.setAttribute('id', 'error');

    form.append(userInput, passInput, loginBtn, errorDiv);
    const container = div('login-container');
    container.append(form);
    document.body.append(container);

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const user = userInput.value.trim();
        const pass = passInput.value.trim();
        if (!user || !pass) {
            errorDiv.textContent = 'Please enter both fields.'
            return
        }
      const res =await fetchJWT(user,pass)
        if (!res.ok) { const err = await res.json(); errorDiv.textContent = `Login failed: ${err.error}`;return;}
        const  token  = await res.json(); 
        if (token) {
            localStorage.setItem('jwt', token);
            showApp();  
        } else {
            errorDiv.textContent = 'Authentication failed, no token received.';
        }

    });
}
export async function showApp() {
    const data = await fetchUser(queruser);
    if (!data.ok) { return; }
    const user = await data.json();
    if (!user) { return; }
console.log(user);
    const gradesproject=user.data.user[0].progresses.reduce((acc, curr) => acc + curr.grade, 0);
console.log(gradesproject);

    document.body.innerHTML = '';
    const container = div('app-container');
    const navbar = div('navbar');
    const logoutBtn = button('btn', 'Logout');
    logoutBtn.setAttribute('id', 'logout');
    const logoutDiv = div('logout-container');
    logoutDiv.append(logoutBtn);
    navbar.append(div('logo-container').append(ce('svg', 'logo'), ce('span', 'logotext', 'GraphDB')), 
    ce('h1',"title",`welcome ${user.data.user[0].login}`),logoutDiv);
    const content=div('content');
    const infusser=div('infusser').append(ce('h1',"title","Infusser"),
    ce('h3',"title",`Login:  ${user.data.user[0].login}`),
    ce('h3',"title",`Campus:  ${user.data.user[0].campus}`),
    ce('h3',"title",`FirstName:  ${user.data.user[0].attrs.firstName}`),ce('h3',"title",`LastName:  ${user.data.user[0].attrs.lastName}`)
    ,ce('h3',"title",`Email:  ${user.data.user[0].attrs.email}`),ce('h3',"title",`Country:  ${user.data.user[0].attrs.country}`),
    ce('h3',"title",`Gender:  ${user.data.user[0].attrs.gender}`));
    const projectwork=div('projectwork').append(ce('h1',"title","ProjectWork"))
    user.data.user[0].transactions.forEach(element => {
      projectwork.append(ce('h3',"title",`Amount:  ${element.amount}`), ce('h3',"title",`Name:  ${element.object.name}`))
    })
    const circlegrades=div('circlegrades').append(ce('svg', 'circlegrades').append(ce('circle', 'circle').setAttribute('cx','15').setAttribute('cx','12'),ce('circle', 'circle').setAttribute('cx','24'),ce('circle', 'circle').setAttribute('cx','8')),ce('h3',"title",`Grades:  ${gradesproject}`));
    content.append(infusser,projectwork);
    container.append(navbar,content);
    document.body.append(container);


    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt');
        showlogin(); 
      });
      



    // logoutBtn.addEventListener('click', () => {
    //     localStorage.removeItem('jwt');
    //     showlogin();
    // });

    // container.append(navbar);
    

   
}
