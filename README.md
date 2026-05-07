# PPAC Agricoop Management System

## Project Title & Description

The **PPAC Agricoop Management System** is a digital platform designed to to help Prosamapi Palestina Agriculture Cooperative with its operational challenges. The cooperative's reliance on a semi-manual data recording process often results in inefficiency, data inconsistency, and limited transparency. 

This system contains 4 subsystems:
* Farm Input and Output Management
* Machinery Management and Rental Services
* Cooperative Management
* Financial Management


---

## Tech Stack

The system is built using the following technologies:

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MySQL

---

## Installation Guide

Follow these steps to set up the development environment locally:

### 1. Clone the Repository

```bash
git clone https://github.com/icebirbs/PPAC-AgriCoop-Management-System.git
cd ppac-agricoop-management-system
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the **server** directory and add the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ppac_db
PORT=5000
```

### 4. Set Up the Database

* Open MySQL and create a database:

```sql
CREATE DATABASE ppac_db;
```

* Import the provided SQL file (if available):

```bash
mysql -u root -p ppac_db < database.sql
```

### 5. Run the Application

#### Start Backend Server

```bash
cd server
npm start
```

#### Start Frontend

```bash
cd client
npm start
```

The application should now be running at:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## Contributors

* **Project Manager:** John Edward M. Montañez – Oversees project development and coordination
* **Fullstack Developer:** Rey Francis P. Morata – Manages the complete development lifecycle
* **Fullstack Developer:** Carl Louis M. Naval – Manages the complete development lifecycle
* **Fullstack Developer:** Kian L. Lwin – Manages the complete development lifecycle


---

## Notes

* Ensure that Node.js and MySQL are installed on your machine before setup.
* Update environment variables based on your local configuration.
* For production deployment, additional configuration (e.g., security, environment optimization) is recommended.
