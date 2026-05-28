# PRD: AI-Powered Nigerian Exam Practice Platform MVP

## 1. tl;dr

Build a web-based exam preparation platform for Nigerian students preparing for **UTME/JAMB, WASSCE/WAEC, and POST-UTME/POST-JAMB**. The MVP will allow students to practice past questions by exam type, subject, and year, receive instant feedback, review explanations, and chat with a real-time AI tutor tied to each question.

The platform will use the **ALOC Questions API** as the initial source of past questions. ALOC provides access to Nigerian past questions across UTME, WASSCE, and POST-UTME, with API endpoints for fetching questions by subject, exam type, year, and question ID.

The MVP should focus on one core promise:

> Practice real Nigerian exam questions, understand every mistake, and get unstuck instantly with an AI tutor.

---

## 2. Problem Statement

Millions of Nigerian students prepare for high-stakes exams like UTME/JAMB, WASSCE/WAEC, and POST-UTME using past questions. Past questions are useful because they expose students to exam formats, recurring concepts, and time pressure. But the current experience is often incomplete.

Students can access questions, but they still struggle with:

- Understanding why an answer is correct.
- Knowing what topic or concept they are weak in.
- Getting help at the exact moment they are confused.
- Practicing consistently without a teacher, tutor, or study group.
- Tracking progress across subjects and exam types.
- Building confidence before the real exam.

Most past-question products act like static question banks. They show questions, accept answers, and sometimes reveal the correct answer. That is not enough.

The opportunity is to create a practice platform that behaves more like a personal tutor: it gives students real exam questions, immediate feedback, and conversational support that helps them understand the reasoning behind each answer.

---

## 3. Target Users

### Primary User: Nigerian Secondary School / Pre-University Student

A student preparing for:

- UTME/JAMB
- WASSCE/WAEC
- POST-UTME/POST-JAMB

Typical needs:

- Wants to pass with a high score.
- Studies mostly on a phone or shared computer, but MVP will be web-first.
- May have inconsistent internet.
- May not be able to afford frequent private tutoring.
- Needs simple explanations, not academic walls of text.
- Wants to practice fast, see progress, and know what to improve.

### Secondary User: Parent / Guardian

A parent paying for access or encouraging usage.

Needs:

- Confidence that the product improves readiness.
- Simple progress indicators.
- Proof that the student is practicing.

For MVP, parents are **not** a dedicated user surface. Their needs can be supported later through reports.

### Tertiary User: School / Tutorial Center

Potential future buyer.

Needs:

- Student performance dashboards.
- Assignments.
- Cohort analytics.

This is **not part of the MVP**, but the architecture should not block it.

---

## 4. Goals

### Business Goals

1. **Validate demand for AI-assisted exam practice**
   - Prove that students do not just want past questions; they want explanations and tutor-style support.

2. **Drive repeat usage**
   - Exam prep products win when students return multiple times per week.
   - The MVP should optimize for practice streaks, completed sessions, and tutor interactions.

3. **Create a scalable content foundation**
   - Use ALOC to bootstrap question coverage quickly.
   - Design the data model so future exams can be added later: professional exams, IELTS, TOEFL, SAT, GRE, nursing exams, accounting exams, etc.

4. **Identify willingness to pay**
   - MVP can launch free or freemium.
   - Instrument usage to learn which features users would pay for: unlimited AI tutor, detailed analytics, mock exams, study plans.

5. **Build trust**
   - Accuracy matters. A wrong explanation destroys confidence.
   - The MVP must make it easy for users to report questionable questions, answers, or explanations.

### User Goals

1. Practice past questions for their exam.
2. Filter practice by exam type, subject, and year.
3. Know immediately whether their answer is correct.
4. Understand the reasoning behind the correct answer.
5. Ask follow-up questions in natural language.
6. Review weak areas after practice.
7. Feel more confident before the exam.

### Non-Goals

The MVP will **not** include:

- Native mobile apps.
- School admin dashboards.
- Parent dashboards.
- Live human tutoring.
- Payment/subscription engine unless needed for a private beta.
- User-generated question uploads.
- Full adaptive learning engine.
- Offline mode.
- Peer chat/community.
- Full exam syllabus mapping for every subject.
- Professional or international exams.

