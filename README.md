# Mossy Creations - E-commerce Website

Mossy Creations is a unique e-commerce website that specializes in moss-related crafts, offering products from decorative moss arrangements to moss-based DIY kits. Our platform is built using React.js, MongoDB, Express, Apollo GraphQL, and Stripe for a seamless, user-friendly shopping experience.

### Visit the site:
[Mossy Creations Website](https://www.mossy-creations.com/)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Installation](#installation)
- [Setup](#setup)
- [License](#license)

---

## Tech Stack

- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **GraphQL:** Apollo Client/Server
- **Payment Integration:** Stripe API
- **Authentication:** JWT (JSON Web Tokens), Bcrypt
- **Email Automation:** Nodemailer

---

## Features

### Frontend

- **Homepage:**
  
  ![homePage](https://github.com/user-attachments/assets/2a3dd4c6-6020-4c0c-bd30-e560a2174d53)

  - Product listing display with images, descriptions, and prices.
  - "Add to Cart" option.
  - Easy navigation to various product categories via menu button.
  
- **User Authentication:**
  - Account creation and login for users.
  - Password reset functionality via automated email.
  
- **Cart:**
- 
  ![cart](https://github.com/user-attachments/assets/e5c9622e-7803-4d9b-bb3d-fa6ffca59472)

  - Dynamic cart system allowing users to add or remove products.
  - Cart persists even after user login/logout.
  
- **Checkout:**
- 
  ![Checkout](https://github.com/user-attachments/assets/9cf8cd15-91f2-4078-b880-7137d951df80)

  - Secure Stripe integration for handling payments.
  - Users can enter shipping details and review order before completing the purchase.
  
- **Profile Page:**
  
  ![orderHistory](https://github.com/user-attachments/assets/e627a6b7-7804-4523-9d2d-b328363eeb77)


  - Option to change password.
  - View order history with tracking information.
  - Ability to leave reviews for previously purchased products.
  
- **Product Pages:**
- 
  ![productPage1](https://github.com/user-attachments/assets/934970ed-c7c6-494d-aff4-15f7f2577d1b) ![productPage2](https://github.com/user-attachments/assets/c7943470-aa25-4b1e-a2c1-5ffd328c87e6)

  
  - Each product includes a detailed description, price, and user reviews.
  - Option to add reviews for products.
  - “Add to Cart” and “Buy Now” buttons for quick purchase.

- **Contact Page:**
  - A brief summary about the site owner. 
  - FAQ section with common inquiries about products, shipping, and returns.

### Backend

- **User Model:**
  - User registration, login, and account management.
  - JWT authentication for secure access to protected routes (e.g., profile page, admin panel).
  
- **Product Model:**
  - MongoDB model to manage product data, including price and description.
  - Integration with Stripe for handling price IDs for products.
  
- **Order Model:**
  - Manage orders, including user details, product list, and order status (fulfilled/unfulfilled).
  - Integration with Stripe for payment processing.
  
- **Reviews:**
  - System for users to leave product reviews, which are displayed on the product page.
  
- **Email System:**
  - Automated email notifications for:
    - Order confirmations.
    - Password reset requests.
    - Shipping tracking number updates (automatically sent when updated in the admin panel).
  
- **Admin Panel (Restricted to Admins):**

 ![adminHome](https://github.com/user-attachments/assets/1c948e31-5b35-46bb-9b74-88e54ba58705) ![adminProduct](https://github.com/user-attachments/assets/4d348110-e48a-4708-baac-bad168482b20) ![orderTracking2](https://github.com/user-attachments/assets/bb827092-60d6-4fdf-b578-5d5a9904a0f7)


  - Admins can add/edit products, view and manage orders, and send shipping tracking numbers.
  - Manage product inventory and details through an easy-to-use interface.

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mossy-creations.git
   ```

2. **Navigate into the project folder:**
   ```bash
   cd mossy-creations
   ```

3. **Install all dependencies (frontend & backend) using `concurrently`:**
   ```bash
   npm run install
   ```
   This will install both the frontend and backend dependencies simultaneously.

4. **Run the development environment:**
   In the root directory, run the following command to start both the frontend and backend simultaneously using `concurrently`:
   ```bash
   npm run develop
   ```

5. **Visit the site:**
   Follow the setup instruction below

## Setup

Before running the app, ensure you’ve set up the necessary environment variables. You will need to create `.env` files in both the `client` and `server` directories.

### Server Environment Variables (`server/.env`):
```bash
MONGODB_URI=<Your MongoDB connection string (for production if you are not using local compass)>
SECRET_JWT=<Your secret JWT key>
STRIPE_SECRET_KEY=<Your Stripe secret key>
STRIPE_WEBHOOK_SECRET=<Your Stripe webhook secret key>
DOMAIN_URL=<Your frontend server URL with port (e.g., "http://localhost:3000")>
EMAIL_PASS_SECRET=<Your email account password>
EMAIL_USER=<Your email>
EMAIL_SMTP=<The SMTP server of your email>
```

### Client Environment Variables (`client/.env`):
```bash
VITE_API_SERVER_URL=<Your server URL with port (e.g., "http://localhost:3001")>
VITE_API_CHECKOUT_URL=<Your checkout URL (e.g., "http://localhost:3001/create-checkout-session")>
VITE_API_STRIPEPUBLIC_KEY=<Your Stripe public key>
```

### Start the server using `concurrently`:
```bash
npm run develop
```

Now, visit [http://localhost:3000](http://localhost:3000) in your browser to view the site.

## License
This project is licensed under the MIT License - see the LICENSE file for details.





