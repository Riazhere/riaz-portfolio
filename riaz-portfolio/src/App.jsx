import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";

/* ============================================================
   CONTENT — edit everything here, the page reads from these
   ============================================================ */

const PROFILE = {
  name: "Riaz Ijaz",
  initials: "RI",
  tagline: "CS ’26",
  email: "riazijazuet@gmail.com",
  linkedin: "https://www.linkedin.com/in/riaz-ijaz-452225399/",
  githubUsername: "Riazhere",
  photo: "/Picture/photo.jpeg",
  resume: "", // e.g. "/Picture/Riaz-Ijaz-CV.pdf" — the Download CV buttons appear when this is set
  location: "Taxila, Pakistan",
  timeZone: "Asia/Karachi",
  timeZoneLabel: "PKT",
  updated: "October 2026",
};

const SPECS = [
  { label: "Degree", value: "BS Computer Science", note: "UET Taxila" },
  { label: "Result", count: { to: 3.66, decimals: 2 }, suffix: " / 4.00", note: "Cumulative GPA" },
  { label: "Availability", value: "Immediately", note: "Full time, on-site or remote" },
  { label: "Focus", value: "Applied ML", note: "and full-stack delivery" },
];

const STACK = [
  "Python", "PyTorch", "TensorFlow", "Keras", "scikit-learn", "CNNs", "LSTM", "Transformers",
  "React", "JavaScript", "Tailwind CSS", "PHP", "MySQL", "Git", "Digital Logic",
];

const PROJECTS = [
  {
    id: "derm",
    category: "Machine Learning",
    title: "Dermatological image classifier",
    meta: "Final year project · 2026",
    body: "A computer vision pipeline that classifies skin conditions from clinical photographs. The work covered dataset curation, augmentation, transfer learning on convolutional backbones, and an evaluation protocol reporting per-class recall.",
    chips: ["Python", "PyTorch", "Transfer learning"],
    result: "Best final year project",
  },
  {
    id: "engine",
    category: "Machine Learning",
    title: "Diesel engine pressure prediction",
    meta: "Research model · 2025",
    body: "LSTM models that reconstruct in-cylinder pressure across a full engine cycle using crankshaft angle as the only input. The model learned the shape of the combustion curve itself via sequence framing.",
    chips: ["TensorFlow", "LSTM", "NumPy"],
    result: "R² > 0.997",
  },
  {
    id: "shop",
    category: "Full Stack",
    title: "E-commerce platform",
    meta: "Full stack · 2024",
    body: "A shopping site built end to end: account registration with hashed credentials, persistent cart, and order placement. Designed the database schema first so price changes never rewrote order history.",
    chips: ["PHP", "MySQL", "JavaScript"],
    result: "Full order lifecycle",
  },
  {
    id: "lock",
    category: "Hardware",
    title: "Three-digit digital security lock",
    meta: "Hardware logic · 2024",
    body: "A combination lock built from discrete logic — 7486 XOR gates to compare each entered digit, 7404 inverters, and a 7408 AND stage. No microcontroller; the correctness argument is the truth table.",
    chips: ["Digital logic", "7408 / 7486"],
    result: "Built and demonstrated",
  },
];
const CATEGORIES = ["All", "Machine Learning", "Full Stack", "Hardware"];

// most recent first
const TIMELINE = [
  { when: "Jul 2026", title: "NESTGEN E-Learning Festival", org: "Nestlé Asia, Oceania & Africa", body: "Completed multiple masterclasses covering Computer Engineering and Technology, Purpose-Driven & Sustainability Marketing, and brand cultural relevance." },
  { when: "2022 — 2026", title: "BS Computer Science", org: "University of Engineering and Technology, Taxila", body: "Coursework across algorithms, databases, operating systems, digital logic design and machine learning. Carried a 3.66 cumulative GPA through to the final semester." },
  { when: "Dec 2025", title: "Supervised Machine Learning", org: "Stanford Online & DeepLearning.AI", body: "Completed the full course, covering regression, gradient descent, and practical diagnostics." },
  { when: "Jun — Aug 2025", title: "Front-end developer, internship", org: "HAASHES — IT department", body: "Built and shipped responsive interfaces in HTML, CSS and JavaScript alongside the internal team." },
];

const DOCUMENTS = [
  { src: "/Picture/Transcript.jpeg", group: "Academic", title: "Academic transcript", tag: "UET Taxila", caption: "Official academic transcript" },
  { src: "/Picture/Proviisional Certificate.jpeg", group: "Academic", title: "Provisional certificate", tag: "Degree", caption: "Provisional degree certificate" },
  { src: "/Picture/FYP Certificate.jpeg", group: "Academic", title: "Best final year project", tag: "2026", caption: "Best final year project award" },
  { src: "/Picture/Supervised Learning.jpeg", group: "Certifications", title: "Machine learning", tag: "Stanford", caption: "Supervised Machine Learning" },
  { src: "/Picture/Haashes.jpeg", group: "Experience", title: "Experience letter", tag: "HAASHES", caption: "Internship experience letter" },
  { src: "/Picture/DLD DESIGN.png", group: "Projects", title: "Lock circuit design", tag: "Hardware", caption: "Digital security lock" },
  { src: "/Picture/certificate_23962371785322889 (1).pdf", group: "Certifications", title: "Engineering Masterclass", tag: "NESTGEN", caption: "NESTGEN Manufacturing & Engineering" },
  { src: "/Picture/certificate_23926871785322887 (2).pdf", group: "Certifications", title: "Marketing Masterclass", tag: "NESTGEN", caption: "NESTGEN Digital & Marketing" },
  { src: "/Picture/certificate_23697821785318872 (1).pdf", group: "Certifications", title: "Brand Masterclass", tag: "NESTGEN", caption: "NESTGEN Building a power brand" },
];
const DOC_GROUPS = ["All", "Academic", "Certifications", "Experience", "Projects"];