---

## 5. MVP Scope

### In Scope

#### 1. Student Account Creation

Students should be able to:

- Sign up with email and password.
- Log in.
- Save progress.
- Resume practice history.

Optional MVP shortcut:

- Allow Google sign-in if implementation is easy.
- But do not let auth complexity delay the core learning loop.

#### 2. Exam Selection

Student chooses:

- UTME/JAMB
- WASSCE/WAEC
- POST-UTME/POST-JAMB

Important naming note: product UI can use familiar student language like “JAMB/UTME” and “WAEC/WASSCE,” while the backend maps these to ALOC’s API values: `utme`, `wassce`, and `post-utme`.

#### 3. Subject Selection

Students choose from supported subjects.

Initial MVP subjects should prioritize the highest-demand Nigerian exam subjects:

- English
- Mathematics
- Biology
- Chemistry
- Physics
- Government
- Economics
- Literature in English
- Commerce
- Accounting

ALOC-documented subjects include English, Mathematics, Commerce, Accounting, Biology, Physics, Chemistry, English Literature, Government, CRK, Geography, Economics, IRK, Civic Education, Insurance, Current Affairs, and History.

#### 4. Practice Session

A student can start a practice session by selecting:

- Exam type
- Subject
- Optional year
- Number of questions

Session modes for MVP:

1. **Practice Mode**
   - Student answers one question at a time.
   - They get immediate feedback after submitting.
   - AI tutor is available after answer submission.

2. **Timed Mode**
   - Student chooses a timer.
   - Feedback appears after completion.
   - AI tutor is available during review, not during the timed attempt.

Opinionated MVP call: launch both if feasible, but prioritize **Practice Mode**. It is better for learning and showcases the AI tutor more clearly.

#### 5. Question Experience

Each question screen should include:

- Question text.
- Answer options.
- Exam type.
- Subject.
- Year, when available.
- “Submit answer” button.
- Immediate correct/incorrect state.
- Correct answer after submission.
- Explanation area.
- “Ask AI Tutor” panel.
- “Report issue” link.

The user experience must be clean and fast. Students should not feel like they are filling out a school form.

#### 6. AI Tutor

The AI tutor is the product’s sharp edge.

The tutor should be context-aware. It should know:

- The question.
- The answer options.
- The correct answer.
- The student’s selected answer.
- The subject.
- The exam type.
- The year, if available.
- Any provided explanation/solution from ALOC.
- The student’s recent attempts in the session, where useful.

The tutor should help students:

- Understand why the correct answer is correct.
- Understand why their answer was wrong.
- Break down concepts step-by-step.
- Ask simpler follow-up questions.
- Generate similar practice questions.
- Explain in simpler English.
- Give memory aids.
- Recommend what topic to revise.

The tutor should **not** simply give answers upfront before the student attempts the question in Practice Mode. This is important. The product should encourage effort before assistance.

Recommended tutor prompts:

- “Explain this like I’m new to the topic.”
- “Why is my answer wrong?”
- “Show me a shortcut.”
- “Give me a similar question.”
- “What topic should I revise?”
- “Explain in simpler English.”

#### 7. AI Tutor Safety and Accuracy Guardrails

The tutor must be explicit when it is unsure.

Required behavior:

- If the API answer appears inconsistent with the question, the tutor should say: “This answer may need review. Let’s reason through it.”
- The tutor should avoid inventing exam facts.
- The tutor should not claim official affiliation with JAMB, WAEC, or universities.
- The tutor should keep explanations age-appropriate.
- The tutor should avoid giving harmful, discriminatory, or abusive content.
- The tutor should recommend reporting questionable questions.

#### 8. Results and Progress

After each session, students see:

- Number attempted.
- Number correct.
- Score percentage.
- Time spent.
- Questions missed.
- Topics/concepts inferred from missed questions.
- Suggested next practice action.

MVP analytics do not need perfect topic tagging. A good enough first version:

- Use subject plus AI-generated concept labels.
- Example: “Organic Chemistry,” “Comprehension,” “Algebra,” “Government Institutions.”

#### 9. Practice History

