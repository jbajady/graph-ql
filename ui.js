
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
    document.body.innerHTML = '';
    const container = div('app-container');
    const content=div('content');
   content.append(displayInfoUser(user), displayGrades(user),displayProjectsXP(user));
    container.append(showNavbar(user),content);
    document.body.append(container);

    
}

function displayProjectsXP(user) {
   const div1=div('projectsxp');
   const totalxp=user.data.user[0].transactions.reduce((total, transaction) => total + transaction.amount, 0);
   const svgNs = "http://www.w3.org/2000/svg";
   const svg = document.createElementNS(svgNs, 'svg');
   svg.setAttribute('width', '100%');
   svg.setAttribute('height', '100%');
   const radius = 30;
   const y = radius + 10;
   const circle = document.createElementNS(svgNs, 'circle');
   circle.setAttribute('cx', radius + 10);
   circle.setAttribute('cy', y);
   circle.setAttribute('r', radius);
   circle.setAttribute('stroke', 'black');
   circle.setAttribute('stroke-width', '2');
   circle.setAttribute('fill', '#fefce8');
   svg.appendChild(circle);
   const gradeText = document.createElementNS(svgNs, 'text');
   gradeText.setAttribute('x', radius + 10);
   gradeText.setAttribute('y', y + radius + 10);
   gradeText.setAttribute('text-anchor', 'middle');
   gradeText.setAttribute('dominant-baseline', 'middle');
   gradeText.setAttribute('font-size', '20px');
   gradeText.setAttribute('fill', 'black');
   gradeText.textContent = totalxp;
   svg.appendChild(gradeText);
   div1.append(svg);
   return div1;

}
function displayGrades(user) {
    const container = ce('div', 'grades-list-svg');
   
    const svgNs = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const rowHeight = 80;
    const radius = 30;
    const projects = user.data.user[0].progresses;

    svg.setAttribute('height', projects.length * rowHeight);

    projects.forEach((proj, i) => {
        const group = document.createElementNS(svgNs, 'g');
        const y = i * rowHeight + radius + 10;

        // الدائرة
        const circle = document.createElementNS(svgNs, 'circle');
        circle.setAttribute('cx', radius + 10);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', radius);
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('fill', '#fefce8');
        group.appendChild(circle);

        // نص داخل الدائرة
        const gradeText = document.createElementNS(svgNs, 'text');
        gradeText.setAttribute('x', radius + 10);
        gradeText.setAttribute('y', y + 5);
        gradeText.setAttribute('text-anchor', 'middle');
        gradeText.setAttribute('font-size', '14');
        gradeText.setAttribute('font-weight', 'bold');
        gradeText.setAttribute('fill', '#1f2937');
        gradeText.textContent = `${proj.grade*10}%`;
        group.appendChild(gradeText);

        // اسم المشروع
        const label = document.createElementNS(svgNs, 'text');
        label.setAttribute('x', radius * 2 + 20);
        label.setAttribute('y', y + 5);
        label.setAttribute('font-size', '16');
        label.setAttribute('fill', '#1f2937');
        label.textContent = proj.object.name;
        group.appendChild(label);

        svg.appendChild(group);
    });

    container.appendChild(svg);
    return container;
}




function displayInfoUser(user) {
  return  div('infusser').append(ce('h1',"title","Infusser"),
    ce('h3',"title",`Login:  ${user.data.user[0].login}`),
    ce('h3',"title",`Campus:  ${user.data.user[0].campus}`),
    ce('h3',"title",`FirstName:  ${user.data.user[0].attrs.firstName}`),ce('h3',"title",`LastName:  ${user.data.user[0].attrs.lastName}`)
    ,ce('h3',"title",`Email:  ${user.data.user[0].attrs.email}`),ce('h3',"title",`Country:  ${user.data.user[0].attrs.country}`),
    ce('h3',"title",`Gender:  ${user.data.user[0].attrs.gender}`))
}
function showNavbar(user) {
    
    const logoutBtn = button('btn', 'Logout');
    logoutBtn.setAttribute('id', 'logout');
    const logoutDiv = div('logout-container');
    logoutDiv.append(logoutBtn);
    return div('navbar').append(div('logo-container').append(ce('svg', 'logo'), ce('span', 'logotext', 'GraphDB')), 
    ce('h1',"title",`welcome ${user.data.user[0].login}`),logoutDiv);
}