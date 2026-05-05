# Hope, Inc. CMS — User Manual
## Version 1.0 | Sprint 3

---

## 1. Getting Started

### How to Login
1. Open the CMS at your browser
2. Enter your email and password
3. Click **Login**
4. Or click **Sign in with Google**

### How to Register
1. Click **"Register here"** on the login page
2. Fill in: First Name, Last Name, Username, Email, Password
3. Click **Register**
4. Wait for Admin to activate your account

---

## 2. Customer Management

### View Customers
- Click **👥 Customers** in the sidebar
- All active customers are displayed in a table
- Use the search bar to filter by name or pay term

### Add Customer (CUST_ADD right required)
1. Click **"+ Add Customer"** button
2. Fill in: Customer No, Name, Address, Pay Term
3. Click **Save**

### Edit Customer (CUST_EDIT right required)
1. Find the customer in the list
2. Click the **Edit** button
3. Update the fields
4. Click **Update**

### Soft Delete Customer (SUPERADMIN only)
1. Find the customer in the list
2. Click the **Delete** button
3. Confirm by clicking **"Yes, Delete"**
4. Customer becomes INACTIVE and hidden from regular users

### Recover Deleted Customer (ADMIN/SUPERADMIN only)
1. Click **🗑️ Deleted Customers** in sidebar
2. Find the customer
3. Click **Recover**
4. Customer becomes ACTIVE again

### View Customer Details
1. Click on any **Customer No** (blue link)
2. See customer profile and sales history
3. Click any transaction to see line items

---

## 3. Sales (View Only)
- Click **🧾 Sales** in sidebar
- View all 124 transactions
- Search by transaction no, customer no, or employee

---

## 4. Products (View Only)
- Click **📦 Products** in sidebar
- View all 52 products with current prices
- Search by product name or code

---

## 5. Reports

### Sales Summary
- Click **📊 Sales Summary**
- View total transactions and spend per customer
- Search by customer name

### Top Customers
- Click **🏆 Top Customers**
- View top 10 customers by total spend
- Click any customer to see their details

### Product Revenue
- Click **💰 Product Revenue**
- View total quantity sold and revenue per product

---

## 6. Admin Module (ADM_USER right required)

### User Management
- Click **⚙️ User Management**
- View all registered users
- Activate INACTIVE users
- Deactivate ACTIVE users
- SUPERADMIN rows are protected and cannot be modified

---

## 7. User Types & Rights

| Right | USER | ADMIN | SUPERADMIN |
|-------|------|-------|------------|
| View Customers | ✅ | ✅ | ✅ |
| Add Customer | ❌ | ✅ | ✅ |
| Edit Customer | ❌ | ✅ | ✅ |
| Delete Customer | ❌ | ❌ | ✅ |
| View Sales | ✅ | ✅ | ✅ |
| View Products | ✅ | ✅ | ✅ |
| View Reports | ✅ | ✅ | ✅ |
| Admin Module | ❌ | ✅ | ✅ |
| Deleted Customers | ❌ | ✅ | ✅ |