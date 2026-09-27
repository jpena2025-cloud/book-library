# My Book Library

My Book Library is a web application that allows users to create and manage their own personal book collection.

Each user can register for an account, log in, add books, edit book information, update reading status, and delete books. User data is stored securely in Supabase, and Row Level Security (RLS) ensures that users can only access their own books.

## Features

- User registration
- Email confirmation
- User login
- User logout
- Add books
- View personal book collection
- Edit book information
- Delete books
- Track reading status
- User-specific data protection with Row Level Security

## Technologies Used

- HTML
- CSS
- JavaScript
- ChatGPT
- Supabase
- GitHub
- Netlify

## Backend and Database

Supabase is used as the backend for:

- User authentication
- Email-based registration and login
- Database storage
- Row Level Security

The `books` table stores:

- Book title
- Author
- Genre
- Reading status
- User ID

Each book is associated with the authenticated user who created it.

## CRUD Functionality

The application supports all four CRUD operations:

- **Create** - Add a new book
- **Read** - View books in the user's personal library
- **Update** - Edit book information
- **Delete** - Remove books

## Authentication and Security

Users must register and confirm their email before logging in.

Only authenticated users can create or modify books.

Supabase Row Level Security policies ensure that users can only read, update, and delete records associated with their own user account.

## Setup Instructions

1. Clone or download this GitHub repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. An internet connection is required because the application connects to Supabase.
5. Register for an account using an email address.
6. Confirm the email address.
7. Log in to access the personal book library.

## Project Structure

- `index.html` - Application structure and user interface
- `style.css` - Application styling
- `script.js` - Authentication, CRUD logic, and Supabase integration
- `README.md` - Project documentation

## Live Application

[Open My Book Library](https://gentle-phoenix-98092f.netlify.app)

## Demo Video

Watch the full project demonstration here:

[My Book Library - Demo Video](https://youtu.be/7FVk7KalMns)

## AI Development

ChatGPT was used as the AI coding assistant during development.

The application was built incrementally by generating, reviewing, testing, and improving AI-assisted code throughout the project.
