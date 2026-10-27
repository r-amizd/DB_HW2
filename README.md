# Supermarket Database Application

COSC 3380 — Database Systems

## Project Overview

A supermarket database application built using JavaScript, Node.js, Express, and PostgreSQL.

The application provides database initialization, sample data generation, table browsing, supermarket checkout simulations, bank account transactions, transaction history, and analytical reports.

Checkout operations use PostgreSQL transactions to update purchase records, inventory, and bank account balances atomically.

## Requirements

- Node.js (version 24 recommended)
- npm
- PostgreSQL
- A modern web browser (Chrome, Firefox, or Edge)
- Python 3 (optional, for serving the frontend locally)

## Installation

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd DB_HW2
```

### 2. Create the PostgreSQL database

Start PostgreSQL and connect through psql or pgAdmin.

Run:

```sql
CREATE DATABASE supermarket_db;
```

The application will create its tables through the frontend initialization controls.

### 3. Configure environment variables

Navigate to the `backend` directory.

Copy `.env.example` to `.env`.

Update `.env` with your local PostgreSQL credentials:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supermarket_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
```

### 4. Install backend dependencies

From `backend/`:

```bash
npm ci
```

### 5. Start the backend

```bash
npm start
```

The Express API will be available at:

http://localhost:3000

Verify connectivity at:

http://localhost:3000/api/health

### 6. Open the frontend

Navigate to the folder containing `index.html`, `app.js`, and `style.css`.

Open `index.html` in a browser.

Alternatively, serve the frontend using:

```bash
python -m http.server 5500
```

Then visit:

http://localhost:5500/index.html

## Initial Database Setup

From the application's **Home / Database** tab:

1. Click **Initialize Tables** to create the database tables.
2. Click **Initialize Data** to insert sample data.
3. Select a table from the dropdown to inspect its contents.

Initializing or reseeding the database deletes existing application data.

## Checkout Simulation

Open the **OLTP Simulation** tab.

1. Select Store ID `1`.
2. Choose an item count between 10 and 20.
3. Select `CARD` or `CASH`.
4. Set the number of concurrent clients.
5. Click **Run Checkout Simulation**.

Successful transactions display a receipt containing purchased products, quantities, prices, taxes, and totals.

The sample database currently stocks Store 1 for checkout demonstrations.

## Analytical Reports

The application provides three SQL JOIN reports:

- Store Sales Summary
- Top Selling Products
- Low Stock by Aisle

The **Transaction History** tab displays recent completed purchases.

## Database Transaction Handling

Checkout operations use PostgreSQL transactions with `BEGIN`, `COMMIT`, and `ROLLBACK`.

Inventory and bank account rows are locked using `SELECT ... FOR UPDATE` before quantities and balances are modified.

If a checkout fails because of insufficient inventory or insufficient funds, the transaction is aborted.

## Technology Stack

- Frontend: HTML, CSS, JavaScript, jQuery
- Backend: Node.js, Express
- Database: PostgreSQL
- Database driver: node-postgres (`pg`)

## Notes

- The application is designed to run locally with PostgreSQL.
- The backend listens on port 3000.
- The frontend connects to `http://localhost:3000/api`.
- Do not commit your `.env` file or database credentials.
