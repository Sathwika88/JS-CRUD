const userData = JSON.parse(localStorage.getItem('userInfo'))||[];

function displayData()
{
    const tableBodyData = document.getElementById('tableBodyData');
    tableBodyData.innerHTML="";

        tableBodyData.innerHTML += `
            <tr>
                <td>${userData.username}</td>
                <td>${userData.password}</td>
                <td>${userData.email}</td>
                <td>${userData.mobile}</td>
            </tr>
        `;

}

displayData();

const logoutButton = document.getElementById('logout-button');

if(logoutButton)
{
    logoutButton.addEventListener('click', ()=>{
        localStorage.removeItem('role');
        localStorage.removeItem('userInfo');

        window.location.href = "index.html";
    })
}