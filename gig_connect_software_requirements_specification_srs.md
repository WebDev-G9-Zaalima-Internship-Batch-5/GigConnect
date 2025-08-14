# GigConnect — Software Requirements Specification (SRS)

**Version:** 1.0  
**Date:** 2025-08-11  
**Author:** Niloy Das

---

## 1. Introduction

### 1.1 Purpose

This SRS describes the functional and non-functional requirements for **GigConnect**, a hyperlocal freelance marketplace web application that enables clients to find and hire local freelancers and enables freelancers to showcase skills, find nearby gigs, communicate with clients, and manage payments.

### 1.2 Scope

GigConnect is a mobile-responsive web application with the following major capabilities:

- Dual-role authentication (Client / Freelancer)
- Freelancer profile management (skills, portfolio, rates, reviews)
- Gig posting, discovery and management
- Hyperlocal search and advanced filtering
- Real-time messaging between users
- Two-way review and rating system
- Secure payments and milestone workflows (Razorpay/Stripe)
- Admin dashboard for moderation and management

This SRS covers functional requirements, non-functional requirements, external interfaces, data model overview, security, privacy, and acceptance criteria for the MVP.

### 1.3 Definitions, Acronyms, and Abbreviations

- **Client** — a user who posts gigs / hires freelancers.
- **Freelancer** — a user who offers services and bids / applies for gigs.
- **Gig** — job posting or service request from a Client.
- **MVP** — Minimum Viable Product.
- **JWT** — JSON Web Token.
- **API** — Application Programming Interface.

---

## 2. Overall Description

### 2.1 Product Perspective

GigConnect is a standalone web application (SPA) built with React.js on the frontend and Node.js + Express + MongoDB on the backend. Real-time features use Socket.IO. Payments integrate with third-party providers (Razorpay/Stripe).

### 2.2 User Classes and Characteristics

- **Anonymous Visitor** — Browses public gigs, views limited freelancer profiles.
- **Unverified User** — Can login with email and password, and request for a verification email.
- **Verified Client** — Can create gigs, invite freelancers, make payments, check payment history, rate freelancers.
- **Verified Freelancer** — Can create portfolio, apply to gigs, receive payments, rate clients.
- **Admin** — Manages users, gigs, disputes, and content moderation.

### 2.3 Operating Environment

- Backend: Node.js (LTS), Express, MongoDB (Atlas), Socket.IO, Cloudinary
- Frontend: React (Vite), Tailwind CSS
- Hosting: Render / Heroku / AWS / DigitalOcean
- Payment: Razorpay and/or Stripe
- Authentication: JWT with refresh tokens

### 2.4 Design & Implementation Constraints

- GDPR/Privacy compliance for user data (where applicable)
- PCI-DSS: avoid storing card data; use payment provider tokens
- Mobile-first responsive design
- API rate limiting to prevent abuse

### 2.5 Assumptions and Dependencies

- Users have modern browsers and internet access.
- Payment providers support the countries targeted by early release.
- Third-party services (email, SMS, payment provider) are available and configured.

---

## 3. Functional Requirements

Each requirement is labelled FR-{n}.

### 3.1 User Authentication & Authorization

- **FR-01:** Users can register as a _Client_ or _Freelancer_ with email verification.
- **FR-02:** Users can login using email/password and receive JWT access and refresh tokens.
- **FR-03:** Passwords must be stored hashed (bcrypt) and password reset via secure tokenized link.
- **FR-04:** Role-based access control — endpoints and UI features differ for Client, Freelancer, Admin.
- **FR-05:** Support OAuth login (optional/phase 2).

### 3.2 Freelancer Profile Management

- **FR-06:** Freelancers can create and edit profiles with: display name, headline, bio, skills (tagged), hourly/flat rates, portfolio links/media, service categories, availability, location (city, geo-coordinates), languages, certificates.
- **FR-07:** Freelancers can upload portfolio assets (images, pdfs, links); file size limits and virus scanning policies apply.
- **FR-08:** Profile visibility settings (public/private) and the ability to mark as currently available/unavailable.

### 3.3 Gig Posting & Management