const SKILLS = [
  { group: "Machine learning", items: ["Python, NumPy, pandas", "PyTorch, TensorFlow, Keras", "CNNs and transfer learning", "LSTM and sequence models", "T5 transformers", "scikit-learn"] },
  { group: "Web and product", items: ["React, JavaScript, HTML, CSS", "Tailwind and responsive layout", "PHP and MySQL", "REST APIs and auth flows", "Git and code review"] },
  { group: "Foundations", items: ["Data structures and algorithms", "Database design and SQL", "Digital logic design", "Operating systems", "Technical writing"] },
];

const NAV = [
  ["work", "Work"],
  ["github", "GitHub"],
  ["path", "Path"],
  ["credentials", "Credentials"],
  ["skills", "Skills"],
  ["contact", "Contact"],
];
const SECTION_IDS = ["top", ...NAV.map(([id]) => id)];

const HEADLINE = ["I", "build", "machine*", "learning*", "systems", "and", "the", "software", "that", "carries", "them."];

/* ============================================================
   HELPERS
   ============================================================ */

const GH_URL = `https://github.com/${PROFILE.githubUsername}`;
const encode = (p) => encodeURI(p);
const isPdf = (s) => s.toLowerCase().endsWith(".pdf");
const pad = (n) => String(n).padStart(2, "0");
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const LANG_COLORS = {
  Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B", PHP: "#8892bf", "C++": "#f34b7d", C: "#7a7a7a", Java: "#b07219",
  Shell: "#89e051", Verilog: "#b2b7f8", SCSS: "#c6538c",
};
const langColor = (l) => LANG_COLORS[l] || "#8b9bb0";

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} month${m > 1 ? "s" : ""} ago`;
  const y = Math.floor(m / 12);
  return `${y} year${y > 1 ? "s" : ""} ago`;
}

/* ---------- live GitHub data, fetched once and shared ---------- */
let ghPromise = null;
function loadGithub(user) {
  if (!ghPromise) {
    const get = (url) =>
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`);
        return r.json();
      });
    ghPromise = Promise.all([
      get(`https://api.github.com/users/${user}`),
      get(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
    ]).then(([profile, repos]) => ({ profile, repos }));
  }
  return ghPromise;
}

function useGithub() {
  const [state, setState] = useState({ status: "loading", data: null });
  useEffect(() => {
    let live = true;
    loadGithub(PROFILE.githubUsername)
      .then((data) => live && setState({ status: "ready", data }))
      .catch(() => {
        ghPromise = null;
        live && setState({ status: "error", data: null });
      });
    return () => {
      live = false;
    };
  }, []);
  return state;
}

function useActiveSection(ids) {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* ============================================================
   ICONS
   ============================================================ */

const Icon = ({ size = 18, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);
const I = {
  sun: <Icon><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></Icon>,
  moon: <Icon><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>,
  search: <Icon><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>,
  menu: <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>,
  close: <Icon><path d="M18 6 6 18M6 6l12 12" /></Icon>,
  arrow: <Icon size={17}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>,
  left: <Icon><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>,
  right: <Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon>,
  external: <Icon size={16}><path d="M7 17 17 7M8 7h9v9" /></Icon>,
  star: <Icon size={13}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>,
  copy: <Icon size={16}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>,
  check: <Icon size={16}><path d="M20 6 9 17l-5-5" /></Icon>,
  chat: <Icon size={22}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>,
  send: <Icon size={17}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></Icon>,
  pdf: <Icon size={34}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></Icon>,
  github: <Icon size={16}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></Icon>,
};

/* ============================================================
   SMALL INTERACTIVE PIECES
   ============================================================ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

function Counter({ to, decimals = 0, duration = 1.5 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const c = animate(0, to, { duration, ease: [0.2, 0.7, 0.3, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, duration, reduce]);
  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

function Magnetic({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const reduce = useReducedMotion();
  const move = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span ref={ref} style={{ x: sx, y: sy, display: "inline-block" }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.span>
  );
}

function TiltCard({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-6deg", "6deg"]);
  const reduce = useReducedMotion();

  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div className="tilt-card" onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
      <div style={{ transform: "translateZ(16px)", height: "100%" }}>{children}</div>
    </motion.div>
  );
}

function FilterBar({ options, value, onChange, counts, pill }) {
  return (
    <div className="filter-group" role="tablist">
      {options.map((opt) => (
        <button key={opt} role="tab" aria-selected={value === opt} className={`filter-btn${value === opt ? " active" : ""}`} onClick={() => onChange(opt)}>
          {value === opt && <motion.span layoutId={pill} className="filter-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
          <span className="filter-label">{opt}</span>
          <span className="filter-count">{counts[opt]}</span>
        </button>
      ))}
    </div>
  );
}

function Head({ kicker, title, children }) {
  return (
    <motion.div className="head" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}>
      <div>
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {children && <div className="head-side">{children}</div>}
    </motion.div>
  );
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const t = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: PROFILE.timeZone }).format(now);
  return (
    <span className="clock">
      <span className="dot" /> {t} {PROFILE.timeZoneLabel} · local time
    </span>
  );
}

/* ============================================================
   HERO PIECES
   ============================================================ */

function Word({ text, i }) {
  const hl = text.endsWith("*");
  const word = hl ? text.slice(0, -1) : text;
  return (
    <span className="h1-word" aria-hidden="true">
      <motion.span className={hl ? "hl" : undefined} style={{ display: "inline-block" }} initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 0.75, delay: 0.12 + i * 0.055, ease: [0.2, 0.7, 0.3, 1] }}>
        {word}
      </motion.span>
    </span>
  );
}

function Portrait({ src, alt }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="plate-frame">
      {failed ? <div className="plate-fallback">Portrait loads from<br />{src}</div> : <img src={src} alt={alt} onError={() => setFailed(true)} />}
      <div className="plate-chip c1"><b>3.66</b><span>CGPA · UET Taxila</span></div>
      <div className="plate-chip c2"><b>Best FYP</b><span>2026 cohort</span></div>
      <span className="plate-tag">{PROFILE.location}</span>
    </div>
  );
}

