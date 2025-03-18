async function listDayRecord(period){
    const token = localStorage.getItem('jwt_token')
    let work_total = 0
    let rest_total = 0
    let study_total = 0
    try {
        const res = await axios.get(`/api/list/record/?period=${period}`,{
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
        console.log('送信完了しました',res.data)

        for(let record of res.data){
            work_total += record.work_time
            rest_total += record.rest_time
            study_total += record.total
        }
        console.log(work_total)
        console.log(rest_total)
        console.log(study_total)


    } catch (err) {
        if(err.respons && err.respons.status === 401){
            console.log('JWTトークンが切れています。再発行中です。。。')
            const newToken = await refreshAccessToken();

            if(!newToken){
                console.log('トークンの更新失敗。再ログインしてください')
                return
            }
            try {
                const retryRes = await axios.get('/api/list/record/',{
                    headers: {
                        'Authorization': `JWT ${token}`
                    }
                })
                console.log('送信完了しました',retryRes.data)
            } catch (retryErr) {
                console.log('記録の保存失敗',retryErr)
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', async function(){
    await listDayRecord('day')
    await listDayRecord('week')
    await listDayRecord('month')

})