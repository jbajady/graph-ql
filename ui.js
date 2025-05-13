
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
   content.append(displayInfoUser(user), displayGrades(user),displayLevelWithSVG(user));
    container.append(showNavbar(user),content);
    document.body.append(container);

    
}

function displayLevelWithSVG(user) {
  const level = user.data.level || 25;

  const container = div("levelContainer");
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "160");
  svg.setAttribute("height", "160");

  const centerX = 80;
  const centerY = 80;
  const radius = 60;

  // خلفية الدائرة
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", centerX);
  circle.setAttribute("cy", centerY);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", "#fefce8");
  circle.setAttribute("stroke", "#ddd");
  circle.setAttribute("stroke-width", "2");
  svg.appendChild(circle);

  // النقاط حول الدائرة
  const dotCount = 40;
  for (let i = 0; i < dotCount; i++) {
    const angle = (2 * Math.PI * i) / dotCount;
    const dotX = centerX + Math.cos(angle) * (radius + 10);
    const dotY = centerY + Math.sin(angle) * (radius + 10);

    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", dotX);
    dot.setAttribute("cy", dotY);
    dot.setAttribute("r", 2);
    dot.setAttribute("fill", "#a855f7");
    svg.appendChild(dot);
  }

  // نص "Level"
  const levelText = document.createElementNS(svgNS, "text");
  levelText.setAttribute("x", centerX);
  levelText.setAttribute("y", centerY - 10);
  levelText.setAttribute("text-anchor", "middle");
  levelText.setAttribute("class", "level-circle-text");
  levelText.textContent = "Level";
  svg.appendChild(levelText);

  // رقم المستوى
  const levelNumber = document.createElementNS(svgNS, "text");
  levelNumber.setAttribute("x", centerX);
  levelNumber.setAttribute("y", centerY + 20);
  levelNumber.setAttribute("text-anchor", "middle");
  levelNumber.setAttribute("class", "level-number-text");
  levelNumber.textContent = level;
  svg.appendChild(levelNumber);

  container.appendChild(svg);
  return container
}


function displayGrades(user) {
    const container = ce('div', 'grades-list-svg');

    const svgNs = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('width', '100%');

    const rowHeight = 100;
    const radius = 30;
    const projects = user.data.transaction;

    svg.setAttribute('height', projects.length * rowHeight);

    projects.forEach((proj, i) => {
        const group = document.createElementNS(svgNs, 'g');
        const centerX = radius + 10;
        const centerY = i * rowHeight + radius + 10;

        const percentage = proj.amount;
        const angle = (percentage / 100) * 360;

        function polarToCartesian(cx, cy, r, angleDeg) {
            const rad = (angleDeg - 90) * Math.PI / 180.0;
            return {
                x: cx + r * Math.cos(rad),
                y: cy + r * Math.sin(rad)
            };
        }

        // Red slice
        const startRed = polarToCartesian(centerX, centerY, radius, 0);
        const endRed = polarToCartesian(centerX, centerY, radius, angle);
        const largeArcRed = angle > 180 ? 1 : 0;
        const redPath = `M ${centerX} ${centerY}
                         L ${startRed.x} ${startRed.y}
                         A ${radius} ${radius} 0 ${largeArcRed} 1 ${endRed.x} ${endRed.y}
                         Z`;

        const redSlice = document.createElementNS(svgNs, 'path');
        redSlice.setAttribute('d', redPath);
        redSlice.setAttribute('class', 'red-slice');
        group.appendChild(redSlice);

        // Blue slice
        const startBlue = endRed;
        const endBlue = polarToCartesian(centerX, centerY, radius, 360);
        const largeArcBlue = (360 - angle) > 180 ? 1 : 0;
        const bluePath = `M ${centerX} ${centerY}
                          L ${startBlue.x} ${startBlue.y}
                          A ${radius} ${radius} 0 ${largeArcBlue} 1 ${startRed.x} ${startRed.y}
                          Z`;

        const blueSlice = document.createElementNS(svgNs, 'path');
        blueSlice.setAttribute('d', bluePath);
        blueSlice.setAttribute('class', 'blue-slice');
        group.appendChild(blueSlice);

        // Percentage Text
        const gradeText = document.createElementNS(svgNs, 'text');
        gradeText.setAttribute('x', centerX);
        gradeText.setAttribute('y', centerY + 5);
        gradeText.setAttribute('text-anchor', 'middle');
        gradeText.setAttribute('font-size', '14');
        gradeText.setAttribute('font-weight', 'bold');
        gradeText.setAttribute('fill', '#fff');
        gradeText.textContent = `${proj.amount}%`;
        group.appendChild(gradeText);

        // Label text
        const label = document.createElementNS(svgNs, 'text');
        label.setAttribute('x', radius * 2 + 30);
        label.setAttribute('y', centerY + 5);
        label.setAttribute('class', 'type-label');
        label.textContent = proj.type;
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