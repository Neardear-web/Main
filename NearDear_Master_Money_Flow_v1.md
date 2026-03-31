# NearDear.in — Master Money Flow Document
## Version 1.0 | March 2026 | Private & Confidential
## Single source of truth for all financial architecture, policy, and UI.

---

> **The Financial Founding Promise:**
> *"Every rupee on this platform is tracked, transparent,
> and reaches the right person at the right time.
> Always."*

---

## TABLE OF CONTENTS

1. Complete Schema — All Financial Tables
2. The Complete Money Flow — Step by Step
3. Cancellation Policy — All Three Sides
4. The 48-Hour Payment Window
5. All Financial UIs — Every Screen
6. Capturing Bank Details — Companion Onboarding
7. Suspension, Pause, Discontinue — Effect on Payments
8. Dispute Protection Framework
9. Complete Payment Policy + Terms & Conditions

---

## 1. COMPLETE SCHEMA — ALL FINANCIAL TABLES

### All tables required for the complete financial system.
### Add to prisma/schema.prisma and run one migration.

```prisma
// ─── FINANCIAL ENUMS ──────────────────────────────────

enum PaymentStatus {
  PENDING           // Order created, payment not captured
  CAPTURED          // Payment successful
  PARTIALLY_REFUNDED // Partial refund processed
  REFUNDED          // Full refund processed
  FAILED            // Payment failed
  DISPUTED          // Under dispute review
}

enum EarningStatus {
  PENDING           // Session not yet confirmed
  RELEASED          // Session confirmed, awaiting transfer
  PROCESSING        // Transfer initiated
  PAID              // Money in companion's bank
  HELD              // Dispute raised — held by admin
  CANCELLED         // Session cancelled, no earning
  COMPENSATED       // Partial comp for late cancellation
}

enum WithdrawalStatus {
  REQUESTED         // Companion requested withdrawal
  PROCESSING        // Admin initiating transfer
  COMPLETED         // Money transferred to bank
  FAILED            // Transfer failed — retry needed
  CANCELLED         // Cancelled by admin or companion
}

enum CancellationWindow {
  BEFORE_PAYMENT    // Cancelled before paying
  HOURS_48_PLUS     // 48+ hours before session
  HOURS_24_TO_48    // 24-48 hours before session
  HOURS_UNDER_24    // Under 24 hours before session
  SAME_DAY          // Same day or no-show
  POST_SESSION      // After session completed
}

enum CancelledBy {
  RECEIVER          // Family / advisee cancelled
  COMPANION         // Companion cancelled
  ADMIN             // Admin cancelled (emergency)
  SYSTEM            // Auto-cancelled (no payment etc)
}

enum DisputeStatus {
  OPEN              // Raised, under review
  UNDER_REVIEW      // Admin actively reviewing
  RESOLVED_VALID    // Session was valid, payment released
  RESOLVED_REFUND   // Session invalid, refund issued
  RESOLVED_PARTIAL  // Partial resolution
  ESCALATED         // Needs senior review
  CLOSED            // Resolved and closed
}

enum DisputeRaisedBy {
  RECEIVER          // Family raised concern
  COMPANION         // Companion raised concern
  ADMIN             // Admin flagged proactively
}

// ─── CORE FINANCIAL TABLES ────────────────────────────

// Already exists — enhance with these fields:
// Add to Payment model:

model Payment {
  id                    String        @id @default(cuid())
  requestId             String        @unique
  sessionId             String?       @unique
  userId                String
  razorpayOrderId       String?       @unique
  razorpayPaymentId     String?       @unique
  razorpaySignature     String?

  // Amounts (stored in INR rupees — not paise)
  amount                Int           // Total paid by family
  platformFee           Int           // 20% platform share
  companionShare        Int           // 80% companion share
  currency              String        @default("INR")

  status                PaymentStatus @default(PENDING)

  // Refund tracking
  refundAmount          Int?          // Amount refunded
  refundReason          String?
  razorpayRefundId      String?
  refundedAt            DateTime?

  // Partial refund tracking
  partialRefundAmount   Int?
  partialRefundReason   String?
  partialRazorpayRefundId String?
  partialRefundedAt     DateTime?

  capturedAt            DateTime?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  earning               Earning?
  cancellationRecord    CancellationRecord?
  dispute               Dispute?

  @@index([userId])
  @@index([status])
  @@index([razorpayOrderId])
  @@index([createdAt])
  @@map("payments")
}

// Companion earnings per session
model Earning {
  id                    String        @id @default(cuid())
  providerProfileId     String
  sessionId             String        @unique
  paymentId             String        @unique

  amount                Int           // 80% of session fee
  // OR compensation amount for cancelled sessions

  earningType           String        @default("SESSION")
  // SESSION / CANCELLATION_COMP / ADJUSTMENT

  status                EarningStatus @default(PENDING)

  // Release tracking
  releasedAt            DateTime?     // When admin marks released
  processingAt          DateTime?     // When transfer started
  paidAt                DateTime?     // When in companion's bank

  // Hold tracking (disputes)
  heldAt                DateTime?
  heldReason            String?
  heldBy                String?       // Admin user id

  // Payment reference
  transactionRef        String?       // Bank transfer reference
  withdrawalId          String?       // Linked withdrawal

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  providerProfile       ProviderProfile @relation(
    fields: [providerProfileId], references: [id])
  session               Session       @relation(
    fields: [sessionId], references: [id])
  payment               Payment       @relation(
    fields: [paymentId], references: [id])

  @@index([providerProfileId])
  @@index([status])
  @@index([releasedAt])
  @@map("earnings")
}

// Companion withdrawal requests
model Withdrawal {
  id                    String            @id @default(cuid())
  providerProfileId     String
  bankAccountId         String

  amount                Int               // Rupees
  status                WithdrawalStatus  @default(REQUESTED)

  requestedAt           DateTime          @default(now())
  processingAt          DateTime?
  completedAt           DateTime?
  failedAt              DateTime?

  transactionRef        String?           // Bank reference
  failureReason         String?
  processedBy           String?           // Admin user id
  adminNote             String?

  // Earnings included in this withdrawal
  earningIds            String[]

  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  providerProfile       ProviderProfile   @relation(
    fields: [providerProfileId], references: [id])
  bankAccount           BankAccount       @relation(
    fields: [bankAccountId], references: [id])

  @@index([providerProfileId])
  @@index([status])
  @@index([requestedAt])
  @@map("withdrawals")
}

// Companion bank account details
model BankAccount {
  id                    String    @id @default(cuid())
  providerProfileId     String    @unique

  accountHolderName     String
  bankName              String
  accountNumber         String    // Store encrypted
  accountNumberLast4    String    // Last 4 for display
  ifscCode              String
  accountType           String    @default("SAVINGS")
  // SAVINGS / CURRENT

  upiId                 String?   // Optional UPI ID

  isVerified            Boolean   @default(false)
  verifiedAt            DateTime?
  verifiedBy            String?   // Admin who verified

  isPrimary             Boolean   @default(true)
  isActive              Boolean   @default(true)

  addedAt               DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  providerProfile       ProviderProfile @relation(
    fields: [providerProfileId], references: [id])
  withdrawals           Withdrawal[]

  @@map("bank_accounts")
}

// Cancellation records
model CancellationRecord {
  id                    String              @id @default(cuid())
  sessionId             String              @unique
  paymentId             String?             @unique

  cancelledBy           CancelledBy
  cancelReason          String?
  cancelReasonCategory  String?
  // PLANS_CHANGED / FAMILY_EMERGENCY /
  // ELDER_UNWELL / FOUND_ALTERNATIVE /
  // COMPANION_UNAVAILABLE / OTHER

  // Timing
  sessionScheduledAt    DateTime
  cancelledAt           DateTime            @default(now())
  hoursBeforeSession    Float
  window                CancellationWindow

  // Amounts (all in rupees)
  originalAmount        Int                 // What family paid
  refundAmount          Int                 // Family gets back
  companionComp         Int                 // Companion receives
  platformRetained      Int                 // Platform keeps

  // Refund processing
  refundStatus          String              @default("PENDING")
  razorpayRefundId      String?
  refundProcessedAt     DateTime?

  // Companion comp processing
  compStatus            String              @default("PENDING")
  compPaidAt            DateTime?

  // Admin override
  adminOverride         Boolean             @default(false)
  adminNote             String?
  adminId               String?

  createdAt             DateTime            @default(now())

  payment               Payment?            @relation(
    fields: [paymentId], references: [id])

  @@index([sessionId])
  @@index([cancelledBy])
  @@index([window])
  @@map("cancellation_records")
}

// Dispute records
model Dispute {
  id                    String          @id @default(cuid())
  sessionId             String          @unique
  paymentId             String?         @unique
  raisedById            String
  raisedAgainstId       String?         // Provider profile id

  raisedBy              DisputeRaisedBy
  status                DisputeStatus   @default(OPEN)
  severity              String          @default("MEDIUM")
  // LOW / MEDIUM / HIGH

  // What happened
  description           String
  evidenceUrls          String[]        // Uploaded files

  // Financial hold
  amountHeld            Int?
  heldAt                DateTime?

  // Resolution
  resolution            String?
  resolvedBy            String?         // Admin user id
  resolvedAt            DateTime?

  // Financial outcome
  refundAmount          Int?
  companionPenalty      Int?
  platformAbsorbed      Int?

  // Timeline
  adminNotes            String?
  escalatedAt           DateTime?
  escalatedTo           String?

  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  payment               Payment?        @relation(
    fields: [paymentId], references: [id])

  @@index([status])
  @@index([severity])
  @@index([raisedById])
  @@index([createdAt])
  @@map("disputes")
}

// Platform revenue ledger
model PlatformRevenue {
  id                    String    @id @default(cuid())
  sessionId             String?
  paymentId             String?
  sourceType            String
  // SESSION_FEE / CANCELLATION_FEE /
  // LATE_CANCEL_FEE / ADJUSTMENT
  amount                Int       // Rupees
  description           String?
  createdAt             DateTime  @default(now())

  @@index([sourceType])
  @@index([createdAt])
  @@map("platform_revenue")
}

// Financial audit trail (immutable)
model FinancialAuditLog {
  id                    String    @id @default(cuid())
  entityType            String
  // PAYMENT / EARNING / WITHDRAWAL /
  // REFUND / DISPUTE / CANCELLATION
  entityId              String
  action                String
  // CREATED / UPDATED / STATUS_CHANGED /
  // HELD / RELEASED / REFUNDED / PAID
  previousValue         Json?
  newValue              Json?
  actorId               String?   // Who made the change
  actorType             String?   // ADMIN / SYSTEM / WEBHOOK
  note                  String?
  createdAt             DateTime  @default(now())

  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("financial_audit_log")
}
```

