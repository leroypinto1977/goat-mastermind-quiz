# 📘 PRODUCT IMPLEMENTATION DOCUMENT
Project Name: “Would You Pay You?” Authority Test Platform

## 1. 🎯 Product Overview

This is a controlled-access quiz application where:
- Only users with a unique 6-digit test code can access the test
- Each code is tied to one individual
- Each user can take the test only once
- After submitting, their score and authority category are stored permanently
- If they revisit with the same code, they see their results instead of the test

There is also an admin panel that allows:
- Secure login
- Generating unique test codes
- Viewing all created users & status
- Viewing scores and completion status

## 2. 🔁 User Flow

### Public User Flow
1. **User lands on homepage**
2. **User enters 6-digit code**
3. **System checks:**
    - Code exists?
    - Has test already been taken?
4. **If:**
    - Code does not exist → Show error
    - Exists & not taken → Start test
    - Exists & taken → Show results page
5. **User completes test**
6. **On submit:**
    - Score is calculated server-side
    - Answers stored
    - User marked as completed
    - Redirect to results page

### Admin Flow
1. **Admin logs in**
2. **Admin dashboard:**
    - Generate new test code
    - View list of all users
    - See status (taken / not taken)
    - See score (if taken)

## 3. 🗄 Database Architecture (Neon PostgreSQL)

Use Prisma ORM or direct SQL.

### Table: test_users
```sql
CREATE TABLE test_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    test_code VARCHAR(6) UNIQUE NOT NULL,
    has_taken_test BOOLEAN DEFAULT FALSE,
    score INTEGER,
    authority_level VARCHAR(50),
    answers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Field Definitions**
| Field | Purpose |
| :--- | :--- |
| id | Unique user identifier |
| full_name | Name entered by admin |
| email | Optional |
| test_code | Unique 6-digit code |
| has_taken_test | Prevent multiple attempts |
| score | Final score (0–100) |
| authority_level | Blocked / Underpriced / Ready |
| answers | Stored answer selections |
| created_at | Record creation time |

### Table: admins
```sql
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
Password must be stored using bcrypt hashing.

## 4. 🧠 Test Structure & Rubric (From Uploaded PDF)

**Source:** "Would you pay you test"

The test contains:
- 5 Questions
- 4 Options each
- Each question has max 20 points
- Total possible score: 100

## 5. 📝 Full Question Bank (Hardcoded Configuration)

This should be stored in code as a constant.

### Question 1: After seeing your profile for 5 seconds, what will someone feel?

| Option | Points | Why |
| :--- | :--- | :--- |
| This person is exactly what I’m looking for | 20 | Clear niche + instant trust |
| Seems knowledgeable, I need to explore more | 12 | Interest without decision |
| Not sure what they actually do | 6 | Confusion kills conversion |
| Just another creator / service provider | 0 | No differentiation |

### Question 2: How do people usually message you?

| Option | Points | Why |
| :--- | :--- | :--- |
| I want to work only with you | 20 | Authority-driven demand |
| Can you give me some advice? | 12 | Trust without buying intent |
| What’s your price? | 6 | Commodity perception |
| Can you give me a discount? | 0 | Low authority + price pressure |

### Question 3: What do you post the most online?

| Option | Points | Why |
| :--- | :--- | :--- |
| Results and success stories | 20 | Outcome-based trust |
| Client testimonials | 14 | Social proof works |
| Tips and teaching content | 8 | Value without positioning |
| Just posting regularly | 0 | Effort ≠ authority |

### Question 4: During sales calls, who is in control?

| Option | Points | Why |
| :--- | :--- | :--- |
| I lead the call | 20 | Leadership = premium |
| Both of us | 12 | Partial control |
| Client controls the call | 6 | Authority gap |
| I avoid sales calls | 0 | No control = no scale |

### Question 5: What’s stopping you from charging more than your revenue?

| Option | Points | Why |
| :--- | :--- | :--- |
| I don’t know how to position myself | 14 | Awareness of the real issue |
| I don’t attract premium clients | 8 | Symptom, not cause |
| Too much competition | 6 | External blame |
| People won’t pay that much | 0 | Market mistrust mindset |

## 6. 🧮 Scoring & Interpretation Logic

After summing the total score:

