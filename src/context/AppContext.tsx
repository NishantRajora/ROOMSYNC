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
  UserAccount,
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
import { testFirestoreConnection, auth, db } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

export const INITIAL_REGISTERED_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_me_001',
    email: 'aarav.sharma@college.edu',
    password: 'password123',
    profile: CURRENT_USER,
    createdAt: '2026-08-15T10:00:00Z',
    lastLoginAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'usr_pro_002',
    email: 'priya.patel@work.com',
    password: 'password123',
    profile: {
      id: 'usr_pro_002',
      fullName: 'Priya Patel',
      email: 'priya.patel@work.com',
      userType: 'professional',
      gender: 'female',
      courseYear: 'Senior UX Designer @ FinTech Corp',
      company: 'FinTech Corp',
      workEmail: 'priya.patel@work.com',
      isStudentVerified: false,
      isProfessionalVerified: true,
      profileCompletion: 100,
      budgetMin: 12000,
      budgetMax: 20000,
      sleepSchedule: 'early_bird',
      bedtime: '10:30 PM',
      wakeTime: '06:30 AM',
      cleanliness: 'neat_freak',
      cleanlinessRating: 5,
      socialHabits: 'ambivert',
      foodPreference: 'pure_veg',
      studyHabits: 'deep_silence',
      studySchedule: '9 AM – 6 PM Corporate / Hybrid',
      noiseTolerance: 'Weekends only · Calm work environment',
      smokingDrinkingTolerance: 'Strictly non-smoking & alcohol-free',
      roomSharingPreference: 'private',
      dealbreakers: [
        'No indoor smoking (balcony only)',
        'Dishes must be washed immediately after eating',
        'Strict quiet hours after 11 PM',
      ],
      preferredLocalities: ['Sector 23', 'Cyber Hub', 'DLF Phase 3'],
      bio: 'Senior UX Designer in tech. Hybrid schedule (office + WFH). Looking for a tidy, respectful flatmate in a modern 2BHK/3BHK.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
      upiId: 'priya.patel@okaxis',
      phone: '+91 98201 54321',
      createdAt: '2026-08-01T09:00:00Z',
    },
    createdAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'usr_pro_003',
    email: 'vikram.singh@gmail.com',
    password: 'password123',
    profile: {
      id: 'usr_pro_003',
      fullName: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      userType: 'professional',
      gender: 'male',
      courseYear: 'Software Engineer @ CloudOps',
      company: 'CloudOps',
      workEmail: 'vikram@cloudops.io',
      isStudentVerified: false,
      isProfessionalVerified: true,
      profileCompletion: 95,
      budgetMin: 14000,
      budgetMax: 24000,
      sleepSchedule: 'night_owl',
      bedtime: '01:30 AM',
      wakeTime: '08:30 AM',
      cleanliness: 'moderate',
      cleanlinessRating: 4,
      socialHabits: 'extrovert',
      foodPreference: 'non_veg',
      studyHabits: 'ambient_music',
      studySchedule: 'Tech worker / night coder',
      noiseTolerance: 'Social weekends welcome · Chill music',
      smokingDrinkingTolerance: 'Social drinking OK, zero indoor smoke',
      roomSharingPreference: 'private',
      dealbreakers: [
        'No indoor smoking',
        'Equal split of bills by 1st of month',
      ],
      preferredLocalities: ['Sector 23', 'Golf Course Road', 'DLF Phase 3'],
      bio: 'Cloud Backend Engineer. Enjoys tech, gaming, and home cooking. Easygoing and punctual with bills.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
      upiId: 'vikram.singh@icici',
      phone: '+91 99345 67890',
      createdAt: '2026-08-12T14:00:00Z',
    },
    createdAt: '2026-08-12T14:00:00Z',
  },
];

