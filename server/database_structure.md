# GigConnect Database Structure

## Collections Overview

| Collection             | Purpose                                   | Key Relations                              |
| ---------------------- | ----------------------------------------- | ------------------------------------------ |
| **users**              | Core user authentication and profile data | Referenced by all other collections        |
| **freelancerprofiles** | Extended profile data for freelancers     | One-to-One with users (freelancer role)    |
| **gigs**               | Job postings created by clients           | Many-to-One with users (clients)           |
| **applications**       | Freelancer applications to gigs           | Many-to-One with gigs, users (freelancers) |
| **contracts**          | Active work agreements                    | One-to-One with applications when accepted |
| **payments**           | Payment transactions and milestones       | Many-to-One with contracts                 |
| **reviews**            | Two-way feedback system                   | One-to-One per user per contract           |
| **conversations**      | Chat containers between users             | Many-to-Many with users                    |
| **messages**           | Individual chat messages                  | Many-to-One with conversations             |
| **notifications**      | System notifications for users            | Many-to-One with users                     |

---

## Detailed Collection Structure

### 1. **users** Collection

**Purpose:** Core user authentication and basic profile information

| Field      | Type     | Description                     | Indexes                |
| ---------- | -------- | ------------------------------- | ---------------------- |
| \_id       | ObjectId | Primary key                     | Primary                |
| email      | String   | Unique email address            | Unique                 |
| password   | String   | Hashed password                 | -                      |
| role       | Enum     | 'client', 'freelancer', 'admin' | -                      |
| firstName  | String   | User's first name               | -                      |
| lastName   | String   | User's last name                | -                      |
| phone      | String   | Phone number (optional)         | -                      |
| avatar     | String   | Profile picture URL             | -                      |
| location   | Object   | Address with coordinates        | 2dsphere (coordinates) |
| isVerified | Boolean  | Email verification status       | -                      |
| isActive   | Boolean  | Account active status           | -                      |
| lastLogin  | Date     | Last login timestamp            | -                      |
| createdAt  | Date     | Account creation date           | -                      |
| updatedAt  | Date     | Last update timestamp           | -                      |

---

### 2. **freelancerprofiles** Collection

**Purpose:** Extended profile information for freelancers

| Field             | Type     | Description                    | Indexes            |
| ----------------- | -------- | ------------------------------ | ------------------ |
| \_id              | ObjectId | Primary key                    | Primary            |
| userId            | ObjectId | Reference to users collection  | Unique             |
| title             | String   | Professional headline          | -                  |
| bio               | String   | Professional summary           | -                  |
| skills            | [String] | Array of skills                | Index              |
| hourlyRate        | Number   | Hourly rate in local currency  | Index              |
| availability      | String   | Current availability status    | -                  |
| portfolio         | [Object] | Array of portfolio items       | -                  |
| experience        | [Object] | Work experience array          | -                  |
| certifications    | [Object] | Professional certifications    | -                  |
| languages         | [Object] | Languages and proficiency      | -                  |
| rating            | Number   | Average rating (0-5)           | Index (descending) |
| totalReviews      | Number   | Total number of reviews        | -                  |
| completedGigs     | Number   | Successfully completed gigs    | -                  |
| responseTime      | Number   | Average response time in hours | -                  |
| isProfileComplete | Boolean  | Profile completion status      | -                  |

---

### 3. **gigs** Collection

**Purpose:** Job postings created by clients