### 0–40 → Authority Blocked
**Message:**
You’re skilled, but replaceable. The market doesn’t see enough reason to choose you.
**CTA:** Book Your Authority Mapping Call

### 41–70 → Authority Underpriced
**Message:**
People trust you, but not enough to pay premium. One positioning shift can change your income.
**CTA:** Book Your Authority Mapping Call

### 71–100 → Authority Ready
**Message:**
You’re already perceived as an expert. Now you need a system to scale demand and pricing.
**CTA:** Book Your Authority Mapping Call

**Post-results message:**
Most people with your score struggle not because of skill — but because the market doesn’t fully trust them yet.

## 7. 🔐 Validation Rules

**Code Validation**
- Must be exactly 6 digits
- Only numeric
- Must exist in DB
- If not found → return 404 error

**Prevent Multiple Attempts**
- If `has_taken_test = TRUE`
- User must:
    - Skip test page
    - Be redirected to results

## 8. 🎛 Admin Panel Requirements

**Admin Authentication**
- Email + password login
- Password hashed using bcrypt
- Use cookie-based session or JWT
- Protect all admin routes using middleware

**Generate Code Logic**
When admin enters:
- `full_name`
- optional `email`

Then:
- Generate random 6-digit number: `Math.floor(100000 + Math.random() * 900000).toString()`
- Check DB uniqueness
- If exists → regenerate
- Store in `test_users`
- Default values:
    - `has_taken_test = false`
    - `score = null`
    - `authority_level = null`
    - `answers = null`

**Admin Dashboard View**
Table must display:
- Name
- Email
- Code
- Status
- Score
- Authority Level
- Created At

Status:
- Not Taken
- Completed

Must support:
- Sorting by `created_at`
- Filter by completed / not completed

## 9. 📡 API Specifications

### POST /api/validate-code
Input:
```json
{ "testCode": "123456" }
```
Output:
- Case 1: Not found → `{ "valid": false }`
- Case 2: Found + not taken → `{ "valid": true, "taken": false }`
- Case 3: Found + taken → `{ "valid": true, "taken": true }`

### POST /api/submit-test
Input:
```json
{
  "testCode": "123456",
  "answers": {
    "q1": 0,
    "q2": 3,
    "q3": 1,
    "q4": 0,
    "q5": 2
  }
}
```
Server must:
- Validate code
- Confirm not already taken
- Calculate score
- Determine `authority_level`
- Save score + answers
- Set `has_taken_test = true`
- Return result object

## 10. 🧾 Test Submission Rules
- All 5 questions must be answered
- Submission must be server-calculated
- Never trust frontend score
- Reject submission if already completed

## 11. 🖥 Frontend Pages

**Landing Page**
- Title & Subtitle
- Code input field & Start button
- Error display if invalid

**Test Page**
- Display all 5 questions
- Radio button selection
- Warning message before submit: "Answer honestly. This test is for clarity, not confidence."
- Submit button disabled until all questions answered

**Results Page**
- If accessed without valid code: Return to homepage
- Display:
    - Score (e.g., 78/100)
    - Authority level heading
    - Interpretation paragraph
    - CTA button
    - Answers breakdown (optional enhancement)

## 12. 🔒 Security Requirements
- All validation server-side
- Rate-limit code validation
- Ensure unique constraint on `test_code`
- Ensure admin routes protected
- Do not expose authority scoring logic in client

## 13. 🔄 Edge Case Handling
| Scenario | Expected Behavior |
| :--- | :--- |
| Invalid code | Error message |
| Already taken | Redirect to results |
| Partial answers | Submission blocked |
| Admin duplicate code | Regenerate |
| DB failure | Return 500 error |

## 14. 🚀 Deployment Requirements
- Host frontend/backend on Vercel
- Connect to Neon PostgreSQL
- Set environment variables securely
- Enable SSL
- Use connection pooling for Neon

## 15. 🎯 MVP Completion Checklist
- [ ] Database schema migrated
- [ ] Admin login works
- [ ] Code generation works
- [ ] Validation endpoint works
- [ ] Test renders correctly
- [ ] Score correctly calculated
- [ ] Results stored
- [ ] Retake blocked
- [ ] Results page correct
- [ ] Authority messaging accurate
