import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
    Bookmark,
    CheckCircle2,
    ImagePlus,
    MapPin,
    MessageCircle,
    Plus,
    Search,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

type Listing = {
    id: number;
    title: string;
    owner: string;
    city: string;
    locality: string;
    address: string;
    rent: number;
    bhk: number;
    occupancy: string;
    looking_for: string;
    furnishing: string;
    amenities: string[];
    highlights: string[];
    photo_count: number;
    trust: {
        score: number;
        signals: { name: string; status: string; explanation: string }[];
    };
    safety?: {
        geo_risk_score: number;
        campus?: { distance_km: number; commute: string };
    };
    is_favorite?: boolean;
};
type DiscoveryProps = {
    api: string;
    onNotify: (message: string) => void;
    currentUser?: string;
    onOpenChat?: (recipient: string, listingId: number, title?: string) => void;
};

const highlights = [
    "Attached washroom",
    "Market nearby",
    "Attached balcony",
    "Close to metro station",
    "Public transport nearby",
    "Gated society",
    "No restriction",
    "Newly built",
    "Separate washrooms",
    "House keeping",
    "Gym nearby",
    "Park nearby",
];
const amenities = [
    "TV",
    "Fridge",
    "Kitchen",
    "WiFi",
    "Washing Machine",
    "AC",
    "Power Backup",
    "Cook",
    "Parking",
];

