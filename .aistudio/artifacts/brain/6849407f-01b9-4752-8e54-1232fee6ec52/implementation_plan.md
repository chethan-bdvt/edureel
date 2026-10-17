# LearnLoop - Educational Video & AI Learning App

LearnLoop is a fun, safe, and engaging educational short-video application designed for kids and students from Nursery & Pre-K through Middle School (Grades 1–8). It pairs bite-sized animated educational reels with an interactive AI learning assistant, voice interactions, asynchronous custom video generation, structured quizzes, parent-friendly controls, and an Admin Portal for content management and publishing.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following adjustments have been incorporated based on your latest directives:

- **Offline Download Option Removed**:
  - Removed all "Download (external)" buttons and the dedicated offline downloads tab.
  - Replaced the downloads screen with the **Admin Dashboard & Content Publishing Studio** (accessible via an Admin Switcher or Settings/Profile).
- **Asynchronous Background Video Generation & Ad Workflow**:
  - When the user clicks "Create Video" / "Generate Reel", a full-screen **video ad** starts playing with a 5-second skip countdown.
  - As soon as the user skips or completes the ad, **the ad dismisses immediately** and returns the user to the app.
  - Generation continues seamlessly in the **background** while the user explores reels, searches library topics, or chats with the assistant.
  - A persistent **Top-Bar Notification Toast / Banner** appears with sound and animation when the generation completes: *"🎉 Your custom video is ready! [Watch Now]"*.
  - Clicking "Watch Now" immediately opens the new custom video in the reel player.
- **Admin Dashboard**:
  - Key operational metrics: Total Educational Reels (live count), Monetized Ad Impressions, Videos Completed, Active Learners, and Subject Breakdown.
  - Platform controls: Ad frequency regulator, safety review log, and curriculum coverage gauges.
- **Admin Content Publishing Studio**:
  - Admin interface allowing teachers/administrators to post and publish new educational reels.
  - Configurable fields: Video Title, Grade Range (Nursery/Pre-K, 1–2, 3–5, 6–8), Subject, Summary, 3 Key Learning Points, and an Interactive Quiz with answers.
  - Instant publishing to the main "For You", "Community", and "Explore" feeds with an "Official Admin Post" badge.
- **Retained Cost & Bandwidth Optimizations**:
  - Bounded pre-buffering (active video + 1 adjacent only; distant media evicted).
  - Strict 720p medium-quality resolution ceiling.
  - 1-Minute inactivity auto-pause watchdog.
  - Monetization ads every 5 contents watched.

---

### 1. Overview & Core Concept

- **What It Does**: LearnLoop provides bite-sized, high-engagement educational short reels for kids from Nursery/Pre-K to Grade 8, paired with an AI Learning Assistant, background custom video creation, comprehensive quizzes, parent controls, and a full Admin Dashboard with content authoring.
- **Target Audience / Persona**:
  - *Nursery & Pre-K (Ages 3–5)*: Animal sounds, ABCs, shapes, counting, and nursery songs.
  - *Elementary (Grades 1–5)*: Fractions, plant cycles, earth science, and grammar.
  - *Middle School (Grades 6–8)*: Algebra, cell biology, world history, and physics.
  - *Admins & Educators*: Publishing official curriculum reels and monitoring platform metrics.
  - *Parents*: Screen-time management, safe search filters, and study reports.

---

### 2. User Experience & Visual Design

#### Screen Roster & Navigation Architecture

1. **Top Bar Notification Zone (System-Wide)**:
   - Dynamic banner that slides down smoothly from the top header when a background video completes:
     - *"✨ Your video 'Photosynthesis in Action' is ready! [Watch Now] [Dismiss]"*
     - Tapping "Watch Now" instantly transitions to the player with the new video.

