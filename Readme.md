# Carting Assessment – BuyALL Feature

This repository contains the implementation of the **BuyALL** feature for the shopping cart application as part of the technical assessment.

The goal of this task was to demonstrate frontend, backend, and UI/UX skills while working within an existing codebase.

---

## Features Implemented

### BuyALL Button
- Added a **Buy ALL** button on the cart page
- Button is enabled only when the cart contains items
- Automatically adapts to single-item carts (`Buy Now`)

### Confirmation Modal
- Displays a confirmation modal before checkout
- Shows the **total price of all cart items**
- Two actions:
  - **Yes, Buy ALL** → proceeds with checkout
  - **No, Cancel** → closes modal without changing the cart
- Fully supports **light and dark mode**

### Checkout Integration
- Sends cart data securely to the backend
- Creates a Stripe checkout session
- Redirects user to Stripe payment page on success
- Handles error states gracefully with user feedback

### Backend Validation
- Validates cart data before processing checkout
- Ensures items, quantity, and price are valid
- Handles Stripe errors safely

---

## Technical Stack

**Frontend**
- React
- Redux (state management)
- Tailwind CSS
- Fetch API

**Backend**
- Node.js
- Express
- Stripe API

---

