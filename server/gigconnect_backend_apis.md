# GigConnect Backend APIs - Complete List

## 🔐 Authentication & Authorization APIs

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user (client/freelancer) | No |
| POST | `/login` | User login with email/password | No |
| POST | `/logout` | User logout (invalidate token) | Yes |
| POST | `/refresh` | Refresh JWT token | Yes |
| POST | `/forgot-password` | Send password reset email | No |
| POST | `/reset-password` | Reset password with token | No |
| POST | `/verify-email` | Verify email address | No |
| POST | `/resend-verification` | Resend verification email | No |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/change-password` | Change user password | Yes |

---

## 👤 User Management APIs

### User Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| POST | `/upload-avatar` | Upload profile picture | Yes |
| DELETE | `/avatar` | Delete profile picture | Yes |
| GET | `/location/nearby` | Find nearby users | Yes |
| PUT | `/location` | Update user location | Yes |
| GET | `/dashboard` | Get user dashboard data | Yes |
| DELETE | `/account` | Delete user account | Yes |

---

## 💼 Freelancer Profile APIs

### Freelancer Routes (`/api/freelancers`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/profile` | Create freelancer profile | Yes (Freelancer) |
| GET | `/profile` | Get own freelancer profile | Yes (Freelancer) |
| PUT | `/profile` | Update freelancer profile | Yes (Freelancer) |
| GET | `/profile/:id` | Get public freelancer profile | No |
| POST | `/portfolio` | Add portfolio item | Yes (Freelancer) |
| PUT | `/portfolio/:id` | Update portfolio item | Yes (Freelancer) |
| DELETE | `/portfolio/:id` | Delete portfolio item | Yes (Freelancer) |
| POST | `/experience` | Add work experience | Yes (Freelancer) |
| PUT | `/experience/:id` | Update work experience | Yes (Freelancer) |
| DELETE | `/experience/:id` | Delete work experience | Yes (Freelancer) |
| POST | `/certifications` | Add certification | Yes (Freelancer) |
| PUT | `/certifications/:id` | Update certification | Yes (Freelancer) |
| DELETE | `/certifications/:id` | Delete certification | Yes (Freelancer) |
| GET | `/search` | Search freelancers | No |
| GET | `/featured` | Get featured freelancers | No |
| GET | `/top-rated` | Get top-rated freelancers | No |

---

## 💰 Gig Management APIs

### Gig Routes (`/api/gigs`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new gig | Yes (Client) |
| GET | `/` | Get all gigs (with filters) | No |
| GET | `/my-gigs` | Get user's posted gigs | Yes (Client) |
| GET | `/:id` | Get gig by ID | No |
| PUT | `/:id` | Update gig | Yes (Client/Owner) |
| DELETE | `/:id` | Delete gig | Yes (Client/Owner) |
| POST | `/:id/view` | Increment gig view count | No |
| GET | `/search` | Advanced gig search | No |
| GET | `/nearby` | Get nearby gigs | Yes |
| GET | `/categories` | Get all gig categories | No |
| GET | `/featured` | Get featured gigs | No |
| POST | `/:id/save` | Save/bookmark gig | Yes |
| DELETE | `/:id/save` | Remove saved gig | Yes |
| GET | `/saved` | Get user's saved gigs | Yes |

---

## 📝 Application Management APIs

### Application Routes (`/api/applications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit application to gig | Yes (Freelancer) |
| GET | `/my-applications` | Get freelancer's applications | Yes (Freelancer) |
| GET | `/gig/:gigId` | Get applications for a gig | Yes (Client/Owner) |
| GET | `/:id` | Get application details | Yes (Authorized) |
| PUT | `/:id` | Update application | Yes (Freelancer/Owner) |
| DELETE | `/:id` | Withdraw application | Yes (Freelancer/Owner) |
| POST | `/:id/accept` | Accept application | Yes (Client) |
| POST | `/:id/reject` | Reject application | Yes (Client) |
| GET | `/stats` | Get application statistics | Yes |

---

## 📋 Contract Management APIs

