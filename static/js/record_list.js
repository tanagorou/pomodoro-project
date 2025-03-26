let charVar = []
checkLogin()
async function listDayRecord(period, offset = 0){
    let dailyRecord = {}
    const token = localStorage.getItem('jwt_token')
    let work_total = 0
    let rest_total = 0
    let study_total = 0
    try {
        const res = await axios.get(`/api/list/record/?period=${period}&offset=${offset}`,{
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
        console.log('送信完了しました',res.data)

        for(let record of res.data){
            //その週の月曜日から日曜日までの曜日ごとの作業時間を考える
            if(period === 'week'){
                let day = record.created.split('T')[0]
                // dailRecordにdayが存在しなかったら作業、休憩時間を0に設定
                if(!dailyRecord[day]){
                    dailyRecord[day] = {
                        work_total: 0,
                        rest_total: 0,
                    }
                }
                // その日ごとの作業時間と休憩時間を計算
                dailyRecord[day].work_total += record.work_time
                dailyRecord[day].rest_total += record.rest_time

            }
            //その日、週、月ごとの作業時間のトータル
            work_total += record.work_time
            rest_total += record.rest_time
            study_total += record.total
        }
        console.log(work_total)
        console.log(rest_total)
        console.log(study_total)
        console.log(dailyRecord)
        return dailyRecord



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

let currentOffset = 0;

async function changeWeek(direction){
    currentOffset += direction
    let weeklyRecord = await listDayRecord('week',currentOffset);
    updateChartDate(weeklyRecord, currentOffset)
}

document.addEventListener('DOMContentLoaded', async function(){
    await listDayRecord('day')
    let weekRecord = await listDayRecord('week', currentOffset)
    await listDayRecord('month')
    updateChartDate(weekRecord, currentOffset)
})



//今日を基準にラベルを作り、データのcreatedの日付と併せる関数
function getDateLabels(offset = 0){
    //今週の保存した記録を表示するようにする
    const today = new Date()
    const statDayOfWeek = new Date(today)
    statDayOfWeek.setDate(today.getDate() - today.getDay() + 1 + (offset * 7))
    const labels = []

    for(let i = 0 ; i < 7 ; i++){
        let currentDate = new Date(statDayOfWeek)
        currentDate.setDate(statDayOfWeek.getDate() + i)

        let year = currentDate.getFullYear()
        let month = String(currentDate.getMonth()+1).padStart(2,'0')
        let day = String(currentDate.getDate()).padStart(2,'0')
        labels.push(`${year}-${month}-${day}`)
    }
    return labels
}

function displayDateLabels(offset = 0){
    let labels = getDateLabels(offset)
    return labels.map(label => {
        let parts = label.split('-')
        return `${parseInt(parts[1])}/${parseInt(parts[2])}`
    })
}

function updateChartDate(dailyRecord, offset = 0){
    let labels = getDateLabels(offset)
    charVar = labels.map(datekey => {
        return dailyRecord[datekey] ? dailyRecord[datekey].work_total : 0
    })
    console.log('更新後のcharvar:',charVar)
    drawChart(offset)
}

function drawChart(offset = 0) {
    let ctx = document.getElementById('canvas').getContext('2d')
    if(window.myChart){
        window.myChart.destroy()
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayDateLabels(offset),
            datasets: [{
                label: '学習時間（分）',
                data: charVar,
                backgroundColor: 'rgb(0, 134, 197, 0.7)',
                borderColor: 'rgba(0, 134, 197, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    suggestedMin: 0
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    })
}