export function Discovery({ api, onNotify, currentUser, onOpenChat }: DiscoveryProps) {
    const [mode, setMode] = useState<"room" | "roommate">("room");
    const [location, setLocation] = useState("Gurugram");
    const [minRent, setMinRent] = useState("");
    const [maxRent, setMaxRent] = useState("");
    const [occupancy, setOccupancy] = useState("");
    const [verified, setVerified] = useState(false);
    const [results, setResults] = useState<Listing[]>([]);
    const [selected, setSelected] = useState<Listing>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({
        city: "Gurugram",
        locality: "Sector 23",
        address: "",
        rent: "",
        occupancy: "single",
        looking_for: "Any",
        amenities: [] as string[],
        highlights: [] as string[],
        contact_visible: false,
        images: [] as { name: string; size: number; type: string }[],
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageError, setImageError] = useState("");

    const search = (event?: FormEvent) => {
        event?.preventDefault();
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ location });
        if (minRent) params.set("minRent", minRent);
        if (maxRent) params.set("maxRent", maxRent);
        if (occupancy) params.set("occupancy", occupancy);
        if (verified) params.set("verified", "true");
        fetch(`${api}/listings/?${params.toString()}`)
            .then((response) => {
                if (!response.ok) throw new Error("Search failed");
                return response.json();
            })
            .then((data) => setResults(data.results || []))
            .catch(() =>
                setError(
                    "Listings could not be loaded. Check that the API is running.",
                ),
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        search();
    }, []);

    const toggleFormValue = (field: "amenities" | "highlights", value: string) =>
        setForm((current) => ({
            ...current,
            [field]: current[field].includes(value)
                ? current[field].filter((item) => item !== value)
                : [...current[field], value],
        }));
    const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 3) return setImageError("Choose up to 3 images.");
        const invalid = files.find(
            (file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024,
        );
        if (invalid)
            return setImageError(
                "Each image must be an image file smaller than 10 MB.",
            );
        setImageError("");
        setForm((current) => ({
            ...current,
            images: files.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
            })),
        }));
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    };
    const createListing = (event: FormEvent) => {
        event.preventDefault();
        if (!form.rent || Number(form.rent) <= 0)
            return onNotify("Enter a valid positive rent amount.");
        fetch(`${api}/listings/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                rent: Number(form.rent),
                title: `${form.occupancy === "single" ? "Private" : "Shared"} room near ${form.locality}`,
            }),
        })
            .then((response) =>
                response.json().then((data) => ({ ok: response.ok, data })),
            )
            .then(({ ok, data }) => {
                if (!ok) return onNotify(data.error || "Listing could not be created.");
                setShowCreate(false);
                setSelected(data);
                onNotify("Room posted and trust checks generated.");
                search();
            })
            .catch(() => onNotify("Could not reach the listing API."));
    };

    const favorite = (listing: Listing) => {
        fetch(`${api}/listings/${listing.id}/favorite/`, {
            method: listing.is_favorite ? "DELETE" : "POST",
        }).then(() => {
            setResults((current) =>
                current.map((item) =>
                    item.id === listing.id
                        ? { ...item, is_favorite: !listing.is_favorite }
                        : item,
                ),
            );
            onNotify(listing.is_favorite ? "Removed from saved." : "Saved listing.");
        });
    };

    const connect = (listing: Listing) => {
        const baseApi = api.replace(/\/api\/?$/, "") + "/api";
        fetch(`${baseApi}/listings/${listing.id}/connect/`, { method: "POST" })
            .then(() => {
                const user = currentUser || "demo@roomsync.test";
                const owner = listing.owner || "Listing Owner";
                fetch(`${baseApi}/chat/conversations/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        participant_1: user,
                        participant_2: owner,
                        listing_id: listing.id,
                    }),
                }).catch(() => { });
                onNotify(`Connected with ${owner}!`);
                if (onOpenChat) {
                    onOpenChat(owner, listing.id, listing.title);
                }
                setSelected(undefined);
            })
            .catch(() => onNotify("Connect request failed."));
    };

    return (
        <section id="discovery" className="discovery-section">
            <div className="discovery-head">
                <div>
                    <p className="eyebrow mint-text">DISCOVER YOUR NEXT HOME</p>
                    <h2>
                        Let’s find your perfect <em>FlatMate.</em>
                    </h2>
                    <p>
                        Search available listings, understand the trust signals, and connect
                        when it feels right.
                    </p>
                </div>
                <button className="primary" onClick={() => setShowCreate(true)}>
                    <Plus size={16} />
                    Post your requirement
                </button>
            </div>
            <div className="discovery-grid">
                <div>
                    <form className="discovery-search" onSubmit={search}>
                        <div className="location-input">
                            <MapPin size={17} />
                            <input
                                value={location}
                                onChange={(event) => setLocation(event.target.value)}
                                placeholder="Search city or locality"
                            />
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={minRent}
                            onChange={(event) => setMinRent(event.target.value)}
                            placeholder="Min rent"
                        />
                        <input
                            type="number"
                            min="0"
                            value={maxRent}
                            onChange={(event) => setMaxRent(event.target.value)}
                            placeholder="Max rent"
                        />
                        <select
                            value={occupancy}
                            onChange={(event) => setOccupancy(event.target.value)}
                        >
                            <option value="">Any occupancy</option>
                            <option value="single">Single</option>
                            <option value="shared">Shared</option>
                        </select>
                        <label className="verified-filter">
                            <input
                                type="checkbox"
                                checked={verified}
                                onChange={(event) => setVerified(event.target.checked)}
                            />{" "}
                            Verified only
                        </label>
                        <button className="search-submit" type="submit">
                            <Search size={16} />
                            Search
                        </button>
                    </form>
                    <div className="intent-tabs">
                        <button
                            className={mode === "room" ? "active" : ""}
                            onClick={() => setMode("room")}
                        >
                            Need a room
                        </button>
                        <button
                            className={mode === "roommate" ? "active" : ""}
                            onClick={() => setMode("roommate")}
                        >
                            Need a roommate
                        </button>
                    </div>
                    <div className="results-heading">
                        <div>
                            <p className="eyebrow">
                                {mode === "room"
                                    ? "ROOMS NEAR YOU"
                                    : "PEOPLE OPEN TO A ROOMMATE"}
                            </p>
                            <h3>
                                {loading
                                    ? "Finding options..."
                                    : `${results.length} rooms near you`}
                            </h3>
                        </div>
                        <button className="text-button" onClick={() => setShowCreate(true)}>
                            Post yours <Plus size={15} />
                        </button>
                    </div>
                    {error && <div className="discovery-error">{error}</div>}
                    {!loading && !error && results.length === 0 && (
                        <div className="discovery-empty">
                            No listings match those filters. Try widening the rent range.
                        </div>
                    )}
                    <div className="listing-results">
                        {results.map((listing) => (
                            <article className="listing-card" key={listing.id}>
                                <div className="listing-art">
                                    <div>
                                        <ImagePlus size={22} />
                                        <span>{listing.photo_count} photos</span>
                                    </div>
                                    <button
                                        className="favorite-button"
                                        onClick={() => favorite(listing)}
                                        aria-label="Save listing"
                                    >
                                        <Bookmark
                                            size={17}
                                            fill={listing.is_favorite ? "currentColor" : "none"}
                                        />
                                    </button>
                                </div>
                                <div className="listing-card-body">
                                    <div className="listing-card-top">
                                        <div>
                                            <h3>{listing.title}</h3>
                                            <span>
                                                {listing.locality}, {listing.city}
                                            </span>
                                        </div>
                                        <strong>
                                            ₹{listing.rent.toLocaleString()}
                                            <small>/month</small>
                                        </strong>
                                    </div>
                                    <div className="listing-meta">
                                        <span>{listing.occupancy}</span>
                                        <span>{listing.bhk} BHK</span>
                                        <span>{listing.looking_for} preferred</span>
                                    </div>
                                    <div className="trust-line">
                                        <ShieldCheck size={14} />
                                        <strong>{listing.trust.score}/100</strong>
                                        <span>
                                            {listing.trust.signals[0]?.explanation ||
                                                "Trust explanation available"}
                                        </span>
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => setSelected(listing)}>
                                            View details
                                        </button>
                                        <button onClick={() => connect(listing)}>
                                            <MessageCircle size={14} />
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                <aside className="discovery-aside">
                    <div className="mini-panel">
                        <p className="eyebrow">QUICK PATH</p>
                        <h3>What are you looking for?</h3>
                        <button onClick={() => setMode("room")}>
                            <span className="quick-icon">
                                <Search size={16} />
                            </span>
                            <span>
                                <strong>A room to move into</strong>
                                <small>Browse verified places</small>
                            </span>
                        </button>
                        <button onClick={() => setMode("roommate")}>
                            <span className="quick-icon">
                                <UserRound size={16} />
                            </span>
                            <span>
                                <strong>A roommate to join</strong>
                                <small>Compare compatibility</small>
                            </span>
                        </button>
                        <button onClick={() => setShowCreate(true)}>
                            <span className="quick-icon">
                                <Plus size={16} />
                            </span>
                            <span>
                                <strong>Post your requirement</strong>
                                <small>Tell the right people</small>
                            </span>
                        </button>
                    </div>
                    <div className="mini-panel safety-tip">
                        <ShieldCheck size={18} />
                        <strong>Keep the first meet public.</strong>
                        <span>Verify the listing before making any payment.</span>
                    </div>
                </aside>
            </div>
            {showCreate && (
                <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
                    <section
                        className="create-listing-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setShowCreate(false)}
                            aria-label="Close listing form"
                        >
                            <X size={18} />
                        </button>
                        <p className="eyebrow">POST YOUR REQUIREMENT</p>
                        <h2>Add your room details</h2>
                        <p className="login-copy">
                            A few practical details help the right housemate find you.
                        </p>
                        <form onSubmit={createListing}>
                            <div className="form-two">
                                <label>
                                    City
                                    <input
                                        value={form.city}
                                        onChange={(event) =>
                                            setForm({ ...form, city: event.target.value })
                                        }
                                        required
                                    />
                                </label>
                                <label>
                                    Locality
                                    <input
                                        value={form.locality}
                                        onChange={(event) =>
                                            setForm({ ...form, locality: event.target.value })
                                        }
                                        required
                                    />
                                </label>
                            </div>
                            <label>
                                Address
                                <input
                                    value={form.address}
                                    onChange={(event) =>
                                        setForm({ ...form, address: event.target.value })
                                    }
                                    placeholder="Building and street"
                                />
                            </label>
                            <div className="form-two">
                                <label>
                                    Rent per person
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.rent}
                                        onChange={(event) =>
                                            setForm({ ...form, rent: event.target.value })
                                        }
                                        placeholder="₹ per month"
                                        required
                                    />
                                </label>
                                <label>
                                    Occupancy
                                    <select
                                        value={form.occupancy}
                                        onChange={(event) =>
                                            setForm({ ...form, occupancy: event.target.value })
                                        }
                                    >
                                        <option value="single">Single room</option>
                                        <option value="shared">Shared room</option>
                                    </select>
                                </label>
                            </div>
                            <label>
                                Looking for
                                <select
                                    value={form.looking_for}
                                    onChange={(event) =>
                                        setForm({ ...form, looking_for: event.target.value })
                                    }
                                >
                                    <option>Any</option>
                                    <option>Female</option>
                                    <option>Male</option>
                                </select>
                            </label>
                            <label className="image-upload-label">
                                Property images (up to 3)
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImages}
                                />
                                {imagePreviews.length > 0 && (
                                    <span className="image-previews">
                                        {imagePreviews.map((preview, index) => (
                                            <img
                                                src={preview}
                                                alt={`Property preview ${index + 1}`}
                                                key={preview}
                                            />
                                        ))}
                                    </span>
                                )}
                            </label>
                            {imageError && (
                                <div className="discovery-error">{imageError}</div>
                            )}
                            <fieldset>
                                <legend>Highlights</legend>
                                <div className="form-chips">
                                    {highlights.map((item) => (
                                        <button
                                            type="button"
                                            className={
                                                form.highlights.includes(item)
                                                    ? "form-chip selected"
                                                    : "form-chip"
                                            }
                                            onClick={() => toggleFormValue("highlights", item)}
                                            key={item}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>Amenities</legend>
                                <div className="form-chips">
                                    {amenities.map((item) => (
                                        <button
                                            type="button"
                                            className={
                                                form.amenities.includes(item)
                                                    ? "form-chip selected"
                                                    : "form-chip"
                                            }
                                            onClick={() => toggleFormValue("amenities", item)}
                                            key={item}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>
                            <label className="consent-toggle">
                                <input
                                    type="checkbox"
                                    checked={form.contact_visible}
                                    onChange={(event) =>
                                        setForm({ ...form, contact_visible: event.target.checked })
                                    }
                                />{" "}
                                Make my mobile number visible to interested users
                            </label>
                            <small>
                                Phone visibility is off by default. The API also rejects more
                                than 3 images.
                            </small>
                            <button className="primary login-submit" type="submit">
                                Post room <CheckCircle2 size={16} />
                            </button>
                        </form>
                    </section>
                </div>
            )}
            {selected && (
                <div className="modal-backdrop" onClick={() => setSelected(undefined)}>
                    <section
                        className="listing-detail-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setSelected(undefined)}
                            aria-label="Close listing details"
                        >
                            <X size={18} />
                        </button>
                        <div className="detail-hero">
                            <ImagePlus size={28} />
                            <span>Gallery placeholder · {selected.photo_count} image(s)</span>
                        </div>
                        <p className="eyebrow">VERIFIED LISTING</p>
                        <h2>{selected.title}</h2>
                        <p className="detail-location">
                            <MapPin size={15} />
                            {selected.address || `${selected.locality}, ${selected.city}`}
                        </p>
                        <strong className="detail-rent">
                            ₹{selected.rent.toLocaleString()} <small>/ month</small>
                        </strong>
                        <div className="detail-badges">
                            <span>
                                <ShieldCheck size={14} />
                                Trust {selected.trust.score}/100
                            </span>
                            <span>{selected.occupancy}</span>
                            <span>{selected.looking_for} preferred</span>
                        </div>
                        <div className="detail-columns">
                            <div>
                                <h3>Amenities</h3>
                                <div className="detail-chip-list">
                                    {selected.amenities.map((item) => (
                                        <span key={item}>{item}</span>
                                    ))}
                                </div>
                                <h3>Highlights</h3>
                                <div className="detail-chip-list">
                                    {selected.highlights.map((item) => (
                                        <span key={item}>{item}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="trust-breakdown">
                                <h3>Listing trust</h3>
                                {selected.trust.signals.map((signal) => (
                                    <div key={signal.name}>
                                        <strong>{signal.status.toUpperCase()}</strong>
                                        <span>{signal.name}</span>
                                        <small>{signal.explanation}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="detail-safety">
                            <ShieldCheck size={17} />
                            <span>
                                Area safety: {selected.safety?.geo_risk_score ?? "unavailable"}
                                /100 risk ·{" "}
                                {selected.safety?.campus?.commute ||
                                    "campus commute unavailable"}
                                . This is context, not a guarantee.
                            </span>
                        </div>
                        <button
                            className="primary login-submit"
                            onClick={() => connect(selected)}
                        >
                            <MessageCircle size={16} />
                            Connect about this room
                        </button>
                    </section>
                </div>
            )}
        </section>
    );
}
