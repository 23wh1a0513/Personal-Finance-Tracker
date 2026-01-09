# **PROJECT TITLE**

**Personal Finance Tracker**

# **1. Introduction**

Personal Finance Tracker is a web-based application developed to help individuals manage their personal finances efficiently. Many people face difficulty in tracking where their money is spent, how much they save, and whether they stay within their budget. This system solves that problem by providing a digital platform to record income, expenses, and budgets in a structured and easy-to-use manner.

The application allows users to monitor their financial activities in real time and gain insights into their spending habits. It helps users plan better, avoid unnecessary expenses, and achieve their financial goals.

---

# **2. Problem Statement**

Most people rely on memory, notebooks, or scattered apps to manage their finances. This leads to:

* Loss of transaction records
* No clear idea of monthly expenses
* Difficulty in budgeting
* Poor financial planning

There is a need for a centralized, simple, and reliable system that can track all financial activities and provide meaningful analysis.

---

# **3. Objectives**

The main objectives of the Personal Finance Tracker are:

* To allow users to record income and expenses
* To categorize transactions for better tracking
* To set and manage monthly budgets
* To provide spending summaries and reports
* To help users improve saving habits
* To give clear insights into financial behavior

---

# **4. Scope of the Project**

This project focuses on individual financial management. It is designed for students, working professionals, and families who want to track their money digitally. The system can be accessed through a web browser and stores all financial records securely.

---

# **5. System Overview**

The Personal Finance Tracker consists of:

* A user interface for adding and viewing transactions
* A backend server for handling requests
* A database for storing financial data

The system processes user inputs and generates financial summaries and budget reports.

---

# **6. Features**

The main features of the system are:

* User registration and login
* Add income and expense records
* Categorize transactions (Food, Rent, Travel, etc.)
* Monthly budget setting
* Expense tracking against budget
* Summary of income, expenses, and savings
* Visual reports (charts and tables)
* Secure data storage

---

# **7. User Roles**

| Role  | Description                                               |
| ----- | --------------------------------------------------------- |
| User  | Can add income, expenses, view reports, and manage budget |
                          
---

# **8. Functional Requirements**

* Users must be able to create an account
* Users must be able to log in securely
* Users must be able to add income details
* Users must be able to add expense details
* Users must be able to view monthly reports
* Users must be able to set and update budgets

---

# **9. Non-Functional Requirements**

* The system should be fast and responsive
* The system should be easy to use
* Data should be stored securely
* The system should be available 24/7
* The system should be scalable

---

# **10. Technology Stack**

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Frontend       | HTML, CSS, JavaScript / React |
| Backend        | Node.js, Express              |
| Database       | MongoDB                       |
| Authentication | JWT                           |
| Deployment     | Cloud or Local Server         |

---

# **11. Database Design**

### Users Collection

```
{
  userId,
  name,
  email,
  password,
  createdAt
}
```

### Transactions Collection

```
{
  transactionId,
  userId,
  amount,
  type (income / expense),
  category,
  date,
  description
}
```

### Budget Collection

```
{
  userId,
  month,
  year,
  totalBudget,
  createdAt
}
```

---

# **12. Advantages**

* Easy financial tracking
* Improves money management
* Reduces unnecessary spending
* Saves time compared to manual tracking
* Provides clear financial reports

---

# **13. Applications**

* Personal budgeting
* Student expense management
* Family financial planning
* Small business cash tracking

---

# **14. Future Enhancements**

* Bank account integration
* Mobile application
* AI-based spending prediction
* Bill reminders
* Tax calculation support

---

# **15. Conclusion**

The Personal Finance Tracker provides a simple and effective solution for managing money. By keeping track of income, expenses, and budgets, users can understand their financial habits and make better decisions. This system helps users stay financially disciplined and achieve long-term financial stability.

