import React, { useState, useCallback } from 'react';
import {
  ReelVideo,
  ScreenId,
  GradeLevel,
  SubjectCategory,
  UserProfile,
  Badge,
  LearningGoal,
  AuthUser,
  StudentProfile,
  CommunityChannel,
  EnrolledStudent,
  JoinRequest,
} from './types';
import {
  INITIAL_REELS,
  INITIAL_SPONSOR_AD,
  INITIAL_BADGES,
  INITIAL_USER_PROFILE,
  INITIAL_GOALS,
  INITIAL_CHANNELS,
  DEFAULT_AUTH_USER,
} from './data/mockCurriculum';
import { useInactivityTimer } from './hooks/useInactivityTimer';

// Components
import { DeviceFrame } from './components/DeviceFrame';
import { BottomNavBar } from './components/BottomNavBar';
import { TopNotificationBanner } from './components/TopNotificationBanner';
import { MonetizationAdModal } from './components/MonetizationAdModal';
import { InactivityModal } from './components/InactivityModal';
import { AuthModal } from './components/auth/AuthModal';
import { SiblingSwitcherModal } from './components/SiblingSwitcherModal';
import { CreateChannelModal } from './components/channels/CreateChannelModal';
import { ChannelDetailModal } from './components/channels/ChannelDetailModal';
import { ApkExportModal } from './components/ApkExportModal';

