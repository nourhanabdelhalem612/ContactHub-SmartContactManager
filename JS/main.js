// ****************** Variables ***********************
const fullNameInput= document.getElementById("fullName");
const phoneNumberInput= document.getElementById("phoneNumber");
const emailAddressInput= document.getElementById("emailAddress");
const addressInput= document.getElementById("address");
const groupInput= document.getElementById("group");
const notesInput= document.getElementById("notes");
const isFavoriteInput= document.getElementById("isFavorite");
const isEmergencyInput= document.getElementById("isEmergency");
const saveContactBtn= document.getElementById("saveContactBtn");
const updateContactBtn= document.getElementById("updateContactBtn");
const searchInput= document.getElementById("searchInput");
let contactsData= JSON.parse(localStorage.getItem('contacts')) || [];  // || or ?? => the both is right
let currentIndex;

// ********************* Events ************************
saveContactBtn.addEventListener('click', () => {addNewContact()});
updateContactBtn.addEventListener('click', () => {updateContact()});
searchInput.addEventListener('input', () => {searchContacts()});

// ******************* Functions ***********************
// add contacts
function addNewContact(){

    if(validationInputs(fullNameInput) && validationInputs(phoneNumberInput) && validationInputs(emailAddressInput) && !(isDublicate(phoneNumberInput.value))){
        const newContact={
            fullName: fullNameInput.value,
            phone: phoneNumberInput.value,
            email: emailAddressInput.value,
            address: addressInput.value,
            group: groupInput.value,
            notes: notesInput.value,
            isFav: isFavoriteInput.checked,
            isEmergency: isEmergencyInput.checked,
        };
        contactsData.push(newContact);
        window.localStorage.setItem('contacts', JSON.stringify(contactsData));
        clearData();
        hideModal();
        // alert
        Swal.fire({
        title: "Contact Added Successfully!",
        text: `${newContact.fullName} added to the list!`,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        });
        searchInput.value = ""; 
        displayContacts();
    }
}

// clear data
function clearData(){  //  "" or null => the both is right
    fullNameInput.value= "";
    phoneNumberInput.value= "";
    emailAddressInput.value= "";
    addressInput.value= "";
    groupInput.value= "";
    notesInput.value= "";
    isFavoriteInput.checked= false;
    isEmergencyInput.checked= false;
    document.getElementById("contactModalLabel").innerHTML = "Add New Contact";
    saveContactBtn.classList.replace("d-none", "d-block");
    updateContactBtn.classList.replace("d-block", "d-none");
}

// hide modal
function hideModal(){
    const myModal= document.getElementById("contactModal");
    const instance= bootstrap.Modal.getInstance(myModal);
    instance.hide();
}

// show modal
function showModal(){
    clearData();
    const myModal= document.getElementById("contactModal");
    const instance= bootstrap.Modal.getOrCreateInstance(myModal);
    instance.show();
}

