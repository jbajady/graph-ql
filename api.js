
export async function fetchJWT(user, pass) {
    const basicAuth = btoa(`${user}:${pass}`);
    try {
        const res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
            }
        });
        return res
    } catch (err) {
        errorDiv.textContent = 'Error connecting to server: ' + err.message;
    }

}
export async function fetchUser(queryuser) {
    try {
        const res = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify( queryuser)
        });
        return res
    } catch (err) {
       console.log("error",err);
       
    }

}