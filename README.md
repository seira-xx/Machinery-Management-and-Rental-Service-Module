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

This system contains 4 subsystems:
* Farm Input and Output Management assigned to John Edward M. Montanez
* Machinery Management and Rental Services assigned to Carl Louis M. Naval
* Cooperative Management assigned to Rey Francis P. Morata
* Financial Management assigned to Kian L. Lwin


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
