const form = document.querySelector('#submitForm')

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("現在のURLパス:", window.location.pathname);
    const isSignup = window.location.pathname.includes('signup');
    const endpoint = isSignup ? '/api/signup/' : '/api/token/'

    const formData = {
        'username': document.getElementById('username').value,
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
    };
    console.log('送信データ', formData)
    try {
        const res = await axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log('送信成功', res.data)
        localStorage.setItem('jwt_token', res.data.access)
        localStorage.setItem('refresh_token', res.data.refresh)

        axios.defaults.headers.common["Authorization"] = `JWT ${res.data.access}`;
        window.location.href = '/'
    } catch (err) {
        console.log('送信失敗', err)
    }
})