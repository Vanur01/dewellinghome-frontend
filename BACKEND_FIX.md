# Backend Fix Required

## Problem

Pre-save hook `isModified` check ki wajah se milestones recalculate nahi ho rahi properly.
Database mein stale/inconsistent values hain.

## Fix 1 — Schema pre-save hook (PaymentSchedule model)

Remove the `isModified` early-return check:

```js
// REMOVE these lines from pre-save hook:
if (!this.isModified("milestones") && !this.isModified("totalProjectValue")) {
  return next();
}
```

After fix, the hook should look like:

```js
paymentScheduleSchema.pre("save", function (next) {
  if (
    !this.milestones ||
    this.milestones.length === 0 ||
    !this.totalProjectValue
  ) {
    return next();
  }
  // NO isModified check — always recalculate

  const milestones = this.milestones;
  const total = this.totalProjectValue;

  // Step 1: baseAmount
  milestones.forEach((m) => {
    m.baseAmount = Math.round(total * (m.percentage / 100));
  });

  // Fix rounding on last milestone
  const baseSum = milestones.reduce((s, m) => s + m.baseAmount, 0);
  if (milestones.length > 0 && baseSum !== total) {
    milestones[milestones.length - 1].baseAmount += total - baseSum;
  }

  // Step 2: Cascade carry-forward
  let runningOutstanding = 0;
  milestones.forEach((m) => {
    m.carriedOverOutstanding = runningOutstanding;
    m.amount = m.baseAmount + m.carriedOverOutstanding;
    m.toBePaid = Math.max(0, m.amount - m.actualPaid);

    if (m.actualPaid === 0) {
      m.status = "pending";
    } else if (m.actualPaid >= m.amount) {
      m.status = "paid";
    } else {
      m.status = "partially_paid";
    }

    runningOutstanding = m.toBePaid;
  });

  // Step 3: Schedule totals
  this.totalPaid = milestones.reduce((s, m) => s + m.actualPaid, 0);
  this.totalRemaining = total - this.totalPaid;
  this.lastUpdated = new Date();
  next();
});
```

## Fix 2 — One-time data fix (run once in MongoDB)

Existing documents mein stale data hai. Ek migration script run karo:

```js
// Run this once to fix all existing payment schedules
const schedules = await PaymentSchedule.find({});
for (const schedule of schedules) {
  schedule.markModified("milestones");
  schedule.markModified("totalProjectValue");
  await schedule.save();
}
console.log("All schedules recalculated");
```

## Root Cause

Phase 2 mein `carriedOverOutstanding: 0` but `amount: 35000` — yeh inconsistency
isliye hai kyunki hook ne `amount` update kiya tha ek baar (35000 = 27500 + 7500)
but baad mein `carriedOverOutstanding` field add hone ke baad hook ne sirf
`carriedOverOutstanding` recalculate kiya (0 set kar diya) bina `amount` update kiye.