Students can view:

- Past sessions.
- Scores by subject.
- Recent incorrect questions.
- Questions they asked the AI tutor about.

This is important because students should feel progress over time.

#### 10. Report Question

Students can report:

- Typo in question.
- Wrong option.
- Wrong answer.
- Poor explanation.
- Other issue.

Product recommendation: store reports internally first, then optionally forward to ALOC. This gives the team visibility into content quality issues and protects the user experience.

---

## 6. User Stories

### Student Onboarding

- As a student, I want to create an account so that my practice history and progress are saved.
- As a student, I want to select the exam I am preparing for so that the platform shows me relevant questions.
- As a student, I want to choose my subjects so that my dashboard reflects what I am actually studying.

### Practice

- As a student, I want to practice questions by subject so that I can improve in one area at a time.
- As a student, I want to filter questions by year so that I can practice recent or specific past papers.
- As a student, I want to see whether my answer is correct immediately so that I can learn while the question is still fresh.
- As a student, I want to review missed questions so that I do not repeat the same mistakes.

### AI Tutor

- As a student, I want to ask why an answer is correct so that I understand the reasoning.
- As a student, I want the tutor to explain my mistake so that I know what went wrong.
- As a student, I want simpler explanations when I am confused so that I can keep learning without shame.
- As a student, I want similar questions so that I can confirm I understand the concept.

### Progress

- As a student, I want to see my scores over time so that I know whether I am improving.
- As a student, I want suggestions on what to practice next so that I do not waste time guessing.

### Quality

- As a student, I want to report a bad question or wrong answer so that I do not learn incorrect information.

---

## 7. User Experience

### First-Time User Flow

#### Step 1: Landing Page

The landing page should make the promise obvious:

> Practice JAMB, WAEC, and Post-UTME past questions with an AI tutor that explains every answer.

Primary CTA:

- Start Practicing

Secondary CTA:

- Try a Sample Question

Landing page sections:

- Supported exams.
- Example question with AI tutor preview.
- Benefits:
  - Practice real past questions.
  - Get instant explanations.
  - Track weak subjects.
  - Prepare smarter.

#### Step 2: Sign Up

User creates account with:

- Name
- Email
- Password

Optional:

- Target exam
- Exam year
- Subjects

Do not overdo onboarding. The student came to practice.

#### Step 3: Exam Setup

Ask:

- “Which exam are you preparing for?”
  - JAMB/UTME
  - WAEC/WASSCE
  - POST-UTME

Then:

- “Choose your subjects.”

#### Step 4: Dashboard

Dashboard should show:

- Continue practice CTA.
- Start new practice CTA.
- Selected exam.
- Selected subjects.
- Recent score.
- Weakest subject.
- Practice streak.
- Recent missed questions.

Opinionated UX: the dashboard should feel motivational, not administrative.

Suggested dashboard copy:

> You’re getting stronger in Chemistry. Your last score was 62%. Let’s push it above 70%.

#### Step 5: Start Practice

Student selects:

- Subject
- Exam type
- Year: optional
- Number of questions: 10, 20, 40
- Mode: Practice or Timed

#### Step 6: Answer Question

Question page:

```text
Chemistry · UTME · 2010

[Question text]

A. Option A
B. Option B
C. Option C
D. Option D

[Submit Answer]
```

After submit:

```text
Correct / Incorrect

Correct answer: B

Why:
[Short explanation]

Need help?
[Ask AI Tutor]
```

#### Step 7: AI Tutor Interaction

Tutor opens in a side panel or modal.

Suggested layout:

- Left: question and answer.
- Right: AI tutor conversation.

Initial tutor message:

> You selected C, but the correct answer is B. Want me to explain the concept, show a shortcut, or give you a similar question?

The tutor should offer buttons, because students often do not know what to ask.

Quick actions:

- Explain simply.
- Why was my answer wrong?
- Give me a similar question.
- What topic is this?
- Show shortcut.

#### Step 8: Session Summary

After final question:

```text
You completed 20 Chemistry questions.

Score: 13/20 — 65%
Time: 18 minutes
Strong areas: Atomic Structure, Acids and Bases
Needs work: Organic Chemistry, Stoichiometry

Recommended next:
Practice 10 more Stoichiometry questions.
```

