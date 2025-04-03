document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.querySelector("dialog");
  const openDialogBtn = document.querySelector(".container__button");
  const closeDialogBtn = document.querySelector(".dialog__close");
  const containerBook = document.querySelector(".container__book");
  const form = document.querySelector(".dialog__form");
  const formInputs = document.querySelectorAll(".form__input");
  const formErrors = document.querySelectorAll(".form__error");
  const title = document.querySelector("#title");
  const author = document.querySelector("#author");
  const pages = document.querySelector("#pages");
  const library = [];

  class Book {
    constructor(title, author, pages) {
      this._title = title;
      this._author = author;
      this._pages = pages;
      this._read = false;
    }

    getTitle() {
      return this._title;
    }

    getAuthor() {
      return this._author;
    }

    getPages() {
      return this._pages;
    }

    getRead() {
      return this._read;
    }

    setRead(value) {
      this._read = value;
    }
  }

  function addBookToLibrary(title, author, pages) {
    const book = new Book(title, author, pages);

    if (!inLibrary(book.getTitle())) {
      library.push(book);
    }
  }

  function displayBooks(arr) {
    containerBook.innerHTML = "";

    arr.forEach((element, index) => {
      // Loop through the array and create the book inside containerBook
      containerBook.insertAdjacentHTML(
        "beforeend",
        `<div class="book book-${index}">
          <div class="book__main">
            <h2 class="book__title">${element.getTitle()}</h2>
            <span class="book__author">By ${element.getAuthor()}</span>
          </div>
          <div class="book__footer">
            <span>
              Read:
              <input 
                type="checkbox"
                class="book__read"
                data-index="${index}" ${element.getRead() ? "checked" : ""}>
            </span>
            <span>Pages: ${element.getPages()}</span>
          </div>
        </div>`
      );

      const book = document.querySelector(`.book-${index}`);
      removeBook(book, index);
    });

    document.querySelectorAll(".book__read").forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const index = this.dataset.index;
        const book = library[index];
        book.setRead(this.checked);
        console.log(library);
      });
    });
  }

  function removeBook(book, index) {
    book.insertAdjacentHTML(
      "afterbegin",
      `<button class="book__remove"></button>`
    );

    book.firstChild.onclick = () => {
      book.remove();
      library.splice(index, 1);
    };
  }

  function inLibrary(bookTitle) {
    return library.some((elem) => elem.getTitle() === bookTitle);
  }

  function displayError(element, messageError) {
    if (element.validity.valueMissing) {
      messageError.textContent = "You cannot leave this field empty";
    } else if (element.validity.rangeUnderflow) {
      messageError.textContent = `The minimum number is ${element.min}; you entered ${element.value}.`;
    } else {
      messageError.textContent = "This book already exists";
    }

    messageError.classList.add("active");
  }

  const openDialog = () => {
    dialog.showModal();
    setTimeout(() => {
      dialog.classList.add("dialog__opening");
      formInputs[0].focus();
    }, 10);
  };

  const closeDialog = () => {
    formErrors.forEach((formError) => {
      formError.textContent = "";
      formError.classList.remove("active");
    });

    dialog.classList.remove("dialog__opening");

    form.reset();

    setTimeout(() => {
      dialog.close();
      openDialogBtn.focus();
    }, 500);
  };

  openDialogBtn.addEventListener("click", openDialog);
  closeDialogBtn.addEventListener("click", closeDialog);

  openDialogBtn.onmousemove = function (event) {
    let x = event.pageX - openDialogBtn.offsetLeft;
    let y = event.pageY - openDialogBtn.offsetTop;

    openDialogBtn.style.setProperty("--x", x + "px");
    openDialogBtn.style.setProperty("--y", y + "px");
  };

  form.addEventListener("submit", (event) => {
    // Cancels the event of sending data to a server
    event.preventDefault();

    if (inLibrary(title.value)) {
      const messageError = formErrors[0];
      displayError(title, messageError);

      return;
    }

    addBookToLibrary(title.value, author.value, pages.value);
    closeDialog();
    displayBooks(library);
  });

  form.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault(); // Prevents automatic closing
    closeDialog();
  });

  dialog.addEventListener("click", () => {
    closeDialog();
  });

  title.addEventListener("input", () => {
    const messageError = formErrors[0];

    if (title.validity.valid) {
      messageError.textContent = "";
      messageError.classList.remove("active");
    } else {
      displayError(title, messageError);
    }
  });

  author.addEventListener("input", () => {
    const messageError = formErrors[1];

    if (author.validity.valid) {
      messageError.textContent = "";
      messageError.classList.remove("active");
    } else {
      displayError(author, messageError);
    }
  });

  pages.addEventListener("input", () => {
    const messageError = formErrors[2];

    if (pages.validity.valid) {
      messageError.textContent = "";
      messageError.classList.remove("active");
    } else {
      displayError(pages, messageError);
    }
  });

  displayBooks(library);
});