// display data contacts
function displayContacts(){
    let allContacts= ``;
    let emergencyContacts= ``;
    let favContacts= ``;
    let favCounter= 0;
    let emergencyCounter= 0;

    if(contactsData.length === 0){
      allContacts = `<p class="alert text-muted text-center">
      <span class="fs-5">No contacts found</span><br>
      Click "Add Contact" to get started
      </p>`
    }

    for(let i=0; i<contactsData.length; i++ ){
        const {name, color}= generateAvatar(contactsData[i].fullName);
        if(contactsData[i].isFav){
            favCounter++;
            favContacts+= `
            <div class="sidebar-contact-card sidebar-contact-card-fav">
                <div
                    class="sidebar-contact-avatar"
                    style="background: ${color}"
                >
                ${name}
                </div>
                <div class="sidebar-contact-info">
                    <h5>${contactsData[i].fullName}</h5>
                    <p>${contactsData[i].phone}</p>
                </div>
                <a href="tel:${contactsData[i].phone}" class="sidebar-call-btn text-decoration-none favorites-call">
                    <i class="fas fa-phone"></i>
                </a>
            </div>
            `;
        }
        if(contactsData[i].isEmergency){
            emergencyCounter++;
            emergencyContacts+= `
            <div class="sidebar-contact-card sidebar-contact-card-emergency">
                <div
                    class="sidebar-contact-avatar"
                    style="background: ${color}"
                >
                    ${name}
                </div>
                <div class="sidebar-contact-info">
                    <h5>${contactsData[i].fullName}</h5>
                    <p>${contactsData[i].phone}</p>
                </div>
                <a href="tel:${contactsData[i].phone}" class="sidebar-call-btn text-decoration-none emergency-call">
                    <i class="fas fa-phone"></i>
                </a>
            </div>
            `;
        }
        allContacts += `
                  <div class="col-md-6">
                    <div class="contact-card">
                      <div class="contact-header">
                        <div class="contact-avatar ${contactsData[i].isEmergency ? "emergency" : ""} ${contactsData[i].isFav ? "favorite" : ""}" 
                    style="background: ${color}"
                        >
                        ${name}
                        </div>
                        <div class="contact-info">
                          <h4>${contactsData[i].fullName}</h4>
                        </div>
                      </div>
                      <div class="contact-details">
                        <div class="contact-detail phone">
                          <i class="fas fa-phone"></i>
                          <span>${contactsData[i].phone}</span>
                        </div>
                        <div class="contact-detail email">
                          <i class="fas fa-envelope"></i>
                          <span>${contactsData[i].email}</span>
                        </div>
                        <div class="contact-detail address">
                          <i class="fas fa-map-marker-alt"></i>
                          <span>${contactsData[i].address}</span>
                        </div>
                      </div>
                      <div class="contact-tags">
                        <span class="tag other">${contactsData[i].group}</span>
                        <span class="tag emergency ${contactsData[i].isEmergency ? "d-block" : "d-none"}">
                          <i class="fas fa-heartbeat"></i> Emergency
                        </span>
                      </div>
                      <div class="contact-actions">
                        <a href="tel:${contactsData[i].phone}" class="contact-action text-decoration-none call" title="Call">
                          <i class="fas fa-phone"></i>
                        </a>
                        <a href="mailto:${contactsData[i].email}" class="contact-action text-decoration-none email" title="Email">
                          <i class="fas fa-envelope"></i>
                        </a>
                        <button
                          class="contact-action favorite ${contactsData[i].isFav ? "active" : ""}"
                          title="Favorite"
                          onclick="toggleContactFav(${i})"
                        >
                          <i class="far fa-star"></i>
                        </button>
                        <button
                          class="contact-action emergency ${contactsData[i].isEmergency ? "active" : ""}" 
                          title="Emergency"
                          onclick="toggleContactEmergency(${i})"
                        >
                          <i class="far fa-heart"></i>
                        </button>
                        <button class="contact-action edit" onclick="setEditContactData(${i})" data-bs-toggle="modal" data-bs-target="#contactModal" title="Edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="contact-action delete" onclick="deleteContact(${i})" title="Delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
        `;
    }
    document.getElementById("rowData").innerHTML= allContacts;
    document.getElementById("contactsCount").innerHTML = contactsData.length;
    document.getElementById("totalContacts").innerHTML = contactsData.length;
    document.getElementById("favoritesCount").innerHTML= favCounter;
    document.getElementById("emergencyCount").innerHTML= emergencyCounter;
    document.getElementById("favoritesList").innerHTML =
    favContacts ||
    `<p class="alert text-center text-muted">No favorite contacts found</p>`;
  document.getElementById("emergencyList").innerHTML =
    emergencyContacts ||
    `<p class="alert text-center text-muted">No emergency contacts found</p>`;
}

