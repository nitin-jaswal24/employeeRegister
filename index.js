const nameInput = document.getElementById("name-input");
const mailInput = document.getElementById("mail-input");
const addBtn = document.getElementById("add-btn");
const tableBody = document.getElementById("table-body");
const updateName = document.getElementById("name-update");
const updateMail = document.getElementById('mail-update');
const cancelBtn = document.getElementById("cancel-btn");
const updateBtn = document.getElementById('update-btn');
//pehle sab kuch grap kar lia hai

//users name ka array bana leta hu
let users = JSON.parse(localStorage.getItem("users")) || [];
let curruserId = null;

const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function renderTable() {
    tableBody.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        const user = users[i];



        const tr = document.createElement('tr');
        const tdid = document.createElement('td');
        const nametd = document.createElement('td');
        const mailtd = document.createElement('td');
        const actionstd = document.createElement('td');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        //edit and delete ko classname de denge

        editBtn.className = "edit-btn";
        deleteBtn.className = "delete-btn";

        //sabke andar dal dia
        tdid.innerText = user.id;
        nametd.innerText = user.name;
        mailtd.innerText = user.email;
        editBtn.innerText = "Edit";
        deleteBtn.innerText = "Delete";
//click handler laga dia ab

        editBtn.addEventListener("click", () => {
            showUpdateForm(user.id);
        });
        deleteBtn.addEventListener("click", () => {
            deleteUser(user.id);
        });

        actionstd.appendChild(editBtn);
        actionstd.appendChild(deleteBtn);
//appending the data in the tr inke andar ham likh chuke hai pehle se
        tr.appendChild(tdid);
        tr.appendChild(nametd);
        tr.appendChild(mailtd);
        tr.appendChild(actionstd);
//appending that tr in the tablebody
        tableBody.appendChild(tr);
    }
}

function addUser() {
    //is nameinput and email me search wala trim hoke aa gaya

    const name = nameInput.value.trim();
    const email = mailInput.value.trim();
    if(!name&&!email){
        window.alert("Name and email is required")
        return;
    }
//now check karo ki regex follow hora hai?
//agar nahi to invalid alert
//agar hora hai to name and email khali to nahi hai?
//agar ham to alert show hoga

    if (email.match(validRegex)) {
        if (name && email) {
            let id = 1;
//map ek user id ka array bana dega fir usme id ko check karege ki hai ya nahi?
            //it will return -1 if id is not present

            //fir id 1 se shuru karege ki kaha kaha -1 nahi aya 
            //jaha -1 aya waha user naam ka object bana  dege 
            //aur id bana denge

            //ab ye niche wala val -1 return nahi karega
            let val = users.map(x => x.id).indexOf(id);
            while (val !== -1) {
                id++;
                val = users.map(x => x.id).indexOf(id);
            }
            //creating new object 

            const user = {
                id: id,
                name: name,
                email: email,
            };
            //ab push karo ise users ke array me

            users.push(user);

            localStorage.setItem("users", JSON.stringify(users));
    //after setting in local storage 
    //empty the name and mail input
            nameInput.value = "";
            mailInput.value = "";
//now update the table using render call again
            renderTable();
        } else {
            alert("Name and email are required");
        }
    } else {
        alert("Invalid email address");
    }
}

function updateUser() {
    //from the update-container value khincho
    const name = updateName.value;
    const email = updateMail.value;
    if (email.match(validRegex)) {
        const index = users.findIndex(user => user.id === curruserId);
        if (index !== -1) {
            users[index].name = name;
            users[index].email = email;
            localStorage.setItem("users", JSON.stringify(users));
            hideUpdateForm();
            renderTable();
        }
    } else {
        alert("Invalid email address");
    }
}

function showUpdateForm(userId) {
    const user = users.find(user => user.id === userId);

    if (user) {
        updateName.value = user.name;
        updateMail.value = user.email;
        curruserId = user.id;

        updateBtn.addEventListener('click', updateUser);
        cancelBtn.addEventListener('click', hideUpdateForm);

        updateName.style.display = 'inline';
        updateMail.style.display = 'inline';
        document.querySelector('.update-container').style.display = 'block';
    }
}

function hideUpdateForm() {
    //sabse pehle jo update-container ke andar input tag hai usko '' kardo

    updateName.value = '';
    updateMail.value = '';
    //user id ko bhi null krdo

    curruserId = null;
//event listener ko remove krdo button se

    updateBtn.removeEventListener('click', updateUser);
    cancelBtn.removeEventListener('click', hideUpdateForm);
//display b none krdo
    updateName.style.display = 'none';
    updateMail.style.display = 'none';
    document.querySelector('.update-container').style.display = 'none';
}

function deleteUser(userId) {
    //is user id ko chhod ke sare dikha do
    users = users.filter(user => user.id !== userId);
    localStorage.setItem("users", JSON.stringify(users));
    hideUpdateForm();
    renderTable();
}

addBtn.addEventListener("click", addUser);
renderTable();
