let Name = document.querySelector('#name');
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let submit_btn = document.querySelector('#submit');
let form = document.querySelector('form');

if (localStorage.getItem('data') == null) {
    localStorage.setItem('data', '[]');
}

//Regular Expression for password and email validation 

const specialChar = new RegExp('(?=.*[@.#$!%*?&])');
const lowerCase = new RegExp('(?=.*[a-z])');
const upperCase = new RegExp('(?=.*[A-Z])');
const eightChar = new RegExp('(?=.{8,})');
const number = new RegExp('(?=.*[0-9])');
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

let check = document.querySelectorAll('.check');

let EVerify = false;
let NVerify = false;

// for email validation
email.addEventListener('keyup', () => {
    if (emailRegex.test(email.value)) {
        EVerify = true;
        document.querySelector('.inEmail').style.display = 'none'
    }
    else {
        EVerify = false;
        document.querySelector('.inEmail').style.display = 'block'
    }
})

//for name validation
Name.addEventListener('keyup', () => {
    document.querySelector('.inName').style.display = 'none'
})

//for password validation
password.addEventListener('keyup', () => {

    document.querySelector('.inPassword').style.display = 'none';

    if (specialChar.test(password.value)) {
        check[0].style.color = 'green'
    }
    else {
        check[0].style.color = 'grey'
    }

    if (lowerCase.test(password.value)) {
        check[1].style.color = 'green'
    }
    else {
        check[1].style.color = 'grey'
    }

    if (upperCase.test(password.value)) {
        check[2].style.color = 'green'
    }
    else {
        check[2].style.color = 'grey'
    }

    if (eightChar.test(password.value)) {
        check[3].style.color = 'green'
    }
    else {
        check[3].style.color = 'grey'
    }

    if (number.test(password.value)) {
        check[4].style.color = 'green'
    }
    else {
        check[4].style.color = 'grey'
    }

})

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