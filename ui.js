
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
            errorDiv.textContent = 'Please enter both fields.';
            return;
        }
        const res = await fetchJWT(user, pass);
        if (!res.ok) {
            const err = await res.json();
            errorDiv.textContent = `Login failed: ${err.error}`;
            return;
        }
        const token = await res.json();
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
    if (user.errors) {
        showlogin()
        return
    }
    if (!user) { return; }
    console.log(user);

    document.body.innerHTML = '';


    document.body.append(writeNavbar(user));

    const container = div('container-content');
    const header = div('header');
    header.append(displayInfoUser(user), displayaudit(user), displayLevelWithSVG(user));

    container.append(
        header, displayGrades(user),
        div('graph').append(Graphxp(user))
    );

    document.body.append(container);
    document.querySelector("#logout").addEventListener("click",(e)=>{
        e.preventDefault()
        localStorage.removeItem('jwt');
        showlogin()
    })
}

function Graphxp(user) {
    const container = div("graph-xp");

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("id", "xpChart");
    svg.setAttribute("width", "800");
    svg.setAttribute("height", "300");
    svg.setAttribute("viewBox", "0 0 800 300");

    svg.innerHTML = `
     <text  x="45%" y="18px"  font-weight="bold" font-size="20px">XP progression</text>
    `

    const transactions = user.data.user[0].transactions;


    if (!transactions?.length) {
        svg.innerHTML += `
        <text  x="40%" y="200px" fill="red"  font-size="70px">0 XP</text>
        `
    } else {

        const padding = 40;
        const width = 800 - 2 * padding;
        const height = 300 - 2 * padding;

        transactions.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        let cumulativeExp = 0;
        const cumulativeAmounts = transactions.map(t => {
            cumulativeExp += t.amount;
            return cumulativeExp;
        });

        const maxExp = Math.max(...cumulativeAmounts);

        let path = "";
        const points = [];
        const spacing = width / (transactions.length - 1)
        if (transactions.length === 1) {
            spacing = 0;
        }
        const r = spacing !== 0 ? spacing : 1
        transactions.forEach((point, i) => {
            const x = padding + spacing * i;
            const y = padding + height - (cumulativeAmounts[i] / maxExp) * height;
            path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            points.push({ x, y });
        });

        const pathElement = document.createElementNS(svgNS, "path");
        pathElement.setAttribute("d", path);
        pathElement.setAttribute("fill", "none");
        pathElement.setAttribute("stroke", "#1e40af");
        pathElement.setAttribute("stroke-width", "1");
        pathElement.setAttribute("stroke-linejoin", "round");
        pathElement.setAttribute("stroke-linecap", "round");

        svg.appendChild(pathElement);

        points.forEach((point, i) => {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);
            circle.setAttribute("r", `${r/4}`);
            circle.setAttribute("fill", "#1e40af");
            circle.setAttribute("stroke", "#ffffff");
            circle.setAttribute("stroke-width", "1.5");

circle.addEventListener("mouseleave",()=>{
      const oldText = svg.querySelector(".xp-label");
                if (oldText) oldText.remove();
})

            circle.addEventListener("mouseenter", () => {
                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", point.x);
                text.setAttribute("y", point.y - 10); 
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("fill", "#1e40af");
                text.setAttribute("font-size", "14");
                text.classList.add("xp-label");
                text.textContent = `xp: ${formatBytes(cumulativeAmounts[i])} XP
                `;

                svg.appendChild(text);
            });

            svg.appendChild(circle);
        });

    }

    container.appendChild(svg);
    return container;
}

function displayLevelWithSVG(user) {
    let totalXp =formatBytes(user.data.user[0].transactions.reduce((total, transaction) => total + transaction.amount, 0));

    let level = user.data.user[0].events[0].level;

    if (!level) level = 0
    if (!(totalXp)) totalXp = 0


    const container = div("level-total-xp");
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "160");
    svg.setAttribute("height", "160");



    const centerX = 80;
    const centerY = 80;
    const radius = 80;
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "#fefce8");
    circle.setAttribute("stroke", "#bfdbfe");
    circle.setAttribute("stroke-width", "2");
    svg.appendChild(circle);

    const levelText = document.createElementNS(svgNS, "text");
    levelText.setAttribute("x", centerX);
    levelText.setAttribute("y", centerY - 10);
    levelText.setAttribute("text-anchor", "middle");
    levelText.setAttribute("class", "level-circle-text");
    levelText.textContent = "Level:";
    svg.appendChild(levelText);

    const levelNumber = document.createElementNS(svgNS, "text");
    levelNumber.setAttribute("x", centerX);
    levelNumber.setAttribute("y", centerY + 20);
    levelNumber.setAttribute("text-anchor", "middle");
    levelNumber.setAttribute("class", "level-number-text");
    levelNumber.textContent = level;
    svg.appendChild(levelNumber);

    const xpText = document.createElementNS(svgNS, "text");
    xpText.setAttribute("x", centerX);
    xpText.setAttribute("y", centerY + 50);
    xpText.setAttribute("text-anchor", "middle");
    xpText.setAttribute("class", "xp-circle-text");
    xpText.textContent = `Total XP: ${totalXp}`;
    svg.appendChild(xpText);
    container.appendChild(svg);
    return container;
}