| Field             | Type     | Description                                     | Indexes                |
| ----------------- | -------- | ----------------------------------------------- | ---------------------- |
| \_id              | ObjectId | Primary key                                     | Primary                |
| clientId          | ObjectId | Reference to users (client)                     | Index                  |
| title             | String   | Gig title                                       | -                      |
| description       | String   | Detailed job description                        | -                      |
| category          | String   | Job category                                    | Index                  |
| skillsRequired    | [String] | Required skills array                           | Index                  |
| budget            | Object   | Budget details (type, amount, currency)         | -                      |
| duration          | String   | Expected project duration                       | -                      |
| location          | Object   | Location with coordinates                       | 2dsphere (coordinates) |
| status            | Enum     | 'open', 'in_progress', 'completed', 'cancelled' | Index                  |
| deadline          | Date     | Project deadline (optional)                     | -                      |
| attachments       | [String] | File attachments URLs                           | -                      |
| applicationsCount | Number   | Number of applications                          | -                      |
| viewsCount        | Number   | Number of views                                 | -                      |
| isUrgent          | Boolean  | Urgent gig flag                                 | -                      |
| createdAt         | Date     | Creation timestamp                              | Index (descending)     |

---

### 4. **applications** Collection

**Purpose:** Freelancer applications to gigs

| Field             | Type     | Description                       | Indexes                    |
| ----------------- | -------- | --------------------------------- | -------------------------- |
| \_id              | ObjectId | Primary key                       | Primary                    |
| gigId             | ObjectId | Reference to gigs                 | Compound with freelancerId |
| freelancerId      | ObjectId | Reference to users (freelancer)   | Index                      |
| proposal          | String   | Application cover letter          | -                          |
| proposedRate      | Number   | Freelancer's proposed rate        | -                          |
| estimatedDuration | String   | Estimated completion time         | -                          |
| status            | Enum     | 'pending', 'accepted', 'rejected' | Index                      |
| appliedAt         | Date     | Application timestamp             | -                          |

---

### 5. **contracts** Collection

**Purpose:** Active work agreements between clients and freelancers

| Field          | Type     | Description                                    | Indexes |
| -------------- | -------- | ---------------------------------------------- | ------- |
| \_id           | ObjectId | Primary key                                    | Primary |
| gigId          | ObjectId | Reference to gigs                              | Index   |
| clientId       | ObjectId | Reference to users (client)                    | Index   |
| freelancerId   | ObjectId | Reference to users (freelancer)                | Index   |
| applicationId  | ObjectId | Reference to applications                      | -       |
| agreedRate     | Number   | Final agreed rate                              | -       |
| agreedDuration | String   | Agreed timeline                                | -       |
| milestones     | [Object] | Project milestones array                       | -       |
| startDate      | Date     | Contract start date                            | -       |
| endDate        | Date     | Contract end date (optional)                   | -       |
| status         | Enum     | 'active', 'completed', 'cancelled', 'disputed' | Index   |
| terms          | String   | Contract terms and conditions                  | -       |

---

### 6. **payments** Collection

**Purpose:** Payment transactions and milestone tracking

| Field                | Type     | Description                                  | Indexes |
| -------------------- | -------- | -------------------------------------------- | ------- |
| \_id                 | ObjectId | Primary key                                  | Primary |
| contractId           | ObjectId | Reference to contracts                       | Index   |
| milestoneId          | ObjectId | Reference to milestone (optional)            | -       |
| clientId             | ObjectId | Reference to users (client)                  | Index   |
| freelancerId         | ObjectId | Reference to users (freelancer)              | Index   |
| amount               | Number   | Payment amount                               | -       |
| currency             | String   | Currency code                                | -       |
| paymentGateway       | Enum     | 'razorpay', 'stripe'                         | -       |
| gatewayTransactionId | String   | Gateway transaction ID                       | -       |
| status               | Enum     | 'pending', 'completed', 'failed', 'refunded' | Index   |
| paidAt               | Date     | Payment completion date                      | -       |

---

### 7. **reviews** Collection

**Purpose:** Two-way feedback and rating system

