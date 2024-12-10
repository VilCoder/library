document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.querySelector("dialog");
    const openDialogBtn = document.querySelector(".container__button");
    const closeDialogBtn = document.querySelector(".dialog__close");
    const containerBook = document.querySelector(".container__book");
    const form = document.querySelector(".dialog__form");
    const formInputs = document.querySelectorAll(".form__input");
    const errorMessage = document.querySelector("#error__message");
    const library = [];

    function Book(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = false;
    }

    function addBookToLibrary(title, author, pages) {
        const book = new Book(title, author, pages);

        if (inLibrary(book.title)) {
            library.push(book);
        }
    }

    function displayBooks(arr) {
        containerBook.innerHTML = "";

        arr.forEach((element, index) => { // Loop through the array and create the book inside containerBook
            containerBook.insertAdjacentHTML(
                "beforeend",
                `<div class="book book-${index}">
                    <div class="book__main">
                        <h2 class="book__title">${element.title}</h2>
                        <span class="book__author">${element.author}</span>
                    </div>
                    <div class="book__footer">
                        <span>Read: <input type="checkbox" class="book__read" data-index="${index}" ${element.read ? "checked" : ""}></span>
                        <span>Pages: ${element.pages}</span>
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
                book.read = this.checked;
            });
        });
    }

    function removeBook(book, index) {
        book.insertAdjacentHTML("afterbegin", '<button class="book__remove">x</button>');
        book.firstChild.onclick = () => {
            book.remove();
            library.splice(index, 1);
        }
    }

    function inLibrary(bookTitle) {
        return library.every(elem => elem.title !== bookTitle);
    }

    const openDialog = () => {
        dialog.showModal();
        setTimeout(() => {
            dialog.classList.add("dialog__opening");
            formInputs[0].focus();
        }, 10);
    };

    const closeDialog = () => {
        dialog.classList.remove("dialog__opening");

        errorMessage.classList.remove("form__error");
        errorMessage.textContent = "";

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

        const title = document.querySelector("#title").value;
        const author = document.querySelector("#author").value;
        const pages = document.querySelector("#pages").value;

        if (!inLibrary(title)) {
            errorMessage.classList.add("form__error");
            errorMessage.textContent = "This book already exists";

            setTimeout(() => {
                errorMessage.textContent = "";
            }, 3000);
            return;
        }

        addBookToLibrary(title, author, pages);

        form.reset();

        closeDialog();

        displayBooks(library);
    });

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault(); // Prevents automatic closing
        form.reset();
        closeDialog();
    });

    displayBooks(library);
});

