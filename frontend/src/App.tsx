import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
    AlertTriangle,
    ArrowUpRight,
    BarChart3,
    Bell,
    Camera,
    CheckCircle2,
    FileCheck2,
    Flag,
    GraduationCap,
    Home,
    IndianRupee,
    LockKeyhole,
    LogIn,
    LogOut,
    Map,
    MessageCircle,
    Receipt,
    Search,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Star,
    UserCog,
    UserRound,
    Users,
    X,
} from "lucide-react";
import { Discovery } from "./Discovery";
import { Chat } from "./Chat";
import { SafetyMap } from "./SafetyMap";
import { AgreementVerifier } from "./AgreementVerifier";
import { ChatPopup } from "./ChatPopup";
import { ExpenseSplitter } from "./ExpenseSplitter";
import { RoommatePact } from "./RoommatePact";
import { RadarMatch } from "./RadarMatch";
import { StudentVerification } from "./StudentVerification";
import { FlatVisitCompanion } from "./FlatVisitCompanion";
import { SocietyReviews } from "./SocietyReviews";

type Match = {
    user: { name: string };
    score: number;
    reasons: string[];
    conflicts: string[];
};
type Account = { id: number; name: string; email: string; phone: string; city: string; sleep: string; cleanliness: string; budget: string };
const api = `http://${window.location.hostname}:8000/api`;
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@roomsync.test";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "Admin@1234";
const DEMO_MATCHES: Match[] = [
    {
        user: { name: "Meera Kapoor" },
        score: 91,
        reasons: [
            "You both prefer calm, tidy evenings",
            "Similar late study rhythm",
        ],
        conflicts: [],
    },
    {
        user: { name: "Rohan Batra" },
        score: 86,
        reasons: ["Your budgets overlap comfortably", "Both enjoy shared dinners"],
        conflicts: ["Different guest tolerance"],
    },
    {
        user: { name: "Ananya Joshi" },
        score: 82,
        reasons: ["Similar cleanliness expectations", "Both are non-smokers"],
        conflicts: ["Different sleep routines"],
    },
    {
        user: { name: "Dev Malhotra" },
        score: 78,
        reasons: [
            "You both want a private room",
            "Close campus commute preference",
        ],
        conflicts: ["Different noise tolerance"],
    },
    {
        user: { name: "Sana Sheikh" },
        score: 88,
        reasons: ["Similar study-first routine", "Overlapping Gurugram budget"],
        conflicts: [],
    },
    {
        user: { name: "Arjun Nair" },
        score: 84,
        reasons: ["Both prefer shared chores", "Close food preferences"],
        conflicts: ["Different guest frequency"],
    },
    {
        user: { name: "Kavya Iyer" },
        score: 81,
        reasons: ["Both value a quiet workspace", "Similar morning routines"],
        conflicts: [],
    },
    {
        user: { name: "Yash Verma" },
        score: 79,
        reasons: ["Flexible routines fit well", "Both want a furnished place"],
        conflicts: ["Different cleanliness styles"],
    },
    {
        user: { name: "Nisha Thakur" },
        score: 76,
        reasons: ["Compatible rent range", "Both are campus-focused"],
        conflicts: ["Different food preferences"],
    },
    {
        user: { name: "Aditi Rao" },
        score: 74,
        reasons: ["Similar private-room preference", "Both avoid smoking indoors"],
        conflicts: ["Different sleep routines"],
    },
    {
        user: { name: "Harsh Vardhan" },
        score: 72,
        reasons: ["Close commute expectations", "Similar social energy"],
        conflicts: ["Different noise tolerance"],
    },
    {
        user: { name: "Ishaan Gupta" },
        score: 70,
        reasons: ["Both enjoy occasional shared meals", "Budget ranges overlap"],
        conflicts: ["Different study styles"],
    },
    {
        user: { name: "Simran Kaur" },
        score: 68,
        reasons: ["Both want transparent house rules", "Similar area preferences"],
        conflicts: ["Different guest tolerance"],
    },
    {
        user: { name: "Neel Shah" },
        score: 66,
        reasons: ["Similar move-in timeline", "Both prefer reliable utilities"],
        conflicts: ["Different routines"],
    },
    {
        user: { name: "Tanya Bansal" },
        score: 64,
        reasons: ["Both value respectful communication", "Compatible budget range"],
        conflicts: ["Different social schedules"],
    },
];