// toggle favorites and emergency buttons
function toggleContactFav(index){
  if(contactsData[index].isFav){
    contactsData[index].isFav= false;
  } 
  else{
    contactsData[index].isFav= true;
  }
  localStorage.setItem("contacts", JSON.stringify(contactsData));
  displayContacts();
}

function toggleContactEmergency(index){
  if(contactsData[index].isEmergency){
    contactsData[index].isEmergency= false;
  } 
  else{
    contactsData[index].isEmergency= true;
  }
  localStorage.setItem("contacts", JSON.stringify(contactsData));
  displayContacts();
}

// generate avatar
function generateAvatar(fullName){
    const avatar={
        color: generateColor(fullName),
        name: fullName.trim().split(" ").map((word) => word[0]).splice(0,2).join("").toUpperCase(),
    };
    return avatar;
}

// random color
function generateColor(contactName) {
  const colors = [
    "linear-gradient(135deg, #00AFE0, #0568F9)",
    "linear-gradient(135deg, #00B57F, #009A89)",
    "linear-gradient(135deg, #E22BE8, #E5028B)",
    "linear-gradient(135deg, #ED213A, #93291E)",
    "linear-gradient(135deg, #B78628, #6C4A13)",
    "linear-gradient(135deg, #FAD961, #F76B1C)",
    "linear-gradient(135deg, #BDC3C7, #2C3E50)",
  ];
  return colors[contactName.length % colors.length];
//   let randomIndex;
//   do{
//     randomIndex= Math.floor(Math.random % colors.length)
//   }
//   while(randomColor===currentIndex);
//   currentIndex=randomColor;
//   return colors[randomIndex];
}

// delete function
function deleteContact(index){
    Swal.fire({
    title: "Delete Contact?",
    text: "Are you sure you want to delete hanan elsayed? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EB0020",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed){
        Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
    });
    contactsData.splice(index, 1);
    if(searchInput.value !== ""){
        searchContacts();
    }
    else{
        displayContacts();
    }
    localStorage.setItem("contacts", JSON.stringify(contactsData));
    }
    });
    
}

//update contact     problem
function setEditContactData(index) {
  fullNameInput.value = contactsData[index].fullName;
  phoneNumberInput.value = contactsData[index].phone;
  emailAddressInput.value = contactsData[index].email;
  addressInput.value = contactsData[index].address;
  groupInput.value = contactsData[index].group;
  notesInput.value = contactsData[index].notes;
  isFavoriteInput.checked = contactsData[index].isFav;
  isEmergencyInput.checked = contactsData[index].isEmergency;
  
  document.getElementById("contactModalLabel").innerHTML = "Edit Contact";
  saveContactBtn.classList.remove("d-block");
  saveContactBtn.classList.add("d-none");
  updateContactBtn.classList.remove("d-none");
  updateContactBtn.classList.add("d-block");
  updatedIndex = index;
}

function updateContact(){
    const newContact={
        fullName: fullNameInput.value,
        phone: phoneNumberInput.value,
        email: emailAddressInput.value,
        address: addressInput.value,
        group: groupInput.value,
        notes: notesInput.value,
        isFav: isFavoriteInput.checked,
        isEmergency: isEmergencyInput.checked,
    }
    contactsData.splice(updatedIndex, 1, newContact)
    localStorage.setItem("contacts", JSON.stringify(contactsData));
    Swal.fire({
    title: "Updated!",
    text: `Contact has been updated Successfully.`,
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
    });
    if(searchInput.value !== ""){
        searchContacts();
    }
    else{
        displayContacts();
    }
    clearData(); 
    hideModal();
}