### Migration Command

```bash
npx prisma migrate dev --name "complete_financial_system"
```

---

## 2. THE COMPLETE MONEY FLOW — STEP BY STEP

### Every rupee tracked from family's phone to Manjuben's bank.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — BOOKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.1 Family submits request
    → Request record created
    → Status: SUBMITTED

1.2 AI matches → Manjuben selected
    → Session record created
    → Session status: SCHEDULED
    → Payment record created
    → Payment status: PENDING

1.3 Razorpay order created (server-side)
    → razorpayOrderId stored
    → Amount: ₹600 (in paise: 60000)
    → Order valid for 15 minutes

1.4 Family completes payment
    → Razorpay captures ₹600
    → Webhook: payment.captured received
    → Payment status: CAPTURED
    → Payment split calculated:
      Platform fee:      ₹120 (20%)
      Companion share:   ₹480 (80%)

1.5 Earning record created
    → providerProfileId: Manjuben's id
    → amount: ₹480
    → status: PENDING
    → (Money still in Razorpay — 
       no transfer yet)

1.6 Confirmation emails sent
    → Family: session confirmed
    → Manjuben: session confirmed + details
    → AuditLog: PAYMENT_CAPTURED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2.1 Session day — Manjuben checks in
    → GPS logged
    → Timestamp: 10:03 AM
    → Family notified
    → Session status: CHECKED_IN

2.2 Session ends — Manjuben checks out
    → GPS logged
    → Timestamp: 11:24 AM
    → Duration: 1h 21m

2.3 Manjuben submits session note
    → 5 fields completed
    → Note delivered to family instantly
    → Session status: NOTE_SUBMITTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — CONFIRMATION & RELEASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.1 Family receives note
    Two options:
    A: Family taps [ Confirm session ]
       → Session status: COMPLETED
       → Earning status: PENDING → RELEASED
       → Release timestamp recorded
       → 48-hour payment clock starts

    B: No action taken
       → System auto-confirms after 24 hours
       → Same outcome as A

3.2 Dispute window: 24 hours after note
    If family flags concern:
    → Earning status: PENDING → HELD
    → Admin alerted immediately
    → 48-hour payment clock PAUSED
    → Dispute record created
    → See Section 8 for full flow

3.3 48-hour payment window
    → Earning status: RELEASED
    → Admin sees in withdrawal queue
    → Manual transfer processed (V1)
    → Earning status: PROCESSING → PAID
    → SMS to Manjuben: 
      "₹480 transferred to your bank"
    → AuditLog: PAYMENT_RELEASED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — PLATFORM REVENUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 After Manjuben is paid:
    ₹120 remains in Razorpay account
    → PlatformRevenue record created
    → type: SESSION_FEE
    → amount: ₹120
    → Visible in admin financial reports

4.2 Weekly reconciliation (admin):
    Total sessions × ₹120 = platform revenue
    Transferred to operating account
    Financial audit log updated
```

---

## 3. CANCELLATION POLICY — ALL THREE SIDES

### Every scenario. Every rupee. No ambiguity.

---

### 3.1 BY THE SERVICE RECEIVER (Family)

```
WINDOW 1: BEFORE PAYMENT
─────────────────────────────────────────
Trigger: Family cancels before paying
Refund: N/A (no money taken)
Companion receives: ₹0
Platform retains: ₹0
Penalty: None
Reliability impact: None on either side
Action: Session cancelled immediately
        Companion notified: "Request
        cancelled before payment"
        Request marked: CANCELLED