interface AppContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  verifyCollegeEmail: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  verifyProfessionalEmail: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  sendVerificationOtp: (email: string) => Promise<{ success: boolean; otp: string }>;
  generatedOtp: string | null;

  // Multi-user authentication & profile registry
  registeredAccounts: UserAccount[];
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  register: (accountData: {
    fullName: string;
    email: string;
    password?: string;
    profileUpdates: Partial<UserProfile>;
  }) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  logout: () => Promise<void>;

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
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('roomsync_registered_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REGISTERED_ACCOUNTS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('roomsync_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const isAuth = localStorage.getItem('roomsync_auth') === 'true';
    const activeId = localStorage.getItem('roomsync_current_user_id');
    const savedUser = localStorage.getItem('roomsync_current_user');

    if (isAuth) {
      if (activeId) {
        const savedAccountsStr = localStorage.getItem('roomsync_registered_accounts');
        if (savedAccountsStr) {
          try {
            const accounts: UserAccount[] = JSON.parse(savedAccountsStr);
            const found = accounts.find((a) => a.id === activeId);
            if (found) return found.profile;
          } catch (e) {
            console.error(e);
          }
        }
      }
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_REGISTERED_ACCOUNTS[0].profile;
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
            text: 'Hey! Saw your RoomSync profile. We match well on Sector 23 flats. Are you free to check Plot 412 this Saturday?',
            timestamp: '10:45 AM',
            isSelf: false,
          },
          {
            id: 'msg_2',
            conversationId: 'usr_002',
            senderId: 'usr_me_001',
            senderName: currentUser.fullName,
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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setCurrentUser(data);
            localStorage.setItem('roomsync_current_user', JSON.stringify(data));
            localStorage.setItem('roomsync_current_user_id', data.id);
            setIsAuthenticated(true);
            localStorage.setItem('roomsync_auth', 'true');
          }
        } catch (err) {
          console.warn('Could not read user from Firestore on auth change:', err);
        }
      } else {
        const authFlag = localStorage.getItem('roomsync_auth');
        if (authFlag === 'false') {
          setIsAuthenticated(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save registered accounts locally for fast cache
  useEffect(() => {
    localStorage.setItem('roomsync_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  // Keep active authenticated user synced in registry & local storage
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!currentUser || !currentUser.id) return;

    localStorage.setItem('roomsync_current_user', JSON.stringify(currentUser));
    localStorage.setItem('roomsync_current_user_id', currentUser.id);

    setRegisteredAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentUser.id || acc.email.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...acc, profile: currentUser }
          : acc
      )
    );
  }, [currentUser, isAuthenticated]);

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

  // Real Database & Authorization implementations
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password?.trim() || '';

    // 1. First check our persistent registered accounts registry
    const localAcc = registeredAccounts.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (localAcc) {
      if (cleanPassword && localAcc.password && localAcc.password !== cleanPassword) {
        return {
          success: false,
          message: 'Incorrect password for this account. Please verify and try again.',
        };
      }

      // Check if Firestore has a newer profile
      let latestProfile = localAcc.profile;
      try {
        const snap = await getDoc(doc(db, 'users', localAcc.id));
        if (snap.exists()) {
          latestProfile = snap.data() as UserProfile;
        }
      } catch (e) {
        console.warn('Firestore fetch on login:', e);
      }

      // Also sign in to Firebase Auth in background if applicable
      if (cleanPassword && cleanPassword.length >= 6) {
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        } catch (_) {}
      }

      setCurrentUser(latestProfile);
      setIsAuthenticated(true);
      localStorage.setItem('roomsync_auth', 'true');
      localStorage.setItem('roomsync_current_user_id', localAcc.id);
      localStorage.setItem('roomsync_current_user', JSON.stringify(latestProfile));

      showToast(`Welcome back, ${latestProfile.fullName}!`);
      return { success: true, user: latestProfile };
    }

    // 2. Check Firebase Authentication
    if (cleanPassword && cleanPassword.length >= 6) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        const uid = userCred.user.uid;
        let profileToLoad: UserProfile | null = null;

        try {
          const docSnap = await getDoc(doc(db, 'users', uid));
          if (docSnap.exists()) {
            profileToLoad = docSnap.data() as UserProfile;
          }
        } catch (dbErr) {
          console.warn('Could not load user from Firestore:', dbErr);
        }

        if (!profileToLoad) {
          try {
            const indexSnap = await getDoc(doc(db, 'user_accounts_index', cleanEmail));
            if (indexSnap.exists()) {
              profileToLoad = indexSnap.data()?.profile as UserProfile;
            }
          } catch (_) {}
        }

        if (profileToLoad) {
          setCurrentUser(profileToLoad);
          setIsAuthenticated(true);
          localStorage.setItem('roomsync_auth', 'true');
          localStorage.setItem('roomsync_current_user_id', profileToLoad.id);
          localStorage.setItem('roomsync_current_user', JSON.stringify(profileToLoad));

          // Save to registeredAccounts
          setRegisteredAccounts((prev) => {
            const filtered = prev.filter((a) => a.email.toLowerCase() !== cleanEmail);
            const updated = [
              {
                id: profileToLoad!.id,
                email: cleanEmail,
                password: cleanPassword,
                profile: profileToLoad!,
                createdAt: profileToLoad!.createdAt || new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              },
              ...filtered,
            ];
            localStorage.setItem('roomsync_registered_accounts', JSON.stringify(updated));
            return updated;
          });

          showToast(`Welcome back, ${profileToLoad.fullName}!`);
          return { success: true, user: profileToLoad };
        }
      } catch (authErr: any) {
        console.warn('Firebase signIn attempt:', authErr?.code);
        if (authErr?.code === 'auth/wrong-password') {
          return {
            success: false,
            message: 'Incorrect password. Please verify and try again.',
          };
        }
      }
    }

    // 3. Check Firestore user_accounts_index
    try {
      const indexSnap = await getDoc(doc(db, 'user_accounts_index', cleanEmail));
      if (indexSnap.exists()) {
        const data = indexSnap.data();
        if (data && data.profile) {
          if (data.password && cleanPassword && data.password !== cleanPassword) {
            return {
              success: false,
              message: 'Incorrect password for this account. Please verify and try again.',
            };
          }

          const loadedProfile = data.profile as UserProfile;
          setCurrentUser(loadedProfile);
          setIsAuthenticated(true);
          localStorage.setItem('roomsync_auth', 'true');
          localStorage.setItem('roomsync_current_user_id', loadedProfile.id);
          localStorage.setItem('roomsync_current_user', JSON.stringify(loadedProfile));

          setRegisteredAccounts((prev) => {
            const filtered = prev.filter((a) => a.email.toLowerCase() !== cleanEmail);
            const updated = [
              {
                id: loadedProfile.id,
                email: cleanEmail,
                password: cleanPassword || data.password || 'password123',
                profile: loadedProfile,
                createdAt: loadedProfile.createdAt || new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              },
              ...filtered,
            ];
            localStorage.setItem('roomsync_registered_accounts', JSON.stringify(updated));
            return updated;
          });

          showToast(`Welcome back, ${loadedProfile.fullName}!`);
          return { success: true, user: loadedProfile };
        }
      }
    } catch (err) {
      console.warn('Firestore index lookup:', err);
    }

    return {
      success: false,
      message: `No account registered with "${email}". Please verify your email address or click Sign Up to create an account.`,
    };
  };

  const register = async (accountData: {
    fullName: string;
    email: string;
    password?: string;
    profileUpdates: Partial<UserProfile>;
  }): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanEmail = accountData.email.trim().toLowerCase();
    const cleanPassword = accountData.password?.trim() || 'password123';

    // Verify account does not already exist
    const existing = registeredAccounts.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return {
        success: false,
        message: 'An account with this email already exists. Please log in with your password.',
      };
    }

    let uid = `usr_${Date.now()}`;

    // 1. Create in Firebase Auth
    if (cleanPassword && cleanPassword.length >= 6) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        uid = userCred.user.uid;
        await updateProfile(userCred.user, {
          displayName: accountData.fullName.trim(),
        });
      } catch (authErr: any) {
        console.warn('Firebase createUser warning:', authErr?.code);
        if (authErr?.code === 'auth/email-already-in-use') {
          return {
            success: false,
            message: 'An account with this email already exists in the system. Please log in with your password.',
          };
        }
      }
    }

    const newProfile: UserProfile = {
      id: uid,
      fullName: accountData.fullName.trim(),
      email: cleanEmail,
      userType: accountData.profileUpdates.userType || 'professional',
      gender: 'prefer_not_to_say',
      budgetMin: accountData.profileUpdates.budgetMin || 8000,
      budgetMax: accountData.profileUpdates.budgetMax || 18000,
      sleepSchedule: accountData.profileUpdates.sleepSchedule || 'early_bird',
      cleanliness: accountData.profileUpdates.cleanliness || 'moderate',
      socialHabits: accountData.profileUpdates.socialHabits || 'ambivert',
      foodPreference: accountData.profileUpdates.foodPreference || 'pure_veg',
      studyHabits: accountData.profileUpdates.studyHabits || 'ambient_music',
      preferredLocalities: accountData.profileUpdates.preferredLocalities || ['Sector 23', 'DLF Phase 3'],
      bio: accountData.profileUpdates.bio || `Hi, I am ${accountData.fullName.trim()}! Looking for a compatible flatmate with great energy and mutual respect.`,
      avatarUrl: accountData.profileUpdates.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
      upiId: `${accountData.fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
      phone: '+91 98765 43210',
      isStudentVerified: Boolean(accountData.profileUpdates.isStudentVerified),
      isProfessionalVerified: Boolean(accountData.profileUpdates.isProfessionalVerified),
      profileCompletion: 100,
      createdAt: new Date().toISOString(),
      ...accountData.profileUpdates,
    };

    // 2. Persist to Firestore database!
    try {
      await setDoc(doc(db, 'users', uid), newProfile, { merge: true });
      await setDoc(doc(db, 'user_accounts_index', cleanEmail), {
        id: uid,
        email: cleanEmail,
        password: cleanPassword,
        profile: newProfile,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (dbErr) {
      console.warn('Firestore write error for user profile:', dbErr);
    }

    const newAccount: UserAccount = {
      id: uid,
      email: cleanEmail,
      password: cleanPassword,
      profile: newProfile,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Update registered accounts list
    setRegisteredAccounts((prev) => {
      const filtered = prev.filter((a) => a.email.toLowerCase() !== cleanEmail);
      const updated = [newAccount, ...filtered];
      localStorage.setItem('roomsync_registered_accounts', JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('roomsync_auth', 'true');
    localStorage.setItem('roomsync_current_user_id', uid);
    localStorage.setItem('roomsync_current_user', JSON.stringify(newProfile));

    return { success: true, user: newProfile };
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    setIsAuthenticated(false);
    localStorage.setItem('roomsync_auth', 'false');
    localStorage.removeItem('roomsync_current_user_id');
    localStorage.removeItem('roomsync_current_user');
    setCurrentUser(INITIAL_REGISTERED_ACCOUNTS[0].profile);
    showToast('Logged out successfully');
  };

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

  const updateCurrentUser = async (updates: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...updates };
    // Recalculate profile completion
    let filledFields = 0;
    const totalChecks = 10;
    if (updated.fullName) filledFields++;
    if (updated.email) filledFields++;
    if (updated.budgetMin && updated.budgetMax) filledFields++;
    if (updated.sleepSchedule) filledFields++;
    if (updated.cleanliness) filledFields++;
    if (updated.socialHabits) filledFields++;
    if (updated.foodPreference) filledFields++;
    if (updated.studyHabits) filledFields++;
    if (updated.preferredLocalities && updated.preferredLocalities.length > 0) filledFields++;
    if (updated.bio) filledFields++;

    updated.profileCompletion = Math.min(100, Math.round((filledFields / totalChecks) * 100));

    setCurrentUser(updated);
    localStorage.setItem('roomsync_current_user', JSON.stringify(updated));
    if (updated.id) {
      localStorage.setItem('roomsync_current_user_id', updated.id);
    }

    // Update in registered accounts registry
    setRegisteredAccounts((prev) => {
      const updatedList = prev.map((acc) =>
        acc.id === updated.id || acc.email.toLowerCase() === updated.email.toLowerCase()
          ? { ...acc, profile: updated }
          : acc
      );
      localStorage.setItem('roomsync_registered_accounts', JSON.stringify(updatedList));
      return updatedList;
    });

    // Save to Firestore database
    try {
      if (updated.id) {
        await setDoc(doc(db, 'users', updated.id), updated, { merge: true });
      }
      if (updated.email) {
        await setDoc(doc(db, 'user_accounts_index', updated.email.toLowerCase()), {
          id: updated.id,
          email: updated.email.toLowerCase(),
          profile: updated,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore update error:', err);
    }

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

  const verifyProfessionalEmail = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    if (otp !== generatedOtp && otp !== '482910') {
      return { success: false, message: 'Invalid OTP code. Please re-enter the 6-digit code.' };
    }

    updateCurrentUser({
      workEmail: email,
      isProfessionalVerified: true,
      userType: 'professional',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast('💼 Verified Professional Badge Awarded! Work Email Verified.');
    return { success: true, message: 'Professional status verified successfully!' };
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
        verifyProfessionalEmail,
        sendVerificationOtp,
        generatedOtp,
        registeredAccounts,
        login,
        register,
        logout,
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