CTA:

- Review missed questions.
- Start another session.
- Ask AI to create a revision plan.

---

## 8. Narrative

A student named Ada is preparing for JAMB. She has a chemistry textbook, a pile of past questions, and pressure from everyone around her. She practices at night after school, but when she gets a question wrong, the answer key only says “B.” No explanation. No teacher. No one to ask.

She keeps moving, but the same topics keep defeating her. Organic chemistry. Stoichiometry. Electrolysis. Her confidence drops.

Now imagine Ada opens the platform.

She selects **JAMB/UTME**, chooses **Chemistry**, and starts a 20-question practice session. The first few questions are familiar. Then she misses one. Instead of simply showing “wrong,” the platform tells her the correct answer and opens the door to understanding:

> You chose C, but the correct answer is B. The trick is that this question is testing mole ratio, not mass directly.

Ada asks:

> Explain it like I’m new to this.

The AI tutor breaks it down step by step. No judgment. No embarrassment. Ada asks for a similar question. She answers it correctly. That small win matters.

After the session, Ada sees that she scored 65%, but more importantly, she sees why. She is strong in atomic structure but weak in stoichiometry. The platform recommends a short follow-up practice session. She does it.

Over time, the platform becomes more than a question bank. It becomes Ada’s study companion. It helps her practice, understand, and build confidence. For the business, this creates a habit loop: practice, feedback, tutor help, progress, repeat.

That is the MVP’s job.

Not to be the biggest question database on day one.

To be the place where students finally understand the questions they keep getting wrong.

---

## 9. Functional Requirements

### Authentication

#### Requirements

- Users can sign up.
- Users can log in.
- Users can log out.
- Users can reset password.
- User session persists securely.

#### Acceptance Criteria

- A new user can create an account in under 60 seconds.
- A returning user can log in and see previous practice history.
- User data is isolated by account.

### Exam and Subject Setup

#### Requirements

- User can select target exam.
- User can select one or more subjects.
- User can update selected subjects later.
- System maps UI exam names to ALOC API exam types.

#### Acceptance Criteria

- “JAMB/UTME” maps to `utme`.
- “WAEC/WASSCE” maps to `wassce`.
- “POST-UTME” maps to `post-utme`.
- Subject names map correctly to ALOC-supported subject parameters.

### Question Retrieval

#### Requirements

- System fetches questions from ALOC by subject.
- System optionally filters by exam type.
- System optionally filters by year.
- System supports fetching a single question by ID.
- System stores normalized question records locally after retrieval.

#### Acceptance Criteria

- User can start a session with at least 10 questions.
- Questions display with answer options.
- Correct answer is available for grading.
- Failed API requests show a helpful error state.
- Duplicate questions are avoided within the same session where possible.

#### Technical Note

Do not rely only on live ALOC calls at render time. Cache question payloads internally after retrieval. This improves speed, reduces API call volume, and allows internal analytics.

### Practice Session

#### Requirements

- User can start a practice session.
- User can answer questions one by one.
- User can submit an answer.
- System grades the answer.
- System records attempt data.
- User can move to the next question.
- User can end the session early.

#### Acceptance Criteria

- Every submitted answer is saved.
- Session score updates correctly.
- User cannot accidentally submit twice.
- User can review completed questions.

### Timed Mode

#### Requirements

- User can choose timed mode.
- Timer is visible.
- Session auto-submits or ends when time expires.
- Feedback is shown at the end.

#### Acceptance Criteria

- Timer persists through page refresh where possible.
- User receives a clear warning before time ends.
- AI tutor is not used to answer live timed questions unless product chooses to allow hints later.

Opinionated call: Timed Mode should simulate pressure. Tutor support belongs in review, not during the attempt.

### AI Tutor

#### Requirements

- User can open AI tutor from a question.
- Tutor receives question context.
- Tutor receives student answer context.
- Tutor can explain correct answer.
- Tutor can explain why selected answer is wrong.
- Tutor can generate similar questions.
- Tutor can simplify explanation.
- Tutor can recommend revision topics.
- Tutor conversation is saved.

