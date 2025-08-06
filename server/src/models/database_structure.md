# GigConnect Database Structure - Separate Client & Freelancer Accounts

## Collections Overview

| Collection             | Purpose                                   | User Access                             |
| ---------------------- | ----------------------------------------- | --------------------------------------- |
| **users**              | Core user authentication and profile data | All users                               |
| **clientprofiles**     | Extended profile data for clients         | CLIENT role only                        |
| **freelancerprofiles** | Extended profile data for freelancers     | FREELANCER role only                    |
| **gigs**               | Job postings created by clients           | Created by CLIENTs only                 |
| **applications**       | Freelancer applications to gigs           | Created by FREELANCERs only             |
| **contracts**          | Active work agreements                    | Both (CLIENT + FREELANCER)              |
| **payments**           | Payment transactions and milestones       | Both (CLIENT pays, FREELANCER receives) |
| **reviews**            | Two-way feedback system                   | Both (bidirectional reviews)            |
| **conversations**      | Chat containers between users             | Both (CLIENT ↔ FREELANCER)              |
| **messages**           | Individual chat messages                  | Both (CLIENT ↔ FREELANCER)              |
| **notifications**      | System notifications for users            | Both (role-specific)                    |
| **savedgigs**          | Freelancer saved gigs                     | FREELANCER role only                    |
| **freelancerinvites**  | Client invitations to freelancers         | Created by CLIENTs only                 |

---

## Role-Based Access Control

### CLIENT Users Can:

- ✅ Create and manage gigs
- ✅ View freelancer profiles and applications
- ✅ Accept/reject applications
- ✅ Create contracts with freelancers
- ✅ Make payments for milestones
- ✅ Leave reviews for freelancers
- ✅ Send direct invites to freelancers
- ❌ **Cannot apply to gigs**
- ❌ **Cannot save gigs**
- ❌ **Cannot create freelancer profiles**

### FREELANCER Users Can:

- ✅ Browse and search gigs
- ✅ Apply to gigs with proposals
- ✅ Save/bookmark interesting gigs
- ✅ Respond to client invitations
- ✅ Work on contracted projects
- ✅ Submit milestone deliverables
- ✅ Leave reviews for clients
- ❌ **Cannot create gigs**
- ❌ **Cannot invite other freelancers**
- ❌ **Cannot access client-only features**

---

## Detailed Collection Structure

### 1. **users** Collection

**Purpose:** Core user authentication with immutable role assignment

| Field      | Type     | Description                     | Constraints                  |
| ---------- | -------- | ------------------------------- | ---------------------------- |
| \_id       | ObjectId | Primary key                     | Primary                      |
| email      | String   | Unique email address            | Unique                       |
| password   | String   | Hashed password                 | Required                     |
| role       | Enum     | 'client', 'freelancer', 'admin' | **Immutable after creation** |
| firstName  | String   | User's first name               | Required                     |
| lastName   | String   | User's last name                | Required                     |
| phone      | String   | Phone number (optional)         | Optional                     |
| avatar     | String   | Profile picture URL             | Optional                     |
| location   | Object   | Address with coordinates        | Required                     |
| isVerified | Boolean  | Email verification status       | Default: false               |
| isActive   | Boolean  | Account active status           | Default: true                |

---

### 2. **clientprofiles** Collection

**Purpose:** Extended profile information for CLIENT users only

| Field                    | Type     | Description                            | Access          |
| ------------------------ | -------- | -------------------------------------- | --------------- |
| \_id                     | ObjectId | Primary key                            | Primary         |
| userId                   | ObjectId | Reference to users (CLIENT role)       | Unique          |
| companyName              | String   | Company/business name                  | Optional        |
| companyWebsite           | String   | Company website URL                    | Optional        |
| businessType             | Enum     | Individual/Startup/Business/Enterprise | Required        |
| industryType             | String   | Business industry                      | Required        |
| description              | String   | Client description                     | Required        |
| projectsPosted           | Number   | Total gigs posted                      | Auto-calculated |
| totalSpent               | Number   | Total money spent                      | Auto-calculated |
| activeGigs               | Number   | Currently active gigs                  | Auto-calculated |
| completedProjects        | Number   | Completed projects                     | Auto-calculated |
| clientRating             | Number   | Client rating (0-5)                    | Auto-calculated |
| totalReviews             | Number   | Total reviews received                 | Auto-calculated |
| verifiedPayment          | Boolean  | Payment method verified                | Default: false  |
| preferredBudgetRange     | Object   | Budget preferences                     | Required        |
| communicationPreferences | Object   | Notification settings                  | Configurable    |