| Field           | Type     | Description                  | Indexes                  |
| --------------- | -------- | ---------------------------- | ------------------------ |
| \_id            | ObjectId | Primary key                  | Primary                  |
| contractId      | ObjectId | Reference to contracts       | Compound with fromUserId |
| fromUserId      | ObjectId | Review author                | -                        |
| toUserId        | ObjectId | Review recipient             | Index                    |
| rating          | Number   | Overall rating (1-5)         | Index (descending)       |
| comment         | String   | Review comment               | -                        |
| skills          | [String] | Skills mentioned in review   | -                        |
| communication   | Number   | Communication rating (1-5)   | -                        |
| quality         | Number   | Work quality rating (1-5)    | -                        |
| professionalism | Number   | Professionalism rating (1-5) | -                        |
| isVisible       | Boolean  | Review visibility flag       | -                        |

---

### 8. **conversations** Collection

**Purpose:** Chat containers for messaging between users

| Field         | Type       | Description                 | Indexes            |
| ------------- | ---------- | --------------------------- | ------------------ |
| \_id          | ObjectId   | Primary key                 | Primary            |
| participants  | [ObjectId] | Array of user references    | Index              |
| gigId         | ObjectId   | Related gig (optional)      | -                  |
| contractId    | ObjectId   | Related contract (optional) | -                  |
| lastMessage   | String     | Preview of last message     | -                  |
| lastMessageAt | Date       | Timestamp of last message   | Index (descending) |
| isActive      | Boolean    | Conversation active status  | -                  |

---

### 9. **messages** Collection

**Purpose:** Individual chat messages within conversations

| Field          | Type     | Description                 | Indexes                 |
| -------------- | -------- | --------------------------- | ----------------------- |
| \_id           | ObjectId | Primary key                 | Primary                 |
| conversationId | ObjectId | Reference to conversations  | Compound with createdAt |
| senderId       | ObjectId | Reference to users (sender) | Index                   |
| content        | String   | Message content             | -                       |
| messageType    | Enum     | 'text', 'image', 'file'     | -                       |
| attachments    | [String] | File attachment URLs        | -                       |
| isRead         | Boolean  | Read status                 | -                       |
| readAt         | Date     | Read timestamp              | -                       |
| createdAt      | Date     | Message timestamp           | -                       |

---

### 10. **notifications** Collection

**Purpose:** System notifications for users

| Field     | Type     | Description                  | Indexes              |
| --------- | -------- | ---------------------------- | -------------------- |
| \_id      | ObjectId | Primary key                  | Primary              |
| userId    | ObjectId | Reference to users           | Compound with isRead |
| title     | String   | Notification title           | -                    |
| message   | String   | Notification content         | -                    |
| type      | Enum     | Notification category        | -                    |
| relatedId | ObjectId | Related entity ID (optional) | -                    |
| isRead    | Boolean  | Read status                  | -                    |
| readAt    | Date     | Read timestamp               | -                    |
| createdAt | Date     | Notification timestamp       | Index (descending)   |

---

## Database Relationships Diagram

