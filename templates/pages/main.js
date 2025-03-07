let timerStringDOM;
let totalStudyTimeDOM;

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

//作業を何ループしたか、i(分)を何回、m(秒)を何回
let i = 0;
let m = 0;

let gSec = 0;
let gMin = 0;

let addTime = 0;
let total = 0;

const minFinishTime = document.querySelector('#minFinishTime')
const secFinishTime = document.querySelector('#secFinishTime')

const minFinishRestTime = document.querySelector('#minFinishRestTime')
const secFinishRestTime = document.querySelector('#secFinishRestTime')



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
    addTime = gMin *60 + gSec
    total = minTotalTime * i + secTotalTime * m + addTime
    console.log(total)
    totalStudyTimeDOM = document.getElementById('totalStudyTime')
    totalStudyTimeDOM.textContent = total

}



//ミリ秒を経過時間の文字列に直す関数
function msecToSecString(time){
    time = Math.floor(time/1000);
    const seconds = time % 60;
    const minutes = Math.floor(time/60)
    const secondStr = (seconds < 10 ? '0' : '') + String(seconds)
    const minuteStr = (minutes < 10 ? '0' : '') + String(minutes)
    
    //グローバルに現在の分と秒を記録（）
    gSec = seconds;
    gMin = minutes;

    return minuteStr + ':' +secondStr
}

//タイマーの時刻を更新
function UpdateTimer(){
    if(restTime){
        const nowTime = new Date().getTime();
        const elapsedSeconds = Math.floor((nowTime - startTime)/1000)
        timerStringDOM.innerHTML = msecToSecString(nowTime - startTime)
         if (finishRestTime < elapsedSeconds ){
            clearInterval(timerId)
            timerId = null
            alert('休憩終了です')
            OnResetButtonClick()
            restTime = false
            OnStartButtonClick()
        }
    }else{
        const nowTime = new Date().getTime();
        const elapsedSeconds = Math.floor((nowTime - startTime)/1000)
        timerStringDOM.innerHTML = msecToSecString(nowTime - startTime)
        if (finishTime < elapsedSeconds ){
            i += 1
            m += 1
            clearInterval(timerId)
            timerId = null
            alert('作業終了です')
            OnResetButtonClick()
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
function OnResetButtonClick(){
    OnStopButtonClick()
    timerStringDOM.innerHTML = '00:00'
    currentTimerTime = 0
    i = 0;
    m = 0;
}