WINDOW 2: 48+ HOURS BEFORE SESSION
─────────────────────────────────────────
Example: Session Thursday 10am
         Cancel Monday evening
Refund: ₹600 (100%)
Companion receives: ₹0
Platform retains: ₹0
Processing: Razorpay full refund
Timeline: 5-7 business days to family
Penalty: None to family
Companion impact: Cancellation logged
                  Not penalised
                  (sufficient notice given)
SMS to family: "Full refund of ₹600
               initiated. 5-7 days."
SMS to Manjuben: "Session cancelled with
                  advance notice. No
                  earnings for this session."

WINDOW 3: 24-48 HOURS BEFORE SESSION
─────────────────────────────────────────
Example: Session Thursday 10am
         Cancel Wednesday morning
Refund: ₹450 (75%)
Companion receives: ₹120 (20% comp)
Platform retains: ₹30 (5% processing)
Processing: Razorpay partial refund ₹450
           Earning record: ₹120 (RELEASED)
           Paid to Manjuben within 48h
Penalty: None to family
         (short but within policy)
Companion impact: Logged as advance cancel
                  (not a no-show)
SMS to family: "₹450 refund initiated.
               Manjuben receives ₹120
               compensation for her time."
SMS to Manjuben: "Session cancelled.
                  You receive ₹120
                  within 48 hours."

WINDOW 4: UNDER 24 HOURS BEFORE SESSION
─────────────────────────────────────────
Example: Session Thursday 10am
         Cancel Wednesday evening
Refund: ₹300 (50%)
Companion receives: ₹240 (40% comp)
Platform retains: ₹60 (10% processing)
Processing: Razorpay partial refund ₹300
           Earning: ₹240 (RELEASED)
           Paid within 48h
Penalty: No financial penalty to family
         beyond policy split
Companion impact: Short-notice cancel logged
                  2+ in month: admin review
SMS to family: "₹300 refund initiated.
               Cancellation policy applied."
SMS to Manjuben: "Session cancelled under
                  24 hours. You receive
                  ₹240 within 48 hours."

WINDOW 5: SAME DAY / NO-SHOW
─────────────────────────────────────────
Example: Session Thursday 10am
         Cancel Thursday 9am
         OR family not home when
         Manjuben arrives
Refund: ₹0
Companion receives: ₹480 (80% — full)
Platform retains: ₹120 (20%)
Processing: Earning: ₹480 (RELEASED)
           Paid within 48 hours
Penalty: None beyond loss of refund
EXCEPTION — GENUINE EMERGENCY:
  Family submits emergency claim
  within 2 hours of session time.
  Admin reviews within 4 hours.
  Admin can override:
  → Grant partial refund (admin discretion)
  → Manjuben receives minimum ₹150
    travel compensation regardless
  Evidence required: 
  hospital document / death certificate /
  police report / natural disaster proof
SMS to family: "No refund applicable.
               Cancellation policy applied."
SMS to Manjuben: "Family did not attend.
                  You receive ₹480
                  within 48 hours."
```

---

### 3.2 BY THE SERVICE PROVIDER (Companion)

```
WINDOW 1: 48+ HOURS NOTICE
─────────────────────────────────────────
Refund to family: ₹600 (100%)
Companion receives: ₹0
Platform: re-matches automatically
          tries top 3 available companions
Companion impact:
  → Advance cancel logged on record
  → 3+ in a month: admin gentle check-in
  → Not shown publicly
  → No trust level impact (first offense)

WINDOW 2: UNDER 24 HOURS NOTICE
─────────────────────────────────────────
Refund to family: ₹600 (100%)
Companion receives: ₹0
Platform: urgent re-match
          notifies 5 companions
          30-minute window
Companion impact:
  → Short-notice cancel logged
  → shortNoticeCancels counter +1
  → 2 in a month: formal warning issued
  → 3 in a month: trust level review

WINDOW 3: NO-SHOW (Companion does not arrive)
─────────────────────────────────────────
Refund to family: ₹600 (100%)
Companion receives: ₹0
Platform: emergency re-match
          admin alerted immediately
          admin calls family within 30 min
Companion impact:
  → noShowCount +1
  → reliabilityScore reduced by 15 points
  → 1st no-show: formal warning issued
  → 2nd no-show: 2-week suspension
  → 3rd no-show: permanent review
SMS to family: "We are very sorry.
               Full refund of ₹600.
               We are finding you
               another companion now."
SMS to Manjuben: "You have been marked
                  as a no-show for today.
                  This has been noted.
                  Admin will contact you."
```

---

### 3.3 BY ADMIN

```
Admin can cancel any session at any time.
Reasons:
  → Safety concern raised
  → Companion suspended mid-session
  → Platform emergency
  → Fraud detected

Admin cancellation outcome:
  → Full refund to family: always
  → Companion payment: admin discretion
    (if session was completed partially:
     prorated payment can be authorised)
  → AuditLog: ADMIN_ACTION recorded
  → Both parties notified with explanation

Admin can also OVERRIDE any cancellation policy:
  → Grant full refund outside policy window
    (genuine emergencies)
  → Increase companion compensation
    (if family clearly at fault)
  → Absorb loss to platform
    (relationship preservation)
All overrides require written admin note.
All overrides permanently in audit log.
```

---

## 4. THE 48-HOUR PAYMENT WINDOW

### How it works. Why it exists. What companions see.

```
THE PROMISE:
"Your earnings are released within 48 hours
 of every completed session. Every time.
 Without fail."

THE TIMELINE:

Session completed (check-out + note submitted)
           ↓
Family confirms OR 24-hour auto-confirm
           ↓
Earning status: RELEASED
48-hour clock starts
           ↓
Admin processes withdrawal queue
(daily — typically morning)
           ↓
Bank transfer initiated (IMPS/NEFT)
           ↓
Money in Manjuben's account
Total time from completion: ≤ 48 hours

WHY 48 HOURS (NOT INSTANT):
1. Dispute window — family has 24h to flag
   concern after session note received.
   If concern raised: earning held,
   clock paused, admin reviews.
   
2. Processing time — admin reviews and
   batches transfers once daily.
   Not a delay — a quality check.
   
3. Bank processing — IMPS is typically
   instant. NEFT takes 2-4 hours.
   Both well within 48-hour window.

WHY NOT WEEKLY:
Because Manjuben should not wait 7 days
to know she is valued. Because trust is
built in hours, not days. Because Rapido
pays drivers daily and we must match that
standard or exceed it.

ADMIN DAILY ROUTINE (V1):
9:00 AM — Open admin → Payments → 
           Withdrawal Queue
           See all RELEASED earnings
           from previous day