---

### 3. **freelancerprofiles** Collection

**Purpose:** Extended profile information for FREELANCER users only

| Field               | Type     | Description                          | Access             |
| ------------------- | -------- | ------------------------------------ | ------------------ |
| \_id                | ObjectId | Primary key                          | Primary            |
| userId              | ObjectId | Reference to users (FREELANCER role) | Unique             |
| title               | String   | Professional headline                | Required           |
| bio                 | String   | Professional summary                 | Required           |
| skills              | [String] | Array of skills                      | Required           |
| hourlyRate          | Number   | Hourly rate                          | Required           |
| availability        | Enum     | Available/Busy/Not Available         | Default: Available |
| portfolio           | [Object] | Portfolio items with images          | Optional           |
| experience          | [Object] | Work experience history              | Optional           |
| education           | [Object] | Educational background               | Optional           |
| certifications      | [Object] | Professional certifications          | Optional           |
| languages           | [Object] | Languages and proficiency            | Optional           |
| rating              | Number   | Average rating (0-5)                 | Auto-calculated    |
| totalReviews        | Number   | Total reviews received               | Auto-calculated    |
| completedGigs       | Number   | Successfully completed gigs          | Auto-calculated    |
| totalEarnings       | Number   | Total earnings                       | Auto-calculated    |
| successRate         | Number   | Project success rate %               | Auto-calculated    |
| responseTime        | Number   | Average response time (hours)        | Auto-calculated    |
| profileViews        | Number   | Profile view count                   | Auto-calculated    |
| isTopRated          | Boolean  | Top-rated freelancer status          | Auto-assigned      |
| specializationAreas | [String] | Specialization areas                 | Optional           |
| workPreferences     | Object   | Work location/travel preferences     | Configurable       |
| socialLinks         | Object   | Social media profiles                | Optional           |

---

### 4. **gigs** Collection

**Purpose:** Job postings created by CLIENT users only

| Field             | Type     | Description                               | Access Control |
| ----------------- | -------- | ----------------------------------------- | -------------- |
| \_id              | ObjectId | Primary key                               | Primary        |
| clientId          | ObjectId | Reference to users (**CLIENT role only**) | Required       |
| title             | String   | Gig title                                 | Required       |
| description       | String   | Detailed job description                  | Required       |
| category          | String   | Job category                              | Required       |
| subCategory       | String   | Job subcategory                           | Optional       |
| skillsRequired    | [String] | Required skills array                     | Required       |
| experienceLevel   | Enum     | Entry/Intermediate/Expert                 | Required       |
| budget            | Object   | Budget details (type, amount, currency)   | Required       |
| duration          | String   | Expected project duration                 | Required       |
| expectedStartDate | Date     | Expected start date                       | Optional       |
| location          | Object   | Location with coordinates                 | Required       |
| status            | Enum     | Open/In Progress/Completed/Cancelled      | Default: Open  |
| requirements      | [String] | Specific requirements                     | Optional       |
| deliverables      | [String] | Expected deliverables                     | Optional       |
| projectComplexity | Enum     | Simple/Moderate/Complex                   | Required       |

---

### 5. **applications** Collection

**Purpose:** Freelancer applications to gigs (FREELANCER users only)

| Field              | Type     | Description                                   | Access Control   |
| ------------------ | -------- | --------------------------------------------- | ---------------- |
| \_id               | ObjectId | Primary key                                   | Primary          |
| gigId              | ObjectId | Reference to gigs                             | Required         |
| freelancerId       | ObjectId | Reference to users (**FREELANCER role only**) | Required         |
| coverLetter        | String   | Application cover letter                      | Required         |
| proposedRate       | Number   | Freelancer's proposed rate                    | Required         |
| estimatedDuration  | String   | Estimated completion time                     | Required         |
| relevantExperience | String   | Relevant experience description               | Required         |
| portfolioSamples   | [String] | Portfolio samples                             | Optional         |
| questionsAnswers   | [Object] | Client questions answered                     | Optional         |
| status             | Enum     | Pending/Accepted/Rejected                     | Default: Pending |
| clientViewed       | Boolean  | Whether client viewed application             | Default: false   |