- **FR-09:** Clients can create gigs with title, description, required skills, location (local radius), budget (fixed/hourly), start and end dates, required experience level, attachments, and optional milestone breakdown.
- **FR-10:** Clients can edit and close gigs; freelancers can submit proposals / apply.
- **FR-11:** Clients can shortlist, invite, accept, or decline applications.
- **FR-12:** The system tracks gig status: Draft, Published, In Progress, Completed, Cancelled.

### 3.4 Search & Filtering

- **FR-13:** Implement search for freelancers and gigs by keyword.
- **FR-14:** Advanced filters: skills, distance (hyperlocal radius), price range, rating, availability, tags, and languages.
- **FR-15:** Sorting options: relevance, distance, rating, newest.
- **FR-16:** Distance calculation uses geo-coordinates and supports bounding-box or radius queries (MongoDB geospatial index).

### 3.5 Real-time Messaging

- **FR-17:** Real-time 1:1 chat between Client and Freelancer using Socket.IO with message persistence in DB.
- **FR-18:** Chat features: read receipts, typing indicator, message timestamps, and file attachments (subject to size/type limits).
- **FR-19:** Chat notifications (in-app & push/email optional) for new messages.

### 3.6 Review & Rating System

- **FR-20:** After gig completion, both parties can rate (1–5 stars) and leave textual reviews.
- **FR-21:** Reviews are immutable once submitted; moderation flow for dispute/reports.
- **FR-22:** Aggregate rating displayed on freelancer and client profiles.

### 3.7 Payments & Milestones

- **FR-23:** Secure payment flow via Razorpay/Stripe for one-off and milestone-based payments.
- **FR-24:** Escrow-like behavior: client funds milestones; funds released to freelancer on milestone completion/acceptance.
- **FR-25:** Transaction history for users and refunds/dispute handling API endpoints.
- **FR-26:** Webhooks handle payment events and update gig/payment statuses.

### 3.8 Notifications

- **FR-27:** In-app notifications for proposals, messages, payment events, gig status changes.
- **FR-28:** Email templates for critical events (registration, password reset, payment receipts).

### 3.9 Admin Features

- **FR-29:** Admin dashboard to view and manage users, gigs, reports, payments, and content moderation.
- **FR-30:** Admin can suspend/ban users, remove content, and issue refunds (via payment provider integrations).

---

## 4. Non-Functional Requirements

### 4.1 Security

- **NFR-01:** All traffic must be HTTPS.
- **NFR-02:** Use JWTs with short-lived access tokens and refresh tokens stored securely (HttpOnly cookies or secure storage).
- **NFR-03:** Role-based authorization checks on all API endpoints.
- **NFR-04:** Input validation and sanitization to prevent XSS/SQL/NoSQL injection.
- **NFR-05:** Rate limiting and brute-force protections on auth endpoints.
- **NFR-06:** Logging and monitoring of security events.

### 4.2 Privacy & Data Protection

- **NFR-07:** Comply with local privacy laws; provide account deletion and data-export features.
- **NFR-08:** Personal data minimization and retention policy.

### 4.3 Performance & Scalability

- **NFR-09:** API responses for core endpoints should return within 300–500 ms under normal load.
- **NFR-10:** Support horizontal scaling: stateless backend servers, shared session/DB.
- **NFR-11:** Use CDN for static assets.

### 4.4 Availability & Reliability

- **NFR-12:** Target 99.9% uptime for user-facing APIs (excluding scheduled maintenance).
- **NFR-13:** Implement retry/backoff for external service calls (payments, email).

### 4.5 Usability

- **NFR-14:** Mobile-first responsive UI; accessible (WCAG AA) basics.
- **NFR-15:** Onboarding flows for both roles with tooltips and help.

---

## 5. External Interfaces

### 5.1 User Interfaces (UI)

- Responsive web UI built in React.
- Core screens: Landing, Sign up / Login, Dashboard (Client/Freelancer), Gig creation, Gig feed, Profile, Chat, Payments, Admin panel.

### 5.2 APIs

- RESTful JSON APIs (versioned, e.g., `/api/v1/`) for all server functionality.
- WebSocket endpoint for real-time messaging (e.g., `/socket.io`).

### 5.3 Third-party Services

- Payment providers: Razorpay and/or Stripe.
- Email provider: NodeMailer (Can switch to SendGrid or Mailgun etc. later).
- Optional: SMS gateway for OTPs.
- CDN / Cloud storage for uploads (Cloudinary).