Process transfers:
  Download transfer list (CSV)
  Upload to bank portal (bulk NEFT)
  Mark each as PROCESSING
  By 11:00 AM — all transfers sent
  Mark as PAID when bank confirms
  System SMS each companion:
  "₹[amount] transferred to your 
   [Bank] account ending [XXXX]"

V2 AUTOMATION (20+ companions):
  Razorpay Payouts API
  Triggered automatically at 8:00 AM
  For all RELEASED earnings from
  previous 24 hours
  Zero manual work
  Same 48-hour promise kept
```

---

## 5. ALL FINANCIAL UIs — EVERY SCREEN

### Companion Side

```
UI 1 — EARNINGS DASHBOARD
Path: /provider/earnings
(Mobile app: Earnings tab)

┌──────────────────────────────────────┐
│  MY EARNINGS                   [GU]  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Available to withdraw          │  │
│  │ ₹3,840          [DM Mono]      │  │
│  │ [Withdraw to bank →]  Saffron  │  │
│  └────────────────────────────────┘  │
│                                      │
│  Pending release                     │
│  ₹480  (Monday's visit — releasing  │
│          within 24 hours)            │
│                                      │
│  On hold (dispute)                   │
│  ₹0  (none currently)               │
│                                      │
│  ──────────────────────────────────  │
│  THIS MONTH                         │
│  Sessions: 9  |  Earned: ₹4,320    │
│                                      │
│  LAST MONTH                         │
│  Sessions: 12  |  Earned: ₹5,760   │
│                                      │
│  ALL TIME                           │
│  Sessions: 34  |  Earned: ₹16,320  │
│                                      │
│  ──────────────────────────────────  │
│  RECENT SESSIONS                    │
│                                      │
│  Mon 14 Apr  Elder Visit   ₹480 ✓  │
│  Fri 11 Apr  Medicine      ₹304 ✓  │
│  Wed 9 Apr   Elder Visit   ₹480 ✓  │
│  Mon 7 Apr   Hospital      ₹640 ✓  │
│  Fri 4 Apr   Elder Visit   ₹480 ✓  │
│                                      │
│  [ View all sessions ]               │
└──────────────────────────────────────┘

STATUS INDICATORS:
✓ Green = PAID (in bank)
⏳ Gold = RELEASED (processing)
🔒 Coral = HELD (dispute)
○ Grey = PENDING (not yet confirmed)
```

---

```
UI 2 — WITHDRAWAL SCREEN
Path: /provider/earnings/withdraw
(Mobile app: Withdraw tab)

┌──────────────────────────────────────┐
│  WITHDRAW EARNINGS                   │
│                                      │
│  Available: ₹3,840                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Transfer to:                   │  │
│  │ HDFC Bank  ···· 4521          │  │
│  │ Savings Account               │  │
│  │ [ Change bank details ]        │  │
│  └────────────────────────────────┘  │
│                                      │
│  Amount to withdraw:                 │
│  [₹3,840_____________] ← editable   │
│  (Minimum: ₹100)                    │
│                                      │
│  Sessions included:                  │
│  Mon 14 Apr  ₹480                  │
│  Fri 11 Apr  ₹304                  │
│  Wed 9 Apr   ₹480                  │
│  + 6 more sessions                  │
│                                      │
│  Transfers processed within 48 hours │
│                                      │
│  [ Request Withdrawal ]  Sage Green  │
│                                      │
│  ──────────────────────────────────  │
│  PAST WITHDRAWALS                   │
│  7 Apr   ₹2,880   HDFC ···4521  ✓  │
│  31 Mar  ₹1,920   HDFC ···4521  ✓  │
└──────────────────────────────────────┘
```

---

```
UI 3 — BANK DETAILS SCREEN
Path: /provider/profile/bank
(Also shown during onboarding)

┌──────────────────────────────────────┐
│  BANK ACCOUNT DETAILS                │
│                                      │
│  This is where your earnings         │
│  will be transferred.               │
│                                      │
│  Account holder name *               │
│  [Manjuben Patel___________]         │
│  Must match your bank records        │
│                                      │
│  Bank name *                         │
│  [HDFC Bank________________]         │
│                                      │
│  Account number *                    │
│  [________________________]          │
│  (Never shown in full after saving)  │
│                                      │
│  Confirm account number *            │
│  [________________________]          │
│                                      │
│  IFSC code *                         │
│  [HDFC0001234______________]         │
│  [ Find your IFSC → ]               │
│                                      │
│  Account type *                      │
│  ● Savings    ○ Current              │
│                                      │
│  UPI ID (optional)                   │
│  [manjuben@upi____________]          │
│  For faster test transfers           │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ✓ I confirm these bank details │  │
│  │   are correct and belong to me │  │
│  └────────────────────────────────┘  │
│                                      │
│  [ Save Bank Details ] Sage Green    │
│                                      │
│  🔒 Your bank details are encrypted  │
│     and only used for NearDear       │
│     earnings transfers               │
└──────────────────────────────────────┘
```

---

### Family / Receiver Side

```
UI 4 — PAYMENT SCREEN
Path: /session/[id]/payment

┌──────────────────────────────────────┐
│  NearDear                            │
│                                      │
│  Complete your payment               │
│  "Session confirmed immediately      │
│   after payment."                   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ PAYMENT SUMMARY                │  │
│  │                                │  │
│  │ Service                        │  │
│  │ Elder Support Visit            │  │
│  │                                │  │
│  │ Companion                      │  │
│  │ Manjuben Patel                 │  │
│  │ ● Home Trusted                 │  │
│  │                                │  │
│  │ Session                        │  │
│  │ Thursday, 17 Apr · 10:00 AM   │  │
│  │                                │  │
│  │ Total amount                   │  │
│  │ ₹600      Manjuben gets ₹480  │  │
│  └────────────────────────────────┘  │
│                                      │
│  [ Complete Payment → ] Saffron     │
│  🔒 Secure payment via Razorpay      │
│                                      │
│  ──────────────────────────────────  │
│  Free cancellation up to 48 hours   │
│  before your session.               │
│  [ Cancellation policy ↗ ]          │
│                                      │
│  ← Back to session details           │
└──────────────────────────────────────┘
```

---

```
UI 5 — PAYMENT CONFIRMED SCREEN
Path: /session/[id]/confirmed

┌──────────────────────────────────────┐
│  ✓ Payment confirmed                 │
│                                      │
│  [MP avatar — Sage Green]            │
│  Manjuben Patel will visit           │
│  Thursday, 17 April at 10:00 AM     │
│                                      │
│  "You will receive a notification    │
│   the moment Manjuben checks in      │
│   at your parent's door."           │
│                                      │
│  WHAT HAPPENS NEXT:                 │
│                                      │
│  ✓ Manjuben has been notified        │
│  ○ She arrives Thursday at 10am     │
│  ○ You get a check-in alert         │
│  ○ You receive a visit note after   │
│                                      │
│  ──────────────────────────────────  │
│  Would you like an intro call        │
│  with Manjuben before the visit?    │
│                                      │
│  [ ✓ Schedule intro call ]          │
│  [ → No, proceed ]                  │
│                                      │
│  ──────────────────────────────────  │
│  [ View session details ]            │
│  [ Go to dashboard ]                 │
│                                      │
│  ──────────────────────────────────  │
│  CANCELLATION POLICY (small text)   │
│  48h+ before: full refund           │
│  24-48h: 75% refund                 │
│  Under 24h: 50% refund              │
│  Same day: no refund                │
│  Companion no-show: full refund     │
│  [ Full policy ↗ ]                  │
└──────────────────────────────────────┘
```

---

```
UI 6 — CANCELLATION MODAL
Shown when family clicks [ Cancel session ]

