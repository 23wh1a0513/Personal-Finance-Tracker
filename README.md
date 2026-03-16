# Personal Finance Tracker

A comprehensive web-based application for managing personal finances with full CRUD operations, built with React frontend and Node.js/Express backend, using MongoDB Atlas for data storage.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration
- **Transaction Management**: Add, edit, delete, and view income/expense records
- **Budget Planning**: Create and manage monthly budgets with category breakdowns
- **Financial Reports**: Generate insights with filtering and summaries
- **Real-time Dashboard**: Overview of financial health with key metrics
- **Responsive UI**: Modern React interface that works on all devices
- **Secure Data Storage**: MongoDB Atlas cloud database with encrypted connections

## 🛠️ Technology Stack

### Frontend
- **React** - UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS** - Custom styling for responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Database Schema
- **Users**: Authentication and profile data
- **Finances**: Income/expense transactions with categories
- **Budgets**: Monthly budget planning with category allocations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/23wh1a0513/Personal-Finance-Tracker.git
cd Personal-Finance-Tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your MongoDB Atlas connection string:
```env
DATABASE_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Start Backend:**
```bash
cd backend
npm start
```
Server will run on `http://localhost:5000`

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Register**: Create a new account or use test credentials
2. **Login**: Access your personal dashboard
3. **Add Transactions**: Record income and expenses with categories
4. **Set Budgets**: Create monthly budgets for different categories
5. **View Reports**: Analyze spending patterns and financial health
6. **Track Progress**: Monitor savings and budget adherence

### Test Credentials
- **Email**: `alice@gmail.com` or `bob@gmail.com`
- **Password**: `password123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Transactions
- `GET /api/finances` - Get all user transactions
- `POST /api/finances` - Create new transaction
- `PUT /api/finances/:id` - Update transaction
- `DELETE /api/finances/:id` - Delete transaction
- `GET /api/finances/summary/monthly` - Monthly financial summary

### Budgets
- `GET /api/budgets` - Get all user budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data stored securely
- **CORS**: Configured for secure cross-origin requests

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database services
- React community for excellent documentation
- Express.js for robust backend framework

---

## Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Bank account integration
- [ ] AI-powered spending predictions
- [ ] Bill reminders and notifications
- [ ] Tax calculation support
- [ ] Multi-currency support
- [ ] Data export (PDF/Excel)
- [ ] Dark mode theme
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