---

### 6. **contracts** Collection

**Purpose:** Active work agreements between clients and freelancers

| Field              | Type     | Description                              | Access          |
| ------------------ | -------- | ---------------------------------------- | --------------- |
| \_id               | ObjectId | Primary key                              | Primary         |
| gigId              | ObjectId | Reference to gigs                        | Required        |
| clientId           | ObjectId | Reference to users (**CLIENT role**)     | Required        |
| freelancerId       | ObjectId | Reference to users (**FREELANCER role**) | Required        |
| applicationId      | ObjectId | Reference to accepted application        | Required        |
| agreedRate         | Number   | Final agreed rate                        | Required        |
| milestones         | [Object] | Project milestones with approvals        | Required        |
| clientSignedAt     | Date     | Client signature timestamp               | Optional        |
| freelancerSignedAt | Date     | Freelancer signature timestamp           | Optional        |
| totalPaid          | Number   | Total amount paid                        | Auto-calculated |
| remainingAmount    | Number   | Remaining payment                        | Auto-calculated |

---

### 7. **payments** Collection

**Purpose:** Payment transactions (CLIENT pays, FREELANCER receives)

| Field             | Type     | Description                 | Flow            |
| ----------------- | -------- | --------------------------- | --------------- |
| \_id              | ObjectId | Primary key                 | Primary         |
| contractId        | ObjectId | Reference to contracts      | Required        |
| clientId          | ObjectId | Payer (**CLIENT role**)     | Required        |
| freelancerId      | ObjectId | Payee (**FREELANCER role**) | Required        |
| amount            | Number   | Total payment amount        | Required        |
| platformFee       | Number   | Platform commission         | Auto-calculated |
| freelancerAmount  | Number   | Amount after platform fee   | Auto-calculated |
| escrowReleaseDate | Date     | When funds are released     | Auto-set        |

---

### 8. **reviews** Collection

**Purpose:** Bidirectional feedback system

| Field          | Type     | Description                                | Access   |
| -------------- | -------- | ------------------------------------------ | -------- |
| \_id           | ObjectId | Primary key                                | Primary  |
| contractId     | ObjectId | Reference to contracts                     | Required |
| fromUserId     | ObjectId | Review author                              | Required |
| toUserId       | ObjectId | Review recipient                           | Required |
| fromUserRole   | Enum     | Client/Freelancer                          | Auto-set |
| toUserRole     | Enum     | Client/Freelancer                          | Auto-set |
| rating         | Number   | Overall rating (1-5)                       | Required |
| skills         | [String] | Skills mentioned (freelancer reviews only) | Optional |
| wouldWorkAgain | Boolean  | Would work together again                  | Required |

---

### 9. **savedgigs** Collection

**Purpose:** Freelancer bookmarked gigs (FREELANCER users only)

| Field        | Type     | Description                                   | Access Control |
| ------------ | -------- | --------------------------------------------- | -------------- |
| \_id         | ObjectId | Primary key                                   | Primary        |
| freelancerId | ObjectId | Reference to users (**FREELANCER role only**) | Required       |
| gigId        | ObjectId | Reference to gigs                             | Required       |
| savedAt      | Date     | When gig was saved                            | Auto-set       |

---

### 10. **freelancerinvites** Collection

**Purpose:** Client invitations to freelancers (CLIENT users only)

| Field        | Type     | Description                        | Access Control   |
| ------------ | -------- | ---------------------------------- | ---------------- |
| \_id         | ObjectId | Primary key                        | Primary          |
| clientId     | ObjectId | Inviter (**CLIENT role only**)     | Required         |
| freelancerId | ObjectId | Invitee (**FREELANCER role only**) | Required         |
| gigId        | ObjectId | Reference to gigs                  | Required         |
| message      | String   | Invitation message                 | Required         |
| status       | Enum     | Pending/Accepted/Declined/Expired  | Default: Pending |
| expiresAt    | Date     | Invitation expiry                  | Auto-set         |

---

### 11. **conversations** Collection

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