┌──────────────────────────────────────┐
│  Cancel your session with Manjuben?  │
│                                      │
│  Session: Thursday 17 Apr, 10:00 AM │
│  Time until session: 38 hours        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ REFUND CALCULATION             │  │
│  │                                │  │
│  │ You paid:          ₹600        │  │
│  │ Your refund:       ₹450 (75%) │  │
│  │ Manjuben receives: ₹120 (20%) │  │
│  │ Processing fee:    ₹30  (5%)  │  │
│  │                                │  │
│  │ Reason: 24-48 hour notice      │  │
│  └────────────────────────────────┘  │
│                                      │
│  Refund in 5-7 business days to      │
│  your original payment method.       │
│                                      │
│  Reason (optional):                  │
│  ○ Plans changed                     │
│  ○ Family emergency                  │
│  ○ Elder unwell                      │
│  ○ Found alternative help            │
│  ○ Other                             │
│                                      │
│  [ Confirm cancellation ] Coral      │
│  [ Keep my session ]      Teal       │
└──────────────────────────────────────┘
```

---

### Admin Side

```
UI 7 — WITHDRAWAL QUEUE
Path: admin.neardear.in/payments/withdrawals

┌──────────────────────────────────────────────────────┐
│  WITHDRAWAL QUEUE          Today: Mon 14 Apr         │
│                                                      │
│  PENDING TRANSFERS                                   │
│  ────────────────────────────────────────────────    │
│  Total to process: ₹9,120  |  Companions: 4          │
│                                                      │
│  [ Download Transfer CSV ]  [ Mark All Processing ]  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Manjuben Patel    ₹3,840   HDFC ···4521     │   │
│  │ 9 sessions  |  Requested: Yesterday 6pm     │   │
│  │ [ Process ] [ View earnings ] [ Hold ]       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Rameshbhai P.     ₹2,100   SBI  ···8834     │   │
│  │ 5 sessions  |  Requested: Yesterday 4pm     │   │
│  │ [ Process ] [ View earnings ] [ Hold ]       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  PROCESSED TODAY                                     │
│  ────────────────────────────────────────────────    │
│  Priyaben S.   ₹1,440   ✓ Transferred 9:15 AM       │
│  Ref: HDFC20240414091523                             │
│                                                      │
│  ON HOLD (disputes)                                  │
│  ────────────────────────────────────────────────    │
│  Sureshbhai K.  ₹960   🔒 Dispute #D-2026-0042      │
│  [ View Dispute ]                                    │
└──────────────────────────────────────────────────────┘
```

---

```
UI 8 — FINANCIAL DASHBOARD
Path: admin.neardear.in/payments

┌──────────────────────────────────────────────────────┐
│  FINANCIAL OVERVIEW         April 2026               │
│                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│  │ Total      │ │ Platform   │ │ Companion  │       │
│  │ Revenue    │ │ Earnings   │ │ Payments   │       │
│  │ ₹48,000   │ │ ₹9,600    │ │ ₹38,400   │       │
│  │ 80 sessions│ │ (20%)     │ │ (80%)     │       │
│  └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│  │ Pending    │ │ Refunds    │ │ Disputes   │       │
│  │ Release    │ │ This Month │ │ Open       │       │
│  │ ₹2,880    │ │ ₹1,200    │ │ 2          │       │
│  └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
│  PAYMENT POLICY SETTINGS                             │
│  ────────────────────────────────────────────────    │
│  Companion share:     80%  [ Edit ]                  │
│  Platform share:      20%  (auto)                    │
│  Auto-confirm after:  24h  [ Edit ]                  │
│  Payment window:      48h  [ Edit ]                  │
│                                                      │
│  REVENUE CHART (last 8 weeks)                        │
│  [Bar chart — Saffron bars]                          │
│                                                      │
│  RECENT TRANSACTIONS                                 │
│  ────────────────────────────────────────────────    │
│  14 Apr  Session #S-0234  ₹600  Captured  ✓        │
│  14 Apr  Session #S-0233  ₹400  Captured  ✓        │
│  13 Apr  Refund  #R-0012  ₹600  Refunded  ↩        │
│  13 Apr  Session #S-0232  ₹1000 Captured  ✓        │
│                                                      │
│  [ Export Payment Ledger CSV ]                       │
└──────────────────────────────────────────────────────┘
```

---

## 6. CAPTURING BANK DETAILS — COMPANION ONBOARDING

### Shown during application Stage 2. Optional at that stage. Required before first withdrawal.

```
WHEN TO SHOW:

Option A — During Application (recommended)
Show as an optional step at the END of
the companion application form, after
the Declaration step.

"Almost done. Add your bank details now
 so your first earnings transfer is
 ready the moment you are activated."

Optional — they can skip and add later.
But show the earning potential to motivate:

┌──────────────────────────────────────┐
│  ADD BANK DETAILS (Optional now)     │
│                                      │
│  WHAT YOU COULD EARN:               │
│                                      │
│  With 3 sessions/week:               │
│  ┌────────────────────────────────┐  │
│  │ Elder visits (2×/week) ₹3,840 │  │
│  │ Medicine pickup (1×/week)₹1,216│  │
│  │ ─────────────────────────────  │  │
│  │ Monthly estimate:    ₹5,056   │  │
│  │ Working ~8 hrs/week            │  │
│  └────────────────────────────────┘  │
│                                      │
│  Earnings released within 48 hours   │
│  of every completed session.         │
│  Directly to your bank. Every time.  │
│                                      │
│  [ Add bank details now ]            │
│  [ Skip — add later in profile ]     │
│                                      │
│  You can add or update bank details  │
│  anytime from your profile.         │
└──────────────────────────────────────┘

Option B — First Withdrawal Request
If they skipped during onboarding:
When they tap [ Withdraw to bank ]
for the first time — show bank
details form before withdrawal screen.

"Before your first withdrawal, please
 add your bank account details."

WHAT IS COLLECTED:
  Account holder name (required)
  Bank name (required)
  Account number (required, confirmed twice)
  IFSC code (required)
  Account type: Savings / Current (required)
  UPI ID (optional — faster for testing)

SECURITY:
  Account number encrypted in database
  Only last 4 digits shown in UI
  IFSC validated against bank API
  One confirmation entry required
  Admin verifies before first withdrawal
  Admin verification shown in UI:
  "✓ Bank details verified by NearDear team"
  OR
  "⏳ Verification pending — 
    first withdrawal within 24 hours"

