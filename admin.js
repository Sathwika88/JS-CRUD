import { validateForm } from './script.js';

const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

const data = JSON.parse(localStorage.getItem('data')) ||[];

const UserData = data.filter((admin)=>admin.email !== adminInfo.email && !admin.email.endsWith('@cvcorp.in'));

function deleteUser(index)
    {
        const userToDelete = UserData[index];

    const originalIndex = data.findIndex(user => user.email === userToDelete.email);

    if (originalIndex !== -1) {

        UserData.splice(index, 1);
        data.splice(originalIndex, 1);

        saveToLocalStorage();

        displayData();
    }
    }

    function editUser(index) {
        const userEdit = UserData[index];

        document.getElementById('editUsername').value = userEdit.username;
        document.getElementById('editEmail').value = userEdit.email;
        document.getElementById('editMobile').value = userEdit.mobile;

        const editUserForm = document.getElementById('editUser');
        editUserForm.style.display = "block";
        editUserForm.scrollIntoView({ behavior: 'smooth' });
    
        const userEditForm = document.getElementById('userEditForm');

        userEditForm.onsubmit =(e)=> {
            e.preventDefault();

            
    
            const updatedEmail = document.getElementById('editEmail').value.trim();
            const updatedMobile = document.getElementById('editMobile').value.trim();
    
            if(!validateEditForm())
                {
                    return;
                }
            const originalIndex = data.findIndex(user => user.username === userEdit.username);
    
            if (originalIndex !== -1) {
                UserData[index] = {
                    ...userEdit,
                    email: updatedEmail,
                    mobile: updatedMobile,
                };

                data[originalIndex] = UserData[index];

                saveToLocalStorage();
    
                displayData();
    
                userEditForm.reset();

                clearErrorMessages();

                editUserForm.style.display = "none";
            }
        };
    }
    
    function validateEditForm() {
        const updatedEmail = document.getElementById('editEmail').value.trim();
        const updatedMobile = document.getElementById('editMobile').value.trim();
        const editUsername = document.getElementById('editUsername').value.trim();
        let isValid = true;
    
        if (!updatedEmail) {
            displayErrorMessage('editEmail', "Please fill this field");
            isValid = false;
        } else {
            const existingUser = data.find((user) => user.email === updatedEmail && user.username !== editUsername);
            if (existingUser) {
                displayErrorMessage("editEmail", "User already exists, Please log in!");
                isValid = false;
            } else {
                const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
                if (!emailRegex.test(updatedEmail)) {
                    displayErrorMessage("editEmail", "Please enter a valid email address.");
                    isValid = false;
                } else {
                    message("editEmail");
                }
            }
        }
    
        if (!updatedMobile) {
            displayErrorMessage('editMobile', "Please fill this field");
            isValid = false;
        } else {
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileRegex.test(updatedMobile)) {
                displayErrorMessage("editMobile", "Please enter a valid mobile number.");
                isValid = false;
            } else {
                const existingMobile = data.find((user) => user.mobile === updatedMobile && user.username !== editUsername);
                if (existingMobile) {
                    displayErrorMessage('editMobile', "Mobile number is already registered.");
                    isValid = false;
                } else {
                    message("editMobile");
                }
            }
        }
    
        return isValid;
    }
    
function filterData(searchTerm) {
    return UserData.filter((user) => {
        const usernameMatch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return usernameMatch || emailMatch;
    });
}

function displayData(searchingterm = '') {
    const filteredData = filterData(searchingterm);
    const tableBodyData = document.getElementById('tableBodyData');
    tableBodyData.innerHTML = "";

    if (filteredData.length === 0) {
        tableBodyData.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center;">No data found</td>
            </tr>
        `;
        return; 
    }
    filteredData.forEach((data, index) => {
        tableBodyData.innerHTML += `
                        <tr>
                            <td>${data.username}</td>
                            <td>${data.email}</td>
                            <td>${data.mobile}</td>
                            <td>
                                <button class="edit-btn" data-index = "${index}"> 
                                        <i class="fa-solid fa-user-pen"></i>
                                </button>
                                <button class="delete-btn" data-index  = "${index}"> 
                                        <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        `;
    });

    tableBodyData.addEventListener('click', (e) => {
        const target = e.target;
        const button = target.closest('button'); 

    if (button) {
        const index = button.getAttribute('data-index');

        if (button.classList.contains('edit-btn')) {
            editUser(index);
        } else if (button.classList.contains('delete-btn')) {
            deleteUser(index);
        }
    }
    });
}

const searchInput = document.getElementById('searchInput');
if(searchInput)
{
    searchInput.addEventListener('input', (e)=>{
        const searchingterm = e.target.value.trim();
        displayData(searchingterm);
    })
}
displayData();

/*logout*/

const logoutButton = document.getElementById('logout-button');

if(logoutButton)
{
    logoutButton.addEventListener('click', ()=>{
        localStorage.removeItem('role');
        localStorage.removeItem('adminInfo');

        window.location.href = "index.html";
    })
}

/*new user*/

function saveToLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}

const addUserButton = document.getElementById('addNewUser');
const addUserForm = document.getElementById('addUserForm');
const userForm = document.getElementById('userForm');


addUserButton.addEventListener('click', ()=>{
    addUserForm.style.display ="block";
    addUserForm.scrollIntoView({ behavior: 'smooth' });
});

if(userForm){
userForm.addEventListener('submit', (e)=>{

    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmpassword').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    const newUser ={username, password, confirmPassword, email, mobile};

    if(!validateForm(username, password, confirmPassword, email, mobile))
    {
        return;
    }

    data.push(newUser);

    saveToLocalStorage();

    UserData.push(newUser); 
    
    displayData();

    userForm.reset();

    addUserForm.style.display ="none";
});
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