2. **Swipe & Learn (Home Feed)**:
   - Vertical video reel player with tabs: `For You`, `Subjects`, `Following`.
   - Strict ±1 buffer: loads only active and adjacent reel to save bandwidth.
   - Creator overlay, tags, like/comment/save counters, and play/pause/mute toggles.
   - Interstitial ad displays every 5 contents watched.

3. **Detailed View (Concept Deck & Quiz)**:
   - 720p video stage, duration scrubber, CC subtitles, tabs: `Summary`, `Key Points`, `Quiz`.
   - Audio narration player with voice playback.
   - Interactive multi-choice quiz with immediate visual feedback.
   - *(Offline download button removed per user request).*

4. **AI Learning Assistant (Voice Chat + AI)**:
   - Mascot `LoopBot` with animated expressions.
   - Dialogue bubbles with playable embedded reel previews.
   - Voice microphone button (`Tap to speak`) using Web Speech recognition and audio playback.

5. **Request Custom Video & Ad-Gated Background Pipeline**:
   - Topic input with mic icon and prompt suggestions.
   - Grade selector (Nursery/Pre-K up to Grade 8) and Subject grid.
   - "Create Video" button triggers the **Video Ad Modal**.
   - **Skip Ad Action**: Clicking "Skip Ad" closes the ad immediately and shows a floating indicator: *"Generating your video in background (45%)... Feel free to explore!"*
   - User continues using the app unblocked until the top notification announces completion.

6. **Explore Library**:
   - Instant search bar, Subject filter chips (`All`, `Pre-K`, `Math`, `Science`, `English`, `Social`).
   - Popular Topics visual cards (Algebra, Space, Human Body, Phonics).
   - Categorized subjects directory with video counts.

7. **User Created Content (Community)**:
   - Tabs: `Trending`, `Latest`, `My Feed`.
   - Student and educator creators with follow toggles and comment drawers.
   - Displays newly published Admin reels at the top with an "Admin Verified" badge.

8. **Admin Dashboard**:
   - Platform analytics:
     - 📊 Total Published Videos & Watch Minutes
     - 💰 Ad Impressions & Estimated Revenue
     - 👥 Active Students across Nursery, Elementary, and Middle School
     - 📚 Curriculum Distribution chart
   - Content Management table with unpublish/feature actions.

9. **Admin Content Publishing Studio (Post Contents)**:
   - Form for admins to create and post official learning content:
     - Title, Grade Level, Subject Category, Duration
     - Animation scene style selector (Cartoon, Sci-Fi Lab, Nature Canvas, Blueprint)
     - Learning Summary & 3 Key Bullet Points
     - Interactive Quiz builder (Question, 3 Options, Correct Answer Index)
   - "Publish to LearnLoop" action that instantly broadcasts the reel to the home feed.

10. **Track Your Progress & Achievements**:
    - Profile header (Chethan, Grade 7 or Pre-K toggle).
    - Radial progress gauge (`68%`), watched counters, and subject mastery bars.
    - Badges showcase with unlock conditions.

11. **Safe Settings & Parental Controls**:
    - Daily screen time limit slider (15m, 30m, 45m, 60m), PIN protection, content grade filter.
    - Admin Mode toggle switch (quick switch for testing).

12. **Inactivity Watchdog Overlay**:
    - 60-second idle auto-pause overlay: *"Are you still watching? Tap to resume"*.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Asynchronous Background Generation with Top-Bar Toast**
  - *Chosen Approach*: Decouple AI generation from the UI modal. When "Create Video" is clicked, trigger the video ad and fire a non-blocking background task. Once user skips or finishes the ad, they regain full app control. When the background promise resolves, store the video in state and display a sticky top-bar completion banner with a direct "Watch Now" action.
  - *Why*: Eliminates long, frustrating blocking spinners; lets users keep learning while the AI works.
- **Decision 2: Admin Dashboard & Studio Integration**
  - *Chosen Approach*: Replace the removed downloads tab with an accessible Admin Suite (toggleable directly from the top navigation bar or settings). The suite features an Analytics Dashboard and a Full Reel Creator Studio.
  - *Why*: Gives administrators full capability to inject custom curriculum without leaving the client application.