### 12. **messages** Collection

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
                    │ _id (PK)        │
                    │ email           │
                    │ role (immutable)│ ◄──── Role determines access
                    │ firstName       │
                    │ lastName        │
                    │ location        │
                    │ ...             │
                    └─────────────────┘
                            │
                            │ Role-based branching
                 ┌──────────┴──────────┐
                 ▼                     ▼
    ┌─────────────────────┐    ┌─────────────────────┐
    │  CLIENTPROFILES     │    │ FREELANCERPROFILES  │
    │ ─────────────────── │    │ ─────────────────── │
    │ _id (PK)            │    │ _id (PK)            │
    │ userId (FK)         │    │ userId (FK)         │
    │ (CLIENT role only)  │    │ (FREELANCER only)   │
    │ companyName         │    │ title               │
    │ businessType        │    │ skills              │
    │ projectsPosted      │    │ hourlyRate          │
    │ clientRating        │    │ portfolio           │
    │ ...                 │    │ rating              │
    └─────────────────────┘    │ ...                 │
             │                 └─────────────────────┘
             │ 1:M (CLIENT only)        │
             ▼                          │
    ┌─────────────────┐                 │
    │      GIGS       │                 │ M:1 (FREELANCER only)
    │ ─────────────── │                 │
    │ _id (PK)        │ ◄───────────────┼─────────────┐
    │ clientId (FK)   │ 1:M             │             │
    │ (CLIENT only)   │                 │             ▼
    │ title           │                 │    ┌─────────────────┐
    │ description     │                 │    │  APPLICATIONS   │
    │ skillsRequired  │                 │    │ ─────────────── │
    │ budget          │                 │    │ _id (PK)        │
    │ status          │                 │    │ gigId (FK)      │
    │ ...             │                 │    │ freelancerId(FK)│
    └─────────────────┘                 │    │ (FREELANCER only)│
             │                          │    │ coverLetter     │
             │ 1:1 (when accepted)      │    │ proposedRate    │
             └──────────────────────────┼────│ status          │
                                        │    │ ...             │
                                        │    └─────────────────┘
                                        │             │
                                        │             │ 1:1 (when accepted)
                                        │             ▼
                                        │    ┌─────────────────┐
                                        │    │   CONTRACTS     │
                                        │    │ ─────────────── │
                                        │    │ _id (PK)        │
                                        │    │ clientId (FK)   │
                                        │    │ freelancerId(FK)│
                                        │    │ applicationId   │
                                        │    │ milestones      │
                                        │    │ status          │
                                        │    │ ...             │
                                        │    └─────────────────┘
                                        │             │
                                        │             │ 1:M
                                        │             ▼
                                        │    ┌─────────────────┐
                                        │    │    PAYMENTS     │
                                        │    │ ─────────────── │
                                        │    │ _id (PK)        │
                                        │    │ contractId (FK) │
                                        │    │ clientId (FK)   │
                                        │    │ freelancerId(FK)│
                                        │    │ platformFee     │
                                        │    │ status          │
                                        │    │ ...             │
                                        │    └─────────────────┘
                                        │
                                        │    ┌─────────────────┐
                                        │    │    REVIEWS      │
                                        │    │ ─────────────── │
                                        │    │ _id (PK)        │
                                        │    │ contractId (FK) │
                                        │    │ fromUserId (FK) │
                                        │    │ toUserId (FK)   │
                                        │    │ fromUserRole    │ ◄─ Role tracking
                                        │    │ toUserRole      │
                                        │    │ rating          │
                                        │    │ ...             │
                                        │    └─────────────────┘
                                        │
                                        │    ┌─────────────────┐
                                        └────│   SAVEDGIGS     │
                                             │ ─────────────── │
                                             │ _id (PK)        │
                                             │ freelancerId(FK)│ ◄─ FREELANCER only
                                             │ gigId (FK)      │
                                             │ savedAt         │
                                             └─────────────────┘

CLIENT-initiated invitations:
┌─────────────────────┐
│ FREELANCERINVITES   │
│ ─────────────────── │
│ _id (PK)            │
│ clientId (FK)       │ ◄─ CLIENT only
│ freelancerId (FK)   │ ◄─ FREELANCER only
│ gigId (FK)          │
│ message             │
│ status              │
│ expiresAt           │
└─────────────────────┘