function GithubPill() {
  const { status, data } = useGithub();
  if (status !== "ready" || !data.repos.length) return null;
  const n = data.profile.public_repos ?? data.repos.length;
  return (
    <motion.a href={GH_URL} target="_blank" rel="noreferrer" className="gh-pill" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <span className="pulse-dot" /> Live on GitHub · {n} public {n === 1 ? "repository" : "repositories"} {I.external}
    </motion.a>
  );
}

/* ============================================================
   GITHUB SECTION
   ============================================================ */

function GithubSection() {
  const { status, data } = useGithub();

  const repos = useMemo(() => (data ? data.repos.filter((r) => !r.fork).sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)) : []), [data]);
  const stars = repos.reduce((n, r) => n + r.stargazers_count, 0);
  const langs = useMemo(() => {
    const m = {};
    repos.forEach((r) => r.language && (m[r.language] = (m[r.language] || 0) + 1));
    const total = Object.values(m).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, n]) => ({ name, pct: (n / total) * 100 }));
  }, [repos]);

  return (
    <section id="github" className="band band-sunk">
      <div className="wrap">
        <Head kicker="02 / Open code" title="Live from GitHub">
          <p>Pulled from GitHub’s public API each time the page loads — recent work, not a curated highlight reel.</p>
        </Head>

        {status === "loading" && (
          <div className="gh-grid">
            <div className="skeleton" style={{ height: 360 }} />
            <div className="repos">{[0, 1, 2, 3].map((k) => <div className="skeleton" key={k} />)}</div>
          </div>
        )}

        {(status === "error" || (status === "ready" && !repos.length)) && (
          <div className="gh-empty">
            <p>{status === "error" ? "GitHub’s API didn’t respond just now (it rate-limits anonymous visitors)." : "No public repositories to show yet."} The profile is one click away.</p>
            <a className="btn btn-line" href={GH_URL} target="_blank" rel="noreferrer">{I.github} github.com/{PROFILE.githubUsername}</a>
          </div>
        )}

        {status === "ready" && repos.length > 0 && (
          <div className="gh-grid">
            <motion.aside className="gh-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="gh-who">
                <img className="gh-avatar" src={data.profile.avatar_url} alt="" loading="lazy" />
                <div>
                  <b>{data.profile.name || data.profile.login}</b>
                  <span>@{data.profile.login}</span>
                </div>
              </div>
              {data.profile.bio && <p className="gh-bio">{data.profile.bio}</p>}
              <dl className="gh-stats">
                <div><dt>Repos</dt><dd>{data.profile.public_repos}</dd></div>
                <div><dt>Followers</dt><dd>{data.profile.followers}</dd></div>
                <div><dt>Following</dt><dd>{data.profile.following}</dd></div>
                <div><dt>Stars</dt><dd>{stars}</dd></div>
              </dl>
              <a className="btn btn-line" href={GH_URL} target="_blank" rel="noreferrer" style={{ width: "100%", justifyContent: "center" }}>{I.github} View profile</a>
            </motion.aside>

            <div>
              <div className="repos">
                {repos.slice(0, 5).map((r, i) => (
                  <motion.a key={r.id} className="repo" href={r.html_url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                    <div className="repo-top"><b>{r.name}</b>{I.external}</div>
                    <p>{r.description || "No description yet."}</p>
                    <div className="repo-meta">
                      {r.language && <span><i className="lang-dot" style={{ background: langColor(r.language) }} />{r.language}</span>}
                      <span>{I.star} {r.stargazers_count}</span>
                      <span>Updated {timeAgo(r.pushed_at)}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
              {langs.length > 0 && (
                <div className="langs">
                  <span className="langs-title">Languages across public repos</span>
                  <div className="langbar">{langs.map((l) => <span key={l.name} title={l.name} style={{ width: `${l.pct}%`, background: langColor(l.name) }} />)}</div>
                  <ul className="langlist">{langs.map((l) => <li key={l.name}><i className="lang-dot" style={{ background: langColor(l.name) }} />{l.name} {Math.round(l.pct)}%</li>)}</ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CREDENTIALS
   ============================================================ */

function Specimen({ doc, onOpen }) {
  const [failed, setFailed] = useState(false);
  const pdf = isPdf(doc.src);
  return (
    <motion.button layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.3 }} className="specimen" onClick={() => onOpen(doc)} aria-label={`Open ${doc.title}`}>
      <span className="specimen-img">
        {pdf ? (
          <span className="pdf-face">{I.pdf}<b>PDF</b><span>{doc.tag}</span></span>
        ) : failed ? (
          <span className="specimen-miss">Document image<br /><strong>{doc.src}</strong><br />not found in the public folder.</span>
        ) : (
          <img src={encode(doc.src)} alt={doc.title} loading="lazy" onError={() => setFailed(true)} />
        )}
      </span>
      <span className="specimen-cap"><b>{doc.title}</b><span>{doc.tag}</span></span>
    </motion.button>
  );
}

function Viewer({ doc, docs, onClose, onNavigate }) {
  const idx = docs.findIndex((d) => d.src === doc.src);
  const pdf = isPdf(doc.src);
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNavigate(1);
      else if (e.key === "ArrowLeft") onNavigate(-1);
      else if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll("button, a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [onClose, onNavigate]);

  return (
    <motion.div className="lb" role="dialog" aria-modal="true" aria-label={`Document viewer: ${doc.title}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
      <motion.div ref={panelRef} className="lb-panel" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} transition={{ type: "spring", damping: 30, stiffness: 320 }} onClick={(e) => e.stopPropagation()}>
        <header className="lb-bar">
          <div className="lb-title"><b>{doc.title}</b><span>{doc.caption}</span></div>
          <div className="lb-tools">
            <span className="lb-count">{idx + 1} / {docs.length}</span>
            <a className="icon-btn" href={encode(doc.src)} target="_blank" rel="noreferrer" aria-label="Open in a new tab">{I.external}</a>
            <button className="icon-btn" ref={closeRef} onClick={onClose} aria-label="Close viewer">{I.close}</button>
          </div>
        </header>
        <div className="lb-stage">
          <button className="lb-nav prev" onClick={() => onNavigate(-1)} aria-label="Previous document">{I.left}</button>
          <motion.div key={doc.src} className="lb-doc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {pdf ? (
              <object data={encode(doc.src)} type="application/pdf">
                <div className="lb-fallback"><p>This browser can’t preview PDFs inline.</p><a className="btn btn-solid" href={encode(doc.src)} target="_blank" rel="noreferrer">Open PDF</a></div>
              </object>
            ) : (
              <img src={encode(doc.src)} alt={doc.caption} />
            )}
          </motion.div>
          <button className="lb-nav next" onClick={() => onNavigate(1)} aria-label="Next document">{I.right}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   COMMAND PALETTE  (Ctrl/⌘ + K)
   ============================================================ */

function Palette({ items, onClose }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const activeRef = useRef(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((it) => `${it.label} ${it.group} ${it.keywords || ""}`.toLowerCase().includes(s)) : items;
  }, [q, items]);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => { activeRef.current?.scrollIntoView({ block: "nearest" }); }, [active]);

  const choose = (it) => {
    onClose();
    setTimeout(() => it.run(), 60);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); choose(results[active]); }
    else if (e.key === "Escape") onClose();
  };

  let lastGroup = null;
  return (
    <motion.div className="palette-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose}>
      <motion.div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" initial={{ opacity: 0, y: -14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: 0.98 }} transition={{ type: "spring", damping: 30, stiffness: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="palette-input">
          {I.search}
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Jump to a section, open a document, copy my email…" aria-label="Search commands" />
          <span className="kbd">esc</span>
        </div>
        <div className="palette-list">
          {results.length === 0 && <div className="palette-empty">Nothing matches “{q}”.</div>}
          {results.map((it, i) => {
            const header = it.group !== lastGroup ? <div className="palette-group" key={`g-${it.group}`}>{it.group}</div> : null;
            lastGroup = it.group;
            return (
              <div key={it.id}>
                {header}
                <button ref={i === active ? activeRef : null} className={`palette-item${i === active ? " active" : ""}`} onMouseEnter={() => setActive(i)} onClick={() => choose(it)}>
                  <span>{it.label}</span>
                  {it.hint && <span className="hint">{it.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>
        <div className="palette-foot"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   ASSISTANT — answers from the same data the page renders
   ============================================================ */

const KB = [
  { keys: ["tell me about yourself", "who are you", "bio", "introduction", "intro", "background", "summary"],
    reply: () => ({ text: "I'm Riaz Ijaz, an applied machine learning and full-stack software engineer based in Taxila, Pakistan. I hold a BS in Computer Science from UET Taxila with a 3.66 CGPA. My work spans deep learning computer vision (like my award-winning skin disease classifier), time-series LSTM models, and full-stack web platforms." }) },
  { keys: ["skill", "stack", "tech", "tool", "language", "python", "react", "pytorch", "tensorflow", "framework", "machine learning", "web"],
    reply: () => ({ text: SKILLS.map((s) => `${s.group}: ${s.items.slice(0, 4).join(", ")}`).join("\n"), link: { label: "See all skills", href: "#skills" } }) },
  { keys: ["avail", "hire", "hiring", "job", "role", "open to", "recruit", "join", "start", "remote", "relocat", "notice"],
    reply: () => ({ text: `Yes — Riaz graduated in July 2026 and is available immediately for roles in ML engineering, data or full-stack development, on-site or remote. The quickest way to reach him is ${PROFILE.email}.`, link: { label: "Contact him", href: "#contact" } }) },
  { keys: ["project", "built", "portfolio", "work", "made"],
    reply: () => ({ text: PROJECTS.map((p) => `• ${p.title} — ${p.result}`).join("\n"), link: { label: "Browse the projects", href: "#work" } }) },
  { keys: ["final year", "fyp", "derm", "skin", "classif", "award", "best"],
    reply: () => ({ text: `${PROJECTS[0].title}: ${PROJECTS[0].body} It won ${PROJECTS[0].result.toLowerCase()}.`, link: { label: "View the award certificate", href: "#credentials" } }) },
  { keys: ["engine", "diesel", "lstm", "pressure", "r2", "r²", "time series"],
    reply: () => ({ text: `${PROJECTS[1].title}: ${PROJECTS[1].body} Result: ${PROJECTS[1].result}.`, link: { label: "See the project", href: "#work" } }) },
  { keys: ["e-commerce", "ecommerce", "shop", "php", "mysql", "store"],
    reply: () => ({ text: `${PROJECTS[2].title}: ${PROJECTS[2].body}`, link: { label: "See the project", href: "#work" } }) },
  { keys: ["lock", "hardware", "logic", "gate", "circuit", "dld"],
    reply: () => ({ text: `${PROJECTS[3].title}: ${PROJECTS[3].body}`, link: { label: "See the circuit design", href: "#credentials" } }) },
  { keys: ["educat", "degree", "gpa", "cgpa", "grade", "university", "uet", "study", "studied", "graduat", "transcript"],
    reply: () => ({ text: "BS Computer Science at the University of Engineering and Technology, Taxila (2022–2026), with a 3.66 / 4.00 cumulative GPA. The transcript and provisional certificate are on the page.", link: { label: "Open the documents", href: "#credentials" } }) },
  { keys: ["certif", "nestgen", "stanford", "course", "masterclass", "deeplearning", "nestle", "nestlé"],
    reply: () => ({ text: "• Supervised Machine Learning — Stanford Online & DeepLearning.AI (Dec 2025)\n• Three NESTGEN masterclasses — Nestlé (Jul 2026): engineering, digital & marketing, and building a power brand.", link: { label: "Read the certificates", href: "#credentials" } }) },
  { keys: ["experience", "intern", "haashes", "front-end", "frontend"],
    reply: () => ({ text: `${TIMELINE[3].title} at HAASHES (Jun–Aug 2025): ${TIMELINE[3].body} The experience letter is available to read.`, link: { label: "See the timeline", href: "#path" } }) },
  { keys: ["github", "repo", "open source", "code"],
    reply: (gh) => ({ text: gh ? `His public GitHub (@${gh.profile.login}) lists ${gh.profile.public_repos} repositories and ${gh.profile.followers} followers.` : `His code lives at github.com/${PROFILE.githubUsername}.`, link: { label: "Live GitHub section", href: "#github" } }) },
  { keys: ["cv", "resume", "résumé"],
    reply: () => PROFILE.resume ? { text: "Here is his CV as a PDF.", link: { label: "Download CV", href: encode(PROFILE.resume) } } : { text: `A CV isn’t posted on the site yet, but Riaz will gladly send one — just email ${PROFILE.email}.`, link: { label: "Email him", href: `mailto:${PROFILE.email}` } } },
  { keys: ["where", "location", "based", "timezone", "time zone", "city", "country", "pakistan", "taxila"],
    reply: () => ({ text: `Riaz is based in ${PROFILE.location} (${PROFILE.timeZoneLabel}) and is open to on-site or remote work.` }) },
  { keys: ["contact", "email", "mail", "reach", "linkedin", "message", "talk"],
    reply: () => ({ text: `Email ${PROFILE.email} or message him on LinkedIn. He replies to every message.`, link: { label: "Open contact options", href: "#contact" } }) },
  { keys: ["fsc", "f.s.c", "intermediate", "pre-engineering", "pre engineering", "college", "12th"],
    reply: () => ({ text: "Riaz scored 760 out of 1100 in his FSc Pre-Engineering." }) },

  { keys: ["matric", "matriculation", "secondary", "school", "10th"],
    reply: () => ({ text: "Riaz scored an excellent 882 out of 1100 in his Matriculation exams." }) },

  { keys: ["marks", "score", "grades", "numbers", "academic record"],
    reply: () => ({ text: "Before his 3.66 university CGPA, Riaz scored 882 / 1100 in Matriculation and 760 / 1100 in FSc Pre-Engineering." }) },

  ];

function answer(q, gh) {
  const t = q.toLowerCase().trim();

  // Welcoming small talk & personality
  if (/^(hi|hello|hey|salam|assalam|greetings)/.test(t)) return { text: "Welcome! 👋 I'm Riaz's virtual assistant. I'm thrilled you're here. Ask me anything about his skills, projects, academic background, or how to get in touch!" };
  if (/^(how are you|hows it going|how are things|what's up|whats up|how do you do)/.test(t)) return { text: "I'm doing fantastic, thank you for asking! I'm here to guide you through Riaz's portfolio. What would you like to explore?" };
  if (/^(who are you|what are you|are you ai)/.test(t)) return { text: "I'm a custom digital assistant engineered by Riaz. I don't rely on a slow backend API—I'm a lightning-fast state machine designed to answer your questions instantly!" };
  if (/^(thanks|thank you|thx)/.test(t)) return { text: `You're very welcome! If you'd like to speak with Riaz directly, his inbox is always open at ${PROFILE.email}.` };

  let best = null;
  let score = 0;
  for (const item of KB) {
    const s = item.keys.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (s > score) { score = s; best = item; }
  }
  return best ? best.reply(gh) : null;
}

async function answerGeneral(question) {
  const response = await fetch("/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "General answers are temporarily unavailable.");
  }
  if (typeof result.answer !== "string" || !result.answer.trim()) {
    throw new Error("The answer service returned an empty response.");
  }

  return { text: result.answer.trim() };
}

const QUICK = ["Skills", "Availability", "Projects", "Education", "Certificates", "Contact"];

/* --- ADVANCED FEATURE: Matrix Rain Easter Egg --- */
function MatrixRain() {
  useEffect(() => {
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~".split("");
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#10b981"; // Emerald green
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.canvas
      id="matrix-canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 99999, pointerEvents: "none" }}
    />
  );
}

/* --- UPGRADED PORTFOLIO BOT (WITH JARVIS & STOP BUTTON) --- */
function PortfolioBot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [matrixHacked, setMatrixHacked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState([{
    id: 0, sender: "bot",
    text: "Welcome! 👋 I’m Riaz’s voice assistant. Type, speak, or listen to my replies!"
  }]);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);
  const speechRequestIdRef = useRef(0);
  const gh = useGithub();
  const idRef = useRef(1);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 250); }, [open]);

  const stopSpeaking = () => {
    speechRequestIdRef.current += 1;
    // Stop browser speech if active
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    // Stop ElevenLabs MP3 audio if active
    if (window.currentJarvisAudio) {
      const audio = window.currentJarvisAudio;
      audio.pause();
      audio.currentTime = 0;
      URL.revokeObjectURL(audio.src);
      window.currentJarvisAudio = null;
    }
  };

  // 100% CINEMATIC JARVIS VOICE (ELEVENLABS API)
  const speakText = async (text) => {
    if (!voiceEnabled) return;

    stopSpeaking();
    const requestId = speechRequestIdRef.current;

    const cleanText = text.replace(/[*_#\[\]()]/g, "").replace(/https?:\S+/g, "link");

    const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "fDeOZu1sNd7qahm2fV4k";
    const speakInBrowser = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(cleanText));
      }
    };

    if (!API_KEY) {
      speakInBrowser();
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEY
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`ElevenLabs request failed (${response.status}): ${details}`);
      }

      const blob = await response.blob();
      if (requestId !== speechRequestIdRef.current) return;

      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        if (window.currentJarvisAudio === audio) window.currentJarvisAudio = null;
        URL.revokeObjectURL(audioUrl);
      };

      // Store reference globally so the stop button (⏹️) can kill it mid-sentence
      window.currentJarvisAudio = audio;

      audio.play();
    } catch (err) {
      if (requestId !== speechRequestIdRef.current) return;
      console.error("Voice synthesis error:", err);
      speakInBrowser();
    }
  };

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition isn't supported in this browser. Try Chrome or Edge!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      let completeSentence = "";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        completeSentence = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        setInput(completeSentence);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => {
        setIsListening(false);
        if (completeSentence.trim() !== "") send(completeSentence);
      };
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const send = (text) => {
    const clean = text.trim();
    if (!clean) return;

    setMessages((m) => [...m, { id: idRef.current++, sender: "user", text: clean }]);
    setInput("");

    const cmd = clean.toLowerCase();
    if (cmd === "/clear") {
      setTimeout(() => setMessages([{ id: idRef.current++, sender: "bot", text: "Terminal wiped." }]), 300);
      return;
    }
    if (cmd === "/help") {
      setTimeout(() => setMessages((m) => [...m, { id: idRef.current++, sender: "bot", text: "Commands: '/clear', 'sudo hire riaz'" }]), 400);
      return;
    }
    if (cmd.includes("sudo hire riaz")) {
      setTyping(true);
      setTimeout(() => {
        setMatrixHacked(true);
        const reply = "ACCESS GRANTED. Initiating hire protocol...";
        setMessages((m) => [...m, { id: idRef.current++, sender: "bot", text: reply }]);
        speakText(reply);
        setTyping(false);
        setTimeout(() => setMatrixHacked(false), 8000);
      }, 1000);
      return;
    }

    setTyping(true);
    const t = setTimeout(async () => {
      let replyObj = {};
      if (cmd.includes("derm") || cmd.includes("final year") || cmd.includes("fyp")) {
        replyObj = {
          text: "His final year project is a CNN pipeline for classifying skin conditions. It won Best FYP of his cohort!",
          card: { title: "Dermatological Image Classifier", tag: "PyTorch & OpenCV", link: "#work" }
        };
      } else {
        replyObj = answer(clean, gh.status === "ready" ? gh.data : null);
        if (!replyObj) {
          try {
            replyObj = await answerGeneral(clean);
          } catch (err) {
            console.error("General-answer request failed:", err);
            replyObj = { text: "I can't answer general questions right now. Please try again in a moment." };
          }
        }
      }

      setMessages((m) => [...m, { id: idRef.current++, sender: "bot", ...replyObj }]);
      speakText(replyObj.text);
      setTyping(false);
    }, 600 + Math.random() * 400);
    timers.current.push(t);
  };

  return (
    <>
      <AnimatePresence>{matrixHacked && <MatrixRain/>}</AnimatePresence>
      <div className="bot-container">
        <AnimatePresence>
          {open && (
            <motion.div className="bot-window" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}>
              <div className="bot-header">
                <div className="bot-title">
                  <span className="pulse-dot" />
                  <span>RI Voice Assistant</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button className="icon-btn" style={{ width: 28, height: 28, fontSize: 11, padding: 0 }} onClick={stopSpeaking} title="Stop Speaking">
                    ⏹️
                  </button>
                  <button className="icon-btn" style={{ width: 28, height: 28, fontSize: 12, padding: 0 }} onClick={() => { stopSpeaking(); setVoiceEnabled(!voiceEnabled); }} title={voiceEnabled ? "Mute Speech" : "Enable Speech"}>
                    {voiceEnabled ? "🔊" : "🔇"}
                  </button>
                  <button className="bot-close" onClick={() => { stopSpeaking(); setOpen(false); }}>{I.close}</button>
                </div>
              </div>
              <div className="bot-messages" ref={listRef}>
                {messages.map((m) => (
                  <div key={m.id} className={`bot-bubble ${m.sender}`}>
                    {m.text}
                    {m.card && (
                      <div className="bot-rich-card">
                        <div className="brc-top"><b>{m.card.title}</b></div>
                        <span className="brc-tag">{m.card.tag}</span>
                        <a href={m.card.link} className="brc-link" onClick={() => { stopSpeaking(); setOpen(false); }}>View Project {I.arrow}</a>
                      </div>
                    )}
                    {m.link && <div><a className="bot-link" href={m.link.href} onClick={() => { stopSpeaking(); if (m.link.href.startsWith("#")) setOpen(false); }}>{m.link.label} {I.arrow}</a></div>}
                  </div>
                ))}
                {typing && <div className="bot-bubble bot typing"><i /><i /><i /></div>}
              </div>
              <div className="bot-options">
                {QUICK.map((q) => <button key={q} className="bot-chip" onClick={() => send(q)}>{q}</button>)}
              </div>

              <form className="bot-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Speak or type..." maxLength={140} />

                <button type="button" className={`mic-btn ${isListening ? "listening" : ""}`} onClick={handleListen} title="Voice Input">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </button>

                <button type="submit" className="send-btn">{I.send}</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <button className={`bot-fab${open ? " round" : ""}`} onClick={() => setOpen((o) => !o)}>
          {open ? I.close : <>{I.chat}<span className="bot-fab-label">Voice AI</span></>}
        </button>
      </div>
    </>
  );
}


/* ============================================================
   ADVANCED PRO FEATURES (Cursor & Terminal)
   ============================================================ */

function CustomCursor() {
  const [variant, setVariant] = useState("default");
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 800, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const handleMouseOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInteractive = ['a', 'button', 'input'].includes(tag) || e.target.closest('a, button, .tilt-card');
      const isText = ['p', 'h1', 'h2', 'h3', 'span', 'li'].includes(tag);
      if (isInteractive) setVariant("hover");
      else if (isText) setVariant("text");
      else setVariant("default");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: { width: 14, height: 14, backgroundColor: "var(--signal)", border: "2px solid transparent", borderRadius: "50%", opacity: 0.9 },
    hover: { width: 44, height: 44, backgroundColor: "transparent", border: "2px solid var(--signal-ink)", borderRadius: "50%", opacity: 1 },
    text: { width: 3, height: 24, backgroundColor: "var(--signal-ink)", border: "2px solid transparent", borderRadius: "4px", opacity: 0.7 }
  };

  return (
    <motion.div
      className="agency-cursor"
      variants={variants}
      animate={variant}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
}

function CodeTerminal() {
  const [code, setCode] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const fullCode = `import torch\nimport torch.nn as nn\nfrom torchvision import models\n\n# Initialize Skin Disease Classifier\nmodel = models.vit_b_16(weights='DEFAULT')\nmodel.heads = nn.Linear(768, 7)\n\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-4)\ncriterion = nn.CrossEntropyLoss()\n\ndef train_step(images, labels):\n    optimizer.zero_grad()\n    outputs = model(images)\n    loss = criterion(outputs, labels)\n    loss.backward()\n    optimizer.step()\n    return loss.item()`;

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullCode.length - 1) { setCode((prev) => prev + fullCode.charAt(i)); i++; }
      else clearInterval(timer);
    }, 15);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <div className="terminal-win" ref={ref}>
      <div className="term-header">
        <div className="mac-dots"><span className="red"/><span className="yellow"/><span className="green"/></div>
        <div className="term-title">train.py</div>
      </div>
      <div className="term-body"><pre><code>{code}</code></pre></div>
    </div>
  );
}
/* ============================================================
   APP
   ============================================================ */

export default function App() {
  const [viewing, setViewing] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [project, setProject] = useState("All");
  const [docGroup, setDocGroup] = useState("All");
  const toastTimer = useRef(null);
  const active = useActiveSection(SECTION_IDS);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch { /* storage unavailable */ }
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    document.title = `${PROFILE.name} — Applied ML & full-stack engineer`;
  }, []);

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const flash = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const copyEmail = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(PROFILE.email).then(() => flash("Email copied to clipboard")).catch(() => flash(PROFILE.email));
    } else flash(PROFILE.email);
  }, [flash]);

  /* global shortcuts */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* viewer navigation */
  const closeViewer = useCallback(() => setViewing(null), []);
  const stepViewer = useCallback((dir) => {
    setViewing((v) => {
      if (!v) return v;
      const i = DOCUMENTS.findIndex((d) => d.src === v.src);
      return DOCUMENTS[(i + dir + DOCUMENTS.length) % DOCUMENTS.length];
    });
  }, []);

  /* hero cursor glow, written straight to CSS vars so it never re-renders */
  const onHeroMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const projectCounts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c, c === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length])), []);
  const docCounts = useMemo(() => Object.fromEntries(DOC_GROUPS.map((g) => [g, g === "All" ? DOCUMENTS.length : DOCUMENTS.filter((d) => d.group === g).length])), []);
  const shownProjects = PROJECTS.filter((p) => project === "All" || p.category === project);
  const shownDocs = DOCUMENTS.filter((d) => docGroup === "All" || d.group === docGroup);

  const paletteItems = useMemo(() => {
    const items = [
      ...NAV.map(([id, label]) => ({ id: `nav-${id}`, group: "Navigate", label: `Go to ${label}`, hint: `#${id}`, run: () => go(id) })),
      { id: "act-theme", group: "Actions", label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme", keywords: "mode appearance", run: toggleTheme },
      { id: "act-copy", group: "Actions", label: "Copy email address", hint: PROFILE.email, keywords: "contact mail", run: copyEmail },
      { id: "act-mail", group: "Actions", label: "Write an email", keywords: "contact hire", run: () => { window.location.href = `mailto:${PROFILE.email}`; } },
      { id: "act-li", group: "Actions", label: "Open LinkedIn", run: () => window.open(PROFILE.linkedin, "_blank", "noopener") },
      { id: "act-gh", group: "Actions", label: "Open GitHub profile", hint: `@${PROFILE.githubUsername}`, run: () => window.open(GH_URL, "_blank", "noopener") },
    ];
    if (PROFILE.resume) items.push({ id: "act-cv", group: "Actions", label: "Download CV", run: () => window.open(encode(PROFILE.resume), "_blank", "noopener") });
    DOCUMENTS.forEach((d, i) => items.push({ id: `doc-${i}`, group: "Documents", label: `Open ${d.title}`, hint: d.tag, keywords: `${d.caption} certificate`, run: () => setViewing(d) }));
    return items;
  }, [theme, toggleTheme, copyEmail]);

  const enter = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.2, 0.7, 0.3, 1] },
  });

  return (
    <MotionConfig reducedMotion="user">
      <CustomCursor />
      <ScrollProgress />

      {/* NAV */}
      <nav className="nav" aria-label="Primary">
        <div className="wrap nav-in">
          <a className="mark" href="#top" onClick={() => setMenuOpen(false)}>
            <span className="mark-badge">{PROFILE.initials}</span>
            <span className="mark-name">{PROFILE.name} <span>· {PROFILE.tagline}</span></span>
          </a>
          <div className="nav-links">
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>{label}</a>)}
          </div>
          <div className="nav-tools">
            <button className="cmd-btn" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
              {I.search}<span className="cmd-label">Search</span><span className="kbd">{isMac ? "⌘K" : "Ctrl K"}</span>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -70, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 70, opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: "grid" }}>
                  {theme === "dark" ? I.sun : I.moon}
                </motion.span>
              </AnimatePresence>
            </button>
            <a className="nav-cta" href={`mailto:${PROFILE.email}`}>Get in touch</a>
            <button className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? I.close : I.menu}</button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
              <div className="mobile-links">
                {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* HERO */}
        <section id="top" className="hero" onMouseMove={onHeroMove}>
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap hero-in">
            <div>
              <motion.p className="status" {...enter(0.05)}><span className="dot" /> Graduated July 2026 · open to roles</motion.p>
              <h1 className="h1" aria-label="I build machine learning systems and the software that carries them.">
                {HEADLINE.map((w, i) => <Word key={i} text={w} i={i} />)}
              </h1>
              <motion.p className="lede" {...enter(0.7)}>
                Computer science graduate from UET Taxila with a 3.66 CGPA. My final year project — a dermatological image classifier — was named best project of its cohort.
              </motion.p>
              <GithubPill />
              <motion.div className="hero-actions" {...enter(0.8)}>
                <Magnetic><a className="btn btn-solid" href="#work">Explore projects {I.arrow}</a></Magnetic>
                <a className="btn btn-line" href="#credentials">Verify credentials</a>
                {PROFILE.resume && <a className="btn btn-ghost" href={encode(PROFILE.resume)} download>Download CV</a>}
              </motion.div>
            </div>
            <motion.div className="plate" {...enter(0.3)}>
              <Portrait src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} />
            </motion.div>
          </div>
        </section>

        {/* SPECS */}
        <div className="readout">
          <dl className="wrap readout-in">
            {SPECS.map((s) => (
              <div className="spec" key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  {s.count ? <><Counter {...s.count} />{s.suffix}</> : s.value}
                  <small>{s.note}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* MARQUEE */}
        <div className="marquee" aria-label="Technologies I work with">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <ul key={k} aria-hidden={k === 1}>
                {STACK.map((s) => <li key={s}>{s}</li>)}
              </ul>
            ))}
          </div>
        </div>

        {/* WORK */}
        <section id="work" className="band">
          <div className="wrap">
            <Head kicker="01 / Work" title="Selected work">
              <FilterBar options={CATEGORIES} value={project} onChange={setProject} counts={projectCounts} pill="work-pill" />
            </Head>
            <motion.div layout className="project-grid">
              <AnimatePresence mode="popLayout">
                {shownProjects.map((p) => (
                  <motion.article key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}>
                    <TiltCard>
                      <div className="project-inner">
                        <div className="project-top">
                          <span className="idx">{pad(PROJECTS.indexOf(p) + 1)}</span>
                          <span className="meta">{p.category} · {p.meta}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p className="project-body">{p.body}</p>
                        <div className="chips">{p.chips.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
                        <div className="result">
                          <span className="result-label">Outcome</span>
                          <b>{p.result}</b>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* GITHUB */}
        <GithubSection />

        {/* PATH */}
        <section id="path" className="band">
          <div className="wrap">
            <Head kicker="03 / Path" title="How I got here"><p>Most recent first.</p></Head>
            <ol className="track">
              {TIMELINE.map((t, i) => (
                <motion.li className="stop" key={t.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: i * 0.05 }}>
                  <span className="stop-no">{pad(i + 1)}</span>
                  <span className="stop-when">{t.when}</span>
                  <div className="stop-body">
                    <h3>{t.title}</h3>
                    <p className="stop-org">{t.org}</p>
                    <p className="stop-text">{t.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* CREDENTIALS */}
        <section id="credentials" className="band paper-band">
          <div className="wrap">
            <Head kicker="04 / Evidence" title="The paperwork">
              <FilterBar options={DOC_GROUPS} value={docGroup} onChange={setDocGroup} counts={docCounts} pill="doc-pill" />
            </Head>
            <motion.div layout className="specimens">
              <AnimatePresence mode="popLayout">
                {shownDocs.map((d) => <Specimen key={d.src} doc={d} onOpen={setViewing} />)}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="band">
          <div className="wrap">
            <Head kicker="05 / Toolkit" title="What I work in"><p>Grouped by how often I actually reach for them.</p></Head>
            <div className="skills-layout">
              <CodeTerminal />
              <div className="skills">
                {SKILLS.map((s, i) => (
                  <motion.div className="skill" key={s.group} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: i * 0.08 }}>
                    <h3>{s.group}</h3>
                    <ul>{s.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="band contact">
          <div className="wrap contact-in">
            <div>
              <span className="kicker">06 / Contact</span>
              <h2>Looking for a graduate engineer?</h2>
              <p className="contact-copy">I reply to every message. Tell me what your team is building and I’ll tell you honestly whether I’m the right fit for it.</p>
            </div>
            <div className="contact-links">
              <a className="clink" href={`mailto:${PROFILE.email}`}><span>{PROFILE.email}</span><span>Email</span></a>
              <button className="clink" onClick={copyEmail}><span>Copy email address</span><span>Copy</span></button>
              <a className="clink" href={PROFILE.linkedin} target="_blank" rel="noreferrer"><span>{PROFILE.name}</span><span>LinkedIn</span></a>
              <a className="clink" href={GH_URL} target="_blank" rel="noreferrer"><span>@{PROFILE.githubUsername}</span><span>GitHub</span></a>
              {PROFILE.resume && <a className="clink" href={encode(PROFILE.resume)} download><span>Curriculum vitae</span><span>PDF</span></a>}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap foot-in">
          <span>{PROFILE.name} — {PROFILE.location}</span>
          <div className="foot-meta">
            <LocalTime />
            <span className="mono" style={{ fontSize: 12.5 }}>Updated {PROFILE.updated}</span>
            <a className="to-top" href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>

      {/* OVERLAYS */}
      <AnimatePresence>
        {viewing && <Viewer key="viewer" doc={viewing} docs={DOCUMENTS} onClose={closeViewer} onNavigate={stepViewer} />}
      </AnimatePresence>
      <AnimatePresence>
        {paletteOpen && <Palette key="palette" items={paletteItems} onClose={() => setPaletteOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div key="toast" className="toast" role="status" initial={{ opacity: 0, y: 16, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 16, x: "-50%" }} transition={{ duration: 0.2 }}>
            {I.check} {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <PortfolioBot />
    </MotionConfig>
  );
}