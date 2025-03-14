const logoutButton = document.getElementById('logoutButton')
console.log('logout.jsが呼ばれました')
logoutButton.addEventListener('click', function (){
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('refresh_token')
})