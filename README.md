# 💸 Spendly

A modern and elegant expense tracking application built with **React**, **TypeScript**, and **Spring Boot**. This tool empowers users to manage, categorize, and visualize their financial transactions with clarity and ease — all while following best practices in software design and architecture.
🌐 Live Site:  [Spendly](https://spendly-scsi.onrender.com/)
---

## ✨ Features

- 📌 **Transaction Management** – Add, view, and categorize income/expenses
- 📂 **CSV/Text/PDF Import & Export** – Import/export transaction data effortlessly for offline access
- 📊 **Data Visualization** – Clean animated UI to explore spending patterns
- 🛡️ **Robust Error Handling** – Seamless user experience under failure conditions
- ⚡ **Infinite Scroll & Server-side Pagination** – Lightning-fast UI, even with large datasets
- 🌀 **Modern Animations & Loaders** – Framer Motion-powered animations and contextual spinners for smooth, immersive feedback
- 📈 **Accurate Analytics** – Visualiser Page always fetches all data for correct graphs, regardless of pagination
- 🧩 **Professional Architecture** – Clean separation of concerns, reusable components, and scalable context logic

---

## 🧠 Design Philosophy

The backend of this project strictly follows the **SOLID principles** of object-oriented programming to ensure:

- ✅ Scalability
- ✅ Maintainability
- ✅ Readability
- ✅ Testability
- ✅ Performance

The frontend of this project follows the **DRY principle** of frontend development to ensure:

- ✅ Reusable UI Components
- ✅ Abstraction
- ✅ Global State Management (Context API)
- ✅ Custom Hooks
- ✅ Robust Error Handling

---

## 🔧 Tech Stack

| Layer         | Tech                                                           |
| ------------- | -------------------------------------------------------------- |
| **Frontend**  | React, TypeScript, Tailwind CSS, Framer Motion, D3.JS          |
| **Backend**   | Spring Boot (Java), REST APIs                                  |
| **Database**  | PostgreSQL (production), H2 (development)                      |
| **Utilities** | CSV/Text File I/O for import/export with PDF export supported. |

### Sample Upload Files in **'public/test-data' folder.**
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
<img width="2559" height="1017" alt="Screenshot 2025-07-25 032401" src="https://github.com/user-attachments/assets/0269c86a-0830-43ab-98a2-6e9a9aa0febe" />

---

- **Income Page**
  <img width="2559" height="1181" alt="Screenshot 2025-07-22 020441" src="https://github.com/user-attachments/assets/3e72d9e7-bc43-4c43-a0e0-03463d046768" />

---

- **Expense Page**
  <img width="2507" height="1439" alt="Screenshot 2025-07-22 015717" src="https://github.com/user-attachments/assets/43fbc68b-ac67-4965-b0ad-416e1bb77960" />

---

- **Visualiser Page**
  <img width="2559" height="1278" alt="Screenshot 2025-07-24 022740" src="https://github.com/user-attachments/assets/af2eae79-50de-42b3-9b1f-90505d426469" />

- **Insights Section**
  <img width="2078" height="314" alt="Screenshot 2025-07-24 022757" src="https://github.com/user-attachments/assets/00f52cc5-b608-4514-b3cf-c3f0150d080a" />

---

## Backend API Notes

- The `/api/transactions` endpoint supports both paginated (with `page` and `size` params) and non-paginated (no params) fetches.
- Visualiser Page always fetches all transactions for analytics, while the rest of the app uses pagination for performance.
- All import/export, error handling, and UI feedback are robust and production-ready.