---

## 6. Data Model (Overview)

Initial schema overview (MongoDB collections):
**_Note: This is just the initial schema overview. The schema is subject to change based on the final design and requirements._**

### 6.1 User Model

- **Purpose**: Central authentication and basic user information
- **Key Fields**:
  - Authentication: email, password (hashed), refreshTokens
  - Profile: fullName, phone, avatar
  - Location: address, city, state, country, pincode, geo-coordinates
  - Account Status: isVerified, isActive, verification details
  - Role: client, freelancer, or admin
  - Timestamps: createdAt, updatedAt, lastLogin

### 6.2 Client Profile Model

- **Purpose**: Extended profile for clients posting gigs
- **Key Fields**:
  - Company Information: companyName, companyWebsite, businessType, industryType
  - Project Stats: projectsPosted, totalSpent, activeGigs, completedProjects
  - Ratings: clientRating, totalReviews
  - Preferences: preferredBudgetRange, communicationPreferences
  - Verification: verifiedPayment status

### 6.3 Freelancer Profile Model

- **Purpose**: Comprehensive professional profile for freelancers
- **Key Fields**:
  - Professional Details: title, bio, skills, hourlyRate, availability
  - Portfolio: projects with descriptions and media
  - Experience: work history with companies and positions
  - Education: academic qualifications
  - Certifications: professional certifications
  - Performance Metrics: rating, totalReviews, completedGigs, totalEarnings
  - Work Preferences: remote work, travel willingness, project duration
  - Social Links: LinkedIn, GitHub, etc.

### 6.4 Gig Model

- **Purpose**: Job postings created by clients
- **Key Fields**:
  - Basic Info: title, description, category, subCategory
  - Requirements: skillsRequired, experienceLevel
  - Budget: type (fixed/hourly), amount, currency
  - Timeline: duration, expectedStartDate, deadline
  - Location: address details and geo-coordinates (for proximity search)
  - Status: open, in_progress, completed, cancelled
  - Metadata: applicationsCount, viewsCount, isUrgent, isFeatured
  - Project Details: requirements, deliverables, projectComplexity

### 6.5 Application Model

- **Purpose**: Freelancer applications for gigs
- **Key Fields**:
  - Applicant details (freelancer reference)
  - Gig reference
  - Proposal details
  - Status tracking
  - Cover letter and attachments

### 6.6 Contract Model

- **Purpose**: Formal agreements between clients and freelancers
- **Key Fields**:
  - Parties involved (client and freelancer references)
  - Gig details
  - Terms and conditions
  - Milestones and payments
  - Status tracking

### 6.7 Review Model

- **Purpose**: Feedback and ratings between clients and freelancers
- **Key Fields**:
  - Reviewer and reviewee references
  - Rating and written feedback
  - Project reference
  - Timestamp

### 6.8 Payment Model

- **Purpose**: Financial transaction records
- **Key Fields**:
  - Payer and payee references
  - Amount and currency
  - Payment method
  - Status and timestamps
  - Related contract/gig reference

### 6.9 Messaging System

- **Conversation Model**: Threads between users
- **Message Model**: Individual messages within conversations

### 6.10 Notification Model

- **Purpose**: System and user notifications
- **Key Fields**:
  - Recipient
  - Type (message, application update, etc.)
  - Status (read/unread)
  - Action link
  - Timestamp

### 6.11 Relationships

- Users have one-to-one relationships with ClientProfile or FreelancerProfile based on role
- Clients have one-to-many relationships with Gigs
- Gigs have many Applications
- Contracts are created from successful Applications
- Reviews can be left by both Clients and Freelancers after contract completion
- Payments are linked to Contracts and their Milestones

### 6.12 Data Integrity & Indexes

- Unique indexes on email, usernames
- Geospatial indexes for location-based searches
- Compound indexes for common query patterns
- Referential integrity through MongoDB references
- Timestamps for auditing and analytics

---

## 7. Security & Privacy Considerations

- Encrypt sensitive data in transit (TLS) and at rest where required.
- Do not store raw payment card data — use payment provider tokens.
- Implement consent checkboxes for public profile visibility and email communications.
- Admin activity logs and audit trails for moderation and refunds.

---

## 8. Acceptance Criteria & Test Cases (High Level)