### Contract Routes (`/api/contracts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create contract from application | Yes (Client) |
| GET | `/` | Get user's contracts | Yes |
| GET | `/:id` | Get contract details | Yes (Authorized) |
| PUT | `/:id` | Update contract terms | Yes (Authorized) |
| POST | `/:id/start` | Start contract | Yes (Both parties) |
| POST | `/:id/complete` | Mark contract complete | Yes (Client) |
| POST | `/:id/cancel` | Cancel contract | Yes (Authorized) |
| POST | `/:id/dispute` | Raise dispute | Yes (Authorized) |
| GET | `/:id/milestones` | Get contract milestones | Yes (Authorized) |
| POST | `/:id/milestones` | Add milestone | Yes (Client) |
| PUT | `/:id/milestones/:milestoneId` | Update milestone | Yes (Authorized) |
| POST | `/:id/milestones/:milestoneId/complete` | Mark milestone complete | Yes (Freelancer) |
| POST | `/:id/extend` | Extend contract deadline | Yes (Both parties) |

---

## 💳 Payment Management APIs

### Payment Routes (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/initiate` | Initiate payment | Yes (Client) |
| POST | `/webhook/razorpay` | Razorpay webhook | No |
| POST | `/webhook/stripe` | Stripe webhook | No |
| GET | `/history` | Get payment history | Yes |
| GET | `/:id` | Get payment details | Yes (Authorized) |
| POST | `/:id/refund` | Process refund | Yes (Admin) |
| GET | `/analytics` | Get payment analytics | Yes |
| POST | `/verify` | Verify payment status | Yes |
| GET | `/methods` | Get available payment methods | Yes |
| POST | `/milestone/:milestoneId` | Pay for milestone | Yes (Client) |

---

## ⭐ Review & Rating APIs

### Review Routes (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit review | Yes (Authorized) |
| GET | `/user/:userId` | Get reviews for user | No |
| GET | `/contract/:contractId` | Get reviews for contract | Yes (Authorized) |
| GET | `/:id` | Get review details | No |
| PUT | `/:id` | Update review | Yes (Owner) |
| DELETE | `/:id` | Delete review | Yes (Owner/Admin) |
| POST | `/:id/report` | Report inappropriate review | Yes |
| GET | `/stats/:userId` | Get user review statistics | No |
| GET | `/pending` | Get pending reviews | Yes |

---

## 💬 Messaging & Communication APIs

### Conversation Routes (`/api/conversations`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user conversations | Yes |
| POST | `/` | Create new conversation | Yes |
| GET | `/:id` | Get conversation details | Yes (Participant) |
| PUT | `/:id` | Update conversation | Yes (Participant) |
| DELETE | `/:id` | Delete conversation | Yes (Participant) |
| POST | `/:id/archive` | Archive conversation | Yes (Participant) |
| GET | `/:id/messages` | Get conversation messages | Yes (Participant) |
| POST | `/:id/messages` | Send message | Yes (Participant) |
| PUT | `/:id/read` | Mark messages as read | Yes (Participant) |

### Message Routes (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:id` | Get message details | Yes (Participant) |
| PUT | `/:id` | Edit message | Yes (Sender) |
| DELETE | `/:id` | Delete message | Yes (Sender) |
| POST | `/:id/read` | Mark message as read | Yes (Recipient) |
| POST | `/upload` | Upload message attachment | Yes |

---

## 🔔 Notification APIs

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | Yes |
| GET | `/unread` | Get unread notifications | Yes |
| PUT | `/:id/read` | Mark notification as read | Yes (Owner) |
| PUT | `/mark-all-read` | Mark all notifications as read | Yes |
| DELETE | `/:id` | Delete notification | Yes (Owner) |
| POST | `/preferences` | Update notification preferences | Yes |
| GET | `/preferences` | Get notification preferences | Yes |

---

## 🔍 Search APIs

### Search Routes (`/api/search`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/gigs` | Search gigs with filters | No |
| GET | `/freelancers` | Search freelancers with filters | No |
| GET | `/suggestions` | Get search suggestions | No |
| GET | `/popular` | Get popular search terms | No |
| GET | `/filters` | Get available filter options | No |
| POST | `/save` | Save search query | Yes |
| GET | `/saved` | Get saved searches | Yes |
| DELETE | `/saved/:id` | Delete saved search | Yes |

---

## 📊 Analytics & Reporting APIs

