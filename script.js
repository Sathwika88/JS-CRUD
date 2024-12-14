const data = JSON.parse(localStorage.getItem('data')) || [];

const registerForm = document.getElementById('registerForm');

const allInputs = document.querySelectorAll('input');


function saveToLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}

if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        save();
    })
}

function displayErrorMessage(inputId, message) {
    const error = document.getElementById(`${inputId}-error`);
    const input = document.getElementById(inputId);

    if (error) {
        error.innerText = message;
        error.style.display = "block";
    }

    if (input) {
        input.style.border = "1px solid rgb(136, 8, 8)";
    }
}

function clearErrorMessages() {

    const allError = document.querySelectorAll('.error-message');
    const allInputs = document.querySelectorAll('input');

    allError.forEach((error) => {
        error.innerText = "";
        error.style.display = "none";
    })

    allInputs.forEach((input) => {
        input.style.border = "1px solid black";
    })
}

function message(id) {
    const err = document.getElementById(`${id}-error`);
    const input = document.getElementById(id);
    if (err) {
        err.innerText = '';
        input.style.border = "1px solid black";
    }
}

export function validateForm(username, password, confirmPassword, email, mobile) {

    let isValid = true;


    if (!username) {
        displayErrorMessage('username', "Please fill this field");
        isValid = false;
    }
    else{
    const existingUsername = data.find((user) => user.username.toLowerCase() === username);
    if (existingUsername) {
        displayErrorMessage('username', "Username is already taken. Please choose another.");
        isValid = false;
    }
    else{
        message('username');
    }
    }

    if (!password) {
        displayErrorMessage('password', "Please fill this field");
        isValid = false;
    }
    else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*.?&])[A-Za-z\d@$!%#*.?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            displayErrorMessage("password", "8+ characters, including upper, lower, number & symbol.");
            isValid = false;
        }
        else {
            message("password");
        }
    }

    if (!confirmPassword) {
        displayErrorMessage('confirmpassword', "Please fill this field");
        isValid = false;
    }
    else {
        if (password !== confirmPassword) {
            displayErrorMessage("confirmpassword", "Passwords dont match");
            isValid = false;
        }
        else {
            message("confirmpassword");
        }
    }

    if (!email) {
        displayErrorMessage('email', "Please fill this field");
        isValid = false;
    } else {
        const existingUser = data.find((user) => user.email === email);
    
        if (existingUser) {
            displayErrorMessage("email","User already exists, Please log in!");
            return;
        }
    
        const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
    
        if (!emailRegex.test(email)) {
            displayErrorMessage("email", "Please enter a valid email address.");
            isValid = false;
        } else {
            message("email");
        }
    }
    

    if (!mobile) {
        displayErrorMessage('mobile', "Please fill this field");
        isValid = false;
    }
    else {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            displayErrorMessage("mobile", "Please enter a valid mobile number.");

            isValid = false;
        }
        else {
            message("mobile");
        }
    }

    const existingMobile = data.find((user) => user.mobile === mobile);
    if (existingMobile) {
        displayErrorMessage('mobile', "Mobile number is already registered.");
        isValid = false;
    }

    return isValid;
}

function save() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmpassword').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    const form = document.querySelector('form');

    if (!validateForm(username, password, confirmPassword, email, mobile)) {
        return;
    }

    data.push({
        username: username,
        password: password,
        cpassword: confirmPassword,
        email: email,
        mobile: mobile,
    });

    saveToLocalStorage();

    displaySuccessMessage("Registration successful.Redirecting to login page");

    form.reset();

    clearErrorMessages();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
const successMessage = document.getElementById('success-message');
function displaySuccessMessage(message) {
    successMessage.innerText = message;
}

const loginForm = document.getElementById('loginForm');
function validateLogin(email, password) {
    const loginEmail = email.trim();
    const loginPassword = password.trim();

    let isValid = true;

    if (!loginEmail) {
        displayErrorMessage("email", "Please fill this field");
        isValid = false;
    }
    else{
        const isExist = data.some((user) => user.email === loginEmail);
        if (!isExist) {
            displayErrorMessage("email", "User doesn't exist");
        }
        else{
            message("email");
        }
    }

    if (!loginPassword) {
        displayErrorMessage("password", "Please fill this field");
        isValid = false;
    }
    else{
        const userData = data.find((user) => user.email === loginEmail);
        if (userData && userData.password !== loginPassword) {
            displayErrorMessage("password", "Incorrect password");
            isValid = false;
        } else {
            message("password");
        }
    }

    return isValid;

}
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const loginEmail = document.getElementById('email').value.trim();
        const loginPassword = document.getElementById('password').value.trim();

        const data = JSON.parse(localStorage.getItem('data')) || [];


        if (!validateLogin(loginEmail, loginPassword)) {
            return;
        }
        const userData = data.find((user) => user.email === loginEmail && user.password === loginPassword);

        if (userData) {
            let email = loginEmail.split('@')[1];
            
            if (email === 'cvcorp.in') {
                localStorage.setItem("role", "admin");
                localStorage.setItem("adminInfo", JSON.stringify(userData));
                window.location.href = 'admin.html';
            }
            else {
                localStorage.setItem("role", "user");
                localStorage.setItem("userInfo", JSON.stringify(userData));
                window.location.href = 'user.html';
            }
        }
        
    });
}

/*password toggle*/

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const toggleIcon = togglePassword.querySelector('i');

togglePassword.addEventListener('click', ()=>{
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
});