function displayaudit(user) {
    const container = ce('div', 'audit').append(ce('h1', undefined, "Audit:"));
    const div1 = ce('div', "", `Audit Ratio: ${Math.round(user.data.user[0].auditRatio * 10) / 10}`);
    const div2 = ce('div', "", `Total Up: ${formatBytes(user.data.user[0].totalUp)}`);
    const div3 = ce('div', "", `Total Up Bonus: ${formatBytes(user.data.user[0].totalUpBonus)}`);
    const div4 = ce('div', "", `Total Down: ${formatBytes(user.data.user[0].totalDown)}`);

    return container.append(div1, div2, div3, div4);
}

function displayGrades(user) {
    const container = ce('div', 'sidebar');

    const svgNs = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('width', '100%');

    const rowHeight = 100;
    const radius = 30;
    const projects = user.data.transaction;

    svg.setAttribute('height', projects && projects.length > 0 ? projects.length * rowHeight : "200px");
    svg.innerHTML = `
    <text  x="45%" y="18px"  font-weight="bold" font-size="20px">Skills</text>
   `

    if (projects?.length > 0) {
        projects.forEach((proj, i) => {
            const group = document.createElementNS(svgNs, 'g');
            const centerX = radius + 10;
            const centerY = i * rowHeight + radius + 30;

            const percentage = proj.amount;
            const angle = percentage === 100 ? 359.99 : (percentage / 100) * 360;


            function polarToCartesian(cx, cy, r, angleDeg) {
                const rad = (angleDeg - 90) * Math.PI / 180.0;
                return {
                    x: cx + r * Math.cos(rad),
                    y: cy + r * Math.sin(rad)
                };
            }

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

            const startBlue = endRed;
            // const endBlue = polarToCartesian(centerX, centerY, radius, 360);
            const largeArcBlue = (360 - angle) > 180 ? 1 : 0;
            const bluePath = `M ${centerX} ${centerY}
                              L ${startBlue.x} ${startBlue.y}
                              A ${radius} ${radius} 0 ${largeArcBlue} 1 ${startRed.x} ${startRed.y}
                              Z`;

            const blueSlice = document.createElementNS(svgNs, 'path');
            blueSlice.setAttribute('d', bluePath);
            blueSlice.setAttribute('class', 'blue-slice');
            group.appendChild(blueSlice);

            const gradeText = document.createElementNS(svgNs, 'text');
            gradeText.setAttribute('x', centerX);
            gradeText.setAttribute('y', centerY + 5);
            gradeText.setAttribute('text-anchor', 'middle');
            gradeText.setAttribute('font-size', '14');
            gradeText.setAttribute('font-weight', 'bold');
            gradeText.setAttribute('fill', '#fff');
            gradeText.textContent = `${proj.amount}%`;
            group.appendChild(gradeText);

            const label = document.createElementNS(svgNs, 'text');
            label.setAttribute('x', radius * 2 + 30);
            label.setAttribute('y', centerY + 5);
            label.setAttribute('class', 'type-label');
            label.textContent = proj.type;
            group.appendChild(label);

            svg.appendChild(group);
        });
    } else {
        svg.innerHTML += `
        <text  x="20%" y="200px" fill="red" font-size="70px">Not Skills found</text>
        `
    }


    container.appendChild(svg);
    return container;
}

function displayInfoUser(user) {
    return div('inf-user').append(
        ce('h1', "title", "User Info"),
        ce('h3', "title", `Login: ${user.data.user[0].login}`),
        ce('h3', "title", `First Name: ${user.data.user[0].attrs.firstName}`),
        ce('h3', "title", `Last Name: ${user.data.user[0].attrs.lastName}`),
        ce('h3', "title", `Gender: ${user.data.user[0].attrs.gender}`)
    );
}

function writeNavbar(user) {
    const logoutBtn = button('btn', 'Logout');
    logoutBtn.setAttribute('id', 'logout');
    const logoutDiv = div('logout-container');
    logoutDiv.append(logoutBtn);
    return div('navbar').append(
        div('logo-container').append(
            ce('svg', 'logo'),
            ce('span', 'logotext', 'GraphQL')
        ),
        ce('h1', "title", `Welcome ${user.data.user[0].login}`),
        logoutDiv
    );
}

function formatBytes(bytes) {
    // if (bytes === 0) return "0 Bytes";
    // const units = ["Bytes", "KB", "MB", "GB", "TB"];
    // const i = Math.floor(Math.log(bytes) / Math.log(1024));
    // const value = bytes / Math.pow(1024, i);
    // return `${value.toFixed(1)} ${units[i]}`;
    if (!bytes) {
        return 0
    }
    if (bytes >= 1000000000) {
        return Math.round((bytes / 1000000000).toFixed(2) )+ " GB";
    } else if (bytes >= 1000000) {
        return Math.round((bytes / 1000000).toFixed(2)) + " MB";
    } else if (bytes >= 1000) {
        return Math.round((bytes / 1000).toFixed(2)) + " KB";
    } else {

        return Math.round(bytes.toFixed(1) )+ " B";
    }
}