### Analytics Routes (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Get user dashboard analytics | Yes |
| GET | `/gigs/performance` | Get gig performance metrics | Yes (Client) |
| GET | `/freelancer/earnings` | Get freelancer earnings | Yes (Freelancer) |
| GET | `/freelancer/performance` | Get freelancer performance | Yes (Freelancer) |
| GET | `/market/trends` | Get market trends | Yes |
| GET | `/revenue` | Get revenue analytics | Yes (Admin) |
| GET | `/users/activity` | Get user activity metrics | Yes (Admin) |

---

## 🛠️ Admin APIs

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Get admin dashboard | Yes (Admin) |
| GET | `/users` | Get all users with pagination | Yes (Admin) |
| GET | `/users/:id` | Get user details | Yes (Admin) |
| PUT | `/users/:id/status` | Update user status | Yes (Admin) |
| DELETE | `/users/:id` | Delete user account | Yes (Admin) |
| GET | `/gigs` | Get all gigs for moderation | Yes (Admin) |
| PUT | `/gigs/:id/status` | Update gig status | Yes (Admin) |
| DELETE | `/gigs/:id` | Delete gig | Yes (Admin) |
| GET | `/reviews/reported` | Get reported reviews | Yes (Admin) |
| PUT | `/reviews/:id/moderate` | Moderate review | Yes (Admin) |
| GET | `/payments/disputes` | Get payment disputes | Yes (Admin) |
| POST | `/payments/:id/resolve` | Resolve payment dispute | Yes (Admin) |
| GET | `/analytics/platform` | Get platform analytics | Yes (Admin) |
| POST | `/announcements` | Create platform announcement | Yes (Admin) |
| GET | `/reports` | Generate platform reports | Yes (Admin) |

---

## 🌐 General Utility APIs

### Utility Routes (`/api/utils`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload/image` | Upload image file | Yes |
| POST | `/upload/document` | Upload document file | Yes |
| DELETE | `/upload/:fileId` | Delete uploaded file | Yes |
| GET | `/location/cities` | Get cities list | No |
| GET | `/location/states` | Get states list | No |
| GET | `/skills` | Get available skills list | No |
| GET | `/categories` | Get gig categories | No |
| POST | `/contact` | Contact form submission | No |
| GET | `/health` | API health check | No |
| GET | `/version` | Get API version | No |

---

## 🔄 Real-time Socket Events

### Socket.IO Events
| Event | Description | Auth Required |
|-------|-------------|---------------|
| `connection` | User connects to socket | Yes |
| `disconnect` | User disconnects | Yes |
| `join_conversation` | Join conversation room | Yes |
| `leave_conversation` | Leave conversation room | Yes |
| `send_message` | Send real-time message | Yes |
| `message_received` | Receive new message | Yes |
| `typing_start` | User starts typing | Yes |
| `typing_stop` | User stops typing | Yes |
| `message_read` | Message read notification | Yes |
| `notification` | Real-time notification | Yes |
| `gig_update` | Gig status update | Yes |
| `application_update` | Application status update | Yes |
| `user_online` | User online status | Yes |
| `user_offline` | User offline status | Yes |

---

## 📋 API Summary

### Total API Endpoints: **120+**

**By Category:**
- **Authentication**: 10 endpoints
- **User Management**: 8 endpoints  
- **Freelancer Profiles**: 15 endpoints
- **Gig Management**: 15 endpoints
- **Applications**: 9 endpoints
- **Contracts**: 13 endpoints
- **Payments**: 10 endpoints
- **Reviews**: 9 endpoints
- **Messaging**: 13 endpoints
- **Notifications**: 7 endpoints
- **Search**: 8 endpoints
- **Analytics**: 7 endpoints
- **Admin**: 15 endpoints
- **Utilities**: 10 endpoints
- **Socket Events**: 14 events

### Key Features Covered:
✅ **JWT Authentication** with role-based access  
✅ **Hyperlocal Search** with geospatial queries  
✅ **Real-time Messaging** with Socket.IO  
✅ **Payment Integration** with webhooks  
✅ **File Upload** capabilities  
✅ **Advanced Filtering** and search  
✅ **Two-way Review** system  
✅ **Milestone-based** payments  
✅ **Admin Dashboard** functionality  
✅ **Notification System** with preferences  
✅ **Analytics & Reporting**  
✅ **Complete CRUD** operations for all entities

### Security Features:
- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- Rate limiting capabilities
- File upload security
- Payment webhook verification
- SQL injection prevention
- XSS protection