#### Acceptance Criteria

- Tutor response references the specific question.
- Tutor does not answer unrelated questions as if they are part of the exam flow.
- Tutor does not claim certainty where the source answer may be questionable.
- Tutor interactions are tied to question ID and session ID.
- User can return to prior tutor explanations.

#### Tutor Prompt Requirements

The AI system should receive structured context like:

```json
{
  "exam_type": "utme",
  "subject": "chemistry",
  "year": "2010",
  "question_id": "12345",
  "question": "...",
  "options": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "correct_answer": "B",
  "student_answer": "C",
  "source_explanation": "...",
  "student_level": "secondary/pre-university",
  "mode": "post_answer_explanation"
}
```

The tutor should be instructed to:

- Explain step-by-step.
- Use simple language.
- Encourage reasoning.
- Avoid long lectures unless requested.
- Ask a short check-for-understanding question when useful.
- Flag uncertainty if answer quality appears questionable.

### Progress Dashboard

#### Requirements

Dashboard shows:

- Total questions attempted.
- Overall accuracy.
- Accuracy by subject.
- Recent sessions.
- Weakest subjects or concepts.
- Recommended next action.

#### Acceptance Criteria

- Dashboard updates after every session.
- Student can click into a subject to see history.
- Incorrect questions are easy to revisit.

### Report Question

#### Requirements

- User can report a question.
- User can choose issue type.
- User can add a message.
- Report is stored internally.
- Report can optionally be forwarded to ALOC.

#### Issue Types

- Question typo.
- Wrong option.
- Wrong answer.
- Poor explanation.
- Other.

#### Acceptance Criteria

- Report is associated with user, question ID, subject, session, and timestamp.
- User sees confirmation after reporting.
- Admin/internal team can review reports.

---

## 10. Data Requirements

### Core Entities

#### User

- id
- name
- email
- password hash
- selected exams
- selected subjects
- created_at
- last_active_at

#### Question

- id
- external_source: `ALOC`
- external_question_id
- exam_type
- subject
- year
- question_text
- options
- correct_answer
- source_explanation
- raw_payload
- created_at
- updated_at

#### PracticeSession

- id
- user_id
- exam_type
- subject
- year
- mode
- total_questions
- started_at
- completed_at
- score
- accuracy
- duration_seconds

#### Attempt

- id
- session_id
- user_id
- question_id
- selected_answer
- correct_answer
- is_correct
- time_spent_seconds
- created_at

#### TutorConversation

- id
- user_id
- session_id
- question_id
- messages
- created_at
- updated_at

#### QuestionReport

- id
- user_id
- question_id
- subject
- issue_type
- message
- status
- created_at

---

## 11. Success Metrics

### Activation Metrics

- Percent of new users who start a practice session.
- Percent of new users who complete at least 10 questions.
- Time from signup to first answered question.
- Percent of users who interact with AI tutor in first session.

### Engagement Metrics

- Questions attempted per active user per week.
- Practice sessions per active user per week.
- AI tutor messages per active user.
- Repeat usage within 7 days.
- Average session completion rate.
- Missed-question review rate.

### Learning Metrics

- Accuracy improvement by subject over time.
- Repeat incorrect rate on previously missed concepts.
- Percent of students who improve after AI tutor interaction.
- Number of similar questions completed after tutor explanation.

### Quality Metrics

- Question report rate.
- AI explanation thumbs-up/down.
- Tutor escalation rate: “I still don’t understand.”
- Incorrect or disputed answer reports.

### Business Metrics

- Weekly active users.
- Signup-to-active-practicer conversion.
- Cost per active learner.
- AI cost per completed session.
- Retention by exam type.
- Future: free-to-paid conversion.

---

## 12. Technical Considerations

### ALOC API Integration

ALOC endpoints include examples for fetching:

- One question.
- Many questions.
- Several questions.
- Questions by year.
- Questions by exam type.
- Questions by type and year.
- Question by ID and subject.

The API requires an `AccessToken` header for calls.

### Recommendation

Create an internal Question Service that:

