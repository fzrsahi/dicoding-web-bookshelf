const books =[];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook(){
  const bookTitle = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked ;

  const idBaru = generateId();
  const bookObject = generateBookObject(idBaru,bookTitle,author,year,isComplete);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36);
}

function generateBookObject(id,bookTitle,author,year,isComplete){
  return {
    id,
    bookTitle,
    author,
    year,
    isComplete
  }
}


function makeBook(bookObject){


  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  


  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.bookTitle;

  const author = document.createElement('p');
  author.innerText = `Penulis : ${bookObject.author}`;
  const year = document.createElement('p');
  year.innerText = `Tahun : ${bookObject.year}`;
  bookItem.append(textTitle,author,year);


  const green = document.createElement("div");
  green.classList.add("action");
  bookItem.appendChild(green);

  if(bookObject.isComplete){
    const action = document.createElement("button");
    action.classList.add("green");
    action.innerText ="Belum selesai";

    action.addEventListener('click',function(){
      undoTaskFromCompleted(bookObject.id);
    })
    const red = document.createElement("button");
    red.classList.add("red");
    red.innerText ="Hapus Buku";
    red.addEventListener('click',function(){
      if(konfirmasiHapus()){
        removeTaskFromCompleted(bookObject.id);
      }
      
    })
    green.appendChild(action);
    green.appendChild(red);
  }else {
    const action = document.createElement("button");
    action.classList.add("green");
    action.innerText ="selesai dibaca";
    action.addEventListener('click',function(){
      addTaskFromCompleted(bookObject.id);
    })
    const red = document.createElement("button");
    red.classList.add("red");
    red.innerText ="Hapus Buku";
    red.addEventListener('click',function(){
      if(konfirmasiHapus()){
        removeTaskFromCompleted(bookObject.id);
      }
    })
    green.appendChild(action);
    green.appendChild(red);
  }
  return bookItem;

};

document.addEventListener(RENDER_EVENT,function(){
  
    const uncompletedbookList  = document.getElementById("incompleteBookshelfList");
    const listCompleted  = document.getElementById("completeBookshelfList");

    uncompletedbookList.innerHTML ="";
    listCompleted.innerHTML ="";

  for(const bookItems of books){
    
    const bookElement = makeBook(bookItems);
    if(bookItems.isComplete){
      listCompleted.append(bookElement)
    }else {
      uncompletedbookList.append(bookElement);
    }
  }
});


function addTaskFromCompleted(bookId){
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId){
  for (const bookItems of books){
    if(bookItems.id === bookId){
      return bookItems;
    }
  }
  return null;
}
function konfirmasiHapus(){
  const result = confirm("Yakin menghapus buku ini dari list?");
  if(result == true){
    return true;
  }
}
function removeTaskFromCompleted(bookId){
  const bookTarget = findTodoIndex(bookId);

  if(bookTarget === -1) return;

  books.splice(bookTarget,1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(bookId){
  for(const index in books){
    if(books[index].id === bookId){
      return index;
    }
  }
  return -1;
}

function undoTaskFromCompleted(bookId){
  const bookTarget = findBook(bookId);
  if(bookTarget === null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true
}


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
const searchSubmit = document.getElementById('searchSubmit');
searchSubmit.addEventListener("click", function (event){
  event.preventDefault();
  const search = document.getElementById('searchBookTitle').value.toLowerCase();
  const filterBook = document.querySelectorAll('.book_item > h3');

      for (book of filterBook) {

    if (search === book.innerText.toLowerCase()) {
      book.parentElement.style.display = 'block';
    } else {
      book.parentElement.style.display = 'none';
    }
  }
})