- **Decision 3: Complete Removal of Offline Download Functionality**
  - *Chosen Approach*: Remove all offline caching, service worker storage hooks, and "Download (external)" UI elements across the reel player, detailed view, and lists.
  - *Why*: Honors the explicit instruction to remove offline downloads and eliminates associated device storage overhead.
- **Decision 4: Cost & Streaming Bandwidth Governance**
  - *Chosen Approach*: Retain 720p maximum resolution cap, strict ±1 buffer eviction, 60-second idle auto-pause, and monetization interstitial ads every 5 contents.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LearnLoop Web Application                       │
│                                                                        │
│  ┌──────────────── Top Notification Bar (Background Ready) ─────────┐  │
│  │  "✨ 'Photosynthesis Explained' is ready! [Watch Now] [Dismiss]"   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│  ┌──────────────── Shell & Mode Controller ─────────────────────────┐  │
│  │  • Phone Frame Toggle (Mobile Mockup / Full Responsive)           │  │
│  │  • Quick Screen Switcher (Reels, Detail, AI, Explore, Admin, etc.)│  │
│  │  • Admin Mode Switch (Quick access for testing and posting)      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│  ┌──────────────── Background Task & Ad Engine ─────────────────────┐  │
│  │  • Video Ad Controller: Plays on generation; skip-able after 5s  │  │
│  │  • Async Job Worker: Generates reel in background while user surfs│  │
│  │  • Inter-Reel Ad Counter: Fires ad every 5 contents watched      │  │
│  │  • Inactivity Watchdog: 60s idle timer auto-pausing media        │  │
│  │  • Bounded Buffer: Loads only active video + 1 adjacent          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│  ┌──────────────── Screen Hierarchy ────────────────────────────────┐  │
│  │  • Swipe & Learn Reel Feed (Bounded Buffer, 720p)                │  │
│  │  • Detailed View & Quiz Deck (No download button)                │  │
│  │  • AI Learning Assistant & Voice Chat                            │  │
│  │  • Request Custom Video (Async with Ad & Background worker)      │  │
│  │  • Explore Library & Search                                      │  │
│  │  • Community Feed                                                │  │
│  │  • Admin Dashboard (Metrics & Platform Analytics)                │  │
│  │  • Admin Content Publishing Studio (Post new reels)              │  │
│  │  • My Progress & Badges Showcase                                 │  │
│  │  • Safe Settings & Parental Controls                             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│  ┌──────────────── Server Backend (server.ts) ──────────────────────┐  │
│  │  • /api/gemini/assistant (LoopBot AI Chat)                       │  │
│  │  • /api/gemini/create-reel (Token-optimized 720p custom reels)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Steps

1. **Server Setup**: Implement Express backend in `server.ts` with token-optimized Gemini endpoints (`/api/gemini/assistant` and `/api/gemini/create-reel`) with 720p constraints.
2. **Background Generation & Notification System**:
   - Build background worker state with task queue.
   - Build video ad interstitial with 5-second countdown and skip action.
   - Build sticky Top-Bar completion notification banner with "Watch Now" deep link.
3. **Admin Suite**:
   - `AdminDashboard`: Live platform metrics, views, monetized ad counts, subject distribution.
   - `AdminPostStudio`: Full authoring form for title, grade, subject, summary, key points, and quiz, immediately publishing to the active feed.
4. **Bandwidth & Inactivity Engine**:
   - Bounded ±1 video pre-buffer engine.
   - 60-second idle auto-pause watchdog.
   - Monetization ad every 5 contents watched.
5. **Content Library & Screen Assembly**:
   - Assemble all screens matching `edureel.jpeg` (removing offline download buttons as instructed).
   - Rich curriculum covering Nursery/Pre-K, Elementary, and Middle School.
6. **Compile & Verification**: Verify app with `compile_applet`.