Communication (CLIENT ↔ FREELANCER):
┌─────────────────┐                          ┌─────────────────┐
│ CONVERSATIONS   │                          │    MESSAGES     │
│ ─────────────── │                          │ ─────────────── │
│ _id (PK)        │ ◄────────────────────────┤ _id (PK)        │
│ participants[2] │ 1:M                      │ conversationId  │
│ (CLIENT+FRELNC) │                          │ senderId (FK)   │
│ gigId (FK)      │                          │ senderRole      │ ◄─ Role tracking
│ contractId (FK) │                          │ content         │
│ lastMessage     │                          │ messageType     │
│ ...             │                          │ ...             │
└─────────────────┘                          └─────────────────┘
```

---

## Key Access Control Rules

### 🔒 **Strict Role Separation:**

1. **Account Creation**: Users must choose CLIENT or FREELANCER role (immutable)
2. **Profile Creation**: Role determines which profile type can be created
3. **Gig Management**: Only CLIENTs can create/manage gigs
4. **Applications**: Only FREELANCERs can apply to gigs
5. **Invitations**: Only CLIENTs can invite FREELANCERs
6. **Saved Gigs**: Only FREELANCERs can save/bookmark gigs
7. **Payments**: CLIENTs make payments, FREELANCERs receive them
8. **Messaging**: Only CLIENT ↔ FREELANCER conversations allowed

### 🔄 **Shared Features:**

- ✅ Both can leave reviews (bidirectional)
- ✅ Both can participate in contracts
- ✅ Both receive notifications (role-specific)
- ✅ Both can message each other
- ✅ Both have location-based features

### 📊 **Role-Specific Analytics:**

- **CLIENT Dashboard**: Posted gigs, active contracts, spending, hired freelancers
- **FREELANCER Dashboard**: Applied gigs, earnings, completed projects, client ratings

This structure ensures complete separation of CLIENT and FREELANCER functionalities while maintaining the platform's core features for connecting local talent with opportunities.

---

## Updated API Access Control

### Authentication & Authorization Changes

With the strict role separation, the APIs from the previous list now have enhanced access controls:

#### **Role-Specific API Access:**

**CLIENT-Only APIs:**

- `POST /api/gigs` - Create gigs
- `PUT /api/gigs/:id` - Update own gigs
- `GET /api/gigs/my-gigs` - Get posted gigs
- `POST /api/applications/:id/accept` - Accept applications
- `POST /api/applications/:id/reject` - Reject applications
- `POST /api/freelancer-invites` - Invite freelancers
- `POST /api/contracts` - Create contracts
- `POST /api/payments/initiate` - Make payments

**FREELANCER-Only APIs:**

- `POST /api/applications` - Apply to gigs
- `GET /api/applications/my-applications` - Get own applications
- `POST /api/gigs/:id/save` - Save/bookmark gigs
- `GET /api/gigs/saved` - Get saved gigs
- `POST /api/freelancer-invites/:id/respond` - Respond to invites
- `POST /api/contracts/:id/milestones/:id/submit` - Submit deliverables

**Shared APIs (Both Roles):**

- All authentication APIs
- Profile management (role-specific)
- Messaging system
- Reviews and ratings
- Contract participation
- Notifications

#### **Database Validation Rules:**

```typescript
// Example middleware for role validation
const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied. Required role: " + allowedRoles.join(" or "),
      });
    }
    next();
  };
};

// Usage examples:
app.post("/api/gigs", requireRole([UserRole.CLIENT]), createGig);
app.post(
  "/api/applications",
  requireRole([UserRole.FREELANCER]),
  createApplication
);
app.get(
  "/api/contracts",
  requireRole([UserRole.CLIENT, UserRole.FREELANCER]),
  getContracts
);
```

#### **Schema-Level Constraints:**

```typescript
// Pre-save hooks to enforce role constraints
GigSchema.pre("save", async function (next) {
  const user = await User.findById(this.clientId);
  if (user?.role !== UserRole.CLIENT) {
    throw new Error("Only CLIENT users can create gigs");
  }
  next();
});

ApplicationSchema.pre("save", async function (next) {
  const user = await User.findById(this.freelancerId);
  if (user?.role !== UserRole.FREELANCER) {
    throw new Error("Only FREELANCER users can create applications");
  }
  next();
});
```



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
