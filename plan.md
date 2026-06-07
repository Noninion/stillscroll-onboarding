# Stillscroll Launch Plan

Source: funnel audit from May 31, 2026 against `http://localhost:5173/`.

Use this as the working checklist for launch readiness. Items are ordered by importance, with low-priority polish removed to keep the plan manageable.

## P0 - Launch Blockers

- [ ] P0.1 Wire waitlist submission to real storage.
  - Current behavior appears to simulate success after a short delay and logs the payload to the console.
  - A successful submission must persist the lead somewhere production can access.
  - Verify saved leads include email, timestamp, and acquisition/source metadata when available.

- [x] <span style="color:#666"><s><em>P0.2 Remove dev navigation from production and ad traffic.</em></s></span>
  - Done: guarded to local Vite dev only, with `VITE_SHOW_DEV_NAV=true` override.
  - The bottom step toolbar exposes the full funnel.
  - Keep it only behind a local/dev guard or remove it from production builds entirely.

- [x] <span style="color:#666"><s><em>P0.3 Fix current-hours vs target-hours logic.</em></s></span>
  - Done: target slider is clamped to `currentHours - 1`.
  - Target usage must not be higher than current usage in the normal savings path.
  - Constrain target hours to a lower value, guide users to a realistic first target, or branch low-usage users into a different question.
  - Hide savings claims when the delta is zero or negative.

- [x] <span style="color:#666"><s><em>P0.4 Make all savings math dynamic and correct.</em></s></span>
  - Done: shared usage math helper drives reframe, plan, and confirmation screens.
  - Yearly saved days: `(currentHours - targetHours) * 365 / 24`.
  - Lifetime reclaimed years: `(currentHours - targetHours) * 85 / 24`.
  - Remove hardcoded outcomes such as "Save 30 days this year" unless they match the user's inputs.

## P1 - Trust And Claim Safety

- [ ] P1.1 Replace or substantiate social proof.
  - Review claims including `1,000,000+ people`, `1M+ people`, `4.7 rating`, beta tester quotes, and `583/1000` spots.
  - If the product is pre-launch, use honest founding-waitlist language instead of mature social proof.
  - If any proof is real, add enough context to make it believable, such as sample size, beta status, or source.

- [ ] P1.2 Soften unsupported scientific and outcome claims.
  - Replace broad statements like "Science agrees" with more defensible behavior-change framing.
  - Avoid precise claims such as "Feel 30% calmer" unless there is evidence behind them.
  - Cite specific studies or experts before claiming backing from longitudinal studies, systematic reviews, or behavioral science experts.

- [ ] P1.3 Clarify what the user is joining before email capture.
  - Add a concise pre-email screen or section explaining the product format, such as iOS app, Android app, browser extension, or waitlist.
  - Include what happens after joining, expected launch timing if known, and whether pricing is final or estimated.

## P2 - Funnel Logic And UX Friction

- [ ] P2.1 Improve selection behavior for multi-choice questions.
  - Make "Nothing yet" mutually exclusive with other past-attempt options.
  - When a max selection count is reached, show clear feedback such as "Choose up to 3".
  - Consider letting a fourth tap replace the oldest selection, if that fits the interaction style.

- [ ] P2.2 Improve form validation feedback.
  - Show an inline email validation message when the entered address is malformed.
  - Do not rely only on a disabled submit button to explain what is wrong.

- [ ] P2.3 Revisit default slider values.
  - Current usage defaults to 4h and target usage defaults to 3h.
  - Choose defaults that avoid weak deltas and reduce the chance of invalid target/current combinations.

- [ ] P2.4 Shorten the cold-traffic path.
  - The current flow has about 23 steps before email capture.
  - Test removing age if it is not used for visible personalization or segmentation.
  - Consider removing or A/B testing one life-math/reframe screen.

- [ ] P2.5 Keep calculation/loading screens reliable and brief.
  - The calculating screen can feel artificial if it takes too long.
  - Make sure it finishes predictably on mobile ad traffic.

## P3 - Product Clarity And Conversion

- [ ] P3.1 Show the core product mechanic earlier.
  - Move or preview the "breathe to unlock scroll" mechanic before lower-value questions.
  - The product idea is the hook and should not be buried.

- [ ] P3.2 Add one concrete product demo asset.
  - Preferred demo: open a scrolling app, trigger the Stillscroll pause, complete the breathing ring, unlock minutes.
  - Use this near the mechanic explanation, where it can reduce text and increase belief.

- [ ] P3.3 Make the final plan more personalized.
  - Reflect the user's selected goals, apps, hooks, emotions, and current/target usage in the plan output.
  - Ensure the plan does not feel generic after collecting many answers.

- [ ] P3.4 Capture useful intent metadata.
  - Persist goals, apps, hooks, emotions, current hours, target hours, age if kept, and campaign/source data.
  - Use this for segmentation, follow-up messaging, and ad iteration.

## Copy Cleanup

- [ ] C.1 Resolve the launch-state mismatch.
  - "Be first when Stillscroll launches" conflicts with ratings, million-user claims, and a mature-looking 7-day plan.
  - Decide whether the product is pre-launch, beta, or launched, then align all copy to that state.

- [ ] C.2 Replace vulnerable or awkward phrasing.
  - Consider changing "Your nervous system has work to do" to "Your plan starts with your nervous system" or "Let's make the pause easier."
  - Change "Practice every day or more" to "Practice daily" or "Build a daily pause."

- [ ] C.3 Explain "Library Access" if it remains in the unlock section.
  - Make clear what the library contains and why it matters.
  - Remove it if it is not part of the real product promise.

## Definition Of Launch Ready

- [ ] D.1 A real user can complete the funnel and be saved to the waitlist.
- [ ] D.2 Production users cannot see dev-only navigation.
- [ ] D.3 Savings math is correct for all valid current/target combinations.
- [ ] D.4 Invalid or non-positive savings combinations do not show misleading outcomes.
- [ ] D.5 All social proof, ratings, scarcity, beta, and science claims are either true and defensible or replaced with honest copy.
- [ ] D.6 The user understands what Stillscroll is and what joining the waitlist means before submitting an email.
