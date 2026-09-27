// Supabase configuration
const SUPABASE_URL = "https://ppmphssibyxtrdnzzwlm.supabase.co";
const SUPABASE_KEY = "sb_publishable_yBNgB99IPQIcjex8TvpUWw_j17ULOsF";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");

// Load books when the page opens
async function loadBooks() {
    const { data: books, error } = await db
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading books:", error);
        bookList.innerHTML = "<p>Unable to load books.</p>";
        return;
    }

    displayBooks(books);
}

// Display books on the page
function displayBooks(books) {
    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = "<p>No books in your library yet.</p>";
        return;
    }

    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        const info = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = `Author: ${book.author}`;

        const genre = document.createElement("p");
        genre.textContent = `Genre: ${book.genre}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${book.status}`;

        info.append(title, author, genre, status);

        const actions = document.createElement("div");
        actions.className = "book-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editBook(book));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteBook(book.id));

        actions.append(editButton, deleteButton);
        bookCard.append(info, actions);
        bookList.appendChild(bookCard);
    });
}

// CREATE - Add a new book
bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const status = document.getElementById("status").value;

    const { error } = await db
        .from("books")
        .insert([
            {
                title: title,
                author: author,
                genre: genre,
                status: status
            }
        ]);

    if (error) {
        console.error("Error adding book:", error);
        alert("There was a problem adding the book.");
        return;
    }

    bookForm.reset();
    await loadBooks();
});

// UPDATE - Edit a book
async function editBook(book) {
    const newTitle = prompt("Book title:", book.title);
    if (newTitle === null) return;

    const newAuthor = prompt("Author:", book.author);
    if (newAuthor === null) return;

    const newGenre = prompt("Genre:", book.genre);
    if (newGenre === null) return;

    const newStatus = prompt(
        "Reading status (Want to Read, Reading, or Finished):",
        book.status
    );
    if (newStatus === null) return;

    const { error } = await db
        .from("books")
        .update({
            title: newTitle.trim(),
            author: newAuthor.trim(),
            genre: newGenre.trim(),
            status: newStatus.trim()
        })
        .eq("id", book.id);

    if (error) {
        console.error("Error updating book:", error);
        alert("There was a problem updating the book.");
        return;
    }

    await loadBooks();
}

// DELETE - Remove a book
async function deleteBook(id) {
    const confirmed = confirm(
        "Are you sure you want to remove this book from your library?"
    );

    if (!confirmed) return;

    const { error } = await db
        .from("books")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting book:", error);
        alert("There was a problem deleting the book.");
        return;
    }

    await loadBooks();
}

// Initial database read
loadBooks();
