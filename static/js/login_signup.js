const form = document.querySelector('#submitForm')

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("現在のURLパス:", window.location.pathname);
    const isSignup = window.location.pathname.includes('signup');

    if(isSignup){
        const signUpEndpoint = '/api/signup/'
        const signUpFormData = {
        'username': document.getElementById('username').value,
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
        };
        try{
            const res = await axios.post(signUpEndpoint, signUpFormData,{
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log('これはサインアップです。データを送信できました')
            localStorage.setItem('jwt_token', res.data.access)
            localStorage.setItem('refresh_token', res.data.refresh)
            window.location.href = '/'
        } catch (err) {
            console.log('これはサインアップです。データを送信できませんでした', err)
        }
    } else {
        const loginEndpoint = '/api/login/'
        const loginFormData = {
            'email': document.getElementById('email').value,
            'password': document.getElementById('password').value,
        }
        try {
            const res = await axios.post(loginEndpoint,loginFormData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log('これはログインです。送信成功です')
            localStorage.setItem('jwt_token', res.data.access)
            localStorage.setItem('refresh_token', res.data.refresh)
            window.location.href = '/'
        } catch (err) {
            console.log('これはログインです。送信できませんでした',err)
        }
    }
})