- Users can register and login, and receive valid JWTs (FR-01/02).
- Freelancer profile creation displays correctly in search results (FR-06/13).
- Client can post a gig and receive applications (FR-09/11).
- Chat messages sent are persisted and delivered in realtime (FR-17).
- Payment flows succeed via provider sandbox and update transaction status (FR-23/26).
- Reviews affect overall rating and are displayed on profiles (FR-20/21).
- Admin can suspend users and remove content (FR-29).

---

## 9. API Endpoints (MVP — Sample)

**_Note: This is just the initial API endpoints design. The API endpoints are subject to change based on the final design and requirements._**

---

### **User & Authentication APIs**

- `POST /api/v1/users/register` — register user (role-based)
- `POST /api/v1/users/login` — login user
- `POST /api/v1/users/verify-email` — verify user email
- `POST /api/v1/users/resend-verification-email` — resend verification email
- `GET /api/v1/users/get-current-user` — get current authenticated user
- `POST /api/v1/users/forgot-password` — request password reset
- `POST /api/v1/users/reset-password` — reset password
- `POST /api/v1/users/logout` — logout user
- `PATCH /api/v1/users/update-profile` — update basic profile details
- `PATCH /api/v1/users/update-avatar` — update profile picture
- `PATCH /api/v1/users/change-password` — change password (authenticated)
- `DELETE /api/v1/users/delete-account` — delete user account

---

### **Client Profile APIs**

- `PATCH /api/v1/client/update-profile` — update client profile
- `GET /api/v1/client/my-gigs` — list gigs posted by authenticated client

---

### **Freelancer Profile APIs**

- `PATCH /api/v1/freelancer/update-profile` — update freelancer profile
- `GET /api/v1/freelancer/search` — search freelancers by skills, rating, etc.
- `GET /api/v1/freelancer/my-applications` — list applications submitted by authenticated freelancer
- `GET /api/v1/freelancer/my-gigs` — list gigs of authenticated freelancer

---

### **Gig APIs**

- `POST /api/v1/gigs` — create a new gig (client only)
- `GET /api/v1/gigs` — list gigs (with filters, pagination)
- `GET /api/v1/gigs/:id` — get gig details
- `PATCH /api/v1/gigs/:id` — update gig (client only)
- `DELETE /api/v1/gigs/:id` — delete gig (client only)
- `GET /api/v1/gigs/:gigId/applications` — list applications for a gig

---

### **Application APIs**

- `POST /api/v1/application` — apply to a gig (freelancer only)
- `GET /api/v1/application/:id` — get application details
- `PATCH /api/v1/application/:id/status` — update application status (client only)

---

### **Contract APIs**

- `POST /api/v1/contract` — create contract from accepted application
- `GET /api/v1/contract/:id` — get contract details
- `PATCH /api/v1/contract/:id/status` — update contract status (e.g., in_progress, completed)
- `GET /api/v1/contract/my-contracts` — list authenticated user’s contracts

---

### **Review APIs**

- `POST /api/v1/review` — create review for a completed contract
- `GET /api/v1/review/:id` — get review details
- `GET /api/v1/users/:userId/review` — get all reviews for a user

---

### **Payment APIs**

- `POST /api/v1/payment` — initiate payment for milestone/contract
- `GET /api/v1/payment/:id` — get payment details
- `GET /api/v1/contracts/:contractId/payment` — list payments for a contract
- `PATCH /api/v1/payment/:id/status` — update payment status

---

### **Messaging APIs**

- `POST /api/v1/conversations` — start a new conversation
- `GET /api/v1/conversations` — list user conversations
- `GET /api/v1/conversations/:id/messages` — get messages in a conversation
- `POST /api/v1/conversations/:id/messages` — send a message
- `PATCH /api/v1/messages/:id` — edit a message
- `DELETE /api/v1/messages/:id` — delete a message

---

## **Notification APIs**

- `GET /api/v1/notifications` — list notifications
- `PATCH /api/v1/notifications/:id/mark-read` — mark a notification as read
- `DELETE /api/v1/notifications/:id` — delete a notification

---

## **Search & Discovery APIs**

- `GET /api/v1/search/gigs` — search gigs with filters
- `GET /api/v1/search/freelancers` — search freelancers
- `GET /api/v1/search/clients` — search clients

---

_End of SRS v1.0_
