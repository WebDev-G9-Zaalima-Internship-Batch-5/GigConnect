# Project - "GigConnect": A Hyperlocal Freelance Marketplace

**Problem Statement:** _To create a streamlined platform that connects local communities with skilled
freelancers, enabling clients to easily find and hire local talent for specific services while providing
freelancers with a platform to showcase their skills and find nearby job opportunities._

**Use Case:** Develop a mobile-responsive web application where users can register as either a client or a
freelancer. Clients can post job listings (gigs), search for freelancers based on skill and location, and
manage payments securely. Freelancers can create detailed profiles, browse and apply for local gigs, and
communicate with clients directly through the platform.

**Key Modules:**

- **Dual-Role User Authentication:** Secure registration and login for both "Client" and "Freelancer"
  roles using JWT.

- **Freelancer Profile Management:** Detailed profiles with skills, portfolio, service rates, and user
  reviews.

- **Gig Posting & Management:** Clients can create, edit, and manage job postings with clear
  requirements.

- **Advanced Search & Filtering:** Hyperlocal search functionality with filters for skills, location, price
  range, and ratings.

- **Real-time Messaging System:** Integrated chat for seamless communication between clients and
  freelancers.

- **Review & Rating System:** A two-way feedback system to build trust and reputation.

- **Secure Payment Integration:** Integration with Razorpay/Stripe for secure transactions and
  milestone payments.

**Week-wise Development Plan:**

| Week                 | Backend (Node.js + Express)                                                                                        | Frontend (React.js)                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Week 1               | Setup JWT Authentication for dual roles (Client/Freelancer), build APIs for user profiles and gig postings (CRUD). | Create React setup, build UI for login/registration, freelancer profile pages, and the gig posting form.       |
| Week 2               | Develop backend logic for advanced search, filtering APIs, and set up real-time chat with Socket.IO.               | Implement the main gig feed with search and filter functionality, and build the real-time messaging interface. |
| Mid Project Review   | Core APIs for users, gigs, and search are functional. Real-time chat is initiated.                                 | Users can register, create profiles, post gigs, and search for freelancers. Basic chat UI is in place.         |
| Week 3               | Implement the review and rating system APIs. Develop APIs for secure payment workflow.                             | Build the UI for submitting and displaying reviews. Integrate the payment gateway on the frontend.             |
| Week 4               | Create Admin dashboard APIs for managing users and gigs. Conduct final API testing and cleanup.                    | Develop the Admin panel UI. Perform final UI polishing and ensure the application is fully responsive.         |
| Final Project Review | All modules including payments, reviews, and chat are fully functional and secure.                                 | A complete, responsive frontend with a seamless user experience for both clients and freelancers.              |
