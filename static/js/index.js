async function checkLogin(){
    const token = localStorage.getItem('jwt_token');
    if(!token){
        document.getElementById('user_message').textContent = 'ログインしてください';
        document.getElementById('auth-button').style.display = 'block';
        document.getElementById('logout-form').style.display = 'none'
        return
    }

    try {
        const res = await axios.get('/api/user/', {
            headers: { Authorization: `JWT ${token}`}
        })
        console.log('認証成功',res)
        document.getElementById('user_message').textContent = `ようこそ、${res.data.username}`
        document.getElementById('auth-button').style.display = 'none';
        document.getElementById('logout-form').style.display = 'block'
    } catch (err) {
        console.log('認証失敗',err)
    }
}

document.addEventListener('DOMContentLoaded', function(){
    checkLogin()
})
