let timerStringDOM;
let totalStudyTimeDOM;
let totalRestTimeDOM;
let completeDOM;

let startTime;
let timerId = null;
let restTime = false;
let currentTimerTime = 0;

//作業時間
let minTotalTime = 0;
let secTotalTime = 0;
let finishTime = 0;

//休憩時間
let minTotalRestTime = 0;
let secTotalRestTime = 0;
let finishRestTime = 0;

//作業、休憩のターンを何回ループしたのか
let studyLoop = 0;
let restLoop = 0;

//途中で終了を押したときの時間を保存
let grobalStudySec = 0;
let grobalStudyMin = 0;
let grobalRestMin = 0;
let grobalRestSec = 0;


const minFinishTime = document.querySelector('#minFinishTime')
const secFinishTime = document.querySelector('#secFinishTime')
const minFinishRestTime = document.querySelector('#minFinishRestTime')
const secFinishRestTime = document.querySelector('#secFinishRestTime')

async function checkLogin(){
    const token = localStorage.getItem('jwt_token')
    try{
        const res = await axios.get('/api/user/', {
            headers: { Authorization: `JWT ${token}`}
        })
        console.log('認証成功',res.data)
        document.getElementById('title').textContent = 'ようこそ！！颯汰のポメラードタイマーへ！！'
    } catch (err) {
        console.log('認証失敗',err)
        window.location.href = '/login/'
    }
}


document.addEventListener('DOMContentLoaded', function(){
    checkLogin()
})