THE EARNING POTENTIAL FRAMEWORK
(Why they should add details and join):

Show this on the companion landing page,
the application confirmation, and the
earnings dashboard for new companions:

TRUST LEVEL 0 (starting out):
Remote sessions only
3-5 sessions/week possible
Monthly estimate: ₹3,000–6,000
Working: ~5-8 hours/week

TRUST LEVEL 1 (after 5 sessions):
Field services unlocked
5-10 sessions/week possible
Monthly estimate: ₹6,000–12,000
Working: ~10-15 hours/week

TRUST LEVEL 2 (after 10 sessions):
Home visits unlocked
8-15 sessions/week possible
Monthly estimate: ₹12,000–25,000
Working: ~15-25 hours/week

TRUST LEVEL 3 (after 25 sessions):
All services + recurring care
10-20 sessions/week possible
Monthly estimate: ₹25,000–40,000
Working: ~20-35 hours/week

TEAM OPERATOR BONUS:
Build a team of 4 companions.
Earn 10% of their sessions too.
Team of 4 × ₹12,000 = ₹48,000/month
Your 10% share: ₹4,800 + own sessions
Total potential: ₹15,000–20,000/month
As an operator.
```

---

## 7. SUSPENSION, PAUSE, DISCONTINUE — EFFECT ON PAYMENTS

### Every account state change has a defined financial outcome.

```
STATE 1 — SELF-PAUSE (Companion initiated)
─────────────────────────────────────────────
Trigger: Companion taps [ Pause account ]
Duration: 1 week / 2 weeks / 1 month / 
          Until manually resumed

EFFECT ON MATCHING:
→ accountStatus = PAUSED immediately
→ Invisible in matching engine instantly
→ No new requests routed to them

EFFECT ON PAYMENTS:
→ Existing RELEASED earnings: 
  paid normally within 48 hours
→ Existing PENDING earnings:
  held until session confirmed,
  then released and paid normally
→ In-progress sessions:
  MUST be honoured (already committed)
  OR companion must individually cancel
  (subject to cancellation policy)
→ No new earnings created during pause

EFFECT ON BANK DETAILS:
→ Unchanged
→ Withdrawal can still be requested
  during pause for existing earnings

REACTIVATION:
→ One tap: [ Resume accepting requests ]
→ accountStatus = ACTIVE immediately
→ Matching engine picks up within minutes
→ Trust level: unchanged
→ Reliability score: unchanged

─────────────────────────────────────────────
STATE 2 — SELF-CANCEL (Companion closes account)
─────────────────────────────────────────────
Trigger: Companion taps [ Close account ]
         Types "CLOSE" to confirm

EFFECT ON MATCHING:
→ accountStatus = REMOVED immediately
→ Invisible everywhere
→ No new requests ever

EFFECT ON PAYMENTS:
→ All RELEASED earnings:
  paid within 7 days (final payment run)
→ All PENDING earnings:
  sessions must complete first
  then paid within 7 days
→ Any HELD earnings (dispute):
  held until dispute resolved
  then paid or forfeited per resolution
→ Recurring plans: cancelled immediately
  families notified + re-matched

FINAL PAYMENT NOTIFICATION:
"Your account is closing.
 Final earnings of ₹[amount] will be
 transferred to your bank within 7 days."

DATA RETENTION:
→ Profile data: retained 6 months
→ After 6 months: anonymised
→ Financial records: retained 7 years
  (legal requirement)
→ Bank details: deleted immediately
  on account closure

─────────────────────────────────────────────
STATE 3 — ADMIN SUSPENSION (Platform initiated)
─────────────────────────────────────────────
Trigger: Admin action (conduct violation,
         concern, investigation)
Types:
  TEMPORARY: 1-4 weeks specified
  INDEFINITE: until investigation complete
  PERMANENT: account removed

EFFECT ON MATCHING:
→ accountStatus = SUSPENDED immediately
→ Invisible in all matching
→ Existing confirmed sessions: 
  admin decides case by case
  (urgent re-match OR allow to complete
   if no safety concern)

EFFECT ON PAYMENTS — TEMPORARY SUSPENSION:
→ All RELEASED earnings: HELD
→ All PENDING earnings: HELD
→ Withdrawal requests: blocked
→ Reason shown: "Account under review.
  Earnings held pending resolution."
→ If suspension lifted:
  All held earnings released
  Paid within 48 hours

EFFECT ON PAYMENTS — PERMANENT REMOVAL:
→ All RELEASED earnings:
  admin reviews each one
  Valid sessions paid within 14 days
  Invalid sessions (if fraud found):
  forfeited, may be recovered
→ All PENDING earnings: forfeited
→ Recurring plans: cancelled
  full refund to families
→ Bank details: retained 7 years
  (financial records requirement)

NOTIFICATION ON SUSPENSION:
"Your NearDear account has been suspended
 pending review. Your earnings are held
 during this period.
 Admin will contact you within 24 hours."

─────────────────────────────────────────────
STATE 4 — RE-VERIFICATION OVERDUE
─────────────────────────────────────────────
Trigger: 12 months since activation
         PCC expired or not renewed

EFFECT ON MATCHING:
→ 30 days warning: account still active
→ Day 31: accountStatus = PAUSED (auto)
→ Invisible in matching

EFFECT ON PAYMENTS:
→ Existing earnings: paid normally
→ New sessions: cannot be created
→ Withdrawal: still available

NOTIFICATION SEQUENCE:
Day -30: "Your annual re-verification
          is due in 30 days."
Day -7:  "7 days left. Please complete
          re-verification to stay active."
Day -1:  "Tomorrow your account pauses
          until re-verification complete."
Day 0:   "Account paused. Complete
          re-verification to resume."

REACTIVATION:
→ Upload new PCC
→ Complete brief re-interview
→ Admin approves
→ accountStatus = ACTIVE
→ Matching resumes immediately
```

---

## 8. DISPUTE PROTECTION FRAMEWORK

### What happens when something goes wrong.

```
WHO CAN RAISE A DISPUTE:
→ Family / receiver: within 24 hours 
  of session completion
→ Companion: at any time during or
  after session
→ Admin: proactively at any time

HOW TO RAISE:
Family: [ Flag a concern ] button
        on session confirmation screen
        or visit note screen

Companion: [ I need to flag something ]
           button in session protocol screen
           or [ Flag concern ] in 
           session history

Admin: Dispute panel in admin dashboard

WHAT HAPPENS IMMEDIATELY ON RAISE:
→ Dispute record created
→ Earning status: PENDING/RELEASED → HELD
→ Admin alerted: HIGH PRIORITY
→ Both parties notified:
  "A concern has been raised about
   this session. Admin is reviewing.
   Earnings held pending resolution."
→ 48-hour payment clock: PAUSED

─────────────────────────────────────────────
SEVERITY LEVELS:
─────────────────────────────────────────────

LOW (admin reviews within 48 hours):
  → Session note missing or inadequate
  → Companion arrived late
  → Family unhappy with service quality
  → Minor scope deviation

