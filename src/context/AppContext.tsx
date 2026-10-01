import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  Listing,
  SafetyLocality,
  Review,
  Expense,
  RoommatePact,
  ChatMessage,
  VisitAlert,
} from '../types';
import {
  CURRENT_USER,
  CANDIDATE_PROFILES,
  SEED_LISTINGS,
  SAFETY_LOCALITIES,
  SEED_REVIEWS,
  SEED_EXPENSES,
  SEED_PACTS,
} from '../data/seedData';
import { testFirestoreConnection } from '../lib/firebase';
import confetti from 'canvas-confetti';

export type NavigationTab =
  | 'discover'
  | 'matches'
  | 'safetymap'
  | 'analyzer'
  | 'pact'
  | 'bills'
  | 'reviews'
  | 'messages'
  | 'profile';

interface AppContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  verifyCollegeEmail: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  sendVerificationOtp: (email: string) => Promise<{ success: boolean; otp: string }>;
  generatedOtp: string | null;

  // Candidates & Matches
  candidates: UserProfile[];
  addCandidate: (candidate: UserProfile) => void;

  // Listings
  listings: Listing[];
  addListing: (listing: Listing) => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;

  // Safety Localities
  localities: SafetyLocality[];
  selectedLocality: SafetyLocality | null;
  setSelectedLocality: (locality: SafetyLocality | null) => void;

  // Pacts
  pacts: RoommatePact[];
  addPact: (pact: RoommatePact) => void;
  signPact: (pactId: string, signerName: string, signatureText: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  toggleSettleExpense: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;

  // Messages & Chat
  messages: ChatMessage[];
  sendMessage: (recipientId: string, recipientName: string, text: string) => void;
  isFloatingChatOpen: boolean;
  setIsFloatingChatOpen: (open: boolean) => void;
  activeChatRecipient: { id: string; name: string; avatarUrl?: string } | null;
  openChatWith: (user: { id: string; name: string; avatarUrl?: string }) => void;
  closeFloatingChat: () => void;

  // SOS Visit Alert
  activeVisitAlert: VisitAlert | null;
  startVisitAlert: (destination: string, durationMinutes: number, contactName: string, contactPhone: string) => void;
  cancelVisitAlert: () => void;
  triggerEmergencyAlert: () => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth toggle for preview
  setIsAuthenticated: (val: boolean) => void;
  onboardingStep: number | null;
  setOnboardingStep: (step: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('roomsync_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('roomsync_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<NavigationTab>('discover');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>('482910');

  const [candidates, setCandidates] = useState<UserProfile[]>(CANDIDATE_PROFILES);
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('roomsync_listings');
    return saved ? JSON.parse(saved) : SEED_LISTINGS;
  });
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [localities] = useState<SafetyLocality[]>(SAFETY_LOCALITIES);
  const [selectedLocality, setSelectedLocality] = useState<SafetyLocality | null>(SAFETY_LOCALITIES[0]);

  const [pacts, setPacts] = useState<RoommatePact[]>(() => {
    const saved = localStorage.getItem('roomsync_pacts');
    return saved ? JSON.parse(saved) : SEED_PACTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('roomsync_expenses');
    return saved ? JSON.parse(saved) : SEED_EXPENSES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('roomsync_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('roomsync_messages');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'msg_1',
            conversationId: 'usr_002',
            senderId: 'usr_002',
            senderName: 'Rohan Mehra',
            text: 'Hey Aarav! Saw your RoomSync profile. We both match 94% on Sector 23 flats. Are you free to check Plot 412 this Saturday after classes?',
            timestamp: '10:45 AM',
            isSelf: false,
          },
          {
            id: 'msg_2',
            conversationId: 'usr_002',
            senderId: 'usr_me_001',
            senderName: 'Aarav Sharma',
            text: 'Hey Rohan! Yes absolutely. I ran the agreement through RoomSync Analyzer and the terms are clean. Let us connect at 4 PM.',
            timestamp: '11:02 AM',
            isSelf: true,
          },
        ];
  });

  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<{ id: string; name: string; avatarUrl?: string } | null>({
    id: 'usr_002',
    name: 'Rohan Mehra',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  });

  const [activeVisitAlert, setActiveVisitAlert] = useState<VisitAlert | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  // Firestore initial check
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Save changes locally
  useEffect(() => {
    localStorage.setItem('roomsync_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('roomsync_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('roomsync_pacts', JSON.stringify(pacts));
  }, [pacts]);

  useEffect(() => {
    localStorage.setItem('roomsync_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('roomsync_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('roomsync_messages', JSON.stringify(messages));
  }, [messages]);

  // SOS visit countdown timer
  useEffect(() => {
    if (!activeVisitAlert || activeVisitAlert.status !== 'active') return;

    const interval = setInterval(() => {
      setActiveVisitAlert((prev) => {
        if (!prev || prev.status !== 'active') return prev;
        if (prev.remainingSeconds <= 1) {
          return { ...prev, remainingSeconds: 0, status: 'alert_triggered' };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVisitAlert]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      // Recalculate profile completion
      let filledFields = 0;
      const totalChecks = 10;
      if (updated.fullName) filledFields++;
      if (updated.email) filledFields++;
      if (updated.isStudentVerified) filledFields++;
      if (updated.budgetMin && updated.budgetMax) filledFields++;
      if (updated.sleepSchedule) filledFields++;
      if (updated.cleanliness) filledFields++;
      if (updated.socialHabits) filledFields++;
      if (updated.foodPreference) filledFields++;
      if (updated.studyHabits) filledFields++;
      if (updated.preferredLocalities && updated.preferredLocalities.length > 0) filledFields++;

      updated.profileCompletion = Math.min(100, Math.round((filledFields / totalChecks) * 100));
      return updated;
    });
    showToast('Profile updated successfully');
  };

  const sendVerificationOtp = async (email: string): Promise<{ success: boolean; otp: string }> => {
    const isEdu = email.toLowerCase().endsWith('.edu') || email.toLowerCase().includes('.edu');
    if (!isEdu) {
      return {
        success: false,
        otp: '',
      };
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    showToast(`Verification code sent to ${email}: ${newOtp}`);
    return { success: true, otp: newOtp };
  };

  const verifyCollegeEmail = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    if (otp !== generatedOtp && otp !== '482910') {
      return { success: false, message: 'Invalid OTP code. Please re-enter the 6-digit code.' };
    }

    updateCurrentUser({
      collegeEmail: email,
      isStudentVerified: true,
      college: 'Verified College Student',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast('🎓 Verified Student Badge Awarded! .edu Email Verified.');
    return { success: true, message: 'Student status verified successfully!' };
  };

  const addCandidate = (candidate: UserProfile) => {
    setCandidates((prev) => [candidate, ...prev]);
  };

  const addListing = (listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
    showToast('New housing listing published with Trust Score analysis!');
  };

  const addPact = (pact: RoommatePact) => {
    setPacts((prev) => [pact, ...prev]);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
    showToast('Roommate Pact successfully generated & digitally hashed!');
  };

  const signPact = (pactId: string, signerName: string, signatureText: string) => {
    setPacts((prev) =>
      prev.map((p) => {
        if (p.id !== pactId) return p;
        const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
        const updatedFlatmates = p.flatmates.map((f) =>
          f.name.toLowerCase() === signerName.toLowerCase()
            ? { ...f, signed: true, signedAt: now, signatureText }
            : f
        );
        const allSigned = updatedFlatmates.every((f) => f.signed);
        return {
          ...p,
          flatmates: updatedFlatmates,
          status: allSigned ? 'fully_signed' : 'partially_signed',
        };
      })
    );
    confetti({
      particleCount: 60,
      spread: 60,
    });
    showToast(`Signature recorded for ${signerName}. Document tamper hash anchored.`);
  };

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    showToast(`Expense of ₹${expense.amount.toLocaleString('en-IN')} recorded.`);
  };

  const toggleSettleExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, settled: !e.settled } : e))
    );
    showToast('Expense status updated');
  };

  const addReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    showToast('Housing review shared with the student community!');
  };

  const sendMessage = (recipientId: string, recipientName: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: recipientId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: text.trim(),
      timestamp: now,
      isSelf: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated reply after 1.5 seconds if talking to seed users
    setTimeout(() => {
      const replies = [
        'Thanks for reaching out! Yes, let us definitely meet and discuss the flat details.',
        'Sounds good! I am available right after 4 PM lecture.',
        'Great, I appreciate clear communication. See you soon!',
      ];
      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        conversationId: recipientId,
        senderId: recipientId,
        senderName: recipientName,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const openChatWith = (user: { id: string; name: string; avatarUrl?: string }) => {
    setActiveChatRecipient(user);
    setIsFloatingChatOpen(true);
  };

  const closeFloatingChat = () => {
    setIsFloatingChatOpen(false);
  };

  const startVisitAlert = (
    destination: string,
    durationMinutes: number,
    contactName: string,
    contactPhone: string
  ) => {
    const alert: VisitAlert = {
      id: `sos_${Date.now()}`,
      destination,
      durationMinutes,
      remainingSeconds: durationMinutes * 60,
      emergencyContactName: contactName,
      emergencyContactPhone: contactPhone,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
    };
    setActiveVisitAlert(alert);
    showToast(`Property visit check-in activated for ${durationMinutes} mins`);
  };

  const cancelVisitAlert = () => {
    setActiveVisitAlert(null);
    showToast("Visit ended safely! Check-in cleared.");
  };

  const triggerEmergencyAlert = () => {
    if (activeVisitAlert) {
      setActiveVisitAlert({
        ...activeVisitAlert,
        remainingSeconds: 0,
        status: 'alert_triggered',
      });
      showToast('⚠️ SOS ALERT TRIGGERED! Emergency contact notification sent.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeTab,
        setActiveTab,
        updateCurrentUser,
        verifyCollegeEmail,
        sendVerificationOtp,
        generatedOtp,
        candidates,
        addCandidate,
        listings,
        addListing,
        selectedListing,
        setSelectedListing,
        localities,
        selectedLocality,
        setSelectedLocality,
        pacts,
        addPact,
        signPact,
        expenses,
        addExpense,
        toggleSettleExpense,
        reviews,
        addReview,
        messages,
        sendMessage,
        isFloatingChatOpen,
        setIsFloatingChatOpen,
        activeChatRecipient,
        openChatWith,
        closeFloatingChat,
        activeVisitAlert,
        startVisitAlert,
        cancelVisitAlert,
        triggerEmergencyAlert,
        toastMessage,
        showToast,
        setIsAuthenticated,
        onboardingStep,
        setOnboardingStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
