# 💸 Spendly

A modern and elegant expense tracking application built with **React**, **TypeScript**, and **Spring Boot**. This tool empowers users to manage, categorize, and visualize their financial transactions with clarity and ease — all while following best practices in software design and architecture.

---

## ✨ Features

- 📌 **Transaction Management** – Add, view, and categorize income/expenses
- 📂 **CSV/Text/PDF Import & Export** – Import/export transaction data effortlessly for offline access
- 📊 **Data Visualization** – Clean animated UI to explore spending patterns
- 🧱 **Responsive Design** – Mobile-first, Tailwind-powered layout
- 🛡️ **Robust Error Handling** – Seamless user experience under failure conditions
- ⚡ **Infinite Scroll & Server-side Pagination** – Lightning-fast UI, even with large datasets
- 🌀 **Modern Animations & Loaders** – Framer Motion-powered animations and contextual spinners for smooth, immersive feedback
- 📈 **Accurate Analytics** – Visualiser Page always fetches all data for correct graphs, regardless of pagination
- 🧩 **Professional Architecture** – Clean separation of concerns, reusable components, and scalable context logic

---

## 🧠 Design Philosophy

This project strictly follows the **SOLID principles** of object-oriented programming to ensure:

- ✅ Scalability
- ✅ Maintainability
- ✅ Readability
- ✅ Testability
- ✅ Performance (with paginated APIs and optimized frontend state)

---

## 🔧 Tech Stack

| Layer         | Tech                                                           |
| ------------- | -------------------------------------------------------------- |
| **Frontend**  | React, TypeScript, Tailwind CSS, Framer Motion, Topbar         |
| **Backend**   | Spring Boot (Java), REST APIs                                  |
| **Database**  | PostgreSQL (production), H2 (development)                      |
| **Utilities** | CSV/Text File I/O for import/export with PDF export supported. |

---

## 🚀 Getting Started

### 📦 Prerequisites

- [Node.js](https://nodejs.org/)
- [Java JDK](https://adoptium.net/)
- [Maven](https://maven.apache.org/)

---

### ⚙️ Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Start the backend (Spring Boot)**

   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Start the frontend (React)**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 👨‍💻 Contact Me

- [🔗 LinkedIn – Anshuman Naithani](https://www.linkedin.com/in/anshuman-naithani/)
- [🌐 Portfolio](https://anshumannaithani.netlify.app/)

---

## Previews

- **Home Page**
  "C:\Users\ASUS\OneDrive\Pictures\Screenshots\Screenshot 2025-07-22 015632.png"

---

- **Income Page**
  "C:\Users\ASUS\OneDrive\Pictures\Screenshots\Screenshot 2025-07-22 015655.png"

---

- **Expense Page**
  "C:\Users\ASUS\OneDrive\Pictures\Screenshots\Screenshot 2025-07-22 015717.png"

---

- **Visualiser Page**
 "C:\Users\ASUS\OneDrive\Pictures\Screenshots\Screenshot 2025-07-22 015955.png"

- **Insights Section**
  "C:\Users\ASUS\OneDrive\Pictures\Screenshots\Screenshot 2025-07-22 020015.png"

---

## Backend API Notes

- The `/api/transactions` endpoint supports both paginated (with `page` and `size` params) and non-paginated (no params) fetches.
- Visualiser Page always fetches all transactions for analytics, while the rest of the app uses pagination for performance.
- All import/export, error handling, and UI feedback are robust and production-ready.