MEDIUM (admin reviews within 24 hours):
  → Companion did not complete service
  → Family claims session did not happen
  → Significant scope violation
  → Communication breakdown

HIGH (admin reviews within 4 hours):
  → Safety concern raised
  → Allegation of rule violation
  → Financial misconduct alleged
  → Companion requested cash/gift
  → Inappropriate behaviour reported

─────────────────────────────────────────────
ADMIN REVIEW PROCESS:
─────────────────────────────────────────────

Step 1: Admin reads full dispute description
Step 2: Admin reviews:
  → Check-in timestamp (GPS)
  → Check-out timestamp (GPS)
  → Session note (submitted?)
  → Session duration
  → Family feedback form
  → Past history of both parties
  → Any previous concerns

Step 3: Admin contacts both parties
  → Calls family within the SLA window
  → Calls companion within the SLA window
  → Records conversation notes

Step 4: Admin makes decision

─────────────────────────────────────────────
RESOLUTION OUTCOMES:
─────────────────────────────────────────────

OUTCOME A — SESSION VALID
Evidence shows session happened correctly.
→ Earning status: HELD → RELEASED
→ Paid to companion within 48 hours
→ Family notified: "After reviewing,
  we have confirmed the session was
  completed as expected."
→ No refund to family
→ Dispute closed

OUTCOME B — SESSION INVALID
Evidence shows session did not happen
or was significantly incomplete.
→ Full refund to family: ₹600
→ Companion earning: ₹0
→ Companion record: concern noted
→ Reliability score: reduced
→ Family notified: "We are sorry.
  Full refund processed."
→ Companion notified: "Decision made.
  No earnings for this session."

OUTCOME C — PARTIAL RESOLUTION
Evidence is mixed. Partial service delivered.
→ Partial refund to family (admin decides)
→ Companion receives partial earning
  (admin decides)
→ Both notified with explanation
→ Admin note on both records

OUTCOME D — SAFETY CONCERN CONFIRMED
Serious rule violation confirmed.
→ Companion: immediate suspension
  pending full investigation
→ Family: full refund + apology call
  from admin personally
→ Companion: all future earnings HELD
  until investigation complete
→ Police involvement if warranted

─────────────────────────────────────────────
DISPUTE PROTECTION FOR COMPANIONS:
─────────────────────────────────────────────

Companions are also protected.
If a family repeatedly cancels,
makes false claims, or is abusive:

→ Admin can flag the family account
→ Admin can block a family from
  booking specific companions
→ Admin can require a family to
  provide evidence before future
  dispute claims are processed
→ Companion can request to not be
  matched with a specific family again
  (quietly honoured by admin)

The platform protects both sides.
Not just the family. Not just the companion.
Both.
```

---

## 9. COMPLETE PAYMENT POLICY + TERMS & CONDITIONS

### Two separate policy pages. One for each side.
### Shown as expandable section OR separate page.
### Must be agreed to at onboarding.

---

### 9.1 FOR SERVICE RECEIVERS (Families)

```
Page path: /policies/payment-policy-receiver
Also accessible as expandable section on:
  → Payment confirmation screen
  → Session detail page
  → Account settings

TITLE:
NearDear Payment & Cancellation Policy
For Families and Service Receivers

LAST UPDATED: March 2026

─────────────────────────────────────────────
1. HOW PAYMENT WORKS
─────────────────────────────────────────────
When you book a session on NearDear.in,
you pay the full session fee upfront
through Razorpay, our payment partner.

Your payment is held securely until the
session is completed and confirmed.
We then release 80% of your payment to
your companion and retain 20% as our
platform fee.

All prices shown include the platform fee.
The companion's earnings are shown
transparently on every booking.

─────────────────────────────────────────────
2. CANCELLATION POLICY
─────────────────────────────────────────────

Before payment:
Free cancellation at any time.
No charge.

48+ hours before your session:
Full refund. 100% of amount paid.

24-48 hours before your session:
75% refund. 20% goes to your companion
as compensation for their time.
5% is retained as processing fee.

Under 24 hours before your session:
50% refund. 40% goes to your companion.
10% retained as processing fee.

Same day or no-show:
No refund. Your companion receives their
full earnings as compensation for being
ready to serve you.

GENUINE EMERGENCIES:
If you face a genuine emergency on the
day of your session (hospitalisation,
bereavement, natural disaster), contact
us immediately. We review emergency
claims within 4 hours and may grant
a partial or full refund at our discretion.
Evidence will be required.

─────────────────────────────────────────────
3. REFUND TIMELINE
─────────────────────────────────────────────
All refunds are processed through Razorpay
and typically reach your account within
5-7 business days, depending on your
bank and payment method.

UPI refunds: typically 1-3 business days
Card refunds: typically 5-7 business days
Net banking: typically 3-5 business days

─────────────────────────────────────────────
4. DISPUTES
─────────────────────────────────────────────
If you are unhappy with a session, you
can raise a concern within 24 hours of
receiving the session note.

We review all disputes within 24-48 hours.
Your earnings payment to the companion
is held during review.

We will contact you to understand
what happened and make a fair decision.

─────────────────────────────────────────────
5. WHAT WE DO NOT CHARGE
─────────────────────────────────────────────
No booking fee.
No platform subscription.
No hidden charges.
You pay only the session fee shown.

─────────────────────────────────────────────
6. PLATFORM DISCLAIMER
─────────────────────────────────────────────
NearDear.in connects families with
verified companions. We are not responsible
for the quality of advice or service
provided. All companions are independent
individuals, not employees of NearDear.

For medical emergencies, call 112.

─────────────────────────────────────────────
7. CONTACT
─────────────────────────────────────────────
Payment queries: hello@neardear.in
Disputes: support@neardear.in
Emergency: [support phone number]

I AGREE TO THIS POLICY: [ ✓ checkbox ]
Required at first booking.
Stored permanently on your account.
```

---

### 9.2 FOR SERVICE PROVIDERS (Companions)

```
Page path: /policies/payment-policy-companion
Also accessible from:
  → Earnings dashboard
  → Declaration step of application
  → Profile settings

TITLE:
NearDear Companion Earnings Policy
For All Service Providers

LAST UPDATED: March 2026

─────────────────────────────────────────────
1. HOW YOU EARN
─────────────────────────────────────────────
For every session you complete on NearDear,
you receive 80% of the session fee.
The platform retains 20% as its fee.

This split is fixed. It will never change
without giving you 60 days written notice
and your right to exit without penalty.

Example:
Family pays ₹600 → You receive ₹480
Family pays ₹1,000 → You receive ₹800
Family pays ₹300 → You receive ₹240

Your earnings are always shown transparently
in your earnings dashboard, session by
session.

─────────────────────────────────────────────
2. WHEN YOU GET PAID
─────────────────────────────────────────────
Your earnings are released within 48 hours
of every completed session.

Timeline:
Session completed → Note submitted
→ Family confirms (or auto-confirm 24h)
→ Earning released
→ Admin processes transfer within 48 hours
→ Money in your bank account

We process transfers daily (Monday-Saturday).
Sessions confirmed on a given day are
paid within 48 hours.

