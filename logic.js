let myLibrary = [];
let libraryContainer = document.querySelector(".grid");
let addBookButton = document.querySelector(".add-book-button");
let newBookPopup;

// constructor for the book
function Book(title, author, pages, bookmark) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.bookmark = bookmark;
}

Book.prototype.deleteBook = function(cardContainer) {
  libraryContainer.removeChild(cardContainer);
  // actually delete the book object from the myLibrary array
  myLibrary = myLibrary.filter(element => element != this);
};

function changePages(pagesText, book) {
  pagesText.innerHTML = `${book.bookmark} / ${book.pages}`;
  pagesText.style.cssText = 'font-size:24px;';
  // if user has read the whole book make the text green
  if (book.bookmark == book.pages) {
    pagesText.style.color = 'rgb(101, 233, 85)';
  } else {
    pagesText.style.color = 'white';
  }

}

Book.prototype.createCard = function() {
  // console.log('this:', this);
  let book = this;
  // console.log("in createCard()");
  let cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  // append the number of pages of the book and the bookmark to the cardContainer
  let pagesText = document.createElement('p');
  changePages(pagesText, book);

  let completeButton = document.createElement('img');
  completeButton.src = "images/check-mark.png";
  completeButton.classList.add('complete-button');
  completeButton.addEventListener('click', function() {
    book.bookmark = book.pages;
    changePages(pagesText, book);
    saveData();
  });

  let deleteButton = document.createElement('img');
  deleteButton.src = "images/trash-can.png";
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function() {
    book.deleteBook(cardContainer);
    saveData();
  });

  // make the actual card
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = "<h1 style = 'padding:10px 30px 10px; position:absolute; width:151px;'>" + book.title + "</h1>";
  card.addEventListener('click', function() {
    popupEditBook(book, card, pagesText);
  });
  // append everything to the card container
  cardContainer.appendChild(completeButton);
  cardContainer.appendChild(deleteButton);
  cardContainer.appendChild(card);
  cardContainer.appendChild(pagesText);

  libraryContainer.insertBefore(cardContainer, addBookButton);
};

Book.prototype.addBookToLibrary = function() {
  myLibrary.push(this);
  // console.log("after add: ", myLibrary);
  this.createCard();
};

function createForm() {
  // make a form to store input
  let form = document.createElement("div");
  form.classList.add("new-book-form");
  // make all the text boxes for the name, author, pages, and bookmark

  let nameText = document.createElement("input");
  nameText.setAttribute('type', 'text');
  nameText.setAttribute('id', 'bookName');
  let nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'bookName');
  nameLabel.innerHTML = 'Name';
  let nameContainer = document.createElement('div');
  nameContainer.classList.add('form-element-container');
  nameContainer.appendChild(nameLabel);
  nameContainer.appendChild(nameText);

  let authorText = document.createElement("input");
  authorText.setAttribute('type', 'text');
  authorText.setAttribute('id', 'bookAuthor');
  let authorLabel = document.createElement('label');
  authorLabel.setAttribute('for', 'bookAuthor');
  authorLabel.innerHTML = 'Author';
  let authorContainer = document.createElement('div');
  authorContainer.classList.add('form-element-container');
  authorContainer.appendChild(authorLabel);
  authorContainer.appendChild(authorText);

  let pagesText = document.createElement("input");
  pagesText.setAttribute('type', 'text');
  pagesText.setAttribute('id', 'bookPages');
  let pagesLabel = document.createElement('label');
  pagesLabel.setAttribute('for', 'bookPages');
  pagesLabel.innerHTML = 'Pages';
  let pagesContainer = document.createElement('div');
  pagesContainer.classList.add('form-element-container');
  pagesContainer.appendChild(pagesLabel);
  pagesContainer.appendChild(pagesText);

  let bookmarkText = document.createElement("input");
  bookmarkText.setAttribute('type', 'text');
  bookmarkText.setAttribute('id', 'bookBookmark');
  let bookmarkLabel = document.createElement('label');
  bookmarkLabel.setAttribute('for', 'bookBookmark');
  bookmarkLabel.innerHTML = 'Bookmark';
  let bookmarkContainer = document.createElement('div');
  bookmarkContainer.classList.add('form-element-container');
  bookmarkContainer.appendChild(bookmarkLabel);
  bookmarkContainer.appendChild(bookmarkText);

  // append all the element containers
  let formContent = document.createElement('div');
  formContent.classList.add('form-content');
  formContent.appendChild(nameContainer);
  formContent.appendChild(authorContainer);
  formContent.appendChild(pagesContainer);
  formContent.appendChild(bookmarkContainer);
  form.appendChild(formContent);

  return form;
}