```
┌─────────────────┐
│     USERS       │
│ ─────────────── │
│ _id (PK)        │ ──────┐
│ email           │       │
│ password        │       │
│ role            │       │
│ firstName       │       │
│ lastName        │       │
│ location        │       │
│ ...             │       │
└─────────────────┘       │
                          │
                          │ 1:1 (freelancers only)
                          ▼
              ┌─────────────────────┐
              │ FREELANCERPROFILES  │
              │ ─────────────────── │
              │ _id (PK)            │
              │ userId (FK)         │
              │ title               │
              │ skills              │
              │ hourlyRate          │
              │ portfolio           │
              │ rating              │
              │ ...                 │
              └─────────────────────┘

┌─────────────────┐                          ┌─────────────────┐
│      GIGS       │                          │  APPLICATIONS   │
│ ─────────────── │                          │ ─────────────── │
│ _id (PK)        │ ◄────────────────────────┤ _id (PK)        │
│ clientId (FK)   │ 1:M                      │ gigId (FK)      │
│ title           │                          │ freelancerId(FK)│
│ description     │                          │ coverLetter     │
│ skillsRequired  │                          │ proposedRate    │
│ budget          │                          │ status          │
│ location        │                          │ ...             │
│ status          │                          └─────────────────┘
│ ...             │                                    │
└─────────────────┘                                    │ 1:1 (when accepted)
         │                                             ▼
         │ 1:1 (when contract created)        ┌─────────────────┐
         └─────────────────────────────────►  │   CONTRACTS     │
                                             │ ─────────────── │
                                             │ _id (PK)        │
                                             │ gigId (FK)      │
                                             │ clientId (FK)   │
                                             │ freelancerId(FK)│
                                             │ applicationId(FK)│
                                             │ milestones      │
                                             │ status          │
                                             │ ...             │
                                             └─────────────────┘
                                                      │
                                                      │ 1:M
                                                      ▼
                                             ┌─────────────────┐
                                             │    PAYMENTS     │
                                             │ ─────────────── │
                                             │ _id (PK)        │
                                             │ contractId (FK) │
                                             │ clientId (FK)   │
                                             │ freelancerId(FK)│
                                             │ amount          │
                                             │ status          │
                                             │ ...             │
                                             └─────────────────┘

                                             ┌─────────────────┐
                                             │    REVIEWS      │
                                             │ ─────────────── │
                                             │ _id (PK)        │
                                             │ contractId (FK) │ ──────┐
                                             │ fromUserId (FK) │       │
                                             │ toUserId (FK)   │       │ 1:1 per user per contract
                                             │ rating          │       │
                                             │ comment         │       │
                                             │ ...             │       │
                                             └─────────────────┘ ◄─────┘

┌─────────────────┐                          ┌─────────────────┐
│ CONVERSATIONS   │                          │    MESSAGES     │
│ ─────────────── │                          │ ─────────────── │
│ _id (PK)        │ ◄────────────────────────┤ _id (PK)        │
│ participants[FK]│ 1:M                      │ conversationId  │
│ gigId (FK)      │                          │ senderId (FK)   │
│ contractId (FK) │                          │ content         │
│ lastMessage     │                          │ messageType     │
│ lastMessageAt   │                          │ isRead          │
│ ...             │                          │ ...             │
└─────────────────┘                          └─────────────────┘

┌─────────────────┐
│ NOTIFICATIONS   │
│ ─────────────── │
│ _id (PK)        │
│ userId (FK)     │ ──────► References USERS
│ title           │
│ message         │
│ type            │
│ relatedId       │
│ isRead          │
│ ...             │
└─────────────────┘
```

---

## Key Relationships Summary

### Primary Relationships:

1. **Users → FreelancerProfiles** (1:1) - Extended profile for freelancers
2. **Users → Gigs** (1:M) - Clients can create multiple gigs
3. **Gigs → Applications** (1:M) - Each gig can have multiple applications
4. **Applications → Contracts** (1:1) - Accepted applications become contracts
5. **Contracts → Payments** (1:M) - Multiple payments per contract (milestones)
6. **Contracts → Reviews** (1:2) - Each contract gets 2 reviews (bidirectional)

### Communication Relationships:

7. **Users → Conversations** (M:M) - Users can participate in multiple conversations
8. **Conversations → Messages** (1:M) - Each conversation contains multiple messages
9. **Users → Notifications** (1:M) - Users receive multiple notifications

### Location-Based Features:

- Both **Users** and **Gigs** collections have geospatial indexes for location-based searching
- Supports hyperlocal matching of freelancers to nearby gigs

---

## Index Strategy for Performance

### Primary Search Patterns:

1. **Location-based gig search**: 2dsphere index on `gigs.location.coordinates`
2. **Skill-based freelancer search**: Index on `freelancerprofiles.skills`
3. **User authentication**: Unique index on `users.email`
4. **Real-time messaging**: Compound index on `messages.conversationId + createdAt`
5. **Rating-based sorting**: Descending index on `freelancerprofiles.rating`

### Query Optimization:

- Compound indexes for common query patterns
- Separate indexes for filtering and sorting operations
- Geospatial indexes for location-based features
