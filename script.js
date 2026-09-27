// Supabase configuration
const SUPABASE_URL = "https://ppmphssibyxtrdnzzwlm.supabase.co";
const SUPABASE_KEY = "sb_publishable_yBNgB99IPQIcjex8TvpUWw_j17ULOsF";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");

//--------------------------------    Authentication elements
const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupButton = document.getElementById("signup-btn");
const loginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const authMessage = document.getElementById("auth-message");
const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");

// Update the page depending on login status
function updateAuthUI(user) {
    if (user) {
        authForm.style.display = "none";
        userInfo.style.display = "block";
        userEmail.textContent = `Logged in as: ${user.email}`;
        bookForm.style.display = "grid";
    } else {
        authForm.style.display = "grid";
        userInfo.style.display = "none";
        userEmail.textContent = "";
        bookForm.style.display = "none";
    }
}

// --------------------------------------------   REGISTER
signupButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent = "Please enter an email and password.";
        return;
    }

    const { error } = await db.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    authMessage.textContent =
        "Registration successful. Check your email to confirm your account.";
});

// -----------------------------            LOGIN
loginButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent = "Please enter an email and password.";
        return;
    }

    const { error } = await db.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    authMessage.textContent = "Login successful.";
    authForm.reset();
});

// --------------------------------------------------        LOGOUT
logoutButton.addEventListener("click", async () => {
    const { error } = await db.auth.signOut();

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    authMessage.textContent = "You have been logged out.";
});

// Check current login status
async function checkUser() {
    const {
        data: { user }
    } = await db.auth.getUser();

    updateAuthUI(user);
}

db.auth.onAuthStateChange((_event, session) => {
    updateAuthUI(session?.user ?? null);
});

checkUser();

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

    const { data: { user } } = await db.auth.getUser();

if (!user) {
    alert("You must be logged in to add a book.");
    return;
}
    
    const { error } = await db
        .from("books")
        .insert([
            {
                title: title,
                author: author,
                genre: genre,
                status: status,
                user_id: user.id
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
