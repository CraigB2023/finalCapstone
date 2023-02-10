let saved = [];//Create an empty array that we will use to store all the saved objects created.

//get arrays of like and save buttons to be used in script
let likeButtons = document.getElementsByClassName("like");
let saveButtons = document.getElementsByClassName("save");

function myLoad() {

    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("savedForLater", JSON.stringify(saved));
        sessionStorage.setItem("hasCodeRunBefore", true);
        console.log(document.title);
    } else {
        saved = JSON.parse(sessionStorage.getItem("savedForLater"));
        //Set the icon in the menu to the count of items saved
        document.getElementsByClassName("cart-quantity")[0].innerHTML = saved.length;
        //set the saved buttons on the page to being toggle selected if they are in saved
        for (var i = 0; i < saveButtons.length; i++) {
            let itemName = saveButtons[i].previousElementSibling.previousElementSibling.alt;
            if (saved.length>=1){
                for (let j=0; j<saved.length; j++){
                    if (saved[j].itemName == itemName){
                        // if the item has been selected already then change background color of save button
                        saveButtons[i].style.backgroundColor = "rgba(255, 21, 21, 0.7)";
                    }   
                }
            }
        }
        
    }
    // if the page is 'save for later' then load the saved items table
    if (document.title == "Save For Later") {
        loadSaved();
    }
}

//The constructor function that will be used to create all saved item objects.
function Item(itemName, type, link) {
    this.itemName = itemName;
    this.type = type;
    this.link = link;
}

function saveItem(i) {
    // only images have been used for the saved items.
    let itemName = saveButtons[i].previousElementSibling.previousElementSibling.alt; // use the alt of the img as the name
    let type = saveButtons[i].previousElementSibling.previousElementSibling.nodeName; 
    let link = saveButtons[i].previousElementSibling.previousElementSibling.src; // use the image link also to create a clickable thumbnail

    saved = JSON.parse(sessionStorage.getItem("savedForLater"));
    let found = 0; // if the item is already in the array
    if (saved.length>=1){
        for (let i=0; i<saved.length; i++){
            // don't add if it is already saved
            if (saved[i].itemName == itemName){
                found=1;
            }   
        }
    }
    // if not in the array saved
    if (found=="0"){
        //create a new saved for later item 
        let newItem = new Item(
            itemName,
            type,
            link
        );
        saved.push(newItem);
        sessionStorage.setItem("savedForLater", JSON.stringify(saved));
        //Set the icon in the menu to the count of items saved
        document.getElementsByClassName("cart-quantity")[0].innerHTML = saved.length;
        // alert the amount of items saved
        alert(`You have ${saved.length} items saved for later.`);
    }    
}