This is our promise. We keep it.

─────────────────────────────────────────────
3. CANCELLATION — WHAT YOU RECEIVE
─────────────────────────────────────────────
If a family cancels your session:

48+ hours before: ₹0
(Sufficient notice — no compensation)

24-48 hours before: 20% of session fee
(You receive ₹120 on a ₹600 session)

Under 24 hours before: 40% of session fee
(You receive ₹240 on a ₹600 session)

Same day / family no-show: 80% (full)
(You receive ₹480 on a ₹600 session)

Compensation is paid within 48 hours
of the cancellation, same as regular earnings.

─────────────────────────────────────────────
4. IF YOU CANCEL
─────────────────────────────────────────────
48+ hours notice: No penalty. Cancellation
logged on your record.

Under 24 hours: Cancellation logged.
2 in one month triggers admin review.

No-show: Formal warning. Reliability
score reduced. Repeat no-shows lead
to suspension review.

When you cancel, the family receives
a full refund. You receive ₹0.

─────────────────────────────────────────────
5. BANK DETAILS AND WITHDRAWAL
─────────────────────────────────────────────
You must provide valid bank account
details to receive payments.

You can request a withdrawal at any time
for your available (released) earnings.

Minimum withdrawal: ₹100
Processing time: Within 48 hours
of your withdrawal request.

Your bank details are encrypted and
only used for NearDear earnings transfers.

─────────────────────────────────────────────
6. DISPUTES AND HELD EARNINGS
─────────────────────────────────────────────
If a family raises a concern about a session,
your earnings for that session are held
pending admin review.

We review all disputes within 24-48 hours.
We contact both you and the family.
We make a fair decision based on evidence.

If the session is confirmed as valid:
Your earnings are released immediately.

If the dispute is upheld:
Your earnings for that session are
forfeited, partially or fully.

You can also raise a concern about a
family or a session at any time.
We protect companions too.

─────────────────────────────────────────────
7. SUSPENSION — EFFECT ON EARNINGS
─────────────────────────────────────────────
If your account is suspended by admin:
All released earnings are held during
the suspension period.

If suspension is lifted: earnings released.
If account is permanently removed:
Valid earnings from completed sessions
are paid within 14 days after review.

─────────────────────────────────────────────
8. YOUR TRUST LEVEL AND EARNINGS
─────────────────────────────────────────────
Your trust level is never taken away
except for a conduct violation.

Higher trust level = higher-value services
= higher earnings potential.

Trust levels are earned by completing
sessions reliably and receiving positive
feedback. They cannot be purchased
or fast-tracked.

─────────────────────────────────────────────
9. THE EARNINGS PROMISE
─────────────────────────────────────────────
NearDear makes these commitments to you:

✓ 80% of every session fee. Always.
✓ Payment within 48 hours. Every time.
✓ Full transparency. Every rupee shown.
✓ Fair dispute resolution. Both sides heard.
✓ Your trust level protected. Yours to keep.
✓ 60 days notice before any policy change.
✓ Right to exit at any time without penalty.

─────────────────────────────────────────────
10. CONTACT
─────────────────────────────────────────────
Earnings queries: companion@neardear.in
Dispute queries: support@neardear.in
Bank transfer issues: hello@neardear.in

I AGREE TO THIS POLICY: [ ✓ checkbox ]
Required at application Declaration step.
Stored permanently on your account.
Shown again before first session.
```

---

### 9.3 IMPLEMENTING THE POLICY PAGES

```
CREATE THESE FILES:

1. src/app/policies/payment-policy-receiver/page.tsx
   Full policy page for families.
   Warm Cream background.
   Clean typography.
   Printable.
   Last updated date visible.
   [ Back ] button.

2. src/app/policies/payment-policy-companion/page.tsx
   Full policy page for companions.
   Same design.

3. src/components/PolicyAgreement.tsx
   Reusable component for agreement checkboxes.
   
   Props:
   - policyType: 'receiver' | 'companion'
   - onAgree: () => void
   
   Shows:
   □ I have read and agree to NearDear's
     Payment & Cancellation Policy
     [ View full policy ↗ ]
   
   □ I understand the cancellation
     timeline and refund structure
   
   □ I consent to my payment/earnings
     being processed as described

   For companions additionally:
   □ I understand the 48-hour payment
     promise and what it requires of me
   □ I agree that conduct violations
     may affect my earnings

4. EXPANDABLE SUMMARY COMPONENT:
   src/components/CancellationSummary.tsx
   
   Shows on:
   → Payment screen (receiver)
   → Session detail page
   → Booking confirmation
   
   Collapsed state:
   "Free cancellation up to 48 hours
    before your session. [ Details ▼ ]"
   
   Expanded state:
   Full cancellation table with amounts.
   [ View full policy ↗ ]

5. WHERE AGREEMENTS ARE CAPTURED:
   
   Receiver:
   → First booking (Step 4 of request flow)
   → Stored: user.consentTerms = true
   → Timestamp stored in user.consentAt
   → Never shown again after first booking
   
   Companion:
   → Application Declaration step (Step 8)
   → Stored: separate CompanionConsent record
   → Must re-confirm if policy changes
   → Timestamp stored permanently

6. CompanionConsent model (add to schema):

model CompanionConsent {
  id                  String    @id @default(cuid())
  providerProfileId   String
  policyVersion       String    @default("1.0")
  agreedAt            DateTime  @default(now())
  ipAddress           String?
  userAgent           String?

  @@index([providerProfileId])
  @@map("companion_consents")
}
```

---

## MIGRATION COMMAND

```bash
npx prisma migrate dev --name "complete_financial_and_policy_system"
```

---

## SUMMARY — ALL FINANCIAL DECISIONS LOCKED

```
EARNINGS SPLIT:        80% companion / 20% platform
PAYMENT WINDOW:        Within 48 hours of confirmation
AUTO-CONFIRM:          24 hours after session note
DISPUTE WINDOW:        24 hours after note received
DISPUTE SLA:           LOW 48h / MEDIUM 24h / HIGH 4h
MIN WITHDRAWAL:        ₹100

CANCELLATION (by receiver):
  Before payment:      Free
  48h+:                100% refund
  24-48h:              75% refund, 20% comp
  Under 24h:           50% refund, 40% comp
  Same day:            0% refund, 80% comp

CANCELLATION (by companion):
  48h+:                0% earning, full family refund
  Under 24h:           0% earning, warning logged
  No-show:             0% earning, formal warning

SUSPENSION EFFECT:     All earnings HELD until resolved
PAUSE EFFECT:          Existing earnings paid normally
ACCOUNT CLOSE:         Final payment within 7 days

POLICY AGREEMENT:      Required at first booking (receiver)
                       Required at Declaration step (companion)
                       Stored with timestamp permanently
```

---

```
NearDear.in — Master Money Flow Document v1.0
March 2026 | Ahmedabad, India
Private and Confidential

"Every rupee on this platform is tracked,
 transparent, and reaches the right person
 at the right time. Always."
```
