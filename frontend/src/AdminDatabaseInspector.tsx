import React, { useState, useEffect } from "react";
import {
    Database,
    Users,
    Home,
    Receipt,
    FileCheck2,
    MessageCircle,
    Star,
    ShieldAlert,
    GraduationCap,
    Search,
    RefreshCw,
    Lock,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Copy,
    Check,
    Layers,
    Sliders,
    Eye,
} from "lucide-react";

interface AdminDatabaseInspectorProps {
    api: string;
    onNotify: (msg: string) => void;
}

type ActiveTab =
    | "accounts"
    | "listings"
    | "expenses"
    | "pacts"
    | "conversations"
    | "messages"
    | "reviews"
    | "visit_alerts"
    | "student_verifications";

export const AdminDatabaseInspector: React.FC<AdminDatabaseInspectorProps> = ({ api, onNotify }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>("accounts");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}/admin/database/`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setData(json);
            onNotify("Database inspector reloaded with latest SQLite records.");
        } catch (err: any) {
            console.error("Failed to load admin database:", err);
            onNotify("Could not load database records. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [api]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        onNotify(`Copied ${label} to clipboard!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const tables = data?.tables || {};
    const listings = data?.listings || [];

    const getRows = (tab: ActiveTab): any[] => {
        if (tab === "listings") return listings;
        const key = `roomsync_${tab}`;
        return tables[key]?.rows || [];
    };

    const currentRows = getRows(activeTab);

    // Filter rows based on search term
    const filteredRows = currentRows.filter((row: any) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return Object.values(row).some((val) => {
            if (val === null || val === undefined) return false;
            if (typeof val === "object") return JSON.stringify(val).toLowerCase().includes(term);
            return String(val).toLowerCase().includes(term);
        });
    });

    const getTabMeta = (tab: ActiveTab) => {
        if (tab === "listings") {
            return {
                title: "All Campus Listings",
                tableName: "listings (ML Verified)",
                icon: Home,
                count: listings.length,
                schema: "id, title, owner, city, locality, address, rent, bhk, occupancy, looking_for, furnishing, trust, safety, status",
                description:
                    "All 20 available student rooms near campus with Trust Engine score (ML evaluation) and Neighborhood Safety index.",
            };
        }
        const key = `roomsync_${tab}`;
        const table = tables[key] || {};
        const iconMap: Record<ActiveTab, any> = {
            accounts: Users,
            listings: Home,
            expenses: Receipt,
            pacts: FileCheck2,
            conversations: MessageCircle,
            messages: MessageCircle,
            reviews: Star,
            visit_alerts: ShieldAlert,
            student_verifications: GraduationCap,
        };

        return {
            title: table.title || key,
            tableName: key,
            icon: iconMap[tab] || Database,
            count: table.count || 0,
            schema: table.schema || table.columns?.join(", ") || "",
            description: table.description || "",
        };
    };

    const activeMeta = getTabMeta(activeTab);

    return (
        <section className="admin-db-inspector">
            {/* Header & Reload */}
            <div className="admin-db-header">
                <div className="admin-db-title">
                    <div className="admin-db-icon-wrap">
                        <Database size={24} className="mint-icon" />
                    </div>
                    <div>
                        <div className="admin-db-badge-row">
                            <span className="admin-db-badge">SQLite3 Production Engine</span>
                            <span className="admin-db-badge live">● Live Connection</span>
                        </div>
                        <h2>Database & Schema Inspector</h2>
                        <p>Real-time view of all tables, fields, cryptographic hashes, and student records.</p>
                    </div>
                </div>

                <div className="admin-db-actions">
                    <button className="admin-db-refresh-btn" onClick={fetchData} disabled={loading}>
                        <RefreshCw size={15} className={loading ? "spin" : ""} />
                        {loading ? "Syncing..." : "Sync DB"}
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="admin-db-tabs-bar">
                {(
                    [
                        { id: "accounts", label: "Accounts", icon: Users, count: tables["roomsync_accounts"]?.count ?? 0 },
                        { id: "listings", label: "Listings", icon: Home, count: listings.length },
                        { id: "expenses", label: "Expenses & UPI", icon: Receipt, count: tables["roomsync_expenses"]?.count ?? 0 },
                        { id: "pacts", label: "Roommate Pacts", icon: FileCheck2, count: tables["roomsync_pacts"]?.count ?? 0 },
                        { id: "conversations", label: "Conversations", icon: MessageCircle, count: tables["roomsync_conversations"]?.count ?? 0 },
                        { id: "messages", label: "Messages", icon: MessageCircle, count: tables["roomsync_messages"]?.count ?? 0 },
                        { id: "reviews", label: "Reviews", icon: Star, count: tables["roomsync_reviews"]?.count ?? 0 },
                        { id: "visit_alerts", label: "SOS Alerts", icon: ShieldAlert, count: tables["roomsync_visit_alerts"]?.count ?? 0 },
                        { id: "student_verifications", label: "Campus Badges", icon: GraduationCap, count: tables["roomsync_student_verifications"]?.count ?? 0 },
                    ] as const
                ).map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            className={`admin-db-tab-pill ${isActive ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSearchTerm("");
                            }}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                            <strong className="admin-db-pill-count">{tab.count}</strong>
                        </button>
                    );
                })}
            </div>

            {/* Active Table Schema Card */}
            <div className="admin-db-schema-card">
                <div className="admin-db-schema-top">
                    <div className="admin-db-schema-info">
                        <span className="admin-db-table-chip">
                            <Layers size={13} /> {activeMeta.tableName}
                        </span>
                        <h3>{activeMeta.title}</h3>
                        <p>{activeMeta.description}</p>
                    </div>

                    <div className="admin-db-search-box">
                        <Search size={15} />
                        <input
                            type="text"
                            placeholder={`Filter ${activeMeta.title}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="admin-db-clear-search" onClick={() => setSearchTerm("")}>
                                <XCircle size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Schema definition banner */}
                <div className="admin-db-schema-row">
                    <div className="admin-db-schema-label">
                        <Lock size={13} /> Schema Columns:
                    </div>
                    <code className="admin-db-schema-code">{activeMeta.schema}</code>
                </div>
            </div>

            {/* Table Records Render */}
            <div className="admin-db-table-wrapper">
                {loading ? (
                    <div className="admin-db-loading">
                        <RefreshCw size={24} className="spin mint-icon" />
                        <p>Querying SQLite database...</p>
                    </div>
                ) : filteredRows.length === 0 ? (
                    <div className="admin-db-empty">
                        <AlertCircle size={28} />
                        <p>No records found matching "{searchTerm}" in {activeMeta.tableName}.</p>
                    </div>
                ) : (
                    <table className="admin-db-table">
                        <thead>
                            {activeTab === "accounts" && (
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone & City</th>
                                    <th>Habits & Preferences</th>
                                    <th>Password Security (PBKDF2)</th>
                                    <th>Created At</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "listings" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Listing Title</th>
                                    <th>Owner</th>
                                    <th>Locality</th>
                                    <th>Rent & Occupancy</th>
                                    <th>Trust Score</th>
                                    <th>Safety Risk</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "expenses" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Expense Title</th>
                                    <th>Amount</th>
                                    <th>Paid By</th>
                                    <th>Category</th>
                                    <th>Split With</th>
                                    <th>UPI ID</th>
                                    <th>Date</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "pacts" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Pact Title</th>
                                    <th>Flatmates</th>
                                    <th>SHA-256 On-Chain Hash</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "conversations" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Participant 1</th>
                                    <th>Participant 2</th>
                                    <th>Listing ID</th>
                                    <th>Started At</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "messages" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Conv ID</th>
                                    <th>Sender</th>
                                    <th>Message Text</th>
                                    <th>Read Status</th>
                                    <th>Sent At</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "reviews" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Locality</th>
                                    <th>Landlord / Society</th>
                                    <th>Deposit Returned</th>
                                    <th>Ratings</th>
                                    <th>Student Feedback</th>
                                    <th>Author</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "visit_alerts" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Student Email</th>
                                    <th>Destination & Listing</th>
                                    <th>Duration</th>
                                    <th>Emergency Phone</th>
                                    <th>Status</th>
                                    <th>Started / Ends</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                            {activeTab === "student_verifications" && (
                                <tr>
                                    <th>ID</th>
                                    <th>Campus Email</th>
                                    <th>OTP Code</th>
                                    <th>Verified Status</th>
                                    <th>Verified At</th>
                                    <th>Inspect</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {filteredRows.map((row: any, idx: number) => {
                                return (
                                    <tr key={row.id ?? idx} className="admin-db-row">
                                        {/* ACCOUNTS */}
                                        {activeTab === "accounts" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td>
                                                    <div className="admin-db-user-cell">
                                                        <span className="admin-db-avatar">{row.name?.slice(0, 2).toUpperCase()}</span>
                                                        <strong>{row.name}</strong>
                                                    </div>
                                                </td>
                                                <td><span className="admin-db-email">{row.email}</span></td>
                                                <td>
                                                    <div className="admin-db-stack">
                                                        <strong>{row.phone}</strong>
                                                        <small>{row.city}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="admin-db-tags">
                                                        <span className="admin-db-tag">{row.sleep}</span>
                                                        <span className="admin-db-tag">{row.cleanliness}</span>
                                                        <span className="admin-db-tag">{row.budget}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="admin-db-hash-cell" title={row.password_hash_masked || row.password_hash}>
                                                        <Lock size={12} />
                                                        <span>{row.password_hash_masked || "pbkdf2:sha256$salted"}</span>
                                                    </div>
                                                </td>
                                                <td><small>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* LISTINGS */}
                                        {activeTab === "listings" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td>
                                                    <div className="admin-db-stack">
                                                        <strong>{row.title}</strong>
                                                        <small>{row.address || row.locality}</small>
                                                    </div>
                                                </td>
                                                <td><span>{row.owner}</span></td>
                                                <td><span className="admin-db-tag">{row.locality}</span></td>
                                                <td>
                                                    <div className="admin-db-stack">
                                                        <strong className="admin-db-rent">₹{row.rent?.toLocaleString()}/mo</strong>
                                                        <small>{row.bhk} BHK · {row.occupancy}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`admin-db-score-badge ${row.trust?.score >= 80 ? "high" : "med"}`}>
                                                        {row.trust?.score ?? 85}% Trust
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`admin-db-safety-badge ${row.safety?.level === "low" ? "safe" : "alert"}`}>
                                                        {row.safety?.level?.toUpperCase() || "SAFE"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* EXPENSES */}
                                        {activeTab === "expenses" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td>
                                                    <div className="admin-db-stack">
                                                        <strong>{row.title}</strong>
                                                        <small className="admin-db-sub">Group: {row.group_id}</small>
                                                    </div>
                                                </td>
                                                <td><strong className="admin-db-amount">₹{row.amount?.toLocaleString()}</strong></td>
                                                <td><span className="admin-db-badge-payer">{row.paid_by}</span></td>
                                                <td><span className="admin-db-category-tag">{row.category}</span></td>
                                                <td>
                                                    <div className="admin-db-split-list">
                                                        {row.split_with?.split(",").map((p: string, i: number) => (
                                                            <span key={i} className="admin-db-split-pill">{p.trim()}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td><code>{row.upi_id || "None"}</code></td>
                                                <td><small>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* PACTS */}
                                        {activeTab === "pacts" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td>
                                                    <div className="admin-db-stack">
                                                        <strong>{row.title}</strong>
                                                        <small>{row.flatmates}</small>
                                                    </div>
                                                </td>
                                                <td><span>{row.flatmates}</span></td>
                                                <td>
                                                    <div className="admin-db-sha-box">
                                                        <code>{row.sha256_hash?.slice(0, 16)}...</code>
                                                        <button
                                                            className="admin-db-copy-icon"
                                                            onClick={() => copyToClipboard(row.sha256_hash, "SHA-256 Hash")}
                                                            title="Copy full hash"
                                                        >
                                                            {copiedField === "SHA-256 Hash" ? <Check size={12} /> : <Copy size={12} />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-db-status-pill signed">
                                                        <CheckCircle2 size={12} /> {row.status || "Signed & Anchored"}
                                                    </span>
                                                </td>
                                                <td><small>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* CONVERSATIONS */}
                                        {activeTab === "conversations" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td><strong>{row.participant_1}</strong></td>
                                                <td><strong>{row.participant_2}</strong></td>
                                                <td><span className="admin-db-tag">Listing #{row.listing_id}</span></td>
                                                <td><small>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* MESSAGES */}
                                        {activeTab === "messages" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td><span className="admin-db-tag">Conv #{row.conversation_id}</span></td>
                                                <td><strong>{row.sender}</strong></td>
                                                <td><p className="admin-db-msg-text">{row.text}</p></td>
                                                <td>
                                                    <span className={`admin-db-read-badge ${row.read ? "read" : "unread"}`}>
                                                        {row.read ? "Read" : "Unread"}
                                                    </span>
                                                </td>
                                                <td><small>{row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* REVIEWS */}
                                        {activeTab === "reviews" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td><span className="admin-db-tag">{row.locality}</span></td>
                                                <td><strong>{row.landlord_name}</strong></td>
                                                <td>
                                                    <span className={`admin-db-deposit-tag ${row.deposit_returned ? "returned" : "deducted"}`}>
                                                        {row.deposit_returned ? "✅ 100% Refunded" : "⚠️ Bogus Cuts"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="admin-db-ratings">
                                                        <span>★ {row.overall_rating}/5</span>
                                                        <small>Maint: {row.maintenance_rating} · Power: {row.water_power_rating}</small>
                                                    </div>
                                                </td>
                                                <td><p className="admin-db-comment-preview">"{row.comment}"</p></td>
                                                <td><small>{row.author_email}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* VISIT ALERTS */}
                                        {activeTab === "visit_alerts" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td><span className="admin-db-email">{row.user_email}</span></td>
                                                <td>
                                                    <div className="admin-db-stack">
                                                        <strong>{row.destination}</strong>
                                                        <small>Listing #{row.listing_id}</small>
                                                    </div>
                                                </td>
                                                <td><span>{row.duration_mins} mins</span></td>
                                                <td><strong>{row.emergency_phone}</strong></td>
                                                <td>
                                                    <span className={`admin-db-sos-pill ${row.status}`}>
                                                        {row.status === "safe" ? "🟢 Check-in Safe" : row.status === "active" ? "🟡 In Progress" : "🔴 SOS Ping"}
                                                    </span>
                                                </td>
                                                <td><small>{row.started_at ? new Date(row.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {/* STUDENT VERIFICATIONS */}
                                        {activeTab === "student_verifications" && (
                                            <>
                                                <td><span className="admin-db-id">#{row.id}</span></td>
                                                <td><strong>{row.email}</strong></td>
                                                <td><code>{row.otp}</code></td>
                                                <td>
                                                    <span className={`admin-db-verify-pill ${row.verified ? "verified" : "pending"}`}>
                                                        <GraduationCap size={13} /> {row.verified ? "Verified Student" : "Pending OTP"}
                                                    </span>
                                                </td>
                                                <td><small>{row.verified_at ? new Date(row.verified_at).toLocaleDateString() : "—"}</small></td>
                                                <td>
                                                    <button className="admin-db-inspect-btn" onClick={() => setSelectedRecord(row)}>
                                                        <Eye size={13} /> View
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Record Inspector Modal */}
            {selectedRecord && (
                <div className="admin-db-modal-overlay" onClick={() => setSelectedRecord(null)}>
                    <div className="admin-db-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-db-modal-header">
                            <div>
                                <span className="admin-db-modal-table">{activeMeta.tableName}</span>
                                <h3>Record #{selectedRecord.id || "Detail"}</h3>
                            </div>
                            <button className="admin-db-close-btn" onClick={() => setSelectedRecord(null)}>
                                <XCircle size={18} />
                            </button>
                        </div>

                        <div className="admin-db-modal-body">
                            <div className="admin-db-fields-grid">
                                {Object.entries(selectedRecord).map(([key, val]) => (
                                    <div key={key} className="admin-db-field-item">
                                        <span className="admin-db-field-key">{key}</span>
                                        <div className="admin-db-field-val">
                                            {typeof val === "object" ? (
                                                <pre className="admin-db-json-block">{JSON.stringify(val, null, 2)}</pre>
                                            ) : (
                                                <span>{String(val ?? "—")}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="admin-db-raw-json">
                                <div className="admin-db-raw-header">
                                    <span>Raw SQLite Record Payload</span>
                                    <button
                                        className="admin-db-copy-json"
                                        onClick={() => copyToClipboard(JSON.stringify(selectedRecord, null, 2), "Raw JSON")}
                                    >
                                        <Copy size={13} /> Copy JSON
                                    </button>
                                </div>
                                <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