export function App() {
    const [matches, setMatches] = useState<Match[]>(DEMO_MATCHES);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [listings, setListings] = useState<any[]>([]);
    const [safety, setSafety] = useState<any>();
    const [activeView, setActiveView] = useState("Overview");
    const [showLogin, setShowLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedAdminPerson, setSelectedAdminPerson] = useState<Match>();
    const [selectedAdminAccount, setSelectedAdminAccount] = useState<Account>();
    const [weights, setWeights] = useState({
        routine: 25,
        cleanliness: 20,
        social: 15,
    });
    const [backendStatus, setBackendStatus] = useState({
        health: false,
        matches: false,
        listings: false,
        safety: false,
    });
    const [showRegister, setShowRegister] = useState(false);
    const [registerStep, setRegisterStep] = useState(1);
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        city: "Gurugram",
        sleep: "Night owl",
        cleanliness: "Balanced",
        budget: "₹10k – ₹18k",
    });
    const [showProfile, setShowProfile] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [toast, setToast] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [profileName, setProfileName] = useState("Priya Sharma");
    const [accountEmail, setAccountEmail] = useState("demo@roomsync.test");
    const [profilePhone, setProfilePhone] = useState("+91 98765 43210");
    const [profileCollege, setProfileCollege] = useState(
        "The NorthCap University",
    );
    const [profilePhoto, setProfilePhoto] = useState("");
    const [profileSleep, setProfileSleep] = useState("Night owl");
    const [profileCleanliness, setProfileCleanliness] = useState("Calm & tidy");
    const [profileBudget, setProfileBudget] = useState("₹10k – ₹18k");
    const [isStudentVerified, setIsStudentVerified] = useState(true);
    const [verifiedCampus, setVerifiedCampus] = useState("The NorthCap University (NCU)");
    const [chatPopup, setChatPopup] = useState<{ recipient: string; listingId: number; title?: string } | null>(null);

    const profileChecklist = [
        { label: "Full Name", done: Boolean(profileName.trim()) },
        { label: "Phone Number", done: Boolean(profilePhone.trim()) },
        { label: "College / Campus", done: Boolean(profileCollege.trim()) },
        { label: "Campus Verified", done: isStudentVerified },
        { label: "Profile Photo", done: Boolean(profilePhoto) },
        { label: "Sleep Routine", done: Boolean(profileSleep) },
        { label: "Cleanliness Habit", done: Boolean(profileCleanliness) },
        { label: "Budget Range", done: Boolean(profileBudget) },
    ];
    const completedItems = profileChecklist.filter((item) => item.done).length;
    const completionPercentage = Math.round((completedItems / profileChecklist.length) * 100);

    const notify = (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 2600);
    };

    const refreshBackendStatus = () => {
        const endpoints = {
            health: `${api}/health/`,
            matches: `${api}/matches/`,
            listings: `${api}/listings/`,
            safety: `${api}/safety/`,
        } as const;
        Object.entries(endpoints).forEach(([name, endpoint]) => {
            fetch(endpoint)
                .then((response) => setBackendStatus((current) => ({ ...current, [name]: response.ok })))
                .catch(() => setBackendStatus((current) => ({ ...current, [name]: false })));
        });
    };

    useEffect(() => {
        refreshBackendStatus();
        Promise.all([
            fetch(`${api}/matches/`).then((response) => response.json()),
            fetch(`${api}/listings/`).then((response) => response.json()),
            fetch(`${api}/safety/`).then((response) => response.json()),
            fetch(`${api}/auth/accounts/`).then((response) => response.json()),
        ])
            .then(([matchData, listingData, safetyData, accountData]) => {
                setMatches([...DEMO_MATCHES, ...matchData.results]);
                setListings(listingData.results);
                setSafety(safetyData);
                setAccounts(accountData.results || []);
            })
            .catch(() =>
                notify("API unavailable. Start the backend to load demo data."),
            );
    }, []);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        if (
            values.get("email") === adminEmail &&
            values.get("password") === adminPassword
        ) {
            setIsAdmin(true);
            setLoggedIn(true);
            setShowLogin(false);
            setActiveView("Admin panel");
            fetch(`${api}/auth/accounts/`).then((response) => response.json()).then((data) => setAccounts(data.results || []));
            notify("Admin console unlocked for this demo.");
            return;
        }
        try {
            const response = await fetch(`${api}/auth/login/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: values.get("email"), password: values.get("password") }) });
            const data = await response.json();
            if (!response.ok) {
                notify(data.error || "Invalid email or password.");
                return;
            }
            setIsAdmin(false);
            setLoggedIn(true);
            setShowLogin(false);
            setActiveView("Overview");
            setProfileName(data.user.name);
            setAccountEmail(data.user.email);
            setProfilePhone(data.user.phone);
            if (data.user.sleep) setProfileSleep(data.user.sleep);
            if (data.user.cleanliness) setProfileCleanliness(data.user.cleanliness);
            if (data.user.budget) setProfileBudget(data.user.budget);
            setProfilePhoto("");
            notify(`Welcome back, ${data.user.name}.`);
        } catch {
            notify("Could not reach the account service.");
        }
    };

    const updateRegister = (field: string, value: string) =>
        setRegisterData((current) => ({ ...current, [field]: value }));

    const handleRegisterNext = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (
            registerStep === 1 &&
            registerData.password !== registerData.confirmPassword
        ) {
            notify("Passwords do not match.");
            return;
        }
        if (registerStep < 4) setRegisterStep((step) => step + 1);
        else {
            try {
                const response = await fetch(`${api}/auth/register/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(registerData) });
                const data = await response.json();
                if (!response.ok) {
                    notify(data.error || "Account could not be created.");
                    return;
                }
                setShowRegister(false);
                setRegisterStep(1);
                setLoggedIn(true);
                setIsAdmin(false);
                setActiveView("Overview");
                setProfileName(data.user.name);
                setAccountEmail(data.user.email);
                setProfilePhone(data.user.phone);
                if (data.user.sleep) setProfileSleep(data.user.sleep);
                if (data.user.cleanliness) setProfileCleanliness(data.user.cleanliness);
                if (data.user.budget) setProfileBudget(data.user.budget);
                setProfilePhoto("");
                setRegisterData((current) => ({ ...current, password: "", confirmPassword: "" }));
                notify(`Account created for ${data.user.email}.`);
            } catch {
                notify("Could not reach the account service.");
            }
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setIsAdmin(false);
        setShowProfile(false);
        setSelectedAdminPerson(undefined);
        setSelectedAdminAccount(undefined);
        setSearchTerm("");
        setActiveView("Overview");
        setProfilePhoto("");
        setChatPopup(null);
        notify("You have been logged out.");
    };

    const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setProfilePhoto(URL.createObjectURL(file));
    };

    const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowProfile(false);
        notify("Profile checklist saved! Your compatibility score is updated.");
    };

    const handleNav = (view: string) => {
        if (!loggedIn) {
            setShowLogin(true);
            return;
        }
        setActiveView(view);
        if (view === "Find your people") {
            document
                .getElementById("discovery")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        notify(
            view === "Overview"
                ? "Overview selected."
                : `${view} is ready in the demo workspace.`,
        );
    };

    const visibleMatches = matches.filter((match) =>
        match.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-mark">R</span>
                    <span>RoomSync</span>
                </div>
                <p className="eyebrow">YOUR RENTING COMPASS</p>
                <nav>
                    {(isAdmin ? [["Admin panel", Settings]] : [
                        ["Overview", Home],
                        ["Find your people", Users],
                        ["Messages", MessageCircle],
                        ["Split bills", Receipt],
                        ["Roommate pact", Sparkles],
                        ["Compatibility radar", BarChart3],
                        ["Safety map", Map],
                        ["Visit SOS", ShieldAlert],
                        ["Landlord reviews", Star],
                        ["Agreements", FileCheck2],
                    ]).map(([label, Icon]) => (
                        <button
                            className={activeView === label ? "active" : ""}
                            onClick={() => handleNav(label as string)}
                            key={label as string}
                        >
                            <Icon size={17} />
                            {label as string}
                        </button>
                    ))}
                </nav>
                <div className="sidebar-note">
                    <ShieldCheck size={20} />
                    <strong>Trust, explained.</strong>
                    <span>Every score comes with a reason you can understand.</span>
                </div>
            </aside>
            <main>
                <header>
                    <div>
                        <p className="eyebrow">{new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()).toUpperCase()}</p>
                        <h1>
                            {isAdmin
                                ? "Admin command center."
                                : loggedIn
                                    ? activeView === "Overview"
                                        ? `Good morning, ${profileName.split(" ")[0]}.`
                                        : activeView
                                    : "Welcome to RoomSync."}
                            {loggedIn && isStudentVerified && (
                                <span
                                    style={{
                                        fontSize: "11px",
                                        background: "#fef3c7",
                                        color: "#92400e",
                                        padding: "4px 10px",
                                        borderRadius: "14px",
                                        fontWeight: 700,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        border: "1px solid #fde68a",
                                        marginLeft: "10px",
                                        verticalAlign: "middle",
                                    }}
                                    title={`Verified NCU Student · ${verifiedCampus}`}
                                >
                                    <GraduationCap size={13} style={{ color: "#d97706" }} /> Verified NCU Student
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="header-actions">
                        {!isAdmin && <label className="search">
                            <Search size={16} />
                            <input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder={loggedIn ? "Search matches" : "Log in to search"}
                                disabled={!loggedIn}
                            />
                        </label>}
                        <button
                            className="icon-button"
                            aria-label="Notifications"
                            onClick={() =>
                                notify(
                                    loggedIn
                                        ? "You have 3 new compatibility updates."
                                        : "Please log in to view notifications.",
                                )
                            }
                        >
                            <Bell size={18} />
                        </button>
                        {isAdmin ? (
                            <button
                                className="admin-session"
                                onClick={handleLogout}
                            >
                                <LogOut size={14} />
                                Log out
                            </button>
                        ) : loggedIn ? (
                            <>
                                <button
                                    className="avatar avatar-button"
                                    onClick={() => setShowProfile(true)}
                                >
                                    {profilePhoto ? <img src={profilePhoto} alt="Profile" /> : profileName.split(" ").map(n => n[0]).join("")}
                                </button>
                                <button className="header-logout" onClick={handleLogout}>
                                    <LogOut size={14} />
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="register-button"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Create account
                                </button>
                                <button
                                    className="login-button"
                                    onClick={() => setShowLogin(true)}
                                >
                                    <LogIn size={15} />
                                    Log in
                                </button>
                            </>
                        )}
                    </div>
                </header>
                {!isAdmin && <section className="hero">
                    <div>
                        <p className="eyebrow mint">NCU GURUGRAM PILOT</p>
                        <h2>
                            Find a home that
                            <br />
                            <em>feels like yours.</em>
                        </h2>
                        <p className="hero-copy">
                            Your personal compatibility map for flatmates, places, and the
                            fine print in between.
                        </p>
                        <button
                            className="primary"
                            onClick={() =>
                                loggedIn
                                    ? setShowProfile(true)
                                    : setShowLogin(true)
                            }
                        >
                            {loggedIn ? "Complete your profile" : "Log in to get started"}{" "}
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                    <div className="hero-orbit">
                        <div className="orbit-ring ring-one" />
                        <div className="orbit-ring ring-two" />
                        <div className="orbit-core">
                            <span>{loggedIn ? `${completionPercentage}%` : "—"}</span>
                            <small>{loggedIn ? "profile complete" : "sign in first"}</small>
                        </div>
                        <span className="orbit-dot dot-one" />
                        <span className="orbit-dot dot-two" />
                    </div>
                </section>}
                {isAdmin ? (
                    <section className="admin-dashboard">
                        <div className="admin-heading">
                            <div>
                                <p className="eyebrow">ROOMSYNC CONTROL ROOM</p>
                                <h2>Admin command center.</h2>
                                <p>
                                    Demo moderation, safety, and matching controls for the NCU
                                    pilot.
                                </p>
                            </div>
                            <div className="admin-heading-actions"><span className="admin-badge"><LockKeyhole size={14} /> Staff only</span><button className="admin-details-jump" onClick={() => document.getElementById("admin-people")?.scrollIntoView({ behavior: "smooth", block: "start" })}><Users size={14} /> View all user details</button></div>
                        </div>
                        <section className="admin-stat-grid">
                            <article>
                                <BarChart3 size={18} />
                                <strong>15</strong>
                                <span>synthetic profiles</span>
                            </article>
                            <article>
                                <Flag size={18} />
                                <strong>4</strong>
                                <span>flagged listings</span>
                            </article>
                            <article>
                                <UserCog size={18} />
                                <strong>98%</strong>
                                <span>profile completion</span>
                            </article>
                            <article>
                                <ShieldCheck size={18} />
                                <strong>32</strong>
                                <span>sample area risk</span>
                            </article>
                        </section>
                        <div className="admin-grid">
                            <section className="admin-card">
                                <div className="panel-heading">
                                    <div>
                                        <p className="eyebrow">MODERATION QUEUE</p>
                                        <h3>Listings needing a look</h3>
                                    </div>
                                    <button
                                        className="text-button"
                                        onClick={() => notify("Moderation queue refreshed.")}
                                    >
                                        Refresh <ArrowUpRight size={15} />
                                    </button>
                                </div>
                                {[
                                    "Token advance requested before visit",
                                    "Duplicate photos match listing #12",
                                    "Rent is 42% below locality median",
                                ].map((flag, index) => (
                                    <div className="admin-row" key={flag}>
                                        <span className="flag-icon">
                                            <Flag size={15} />
                                        </span>
                                        <div>
                                            <strong>Listing #{18 + index}</strong>
                                            <span>{flag}</span>
                                        </div>
                                        <button
                                            className="review-button"
                                            onClick={() =>
                                                notify(`Listing #${18 + index} marked for review.`)
                                            }
                                        >
                                            Review
                                        </button>
                                    </div>
                                ))}
                            </section>
                            <section className="admin-card">
                                <div className="panel-heading">
                                    <div>
                                        <p className="eyebrow">MATCH ENGINE</p>
                                        <h3>Weight tuning</h3>
                                    </div>
                                    <Settings size={18} />
                                </div>
                                {Object.entries(weights).map(([name, value]) => (
                                    <label className="weight-row" key={name}>
                                        <span>
                                            {name}
                                            <strong>{value}%</strong>
                                        </span>
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            value={value}
                                            onChange={(event) =>
                                                setWeights((current) => ({
                                                    ...current,
                                                    [name]: Number(event.target.value),
                                                }))
                                            }
                                        />
                                    </label>
                                ))}
                                <button
                                    className="primary save-weight"
                                    onClick={() => notify("Match weights saved for this demo.")}
                                >
                                    Save weights <CheckCircle2 size={16} />
                                </button>
                            </section>
                        </div>
                        <section className="admin-card people-directory registered-accounts">
                            <div className="panel-heading"><div><p className="eyebrow">REGISTERED ACCOUNTS</p><h3>Users saved in the backend</h3></div><span className="directory-count">{accounts.length} accounts</span></div>
                            <div className="people-table">{accounts.map((account) => <div className="people-row account-row" key={account.id}><span className="person-avatar">{account.name.split(" ").map((name) => name[0]).join("")}</span><div className="people-main"><strong>{account.name}</strong><span>{account.email}</span></div><div className="account-contact"><strong>{account.phone}</strong><span>{account.city}</span></div><div className="account-preferences"><span>{account.sleep}</span><span>{account.cleanliness} · {account.budget}</span></div><button className="review-button" onClick={() => setSelectedAdminAccount(account)}>View detail</button></div>)}</div>
                        </section>
                        <section id="admin-people" className="admin-card people-directory">
                            <div className="panel-heading">
                                <div>
                                    <p className="eyebrow">PEOPLE DIRECTORY</p>
                                    <h3>All available demo profiles</h3>
                                </div>
                                <span className="directory-count">{matches.length} profiles</span>
                            </div>
                            <div className="people-table">
                                {matches.map((match) => (
                                    <div className="people-row" key={match.user.name}>
                                        <span className="person-avatar">{match.user.name.split(" ").map((name) => name[0]).join("")}</span>
                                        <div className="people-main"><strong>{match.user.name}</strong><span>Gurugram · synthetic demo profile</span></div>
                                        <div className="people-signal"><strong>{match.score}</strong><span>compatibility</span></div>
                                        <div className="people-reasons"><span><CheckCircle2 size={12} />{match.reasons[0] || "Reason unavailable"}</span>{match.conflicts[0] && <span className="people-conflict"><AlertTriangle size={12} />{match.conflicts[0]}</span>}</div>
                                        <button className="review-button" onClick={() => setSelectedAdminPerson(match)}>View detail</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="admin-card system-card">
                            <div>
                                <p className="eyebrow">SYSTEM STATUS</p>
                                <h3>Backend feature health</h3>
                            </div>
                            <div className="service-list">
                                {Object.entries(backendStatus).map(([name, working]) => <span className={working ? "service-working" : "service-offline"} key={name}><i />{name} endpoint: {working ? "Working" : "Offline"}</span>)}
                                <span className="service-demo"><i />Storage: in-memory demo</span>
                            </div>
                            <button
                                className="text-button"
                                onClick={() => { refreshBackendStatus(); notify("Backend feature status refreshed."); }}
                            >
                                Check again <ArrowUpRight size={15} />
                            </button>
                        </section>
                    </section>
                ) : loggedIn ? (
                    <>
                        {activeView === "Messages" && (
                            <Chat api={api} currentUser={accountEmail} onNotify={notify} />
                        )}
                        {activeView === "Split bills" && (
                            <ExpenseSplitter api={api} currentUser={profileName} onNotify={notify} />
                        )}
                        {activeView === "Roommate pact" && (
                            <RoommatePact api={api} currentUser={profileName} onNotify={notify} />
                        )}
                        {activeView === "Compatibility radar" && (
                            <RadarMatch />
                        )}
                        {activeView === "Safety map" && (
                            <SafetyMap safety={safety} listings={listings} onNotify={notify} />
                        )}
                        {activeView === "Visit SOS" && (
                            <FlatVisitCompanion api={api} currentUser={accountEmail} onNotify={notify} />
                        )}
                        {activeView === "Landlord reviews" && (
                            <SocietyReviews api={api} currentUser={accountEmail} onNotify={notify} />
                        )}
                        {activeView === "Agreements" && (
                            <AgreementVerifier api={api} onNotify={notify} />
                        )}
                        {(activeView === "Overview" || activeView === "Find your people") && (
                            <>
                                <Discovery
                                    api={api}
                                    onNotify={notify}
                                    currentUser={accountEmail}
                                    onOpenChat={(recipient, listingId, title) => setChatPopup({ recipient, listingId, title })}
                                />
                                <div className="section-heading">
                                    <div>
                                        <p className="eyebrow">YOUR SIGNALS</p>
                                        <h3>Everything in one view</h3>
                                    </div>
                                    <button
                                        className="text-button"
                                        onClick={() => notify("Activity timeline is up to date.")}
                                    >
                                        View activity <ArrowUpRight size={15} />
                                    </button>
                                </div>
                                <section className="stat-grid">
                                    <article className="stat-card mint-card">
                                        <span className="stat-icon">
                                            <Users size={18} />
                                        </span>
                                        <strong>{matches.length}</strong>
                                        <span>compatible people</span>
                                        <small>+3 since yesterday</small>
                                    </article>
                                    <article className="stat-card sand-card">
                                        <span className="stat-icon">
                                            <ShieldCheck size={18} />
                                        </span>
                                        <strong>
                                            {listings[0]?.trust?.score || 0}
                                            <small>/100</small>
                                        </strong>
                                        <span>top listing trust</span>
                                        <small>fully explained</small>
                                    </article>
                                    <article className="stat-card blue-card">
                                        <span className="stat-icon">
                                            <Map size={18} />
                                        </span>
                                        <strong>
                                            {safety?.geo_risk_score || 0}
                                            <small>/100</small>
                                        </strong>
                                        <span>area risk score</span>
                                        <small>{safety?.campus?.commute || "campus nearby"}</small>
                                    </article>
                                    <article className="stat-card lilac-card">
                                        <span className="stat-icon">
                                            <FileCheck2 size={18} />
                                        </span>
                                        <strong>1</strong>
                                        <span>agreement analysed</span>
                                        <small>needs your review</small>
                                    </article>
                                </section>
                                <section className="content-grid">
                                    <div className="panel">
                                        <div className="panel-heading">
                                            <div>
                                                <p className="eyebrow">MATCH FEED</p>
                                                <h3>People you might click with</h3>
                                            </div>
                                            <button
                                                className="text-button"
                                                onClick={() => handleNav("Find your people")}
                                            >
                                                See all <ArrowUpRight size={15} />
                                            </button>
                                        </div>
                                        <div className="match-list">
                                            {visibleMatches.map((match) => (
                                                <button
                                                    className="match-row match-button"
                                                    onClick={() =>
                                                        notify(
                                                            `Opened compatibility details for ${match.user.name}.`,
                                                        )
                                                    }
                                                    key={match.user.name}
                                                >
                                                    <div className="person-avatar">
                                                        {match.user.name
                                                            .split(" ")
                                                            .map((name) => name[0])
                                                            .join("")}
                                                    </div>
                                                    <div className="person-copy">
                                                        <strong>{match.user.name}</strong>
                                                        <span>
                                                            {match.reasons[0] ||
                                                                "A promising compatibility signal"}
                                                        </span>
                                                        <div className="chips">
                                                            {match.reasons.slice(0, 2).map((reason) => (
                                                                <span className="chip positive" key={reason}>
                                                                    <CheckCircle2 size={12} />
                                                                    {reason}
                                                                </span>
                                                            ))}
                                                            {match.conflicts.slice(0, 1).map((conflict) => (
                                                                <span className="chip warning" key={conflict}>
                                                                    <AlertTriangle size={12} />
                                                                    {conflict}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="score">
                                                        <strong>{match.score}</strong>
                                                        <span>match</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="panel place-panel">
                                        <div className="panel-heading">
                                            <div>
                                                <p className="eyebrow">SAFER PLACES</p>
                                                <h3>Near your campus</h3>
                                            </div>
                                            <button
                                                className="panel-icon"
                                                onClick={() => handleNav("Safety map")}
                                                aria-label="Open safety map"
                                            >
                                                <Map size={19} />
                                            </button>
                                        </div>
                                        <div className="map-placeholder osm-map">
                                            <iframe
                                                title="OpenStreetMap map of NCU Gurugram"
                                                src="https://www.openstreetmap.org/export/embed.html?bbox=77.00%2C28.42%2C77.06%2C28.48&layer=mapnik&marker=28.4595%2C77.0266"
                                            />
                                            <div className="map-card">
                                                <strong>
                                                    {safety?.campus?.distance_km || "1.8"} km away
                                                </strong>
                                                <span>Short ride · Moderate risk</span>
                                            </div>
                                        </div>
                                        <button
                                            className="listing-mini listing-button"
                                            onClick={() => notify("Listing trust report opened.")}
                                        >
                                            <div>
                                                <strong>
                                                    {listings[0]?.title || "Sunlit room near NCU"}
                                                </strong>
                                                <span>
                                                    ₹{listings[0]?.rent || "14,500"} · verified listing
                                                </span>
                                            </div>
                                            <span className="trust-badge">
                                                {listings[0]?.trust?.score || 0}
                                            </span>
                                        </button>
                                    </div>
                                </section>
                            </>
                        )}
                    </>
                ) : (
                    <section className="logged-out-panel">
                        <div className="login-mark">
                            <UserRound size={22} />
                        </div>
                        <p className="eyebrow">PRIVATE DASHBOARD</p>
                        <h3>Log in to see your personal signals</h3>
                        <p>
                            Matches, saved listings, safety details, and agreement analysis
                            appear here after you sign in.
                        </p>
                        <button className="primary" onClick={() => setShowLogin(true)}>
                            Open demo login <LogIn size={16} />
                        </button>
                    </section>
                )}
            </main>
            {toast && (
                <div className="toast" role="status">
                    {toast}
                </div>
            )}
            {showLogin && (
                <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
                    <section
                        className="login-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setShowLogin(false)}
                            aria-label="Close login"
                        >
                            <X size={18} />
                        </button>
                        <div className="login-mark">
                            <LogIn size={20} />
                        </div>
                        <p className="eyebrow">ROOMSYNC</p>
                        <h2>Welcome back.</h2>
                        <p className="login-copy">Sign in to continue to your account.</p>
                        <form onSubmit={handleLogin}>
                            <label>
                                Email
                                <input
                                    name="email"
                                    type="email"
                                    required
                                />
                            </label>
                            <label>
                                Password
                                <input
                                    name="password"
                                    type="password"
                                    required
                                />
                            </label>
                            <button className="primary login-submit" type="submit">
                                Sign in <ArrowUpRight size={16} />
                            </button>
                        </form>
                        <small>Use your account credentials to continue.</small>
                    </section>
                </div>
            )}
            {showRegister && (
                <div className="modal-backdrop" onClick={() => setShowRegister(false)}>
                    <section
                        className="register-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setShowRegister(false)}
                            aria-label="Close registration"
                        >
                            <X size={18} />
                        </button>
                        <div className="register-progress">
                            <span className="login-mark">
                                <Users size={20} />
                            </span>
                            <div>
                                <p className="eyebrow">BUILD YOUR HOUSEHOLD DNA</p>
                                <h2>Create your account</h2>
                            </div>
                            <strong>{registerStep}/4</strong>
                        </div>
                        <div className="step-track">
                            <span style={{ width: `${registerStep * 25}%` }} />
                        </div>
                        <form onSubmit={handleRegisterNext}>
                            {registerStep === 1 && (
                                <div className="question-step">
                                    <p className="question-kicker">
                                        First, let’s create your secure account.
                                    </p>
                                    <h3>How can we reach you?</h3>
                                    <label>
                                        Full name
                                        <input
                                            autoFocus
                                            value={registerData.name}
                                            onChange={(event) =>
                                                updateRegister("name", event.target.value)
                                            }
                                            placeholder="e.g. Priya Sharma"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            value={registerData.email}
                                            onChange={(event) =>
                                                updateRegister("email", event.target.value)
                                            }
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Mobile number
                                        <input
                                            type="tel"
                                            value={registerData.phone}
                                            onChange={(event) =>
                                                updateRegister("phone", event.target.value)
                                            }
                                            placeholder="e.g. +91 98765 43210"
                                            required
                                        />
                                    </label>
                                    <div className="form-two">
                                        <label>
                                            Password
                                            <input
                                                type="password"
                                                value={registerData.password}
                                                onChange={(event) =>
                                                    updateRegister("password", event.target.value)
                                                }
                                                minLength={8}
                                                placeholder="At least 8 characters"
                                                required
                                            />
                                        </label>
                                        <label>
                                            Confirm password
                                            <input
                                                type="password"
                                                value={registerData.confirmPassword}
                                                onChange={(event) =>
                                                    updateRegister("confirmPassword", event.target.value)
                                                }
                                                minLength={8}
                                                placeholder="Repeat password"
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                            {registerStep === 2 && (
                                <div className="question-step">
                                    <p className="question-kicker">
                                        The 11:47 PM kitchen conversation.
                                    </p>
                                    <h3>When does your day really begin?</h3>
                                    <div className="choice-grid">
                                        {["Early bird", "Night owl", "Flexible"].map((choice) => (
                                            <button
                                                type="button"
                                                className={
                                                    registerData.sleep === choice
                                                        ? "choice selected"
                                                        : "choice"
                                                }
                                                onClick={() => updateRegister("sleep", choice)}
                                                key={choice}
                                            >
                                                {choice}
                                                <small>
                                                    {choice === "Early bird"
                                                        ? "Up before 7"
                                                        : choice === "Night owl"
                                                            ? "Best after 10 PM"
                                                            : "Depends on the day"}
                                                </small>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {registerStep === 3 && (
                                <div className="question-step">
                                    <p className="question-kicker">
                                        A little friction is normal. Knowing it helps.
                                    </p>
                                    <h3>What does “home” feel like?</h3>
                                    <div className="choice-grid">
                                        {[
                                            "Calm & tidy",
                                            "Lived-in & warm",
                                            "Social & spirited",
                                        ].map((choice) => (
                                            <button
                                                type="button"
                                                className={
                                                    registerData.cleanliness === choice
                                                        ? "choice selected"
                                                        : "choice"
                                                }
                                                onClick={() => updateRegister("cleanliness", choice)}
                                                key={choice}
                                            >
                                                {choice}
                                                <small>
                                                    {choice === "Calm & tidy"
                                                        ? "Clear surfaces, clear mind"
                                                        : choice === "Lived-in & warm"
                                                            ? "Comfort over perfection"
                                                            : "Friends welcome"}
                                                </small>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {registerStep === 4 && (
                                <div className="question-step">
                                    <p className="question-kicker">
                                        Let’s keep the rent conversation easy.
                                    </p>
                                    <h3>What monthly range feels right?</h3>
                                    <div className="choice-grid">
                                        {["₹8k – ₹12k", "₹10k – ₹18k", "₹18k – ₹25k"].map(
                                            (choice) => (
                                                <button
                                                    type="button"
                                                    className={
                                                        registerData.budget === choice
                                                            ? "choice selected"
                                                            : "choice"
                                                    }
                                                    onClick={() => updateRegister("budget", choice)}
                                                    key={choice}
                                                >
                                                    {choice}
                                                    <small>Before utilities</small>
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                            <button className="primary login-submit" type="submit">
                                {registerStep === 4 ? "Create my circle" : "Next question"}{" "}
                                <ArrowUpRight size={16} />
                            </button>
                        </form>
                        <small>
                            Demo account only. Your answers shape recommendations and are not
                            used for protected-attribute matching.
                        </small>
                    </section>
                </div>
            )}
            {showProfile && (
                <div className="modal-backdrop" onClick={() => setShowProfile(false)}>
                    <section
                        className="profile-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setShowProfile(false)}
                            aria-label="Close profile checklist"
                        >
                            <X size={18} />
                        </button>

                        <div className="profile-heading">
                            <div className="profile-photo">
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="Profile preview" />
                                ) : (
                                    <UserRound size={28} />
                                )}
                            </div>
                            <div>
                                <p className="eyebrow mint-text">YOUR PROFILE CHECKLIST</p>
                                <h2>Profile & Preferences</h2>
                                <span style={{ fontSize: "12px", color: "var(--teal)", fontWeight: 600 }}>
                                    {completionPercentage}% completed ({completedItems} of {profileChecklist.length} steps)
                                </span>
                            </div>
                        </div>

                        {/* Interactive Checklist Visual Progress */}
                        <div style={{ margin: "16px 0 20px" }}>
                            <div style={{ height: "7px", borderRadius: "4px", background: "#e2e7e3", overflow: "hidden" }}>
                                <div
                                    style={{
                                        width: `${completionPercentage}%`,
                                        height: "100%",
                                        background: completionPercentage === 100 ? "#48bb78" : "#117c74",
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                                {profileChecklist.map((item) => (
                                    <span
                                        key={item.label}
                                        style={{
                                            fontSize: "11px",
                                            padding: "3px 8px",
                                            borderRadius: "10px",
                                            background: item.done ? "#e8f5e8" : "#f2f5f2",
                                            color: item.done ? "#276749" : "#71808a",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {item.done ? <CheckCircle2 size={11} /> : "○"} {item.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleProfileSave}>
                            <label>
                                Profile photo
                                <span className="upload-control">
                                    <Camera size={15} />
                                    Choose image
                                    <input type="file" accept="image/*" onChange={handlePhoto} />
                                </span>
                            </label>
                            <label>
                                Full name
                                <input
                                    value={profileName}
                                    onChange={(event) => setProfileName(event.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Email
                                <input type="email" value={accountEmail} readOnly />
                            </label>
                            <label>
                                Phone number
                                <input
                                    value={profilePhone}
                                    onChange={(event) => setProfilePhone(event.target.value)}
                                    placeholder="+91 98765 43210"
                                />
                            </label>
                            <label>
                                College / University
                                <input
                                    value={profileCollege}
                                    onChange={(event) => setProfileCollege(event.target.value)}
                                    placeholder="The NorthCap University"
                                />
                            </label>

                            <div className="settings-divider">
                                <StudentVerification
                                    api={api}
                                    currentUserEmail={accountEmail}
                                    isVerified={isStudentVerified}
                                    onVerified={(email, campus) => {
                                        setIsStudentVerified(true);
                                        setVerifiedCampus(campus);
                                        setAccountEmail(email);
                                    }}
                                    onNotify={notify}
                                />
                            </div>

                            <div className="settings-divider">
                                <p className="eyebrow">HOUSEHOLD DNA & HABITS</p>
                                <label>
                                    Daily Routine / Sleep
                                    <select
                                        value={profileSleep}
                                        onChange={(e) => setProfileSleep(e.target.value)}
                                        style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", color: "var(--ink)", font: "inherit", outline: "none", background: "#fff" }}
                                    >
                                        <option value="Early bird">Early bird (Up before 7 AM)</option>
                                        <option value="Night owl">Night owl (Best after 10 PM)</option>
                                        <option value="Flexible">Flexible (Depends on schedule)</option>
                                    </select>
                                </label>
                                <label>
                                    Living Habits & Cleanliness
                                    <select
                                        value={profileCleanliness}
                                        onChange={(e) => setProfileCleanliness(e.target.value)}
                                        style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", color: "var(--ink)", font: "inherit", outline: "none", background: "#fff" }}
                                    >
                                        <option value="Calm & tidy">Calm & tidy (Clear surfaces, clear mind)</option>
                                        <option value="Lived-in & warm">Lived-in & warm (Comfort over perfection)</option>
                                        <option value="Social & spirited">Social & spirited (Friends always welcome)</option>
                                    </select>
                                </label>
                                <label>
                                    Monthly Rent Budget
                                    <select
                                        value={profileBudget}
                                        onChange={(e) => setProfileBudget(e.target.value)}
                                        style={{ border: "1px solid #d5dfdb", borderRadius: "6px", padding: "10px", color: "var(--ink)", font: "inherit", outline: "none", background: "#fff" }}
                                    >
                                        <option value="₹8k – ₹12k">₹8k – ₹12k (Budget friendly)</option>
                                        <option value="₹10k – ₹18k">₹10k – ₹18k (Comfort standard)</option>
                                        <option value="₹18k – ₹25k">₹18k – ₹25k (Premium / Private)</option>
                                    </select>
                                </label>
                            </div>

                            <div className="settings-divider">
                                <p className="eyebrow">SECURITY</p>
                                <label>
                                    New password
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep current password"
                                        minLength={8}
                                    />
                                </label>
                                <label>
                                    Confirm password
                                    <input
                                        type="password"
                                        placeholder="Repeat new password"
                                        minLength={8}
                                    />
                                </label>
                            </div>
                            <button className="primary login-submit" type="submit">
                                Save checklist & preferences <CheckCircle2 size={16} />
                            </button>
                        </form>
                        <button className="logout-button" onClick={handleLogout}>
                            <LogIn size={15} />
                            Log out
                        </button>
                        <small>
                            Changes are saved for this session and refresh your matching compatibility.
                        </small>
                    </section>
                </div>
            )}
            {selectedAdminPerson && (
                <div className="modal-backdrop" onClick={() => setSelectedAdminPerson(undefined)}>
                    <section className="admin-person-modal" onClick={(event) => event.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedAdminPerson(undefined)} aria-label="Close user detail"><X size={18} /></button>
                        <div className="admin-person-header"><span className="large-person-avatar">{selectedAdminPerson.user.name.split(" ").map((name) => name[0]).join("")}</span><div><p className="eyebrow">PROFILE DETAIL · SYNTHETIC DEMO</p><h2>{selectedAdminPerson.user.name}</h2><span>Gurugram · profile available for pilot testing</span></div></div>
                        <div className="admin-person-stats"><div><strong>{selectedAdminPerson.score}</strong><span>compatibility score</span></div><div><strong>{selectedAdminPerson.reasons.length}</strong><span>positive reasons</span></div><div><strong>{selectedAdminPerson.conflicts.length}</strong><span>potential conflicts</span></div></div>
                        <div className="admin-detail-columns"><div><h3>Why this match</h3>{selectedAdminPerson.reasons.length ? selectedAdminPerson.reasons.map((reason) => <p className="admin-detail-reason" key={reason}><CheckCircle2 size={14} />{reason}</p>) : <p className="detail-muted">No explanation available.</p>}</div><div><h3>Potential conflicts</h3>{selectedAdminPerson.conflicts.length ? selectedAdminPerson.conflicts.map((conflict) => <p className="admin-detail-conflict" key={conflict}><AlertTriangle size={14} />{conflict}</p>) : <p className="detail-muted">No conflicts recorded.</p>}</div></div><div className="admin-data-note"><ShieldCheck size={16} /><span>Only fields currently available from the matching API are shown. No phone, email, religion, caste, or other protected details are invented or exposed.</span></div>
                    </section>
                </div>
            )}
            {selectedAdminAccount && <div className="modal-backdrop" onClick={() => setSelectedAdminAccount(undefined)}><section className="admin-person-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedAdminAccount(undefined)} aria-label="Close account detail"><X size={18} /></button><div className="admin-person-header"><span className="large-person-avatar">{selectedAdminAccount.name.split(" ").map((name) => name[0]).join("")}</span><div><p className="eyebrow">REGISTERED ACCOUNT · BACKEND</p><h2>{selectedAdminAccount.name}</h2><span>{selectedAdminAccount.city} · account #{selectedAdminAccount.id}</span></div></div><div className="account-detail-grid"><div><strong>Email</strong><span>{selectedAdminAccount.email}</span></div><div><strong>Phone</strong><span>{selectedAdminAccount.phone}</span></div><div><strong>Sleep routine</strong><span>{selectedAdminAccount.sleep}</span></div><div><strong>Cleanliness</strong><span>{selectedAdminAccount.cleanliness}</span></div><div><strong>Budget</strong><span>{selectedAdminAccount.budget}</span></div></div><div className="admin-data-note"><ShieldCheck size={16} /><span>Password hashes are never returned to the admin UI. This data was loaded from the persistent backend account table.</span></div></section></div>}
            {chatPopup && (
                <ChatPopup
                    api={api}
                    currentUser={accountEmail}
                    recipient={chatPopup.recipient}
                    listingId={chatPopup.listingId}
                    listingTitle={chatPopup.title}
                    onClose={() => setChatPopup(null)}
                    onNotify={notify}
                />
            )}
        </div>
    );
}
