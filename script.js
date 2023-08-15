const contactTable = document.getElementById("contactTable");
const contactList = document.getElementById("contactList");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const phoneNumberInput = document.getElementById("phoneNumber");
const addContactButton = document.getElementById("addContact");

const API_URL = "https://62054479161670001741b708.mockapi.io/api/contacts";

// Загрузка списка контактов при загрузке страницы
window.addEventListener("load", () => {
    fetchContacts();
});

// Функция для загрузки списка контактов
function fetchContacts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            contactList.innerHTML = "";
            data.forEach(contact => {
                const row = createContactRow(contact);
                contactList.appendChild(row);
            });
        });
}

// Создание строки контакта в таблице
function createContactRow(contact) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phoneNumber}</td>
        <td>
            <button class="edit" data-id="${contact.id}">Редактировать</button>
            <button class="delete" data-id="${contact.id}">Удалить</button>
        </td>
    `;

    const editButton = row.querySelector(".edit");
    const deleteButton = row.querySelector(".delete");

    editButton.addEventListener("click", () => editContact(contact));
    deleteButton.addEventListener("click", () => deleteContact(contact.id));

    return row;
}

// Функция для добавления контакта
addContactButton.addEventListener("click", () => {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const phoneNumber = phoneNumberInput.value;

    if (firstName && lastName && phoneNumber) {
        const newContact = {
            firstName,
            lastName,
            phoneNumber
        };

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newContact)
        })
        .then(response => response.json())
        .then(() => {
            firstNameInput.value = "";
            lastNameInput.value = "";
            phoneNumberInput.value = "";
            fetchContacts();
        });
    }
});

// Функция для удаления контакта
function deleteContact(contactId) {
    fetch(`${API_URL}/${contactId}`, {
        method: "DELETE"
    })
    .then(() => fetchContacts());
}

// Функция для редактирования контакта
function editContact(contact) {
    firstNameInput.value = contact.firstName;
    lastNameInput.value = contact.lastName;
    phoneNumberInput.value = contact.phoneNumber;

    addContactButton.textContent = "Сохранить";

    addContactButton.removeEventListener("click", addContact);
    addContactButton.addEventListener("click", () => saveContact(contact.id));
}

// Функция для сохранения отредактированного контакта
function saveContact(contactId) {
    const editedContact = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        phoneNumber: phoneNumberInput.value
    };

    fetch(`${API_URL}/${contactId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editedContact)
    })
    .then(response => response.json())
    .then(() => {
        firstNameInput.value = "";
        lastNameInput.value = "";
        phoneNumberInput.value = "";
        addContactButton.textContent = "Добавить";
        fetchContacts();
    });
}