async function sendStudyRecord(workTime, restTime, total){

    const token = localStorage.getItem('jwt_token')

    const payload = {
        work_time: workTime,
        rest_time: restTime,
        total:total,
        completed: true,
    };

    console.log('送信データ',payload);
    try {
        const res = await axios.post('/save_record/', payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`
        }

    })
        console.log('データ送信成功',res.data);
        completeDOM = document.getElementById('complete')
        completeDOM.textContent = '記録を保存しました'
    } catch(err) {
        if(err.response && err.response.status === 401){
                console.log('JWTトークンが切れています。再発行中です。。。')
                const newToken = await refreshAccessToken();

                if(!newToken){
                    console.log('トークンの更新失敗。再ログインしてください')
                    window.location.href = '/login/'
                    return
                }
                try {
                    const retryRes = await axios.post('/save_record/', payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `JWT ${newToken}`
                        }
                    })
                    console.log('記録の保存成功（リトライ):',retryRes.data)
                    completeDOM = document.getElementById('complete')
                    completeDOM.innerHTML = '記録が保存できました'
                } catch (retryErr) {
                    console.log('記録の保存の失敗:', retryErr)
                    console.log('データ送信失敗', err)
                    completeDOM = document.getElementById('complete')
                    completeDOM.innerHTML = '記録が保存できませんでした'
                }
        }
    }
}

// タイマー終了時にユーザーに報告
function showNotification(title, body){
    if(Notification.permission === 'granted'){
        new Notification(title,{body:body})
    } else if (Notification.permission !== 'denied'){
        Notification.requestPermission().then(permission =>{
            if(permission === 'granted'){
                new Notification(title, {body:body})
            }
        })
    }
}

function playSound(){
    let audio = document.getElementById('notificationSound')
    if(audio){
        audio.play().catch(err =>
            {console.log('音声の再生に失敗',err)
        })
    }
    return audio
}

function soundBreakEnd(){
    //const audio = playSound()
    showNotification('休憩終了','そろそろ作業を再開しましょう')
    //setTimeout(() => {
    //    if(audio) {
    //        audio.pause()
    //        audio.curretTime = 0;
    //    }
    //}, 5000)
}

function soundStudyEnd(){
    //const audio = playSound()
    showNotification('作業終了','休憩も時には大事です！！！')
    //setTimeout(() => {
    //    if(audio) {
    //        audio.pause()
    //        audio.curretTime = 0;
    //    }
    //}, 5000)
}


window.onload = function(){

    timerStringDOM = document.getElementById('timerString')
    timerStringDOM.innerHTML = '00:00'

    minFinishTime.addEventListener('change',function(){
        minTotalTime = parseInt(minFinishTime.value) * 60;
    })
    secFinishTime.addEventListener('change', function(){
        secTotalTime = parseInt(secFinishTime.value)
    })
    minFinishRestTime.addEventListener('change',function(){
        minTotalRestTime = parseInt(minFinishRestTime.value) * 60;
    })
    secFinishRestTime.addEventListener('change', function(){
        secTotalRestTime = parseInt(secFinishRestTime.value)
    })
}

//終了を押したとき、どれだけ作業したかを表示(秒で表示)
function OnFinishButtonClick(){
    OnStopButtonClick()

    //作業開始から終了を押したときの時間
    const study_time = totalStudyTime()
    const rest_time = totalRestTime()
    const totalTime = study_time + rest_time

    totalStudyTimeDOM = document.getElementById('totalStudyTime')
    totalRestTimeDOM = document.getElementById('totalRestTime')

    totalStudyTimeDOM.textContent = study_time
    totalRestTimeDOM.textContent = rest_time

    sendStudyRecord(study_time, rest_time, totalTime);

    OnResetButtonClick()
}

function totalStudyTime(){
    const studyMainTime = (minTotalTime + secTotalTime) * studyLoop
    const studyAddTime = grobalStudyMin*60 +grobalStudySec
    const study_time = studyMainTime + studyAddTime
    return study_time
}

function totalRestTime(){
    const restMainTime = (minTotalRestTime + secTotalRestTime) * restLoop
    const restAddTime = grobalRestMin*60 +grobalRestSec
    const rest_time = restMainTime + restAddTime
    return rest_time
}

//ミリ秒を経過時間の文字列に直す関数
function msecToSecString(time){
    time = Math.floor(time/1000);
    const seconds = time % 60;
    const minutes = Math.floor(time/60)
    const secondStr = (seconds < 10 ? '0' : '') + String(seconds)
    const minuteStr = (minutes < 10 ? '0' : '') + String(minutes)

    //グローバルに現在の分と秒を記録（）
    if(restTime){
        grobalStudyMin = 0
        grobalStudySec = 0

        grobalRestSec = seconds;
        grobalRestMin = minutes;
    }else{
        grobalRestMin = 0
        grobalRestSec = 0

        grobalStudySec = seconds;
        grobalStudyMin = minutes;
    }
    return minuteStr + ':' +secondStr
}

//タイマーの時刻を更新
function UpdateTimer(){
    if(restTime){
        const nowTime = new Date().getTime();
        const elapsedSeconds = Math.floor((nowTime - startTime)/1000)
        timerStringDOM.innerHTML = msecToSecString(nowTime - startTime)
         if (finishRestTime < elapsedSeconds ){
            restLoop += 1
            clearInterval(timerId)
            soundBreakEnd()
            timerStringDOM.innerHTML = '00:00'

            timerId = null
            restTime = false

            OnStartButtonClick()
        }
    }else{
        const nowTime = new Date().getTime();
        const elapsedSeconds = Math.floor((nowTime - startTime)/1000)
        timerStringDOM.innerHTML = msecToSecString(nowTime - startTime)
        if (finishTime < elapsedSeconds ){
            studyLoop += 1
            clearInterval(timerId)
            soundStudyEnd()
            timerStringDOM.innerHTML = '00:00'
            timerId = null
            restTime = true
            OnStartButtonClick()
        }
    }
}

//スタートボタンが押された時の処理
function OnStartButtonClick(){
    //休憩時間
    if(restTime){
        finishRestTime = minTotalRestTime + secTotalRestTime
        startTime = new Date().getTime() - currentTimerTime;
        timerId = setInterval(UpdateTimer, 1000);
    }

    //作業時間
    if(timerId == null){
        finishTime = minTotalTime + secTotalTime
        startTime = new Date().getTime() - currentTimerTime;
        timerId = setInterval(UpdateTimer, 1000);
    }
}

//ストップボタンが押されら
function OnStopButtonClick(){
    if(timerId != null){
        clearInterval(timerId)
        timerId = null
        const nowTime = new Date().getTime();
        currentTimerTime = nowTime - startTime;
        timerStringDOM.innerHTML = msecToSecString(currentTimerTime)
    }
}

//リセットボタンが押されたら
function OnResetButtonClick() {
    OnStopButtonClick()
    timerStringDOM.innerHTML = '00:00'
    currentTimerTime = 0
    minTotalTime = 0
    secTotalTime = 0
    grobalStudyMin = 0
    grobalStudySec = 0

    minTotalRestTime = 0
    secTotalRestTime = 0
    grobalRestMin = 0
    grobalRestSec = 0

    studyLoop = 0;
    restLoop = 0;
}