1. Accepts product-level filters.
2. Converts them to ALOC parameters.
3. Fetches from ALOC.
4. Normalizes the response.
5. Caches/stores questions locally.
6. Serves the frontend from your own backend.

This prevents the frontend from depending directly on ALOC availability and gives you control over performance, data cleanup, and analytics.

### AI Architecture

Recommended flow:

1. Student submits answer.
2. Backend grades answer.
3. Backend prepares tutor context.
4. AI tutor receives structured context.
5. Tutor response is streamed to frontend.
6. Conversation is stored.

For MVP, use a single tutor mode:

- Question explanation after answer submission.

Later modes:

- Pre-exam revision coach.
- Personalized study planner.
- Mock exam review assistant.
- Parent/school summary generator.

### Latency

Target:

- Question load: under 2 seconds.
- Answer grading: instant or under 500ms.
- First AI tutor token: under 3 seconds.
- Full tutor response: under 10 seconds for normal explanations.

### Cost Control

AI tutor cost can grow quickly. MVP controls:

- Limit tutor usage per free user.
- Use short default explanations.
- Offer quick action prompts instead of open-ended rambling.
- Cache AI explanations for repeated questions where no student-specific answer is needed.
- Use longer AI responses only when requested.

### Content Quality

Past-question APIs may contain typos, wrong answers, or inconsistent formatting. Build for this from day one.

Required:

- Internal report system.
- AI uncertainty behavior.
- Admin review queue, even if simple.
- Ability to override a question’s correct answer or explanation locally.

### Privacy

Store only necessary student data.

Avoid exposing:

- API access token in frontend.
- Raw AI provider keys.
- Sensitive user info in AI prompts unless needed.

### Scalability

The data model should support future exams by making `exam_type` configurable, not hardcoded.

Future exam categories:

- Professional exams.
- International exams.
- University-specific POST-UTME.
- Certification exams.

---

## 13. AI Tutor Product Requirements

### Tutor Personality

The tutor should be:

- Patient.
- Clear.
- Encouraging.
- Direct.
- Exam-focused.
- Simple, not childish.

Good tutor tone:

> Nice try. Your thinking was close, but the question is testing a different concept.

Bad tutor tone:

> Incorrect. The answer is B because the textbook says so.

### Tutor Response Format

Default response should be short:

```text
The correct answer is B.

Here’s why:
1. The question is asking about...
2. Option B fits because...
3. Option C is tempting, but it is wrong because...

Quick check:
Can you explain why option C does not work?
```

### Tutor Follow-Up Features

The tutor should support:

- “Explain more simply.”
- “Give me an example.”
- “Give me a similar question.”
- “Summarize this.”
- “What should I revise?”
- “Why not option A?”
- “Teach me the concept.”

### Tutor Limitations

The tutor should not:

- Guarantee exam success.
- Claim to know future exam questions.
- Encourage cheating.
- Provide unrelated homework completion without learning support.
- Pretend to be an official WAEC/JAMB source.

---

## 14. Admin / Internal Tools

For MVP, internal tools can be basic but should exist.

### Admin Needs

- View reported questions.
- Search questions.
- See most disputed questions.
- Review AI tutor downvotes.
- Override local explanation.
- Disable problematic questions.
- View API usage.
- View AI usage cost.

Admin tooling can be a simple protected page. Do not overbuild it, but do not skip it.

---

## 15. Milestones & Sequencing

### Milestone 1: Foundation — XX weeks

Build:

- User authentication.
- Exam and subject setup.
- ALOC API integration.
- Question normalization.
- Basic dashboard.
- Local database schema.

Exit criteria:

- A signed-in user can select exam/subject and fetch real questions.

### Milestone 2: Core Practice Loop — XX weeks

Build:

- Practice session creation.
- Question answering.
- Instant grading.
- Session summary.
- Practice history.

Exit criteria:

- A student can complete a 10-question session and see their score.

### Milestone 3: AI Tutor — XX weeks

Build:

- Tutor panel.
- Question-context prompt.
- Follow-up chat.
- Suggested tutor actions.
- Conversation storage.
- Basic safety/uncertainty behavior.

Exit criteria:

- A student can ask the tutor about any completed question and receive a contextual explanation.

### Milestone 4: Progress and Review — XX weeks