// Screens
import { SwipeLearnFeed } from './components/screens/SwipeLearnFeed';
import { DetailedViewScreen } from './components/screens/DetailedViewScreen';
import { AiAssistantScreen } from './components/screens/AiAssistantScreen';
import { RequestCustomVideoScreen } from './components/screens/RequestCustomVideoScreen';
import { ExploreLibraryScreen } from './components/screens/ExploreLibraryScreen';
import { CommunityScreen } from './components/screens/CommunityScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { AdminPostStudioScreen } from './components/screens/AdminPostStudioScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  // Navigation & Viewport State
  const [activeScreen, setActiveScreen] = useState<ScreenId>('feed');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('Grade 6-8');

  // Auth & Multi-Child / Teacher State
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEFAULT_AUTH_USER);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSiblingModal, setShowSiblingModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  // Community Channels State
  const [channels, setChannels] = useState<CommunityChannel[]>(INITIAL_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<CommunityChannel | null>(null);
  const [showChannelDetail, setShowChannelDetail] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  // Curriculum & Reels Data
  const [reels, setReels] = useState<ReelVideo[]>(INITIAL_REELS);
  const [selectedReel, setSelectedReel] = useState<ReelVideo>(INITIAL_REELS[0]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [goals, setGoals] = useState<LearningGoal[]>(INITIAL_GOALS);

  // Monetization & Video Buffering State
  const [adImpressions, setAdImpressions] = useState(140);
  const [watchedCount, setWatchedCount] = useState(0);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adReason, setAdReason] = useState<'watch_streak' | 'video_generation'>('watch_streak');

  // Background Asynchronous Video Generation Pipeline
  const [isBackgroundGenerating, setIsBackgroundGenerating] = useState(false);
  const [readyVideoNotification, setReadyVideoNotification] = useState<ReelVideo | null>(null);

  // 60-Second Inactivity Watchdog
  const { isIdle, resume: resumeFromIdle } = useInactivityTimer(60000);

  // Current active student profile (for multi-child sibling accounts)
  const activeStudent: StudentProfile =
    currentUser.students.find((s) => s.id === currentUser.activeStudentId) ||
    currentUser.students[0] || {
      id: 's_default',
      name: userProfile.name,
      age: 12,
      grade: currentGrade,
      avatar: '👦🏽',
      overallProgress: userProfile.overallProgress,
      videosWatched: userProfile.videosWatched,
      isPrimary: true,
    };

  // Switch between siblings on the account
  const handleSelectStudent = (studentId: string) => {
    const student = currentUser.students.find((s) => s.id === studentId);
    if (!student) return;

    setCurrentUser((prev) => ({ ...prev, activeStudentId: studentId }));
    setCurrentGrade(student.grade);
    setUserProfile((prev) => ({
      ...prev,
      name: student.name,
      grade: student.grade,
      avatar: student.avatar,
      overallProgress: student.overallProgress || 50,
      videosWatched: student.videosWatched || 0,
    }));
  };

  // Add another sibling to the account
  const handleAddSibling = (newSibling: StudentProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      students: [...prev.students, newSibling],
      activeStudentId: newSibling.id,
    }));
    setCurrentGrade(newSibling.grade);
    setUserProfile((prev) => ({
      ...prev,
      name: newSibling.name,
      grade: newSibling.grade,
      avatar: newSibling.avatar,
      overallProgress: 0,
      videosWatched: 0,
    }));
  };

  // Handle Authentication Success (Student with age/grade/siblings or Teacher with multiple subjects)
  const handleAuthSuccess = (newUser: AuthUser) => {
    setCurrentUser(newUser);
    if (newUser.role === 'teacher') {
      setUserProfile((prev) => ({
        ...prev,
        name: newUser.teacherProfile?.name || 'Teacher',
        avatar: newUser.teacherProfile?.avatar || '👩🏻‍🏫',
      }));
    } else if (newUser.students.length > 0) {
      const primary = newUser.students[0];
      setCurrentGrade(primary.grade);
      setUserProfile((prev) => ({
        ...prev,
        name: primary.name,
        grade: primary.grade,
        avatar: primary.avatar,
        overallProgress: primary.overallProgress,
        videosWatched: primary.videosWatched,
      }));
    }
  };

  // Channel Actions
  const handleOpenChannel = (channel: CommunityChannel) => {
    setSelectedChannel(channel);
    setShowChannelDetail(true);
  };

  const handleCreateChannel = (newChannel: CommunityChannel) => {
    setChannels((prev) => [newChannel, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      joinedChannelIds: [...prev.joinedChannelIds, newChannel.id],
    }));
    setSelectedChannel(newChannel);
    setShowChannelDetail(true);
  };

  const handleJoinChannel = (channelId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      joinedChannelIds: [...new Set([...prev.joinedChannelIds, channelId])],
    }));

    // Also enroll current student
    const enrolled: EnrolledStudent = {
      id: activeStudent.id,
      name: activeStudent.name,
      username: activeStudent.username || `@${activeStudent.name.toLowerCase().replace(/\s+/g, '')}`,
      age: activeStudent.age,
      grade: activeStudent.grade,
      joinedAt: 'Just now',
    };

    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId && !c.enrolledStudents.some((s) => s.id === enrolled.id)
          ? { ...c, enrolledStudents: [enrolled, ...c.enrolledStudents] }
          : c
      )
    );
    setSelectedChannel((prev) =>
      prev && prev.id === channelId && !prev.enrolledStudents.some((s) => s.id === enrolled.id)
        ? { ...prev, enrolledStudents: [enrolled, ...prev.enrolledStudents] }
        : prev
    );
  };

  const handleRequestJoinChannel = (channelId: string, request: JoinRequest) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              pendingRequests: [...(c.pendingRequests || []).filter((r) => r.studentId !== request.studentId), request],
            }
          : c
      )
    );
    setSelectedChannel((prev) =>
      prev && prev.id === channelId
        ? {
            ...prev,
            pendingRequests: [...(prev.pendingRequests || []).filter((r) => r.studentId !== request.studentId), request],
          }
        : prev
    );
  };

  const handleApproveJoinRequest = (channelId: string, requestId: string) => {
    let approvedStudent: EnrolledStudent | null = null;

    setChannels((prev) =>
      prev.map((c) => {
        if (c.id !== channelId) return c;
        const req = c.pendingRequests?.find((r) => r.id === requestId);
        if (!req) return c;

        approvedStudent = {
          id: req.studentId,
          name: req.studentName,
          username: req.username,
          age: req.age,
          grade: req.grade,
          joinedAt: 'Approved just now',
        };

        const updatedPending = (c.pendingRequests || []).filter((r) => r.id !== requestId);
        const updatedEnrolled = [approvedStudent, ...(c.enrolledStudents || [])];

        return {
          ...c,
          pendingRequests: updatedPending,
          enrolledStudents: updatedEnrolled,
        };
      })
    );

    setSelectedChannel((prev) => {
      if (!prev || prev.id !== channelId) return prev;
      const req = prev.pendingRequests?.find((r) => r.id === requestId);
      if (!req) return prev;

      const newStudent: EnrolledStudent = {
        id: req.studentId,
        name: req.studentName,
        username: req.username,
        age: req.age,
        grade: req.grade,
        joinedAt: 'Approved just now',
      };

      return {
        ...prev,
        pendingRequests: (prev.pendingRequests || []).filter((r) => r.id !== requestId),
        enrolledStudents: [newStudent, ...(prev.enrolledStudents || [])],
      };
    });

    if (approvedStudent) {
      setCurrentUser((prev) => {
        const studentMatch = prev.students.some((s) => s.id === (approvedStudent as any).id);
        if (studentMatch && !prev.joinedChannelIds.includes(channelId)) {
          return {
            ...prev,
            joinedChannelIds: [...prev.joinedChannelIds, channelId],
          };
        }
        return prev;
      });
    }
  };

  const handleDeclineJoinRequest = (channelId: string, requestId: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              pendingRequests: (c.pendingRequests || []).filter((r) => r.id !== requestId),
            }
          : c
      )
    );
    setSelectedChannel((prev) =>
      prev && prev.id === channelId
        ? {
            ...prev,
            pendingRequests: (prev.pendingRequests || []).filter((r) => r.id !== requestId),
          }
        : prev
    );
  };

  const handleAddStudentToChannel = (channelId: string, student: EnrolledStudent) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId ? { ...c, enrolledStudents: [student, ...c.enrolledStudents] } : c
      )
    );
    setSelectedChannel((prev) =>
      prev && prev.id === channelId
        ? { ...prev, enrolledStudents: [student, ...prev.enrolledStudents] }
        : prev
    );
  };

  const handlePostVideoToChannel = (channelId: string, videoId: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId && !c.videoIds.includes(videoId)
          ? { ...c, videoIds: [videoId, ...c.videoIds] }
          : c
      )
    );
    setSelectedChannel((prev) =>
      prev && prev.id === channelId && !prev.videoIds.includes(videoId)
        ? { ...prev, videoIds: [videoId, ...prev.videoIds] }
        : prev
    );
    setReels((prev) =>
      prev.map((r) => (r.id === videoId ? { ...r, channelId } : r))
    );
  };

  // Video Watched Handler (Every 5 contents watched triggers monetization ad)
  const handleVideoWatched = useCallback(() => {
    setWatchedCount((prev) => {
      const nextCount = prev + 1;
      setUserProfile((p) => ({ ...p, videosWatched: p.videosWatched + 1 }));

      if (nextCount > 0 && nextCount % 5 === 0) {
        setAdReason('watch_streak');
        setAdImpressions((imp) => imp + 1);
        setAdModalOpen(true);
      }
      return nextCount;
    });
  }, []);

  // Request Custom Video (Async Background Job + Immediate Ad)
  const handleRequestCustomVideo = (topic: string, subject: SubjectCategory, grade: GradeLevel) => {
    setAdReason('video_generation');
    setAdImpressions((imp) => imp + 1);
    setAdModalOpen(true);

    setIsBackgroundGenerating(true);

    fetch('/api/gemini/create-reel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject, grade }),
    })
      .then((res) => res.json())
      .then((data) => {
        let imageAsset = '/src/assets/images/reel_cell_structure_1792219499595.jpg';
        if (data.animationType === 'space') imageAsset = '/src/assets/images/reel_solar_system_1792219498469.jpg';
        if (data.animationType === 'math') imageAsset = '/src/assets/images/reel_algebra_basics_1792219499608.jpg';
        if (data.animationType === 'safari' || grade === 'Nursery & Pre-K') imageAsset = '/src/assets/images/reel_prek_safari_1792219499580.jpg';

        const newReel: ReelVideo = {
          id: `custom_${Date.now()}`,
          title: data.title || topic,
          subtitle: data.subtitle || `Custom AI micro-lesson on ${topic}`,
          subject,
          grade,
          duration: '1:00',
          author: {
            name: `Owl Master Hoot (${userProfile.name})`,
            handle: '@owlmaster_ai',
            avatar: '🦉',
            gradeBadge: `Grade: ${grade}`,
            verified: true,
            isOfficialAdmin: false,
          },
          likes: 42,
          commentsCount: 6,
          sharesCount: 15,
          tags: [`#${subject.toLowerCase().replace(/\s+/g, '')}`, '#owlmaster', '#customai'],
          summary: data.summary || `${topic} explained for ${grade}.`,
          keyPoints: data.keyPoints || [
            'Core idea step-by-step',
            'Real-world everyday observation',
            'Takeaway for your next quiz',
          ],
          audioScript: data.narrationScript || `Hoo-hoo! Here is a lesson on ${topic}. ${data.summary}`,
          quiz: data.quiz || {
            question: `What is the primary takeaway of ${topic}?`,
            options: ['Fundamental principle in action', 'Random variance', 'Non-applicable'],
            correctIndex: 0,
            explanation: 'Consistent principles explain the phenomenon.',
          },
          imageAsset,
          animationType: data.animationType || 'science',
          isUserCreated: true,
          createdAt: 'Just now',
          isLiked: false,
          isSaved: true,
        };

        setReels((prev) => [newReel, ...prev]);
        setIsBackgroundGenerating(false);
        setReadyVideoNotification(newReel);
      })
      .catch((err) => {
        console.error('Error generating reel:', err);
        setIsBackgroundGenerating(false);
      });
  };

  const handleCloseAd = () => {
    setAdModalOpen(false);
    if (activeScreen === 'request-video') {
      setActiveScreen('feed');
    }
  };

  const handleWatchNow = (video: ReelVideo) => {
    setSelectedReel(video);
    setReadyVideoNotification(null);
    setActiveScreen('detail');
  };

  const handleAdminPublishReel = (newReel: ReelVideo) => {
    setReels((prev) => [newReel, ...prev]);
    setSelectedReel(newReel);
  };

  const handleToggleLike = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isLiked: !r.isLiked } : r))
    );
  };

  const handleToggleSave = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const handleOpenDetail = (reel: ReelVideo) => {
    setSelectedReel(reel);
    setActiveScreen('detail');
  };

  return (
    <DeviceFrame
      activeScreen={activeScreen}
      onNavigate={setActiveScreen}
      isPhoneFrame={isPhoneFrame}
      onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
      currentGrade={currentGrade}
      onGradeChange={setCurrentGrade}
      isBackgroundGenerating={isBackgroundGenerating}
      currentUser={currentUser}
      activeStudent={activeStudent}
      onOpenSiblingModal={() => setShowSiblingModal(true)}
      onOpenAuthModal={() => setShowAuthModal(true)}
      onOpenApkModal={() => setShowApkModal(true)}
    >
      {/* Android APK & PWA Generator Modal */}
      <ApkExportModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />

      {/* Top Banner Alert when background video completes */}
      <TopNotificationBanner
        video={readyVideoNotification}
        onWatchNow={handleWatchNow}
        onDismiss={() => setReadyVideoNotification(null)}
      />

      {/* 60s Inactivity Watchdog Overlay */}
      {isIdle && <InactivityModal onResume={resumeFromIdle} />}

      {/* Monetization Ad Modal */}
      {adModalOpen && (
        <MonetizationAdModal
          ad={INITIAL_SPONSOR_AD}
          reason={adReason}
          onClose={handleCloseAd}
          isBackgroundGenerating={isBackgroundGenerating}
        />
      )}

      {/* Auth Modal (Password / Magic Link, Student vs Teacher, Multiple Subjects, Siblings) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Multi-Child Sibling Switcher Modal */}
      <SiblingSwitcherModal
        isOpen={showSiblingModal}
        onClose={() => setShowSiblingModal(false)}
        students={currentUser.students}
        activeStudentId={activeStudent.id}
        onSelectStudent={handleSelectStudent}
        onAddSibling={handleAddSibling}
      />

      {/* Teacher Create Community Channel Modal */}
      {currentUser.teacherProfile && (
        <CreateChannelModal
          isOpen={showCreateChannelModal}
          onClose={() => setShowCreateChannelModal(false)}
          teacherProfile={currentUser.teacherProfile}
          onCreateChannel={handleCreateChannel}
        />
      )}

      {/* Channel Detail & Enrolled Students Modal */}
      {selectedChannel && (
        <ChannelDetailModal
          channel={selectedChannel}
          isOpen={showChannelDetail}
          onClose={() => setShowChannelDetail(false)}
          currentUser={currentUser}
          activeStudent={activeStudent}
          reels={reels}
          onSelectReel={handleOpenDetail}
          onJoinChannel={handleJoinChannel}
          onRequestJoinChannel={handleRequestJoinChannel}
          onApproveJoinRequest={handleApproveJoinRequest}
          onDeclineJoinRequest={handleDeclineJoinRequest}
          onAddStudentToChannel={handleAddStudentToChannel}
          onPostVideoToChannel={handlePostVideoToChannel}
        />
      )}

      {/* Screen Switcher Router */}
      <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
        {activeScreen === 'feed' && (
          <SwipeLearnFeed
            reels={reels}
            currentGrade={currentGrade}
            onOpenDetail={handleOpenDetail}
            onOpenSearch={() => setActiveScreen('explore')}
            onVideoWatched={handleVideoWatched}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeScreen === 'detail' && (
          <DetailedViewScreen
            reel={selectedReel}
            onBack={() => setActiveScreen('feed')}
            onQuizComplete={(passed) => {
              if (passed) {
                setUserProfile((p) => ({
                  ...p,
                  quizzesCompleted: p.quizzesCompleted + 1,
                  overallProgress: Math.min(100, p.overallProgress + 2),
                }));
              }
            }}
          />
        )}

        {activeScreen === 'ai-assistant' && (
          <AiAssistantScreen
            currentGrade={currentGrade}
            onOpenVideo={(title, subject, grade) => {
              const matched = reels.find((r) => r.title.toLowerCase().includes(title.toLowerCase()));
              if (matched) {
                setSelectedReel(matched);
                setActiveScreen('detail');
              } else {
                handleRequestCustomVideo(title, subject as SubjectCategory, grade as GradeLevel);
              }
            }}
            onRequestCustomVideo={(prompt, subject) => {
              handleRequestCustomVideo(prompt, subject as SubjectCategory, currentGrade);
            }}
          />
        )}

        {activeScreen === 'request-video' && (
          <RequestCustomVideoScreen
            currentGrade={currentGrade}
            onBack={() => setActiveScreen('feed')}
            onSubmitRequest={handleRequestCustomVideo}
          />
        )}

        {activeScreen === 'explore' && (
          <ExploreLibraryScreen
            reels={reels}
            onSelectReel={handleOpenDetail}
          />
        )}

        {activeScreen === 'community' && (
          <CommunityScreen
            reels={reels}
            channels={channels}
            currentUser={currentUser}
            onSelectReel={handleOpenDetail}
            onSelectChannel={handleOpenChannel}
            onOpenCreateChannel={() => setShowCreateChannelModal(true)}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeScreen === 'admin-dashboard' && (
          <AdminDashboardScreen
            reels={reels}
            adImpressions={adImpressions}
            onOpenPostStudio={() => setActiveScreen('admin-post')}
            onSelectReel={handleOpenDetail}
          />
        )}

        {activeScreen === 'admin-post' && (
          <AdminPostStudioScreen
            onBack={() => setActiveScreen('admin-dashboard')}
            onPublishReel={handleAdminPublishReel}
          />
        )}

        {activeScreen === 'progress' && (
          <ProgressScreen
            userProfile={userProfile}
            currentGrade={currentGrade}
            onGradeChange={setCurrentGrade}
            onOpenAchievements={() => setActiveScreen('achievements')}
          />
        )}

        {activeScreen === 'achievements' && (
          <AchievementsScreen
            badges={badges}
            goals={goals}
            onBack={() => setActiveScreen('progress')}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            userProfile={userProfile}
            currentGrade={currentGrade}
            onUpdateProfile={(updated) => setUserProfile((p) => ({ ...p, ...updated }))}
            onOpenAdmin={() => setActiveScreen('admin-dashboard')}
            onOpenApkModal={() => setShowApkModal(true)}
          />
        )}
      </div>

      {/* Bottom 5-Tab Bar */}
      <BottomNavBar activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </DeviceFrame>
  );
}
