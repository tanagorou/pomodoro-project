async function refreshAccessToken(){
    const refreshToken = localStorage.getItem("refresh_token")

    if(!refreshToken){
        console.log('リフレッシュトークンがありません。再ログインしてください')
        //window.location.href = ('/login/')
        return null
    }

    try{
        const res = await axios.post('/api/token/refresh/',{
            refresh: refreshToken
        })
        console.log('アクセストークン更新成功',res.data)
        //refreshトークンをもとにトークンを再発行する
        localStorage.setItem('jwt_token', res.data.access)
        return res.data.access
    } catch (err) {
        console.log('トークンの更新失敗', err)
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('refresh_token')
        //window.location.href = ('/login/')
        return null
    }
}