function loadSaved() {
    let myList = document.getElementById("savedTable"); // reference to the div i plan to load the table
    myList.innerHTML = null; // clear the list each time
    saved = JSON.parse(sessionStorage.getItem("savedForLater")); // get the items from session storage
    if (saved.length > 0){
        // note i have left the h2 tag out as i want it to always be displayed so hard coded in html 
        //create the table header
        let table = document.createElement("table");
        table.className = "tableOutput";
        let tr = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.innerHTML = "Name";
        th1.className = "tableHeader";
        let th2 = document.createElement("th");
        th2.innerHTML = "Type";
        th2.className = "tableHeader";
        let th3 = document.createElement("th");
        th3.innerHTML = "Image link";
        th3.className = "tableHeader";
        let th4 = document.createElement("th");
        th4.innerHTML = "Delete";
        th4.className = "tableHeader";
        myList.appendChild(table);
        table.appendChild(tr);
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);

        // add the item details
        saved.forEach((value, index) => {
            let tr = document.createElement("tr");
            tr.id=index; // from lecture
            let td1 = document.createElement("td");
            td1.innerHTML = `${value.itemName}`;
            let td2 = document.createElement("td");
            td2.innerHTML = `${value.type}`;
            let td3 = document.createElement("td");
            //this is the thumbnail that opens in a new window
            td3.innerHTML = `<a href="${value.link}" target="_blank"><img src="${value.link}" alt="${value.itemName}"
            width="120"/></a>`;
            let td4 = document.createElement("td");
            // delete button
            td4.innerHTML = `<span class="delete" onclick="deleteItem(${index})">delete</span>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            table.appendChild(tr);
        });
    } else {
        // if no items in the saved array
        let p = document.createElement("p");
        p.innerHTML = "You have not saved any items for later.";
        myList.appendChild(p);
    }
 
}

function deleteItem(value){
    // get the current items list from session storage
    saved = JSON.parse(sessionStorage.getItem("savedForLater"));
    saved.splice(value,1); // remove the row
    sessionStorage.setItem("savedForLater", JSON.stringify(saved)); // update session storage
    //Set the icon in the menu to the count of items saved
    document.getElementsByClassName("cart-quantity")[0].innerHTML = saved.length;
    loadSaved(); // call loadSaved to update the list to the user
}





function backgroundToggle(buttonType, i){
    return function(){
        // take button type - like or save - and its array level - update its background color
        buttonType[i].style.backgroundColor = "rgba(255, 21, 21, 0.7)";
     
    }

   
};
// https://stackoverflow.com/questions/17981437/how-to-add-event-listeners-to-an-array-of-objects
// this adds an event listener for every LIKE button that calls a function
for (var i = 0; i < likeButtons.length; i++) {
    likeButtons[i].addEventListener('click', backgroundToggle(likeButtons, i), false);
}

// this adds an event listener for every SAVE button
for (var i = 0; i < saveButtons.length; i++) {
    saveButtons[i].addEventListener('click', backgroundToggle(saveButtons, i), false);
    //using bind() to stop 'saveItem' firing straight away - https://stackoverflow.com/questions/35667267/addeventlistenerclick-firing-immediately
    saveButtons[i].addEventListener('click', saveItem.bind(this,i), false);

}

if(document.title == "Contact"){
    // NOTE The forms do not send data anywhere they just valid the responses and show a confirmation message
    // add an event listener to the sendEmail button
    let sendEmailBtn = document.getElementById("sendEmail");

    sendEmailBtn.addEventListener('click',function () {
        //email validation - https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        // this is going to valid the form fields and remove div they are in and replace with one that confirms 
        let divEmail2 = document.getElementById("divEmail2");
        let fullNameEmail = document.getElementById("fullNameEmail").value;
        let emailQuery = document.getElementById("emailQuery").value;
        let commentQuery = document.getElementById("commentQuery").value;

        if (fullNameEmail != "" && emailQuery != "" && commentQuery != ""){
            if (emailQuery.match(validRegex)){
                //remove div1 from dom
                document.getElementById("divEmail1").remove();
                // dynamically add a paragraph about thanking them for subscribing
                let p = document.createElement("p");
                p.innerHTML = `Hi ${fullNameEmail}, thank you for email query! We will endeavour to reply as soon as possible.`;
                divEmail2.appendChild(p);
            }else{
                alert("Please enter a valid email address for email query.")
            }
        } else {
            alert("Please complete all email query fields.")
        }
    },false); 

   // add an event listener to the subscribe button
    let subscribeBtn = document.getElementById("subscribe");

    subscribeBtn.addEventListener('click',function () {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let divNewsletter2 = document.getElementById("divNewsletter2");
        let fullName = document.getElementById("fullName").value;
        let email = document.getElementById("email").value;

        if (fullName != "" && email != ""){
            if (email.match(validRegex)){
                //remove div1 from dom
                document.getElementById("divNewsletter1").remove();
                // dynamically add a paragraph about thanking them for subscribing
                let p = document.createElement("p");
                p.innerHTML = `Hi ${fullName}, thank you for subscribing! You have successfully been added to our mailing list.`;
                divNewsletter2.appendChild(p);
            }else{
                alert("Please enter a valid email address for joining the newsletter.")
            }
        } else {
            alert("Please complete both name and email fields.")
        }
    },false); 

    // add an event listener for the submitComment button
    let submitCommentBtn = document.getElementById("submitComment");

    //i've left comments inputs visible so they can add more than one.
    submitCommentBtn.addEventListener('click',function () {
        let nameComment =  document.getElementById("nameComment").value;
        let comment = document.getElementById("comment").value;
        let commentsHolder = document.getElementById("commentsHolder");

        if (nameComment != "" && comment != ""){
            // create a new comment and add it below the one that is hard coded into the page
            // i'm not going to use the sessionStorage for this part
            let figure = document.createElement("figure");
            figure.className = "quote";
            let blockquote = document.createElement("blockquote");
            blockquote.innerHTML = comment;
            let figcaption = document.createElement("figcaption");
            figcaption.innerHTML = `&mdash; ${nameComment}`;
            commentsHolder.appendChild(figure);
            figure.appendChild(blockquote);
            figure.appendChild(figcaption);
            //clear name and comments inputs
            document.getElementById("nameComment").value= "";
            document.getElementById("comment").value = "";
        } else {
            alert("Please complete both name and comment fields.")
        }
    },false);

}

