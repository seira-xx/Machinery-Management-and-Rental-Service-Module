# PPAC Agricoop Management System

## Project Title & Description

The **PPAC Agricoop Management System** is a digital platform designed to to help Prosamapi Palestina Agriculture Cooperative with its operational challenges. The cooperative currently relies on pen and paper-based records and spreadsheets, which often result in inefficiency, inconsistent data management, delays in processing transactions, and limited transparency across operations.

This project aims to improve the cooperative’s overall operational efficiency by digitizing and streamlining its core processes through a management system.

This repository branch specifically focuses on the **Machinery Management and Rental Services Module**. The primary goal of the module is to help cooperative personnel efficiently manage machinery records, maintenance activities, and rental transactions. It provides a centralized system that to manage the rental process, manage the machinery registry that improves the monitoring of machinery availability and maintenance schedules.

The module allows authorized users such as the Operation Manager, Cashier, Farmer, and Mechanic Head to perform role-specific tasks, which include the following:
- Managing machinery records  
- Monitoring and scheduling maintenance activities  
- Processing, validating, and tracking rental requests  
- Maintaining accurate and organized transaction records  

Through this subsystem, the project aims to improve efficiency, consistency, accuracy, and transparency within the cooperative.

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
git clone https://github.com/seira-xx/Machinery-Management-and-Rental-Service-Module.git
cd Machinery-Management-and-Rental-Service-Module
```

### 2. Install Dependencies

#### Backend

```bash
cd acms-backend
npm install
```

#### Frontend

```bash
cd ../acms-frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the **acms-backend** directory and add the following:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=acms_db

# Server Configuration
PORT=5000

# JWT Configuration -generated using crypto.randomBytes(32).toString('hex')
JWT_SECRET=f77d808757e0ee74ef1bf79398f1cc10431d1e216d634544b6cf306baf8f4ec9

# or generate your own using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# JWT_SECRET=your_generated_jwt_secret

```

### 4. Set Up the Database

* Open MySQL and create a database:

```sql
CREATE DATABASE acms_db;
```

* Import the provided SQL file (if available):

```bash
# Navigate back to the root if needed, or target directly:
mysql -u root -p acms_db < acms-backend/database/acms_db_dump.sql
```

### 5. Run the Application

#### Start Backend Server

```bash
cd acms-backend
npm start
```

#### Start Frontend
#### Open new terminal

```bash
cd acms-frontend
npm start
```

The application should now be running at:

* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:5000`

### 6. Test Credentials

Use the following credentials to test the various role-based features of the system. The password for all test accounts is `123`.

| Role | Username | Password |
| :--- | :--- | :--- |
| **Operation Manager** | `ope` | `123` |
| **Mechanic Head** | `mec` | `123` |
| **Cashier** | `cas` | `123` |
| **Member** | `mem` | `123` |

---

## Contributors

* **Fullstack Developer:** Carl Louis M. Naval – Manages the complete development lifecycle

---

## Notes

* Ensure that Node.js and MySQL are installed on your machine before setup.
* Update environment variables based on your local configuration.
* For production deployment, additional configuration (e.g., security, environment optimization) is recommended.