function intitializeNewBookPopup() {
  newBookPopup = document.createElement('div');
  let form = createForm();

  // make the cancel and submit buttons
  let cancelButton = document.createElement('button');
  cancelButton.innerHTML = "cancel";
  cancelButton.classList.add('form-button');
  let submitButton = document.createElement('button');
  submitButton.classList.add('form-button');
  submitButton.innerHTML = "submit";
  let formButtons = document.createElement('div');
  formButtons.classList.add('form-button-group');
  formButtons.appendChild(cancelButton);
  formButtons.appendChild(submitButton);
  form.appendChild(formButtons);

  // append the completed form to the popup
  newBookPopup.appendChild(form);

  // add eventlisteners for the cancel and submit buttons
  submitButton.addEventListener('click', function() {
    // collect the data from the text fields and make a new book obejct and add it to the library
    let newBook = new Book(form.querySelector('#bookName').value, form.querySelector('#bookAuthor').value, form.querySelector('#bookPages').value, form.querySelector('#bookBookmark').value);
    console.log(newBook);
    newBook.addBookToLibrary();
    saveData();
    // clear all the text boxes fo rnext time we create a book since we reuse the same form to save resources
    form.querySelector('#bookName').value = '';
    form.querySelector('#bookAuthor').value = '';
    form.querySelector('#bookPages').value = '';
    form.querySelector('#bookBookmark').value = '';

    libraryContainer.removeChild(newBookPopup);
  });

  cancelButton.addEventListener('click', function() {
    libraryContainer.removeChild(newBookPopup);
  });
}

function showEditBookPopup(book, card, pagesText) {
  editBookPopup = document.createElement('div');
  let form = createForm();
  // TODO: populate the form text boxes with current book information
  form.querySelector('#bookName').value = book.title;
  form.querySelector('#bookAuthor').value = book.author;
  form.querySelector('#bookPages').value = book.pages;
  form.querySelector('#bookBookmark').value = book.bookmark;

  // make the cancel and submit buttons
  let cancelButton = document.createElement('button');
  cancelButton.innerHTML = "cancel";
  cancelButton.classList.add('form-button');
  let editButton = document.createElement('button');
  editButton.classList.add('form-button');
  editButton.innerHTML = "edit";
  let formButtons = document.createElement('div');
  formButtons.classList.add('form-button-group');
  formButtons.appendChild(cancelButton);
  formButtons.appendChild(editButton);
  form.appendChild(formButtons);

  // append the completed form to the popup
  editBookPopup.appendChild(form);

  // add eventlisteners for the cancel and submit buttons
  editButton.addEventListener('click', function() {
    // collect the data from the text fields and make a new book obejct and add it to the library
    book.title = form.querySelector('#bookName').value;
    book.author = form.querySelector('#bookAuthor').value;
    book.pages = form.querySelector('#bookPages').value;
    book.bookmark = form.querySelector('#bookBookmark').value;
    // console.log(book.title, book.author, book.pages, book.bookmark);
    // TODO: now we want to show it on the card
    card.innerHTML = "<h1 style = 'padding:10px 30px 10px; position:absolute; width:151px;'>" + book.title + "</h1>";
    changePages(pagesText, book);
    saveData();
    libraryContainer.removeChild(editBookPopup);
  });

  cancelButton.addEventListener('click', function() {
    libraryContainer.removeChild(editBookPopup);
  });

  return editBookPopup;
}

function popupEditBook(book, card, pagesText) {
  libraryContainer.appendChild(showEditBookPopup(book, card, pagesText));
}

function displayData() {
  console.log(myLibrary.length);
  for (var a = 0; a < myLibrary.length; a++) {
    myLibrary[a].createCard();
  }
  // let dummy = new Book("The Name of the Wind", "Patrick Rothfuss", 662, 630);
  // dummy.addBookToLibrary();
  // console.log(myLibrary[0]);
  // console.log(dummy);
}

function popupNewBook() {
  libraryContainer.appendChild(newBookPopup);
}

function addListenerAddBook() {
  addBookButton.addEventListener('click', popupNewBook);
}

function loadData() {
  if (!localStorage.getItem('myLibrary')) {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  }
  myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  for (let a = 0; a < myLibrary.length; a++) {
    myLibrary[a] = new Book(myLibrary[a].title, myLibrary[a].author, myLibrary[a].pages, myLibrary[a].bookmark);
  }
  console.log(myLibrary);
  displayData();
}

function saveData() {
  console.log("myLibrary: ", myLibrary);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// make all function calls after all functions have been declared and defined as good practice just in case hoisting is not in effect
loadData();
intitializeNewBookPopup();
addListenerAddBook();
