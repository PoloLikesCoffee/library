// the library where the books are stored
let myLibrary = [];

//localStorage initialization
loadStorage();

//call the function to display the library
updateLibraryDisplay();

class Book{
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleRead() {
        this.read = !this.read; 
    }

    remove() {
        myLibrary.splice(this.index, 1);
    }
}
//constructor
// function Book(title, author, pages, read) {
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
// }    
// //define two functions on the prototype of Book
// Book.prototype.toggleRead = function () { this.read = !this.read; }
// Book.prototype.remove = function() { myLibrary.splice(this.index, 1); }

//add book to myLibrary array feature
function addBookToLibrary(book) {
    myLibrary.push(book);
    populateLocalLibrary();
    updateLibraryDisplay();
}

//display each book feature
function updateLibraryDisplay() {
    const library = document.getElementById('library');
    let index = 0;
    library.innerHTML = '';

    myLibrary.forEach(book => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-index', index);
        book.index = index;

        card.innerHTML = `
        <div class="tools">
            <button class="dlt-button-card"><i class="fa fa-trash"></i></button>
        </div>
        <div class="main">
            <label for="title">Title</label>
            <div class="main-title"></div>

            <label for="author">Author</label>
            <div class="main-author"></div>

            <label for="pages">Number of pages</label>
            <div class="main-pages"></div>

            <label for="reading">I have already read it</label>
                <label class="switch">
                    <input class="input-label" type="checkbox" name="read">
                    <span class="slider round"></span>
                </label>
        </div>
        `;

        //book main part
        const main = card.querySelector('.main');
        let mainTitle = main.querySelector('.main-title');
        let mainAuthor = main.querySelector('.main-author');
        let mainPages = main.querySelector('.main-pages');

        mainTitle.innerHTML = book.title;
        mainAuthor.innerHTML = book.author;
        mainPages.innerHTML = book.pages;

        //toggle read part
        const readlabel = card.querySelector('.switch');
        readlabel.setAttribute("for", ("read" + index));
        const inputlabel = card.querySelector('.input-label');
        inputlabel.setAttribute("id", ("read" + index));
        inputlabel.addEventListener("change", updateReadChange);
        if (book.read) inputlabel.setAttribute("checked", "checked");

        //delete button part
        const deleteButton = card.querySelector('.dlt-button-card');
        deleteButton.addEventListener('click', deleteCard);

        //add card to library
        library.prepend(card);
        index++;
    });
}

//add button and form feature
const addButton = document.getElementById('add');
addButton.addEventListener('click', openForm);
const form = document.getElementById('add-card');
form.addEventListener('submit', submitNewCard);
const closeButton = document.getElementById('close-form');

//open and close form from + button feature
function openForm() {
    form.classList.toggle("hidden");
    closeButton.classList.toggle("hidden");
    closeButton.addEventListener('click', openForm);
    //addButton.innerHTML == `<i class="fa fa-plus"></i> Add Book` ? addButton.innerHTML = `<i class="fa fa-times"></i>  Close Form` : addButton.innerHTML = `<i class="fa fa-plus"></i> Add Book`;
    if (addButton.innerHTML == `<i class="fa fa-plus"></i> Add Book`) {
        addButton.innerHTML = `<i class="fa fa-times"></i>  Close Form`;
    } else {
        addButton.innerHTML = `<i class="fa fa-plus"></i> Add Book`;
    }
}

//creation of book's card feature
function submitNewCard(event) {
    //preventing from submitting a form right away
    event.preventDefault();
    let book = Object.create(Book.prototype);

    book.title = event.target.elements['title'].value;
    book.author = event.target.elements['author'].value;
    book.pages = event.target.elements['pages'].value;
    book.read = event.target.elements['read'].checked;
    
    addBookToLibrary(book);
    clearForm(event);
    openForm();
}

//clear input of the form after submit feature
function clearForm(event) {
    event.target.elements['title'].value = null;
    event.target.elements['author'].value = null;
    event.target.elements['pages'].value = null;
    event.target.elements['read'].value = false ;
}

//update the value of the read's toggle feature
function updateReadChange(event) {
    let bookIndex = event.currentTarget.parentNode.parentNode.parentNode.dataset.index;
    myLibrary[bookIndex].toggleRead();
    populateLocalLibrary();
}

//delete the book's card feature
function deleteCard(event) {
    let bookIndex = event.currentTarget.parentNode.parentNode.dataset.index;
    const foundBook = myLibrary.find(book => book.index == bookIndex);
    foundBook.remove();
    populateLocalLibrary();
    updateLibraryDisplay();
}

//localStorage feature
function loadStorage() {
    // check if the local library is empty
    if(!localStorage.getItem('localLibrary')) {
        populateLocalLibrary();
    } else {
        getLocalLibrary();
    }
}
function populateLocalLibrary() {
    //store books in the "local library" localStorage
    //to store objects, use JSON.stringify()
    localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
}

function getLocalLibrary() {
    //get books from the "local library"
    //return a string, so convert it back to object with JSON.parse() 
    myLibrary = JSON.parse(localStorage.getItem('localLibrary'));
    //return a object but cannot asset the prototype properties

    //lets turn the objects of myLibrary into book
    let tempArray = []; //create a temp array to store the fresh converted objects = book
    myLibrary.forEach(objectToConvert => {
        //convertedBook will get the elements of the object (title, author, pages, read and index)
        let convertedObjectToBook = new Book();
        for(element in objectToConvert) {
            convertedObjectToBook[element] = objectToConvert[element];
        }
        //push convertedObjectToBook = book in the tempArray
        tempArray.push(convertedObjectToBook);
        return tempArray;
    });
    myLibrary = tempArray;
}
