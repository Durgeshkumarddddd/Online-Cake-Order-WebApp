//FOR LOGIN AND SIGNUP OPTION

let login = document.querySelector('.sr1')
let signup = document.querySelector('.sr2')

signup.addEventListener('click', () => {
    signup.style.backgroundColor = 'rgb(38, 164, 38)'
    login.style.backgroundColor = 'white'
    location.href = '/user/register'
})

login.addEventListener('click', () => {
    login.style.backgroundColor = 'rgb(38, 164, 38)'
    signup.style.backgroundColor = 'white'
    location.href = '/user/login'
})