Build:

- Dashboard metrics.
- Incorrect question review.
- Subject-level performance.
- Recommended next practice.
- Basic concept tagging.

Exit criteria:

- A student can see what they are weak in and continue practicing from that insight.

### Milestone 5: Quality and Beta Readiness — XX weeks

Build:

- Report question flow.
- Admin review queue.
- AI feedback rating.
- Performance improvements.
- Error handling.
- Analytics instrumentation.

Exit criteria:

- Product is ready for a controlled beta with Nigerian students preparing for UTME/WASSCE/POST-UTME.

---

## 16. MVP Launch Criteria

The MVP is ready to launch when:

- Users can sign up and log in.
- Users can select exam and subject.
- Users can complete practice sessions.
- Questions load reliably from stored/cache-backed ALOC data.
- Answers are graded correctly.
- AI tutor works for submitted questions.
- Practice history is saved.
- Reports can be submitted.
- Core analytics are tracked.
- The team can monitor API usage and AI costs.

---

## 17. Risks and Mitigations

### Risk 1: ALOC API Reliability

If ALOC has downtime or rate limits, practice sessions may fail.

Mitigation:

- Cache questions locally.
- Pre-fetch popular subjects.
- Build graceful error states.
- Track API failures.

### Risk 2: Incorrect Answers or Poor Question Quality

Students may lose trust if answers are wrong.

Mitigation:

- Add reporting.
- Allow local overrides.
- Let AI flag uncertainty.
- Monitor disputed questions.

### Risk 3: AI Hallucination

Tutor may generate wrong explanations.

Mitigation:

- Provide structured question context.
- Keep tutor grounded in provided answer/options.
- Encourage uncertainty when needed.
- Add thumbs up/down.
- Review low-rated explanations.

### Risk 4: AI Cost Escalation

Heavy tutor usage may become expensive.

Mitigation:

- Usage limits.
- Cached generic explanations.
- Short default responses.
- Paid tiers later for unlimited tutor support.

### Risk 5: Students Want Mobile Immediately

The target market may be mobile-heavy.

Mitigation:

- Build responsive web app from day one.
- Design mobile-first layouts.
- Delay native app, not mobile usability.

### Risk 6: Too Many Exams Too Early

Expanding too quickly will dilute quality.

Mitigation:

- Stay focused on UTME, WASSCE, and POST-UTME.
- Nail the learning loop first.
- Add new exams only after retention is proven.

---

## 18. Open Questions

1. Will the MVP be free, paid, or freemium?
2. Which exam should be the primary launch wedge: JAMB/UTME, WAEC/WASSCE, or POST-UTME?
3. Do we want students to practice anonymously before signup?
4. Should AI tutor access be unlimited during beta?
5. Will we generate AI explanations proactively for every question, or only when students ask?
6. Should we include NECO soon, since ALOC references NECO in the repository description, even though the stated MVP focus is UTME/WASSCE/POST-UTME?
7. How much local moderation/review capacity will the team have?
8. Do we want to support mock exam mode in MVP or reserve it for v1?
9. What is the initial success target: engagement, exam outcomes, revenue, or school partnerships?

---

## 19. Strong Product Opinion

The MVP should **not** try to be the largest exam prep platform immediately.

It should win on one thing:

> A student gets a question wrong, asks “why?”, and finally understands.

That is the magic moment.

Everything else — dashboards, streaks, mock exams, subscriptions, mobile apps, school portals — should support that learning loop. Do not let them distract from it.

For the first beta, I would narrow even further:

- Start with **JAMB/UTME**.
- Launch with **English, Mathematics, Biology, Chemistry, Physics, Government, and Economics**.
- Make **Practice Mode + AI Tutor** excellent.
- Add Timed Mode only after the core tutor loop feels strong.

That focus will get cleaner feedback, faster iteration, and a better shot at building something students actually come back to.

---

## Sources Consulted

- ALOC GitHub repository: https://github.com/Seunope/aloc-endpoints
- ALOC API parameters wiki: https://github.com/Seunope/aloc-endpoints/wiki/API-Parameters
- ALOC Questions API website: https://questions.aloc.com.ng/