// search contacts
function searchContacts(){
    let searchTerm= searchInput.value.trim().toLowerCase();
    let searchedContactsHtml= ``;
  for(let i = 0; i<contactsData.length; i++){
    if(contactsData[i].fullName.toLowerCase().includes(searchTerm) ||
        contactsData[i].email.toLowerCase().includes(searchTerm) ||
        contactsData[i].phone.toLowerCase().includes(searchTerm)
    ){
    const {name, color}= generateAvatar(contactsData[i].fullName);
      searchedContactsHtml += `
                  <div class="col-md-6">
                    <div class="contact-card">
                      <div class="contact-header">
                        <div class="contact-avatar ${contactsData[i].isEmergency ? 'emergency' : ''} ${contactsData[i].isFav ? 'favorite' : ''}" style="background: ${color}">${name}</div>
                        <div class="contact-info">
                          <h4>${contactsData[i].fullName}</h4>
                        </div>
                      </div>
                      <div class="contact-details">
                        <div class="contact-detail phone">
                          <i class="fas fa-phone"></i>
                          <span>${contactsData[i].phone}</span>
                        </div>
                        <div class="contact-detail email">
                          <i class="fas fa-envelope"></i>
                          <span>${contactsData[i].email}</span>
                        </div>
                        <div class="contact-detail address">
                          <i class="fas fa-map-marker-alt"></i>
                          <span>${contactsData[i].address}</span>
                        </div>
                      </div>
                      <div class="contact-tags">
                        <span class="tag other">${contactsData[i].group}</span>
                        <span class="tag emergency ${contactsData[i].isEmergency ? "d-block" : "d-none"}">
                          <i class="fas fa-heartbeat"></i> Emergency
                        </span>
                      </div>

                      <div class="contact-actions">
                        <a href="tel:${contactsData[i].phone}" class="contact-action text-decoration-none call" title="Call">
                          <i class="fas fa-phone"></i>
                        </a>
                        <a href="mailto:${contactsData[i].email}" class="contact-action text-decoration-none email" title="Email">
                          <i class="fas fa-envelope"></i>
                        </a>
                        <button
                          class="contact-action favorite ${contactsData[i].isFav ? "active" : ""}"
                          title="Favorite"
                          onclick="toggleContactFav(${i})"
                        >
                          <i class="fas fa-star"></i>
                        </button>
                        <button
                          class="contact-action emergency ${contactsData[i].isEmergency ? "active" : ""}" 
                          title="Emergency"
                          onclick="toggleContactEmergency(${i})"
                        >
                          <i class="fas fa-heartbeat"></i>
                        </button>
                        <button 
                          class="contact-action delete" 
                          title="Delete"
                          onclick="deleteContact(${i})"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                        <button 
                          class="contact-action edit" 
                          title="Edit"
                          onclick="setEditContactData(${i})"
                          data-bs-toggle="modal"
                          data-bs-target="#contactModal"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  </div>
      `;
    }
  }
  document.getElementById("rowData").innerHTML = searchedContactsHtml;
}

// validation
function validationInputs(input){
    const regex={
        fullName: /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/,
        phoneNumber: /^01[0125][0-9]{8}/,
        emailAddress:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    }

    const message1={
        fullName: "Name",
        phoneNumber: "Phone",
        emailAddress: "Email",
    }
    const message2={
        fullName: "Name should contain only letters and spaces (2-50 characters)",
        phoneNumber: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
        emailAddress: "Please enter a valid email address (e.g., username@gmail.com)",
    }

    if(input.value === ""){
        Swal.fire({
        title: `Missing ${input.id}`,
        text: `Please enter a ${input.id} for the contact!`,
        icon: "error",
        draggable: true
        });
    return false;
    }

    if(!(regex[input.id].test(input.value.trim()))){
        Swal.fire({
        title: `Invalid ${message1[input.id]}`,
        text: `${message2[input.id]}`,
        icon: "error",
        draggable: true,
        });
    return false;
    }

return true;
}

// Duplicated 
function isDublicate(phoneNum){
    const duplicateFound= contactsData.find((con) => con.phone === phoneNum);
    if(duplicateFound){
        Swal.fire({
            title: `Duplicate Phone Number`,
            text: `A contact with this phone number already exists`,
            icon: "error",
            draggable: true,
        });
        return true; 
    }
    return false; 
}

// refresh problem
displayContacts();