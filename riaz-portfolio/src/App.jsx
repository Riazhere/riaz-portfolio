import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Edit your content here. The markup below reads from these.
   ============================================================ */

const PROFILE = {
  name: "Riaz Ijaz",
  initials: "RI",
  tagline: "CS ’26",
  email: "riazijazuet@gmail.com",
  linkedin: "https://www.linkedin.com/in/riaz-ijaz-452225399/",
  photo: "/Picture/photo.jpeg",
  location: "Taxila, Pakistan",
  updated: "September 2026",
};

const SPECS = [
  { label: "Degree", value: "BS Computer Science", note: "UET Taxila" },
  { label: "Result", value: "3.66 / 4.00", note: "Cumulative GPA" },
  { label: "Available", value: "July 2026", note: "Full time, on-site or remote" },
  { label: "Focus", value: "Applied ML", note: "and full-stack delivery" },
];

const PROJECTS = [
  {
    id: "derm",
    title: "Dermatological image classifier",
    meta: "Final year project · 2026",
    body: "A computer vision pipeline that classifies skin conditions from clinical photographs. The work covered dataset curation and balancing, augmentation for under-represented classes, transfer learning on convolutional backbones, and an evaluation protocol that reported per-class recall rather than a single flattering accuracy number — because in a medical setting a missed positive is the expensive error.",
    chips: ["Python", "PyTorch", "Transfer learning", "OpenCV"],
    result: "Best final year project",
    resultNote: "Awarded by the department, 2026 cohort",
    note: "Certificate reproduced in the credentials section below.",
  },
  {
    id: "engine",
    title: "Diesel engine pressure prediction",
    meta: "Research model · 2025",
    body: "Neural network and LSTM models that reconstruct in-cylinder pressure across a full engine cycle using crankshaft angle as the only input. The constraint was the interesting part: with one input variable the model has to learn the shape of the combustion curve itself, so the work went into sequence framing, normalisation of the pressure trace, and guarding against the model memorising a single operating condition.",
    chips: ["TensorFlow / Keras", "LSTM", "Time series", "NumPy"],
    result: "R² > 0.997",
    resultNote: "On held-out cycles",
  },
  {
    id: "shop",
    title: "E-commerce platform",
    meta: "Full stack · 2024",
    body: "A shopping site built end to end: account registration with hashed credentials and session handling, a persistent cart, order placement, and an admin view for stock. The database schema was designed first — products, variants, orders, line items — so that price changes never rewrote the history of an order already placed.",
    chips: ["PHP", "MySQL", "JavaScript", "Schema design"],
    result: "Full order lifecycle",
    resultNote: "Registration through checkout",
  },
  {
    id: "lock",
    title: "Three-digit digital security lock",
    meta: "Hardware logic · 2024",
    body: "A combination lock built from discrete logic — 7486 XOR gates to compare each entered digit against the stored code, 7404 inverters to produce an active-high match, and a 7408 AND stage to release only when all three digits agree. No microcontroller, no firmware; the correctness argument is the truth table.",
    chips: ["Digital logic design", "7408 / 7404 / 7486", "Breadboard"],
    result: "Built and demonstrated",
    resultNote: "Circuit diagram in credentials",
  },
];

const TIMELINE = [
  {
    when: "2022 — 2026",
    title: "BS Computer Science",
    org: "University of Engineering and Technology, Taxila",
    body: "Coursework across algorithms, databases, operating systems, digital logic design and machine learning. Carried a 3.66 cumulative GPA through to the final semester.",
  },
  {
    when: "Jul 2026",
    title: "NESTGEN E-Learning Festival Masterclasses",
    org: "Nestlé Asia, Oceania & Africa",
    body: "Completed multiple masterclasses covering Computer Engineering and Technology, Purpose-Driven & Sustainability Marketing, and brand cultural relevance.",
  },
  {
    when: "Jun — Aug 2025",
    title: "Front-end developer, internship",
    org: "HAASHES — IT department",
    body: "Built and shipped responsive interfaces in HTML, CSS and JavaScript alongside the internal team, working to a real review cycle and testing across browsers and screen sizes rather than only the one on my desk.",
  },
  {
    when: "Dec 2025",
    title: "Supervised Machine Learning: Regression and Classification",
    org: "Stanford Online & DeepLearning.AI",
    body: "Completed the full course, covering linear and logistic regression, gradient descent, regularisation and the practical diagnostics for under- and over-fitting that I now use on my own models.",
  },
  {
    when: "Jul 2026",
    title: "Graduating, and looking for the next team",
    org: "Open to roles in ML engineering, data or full-stack",
    body: "I want to join a team that ships to real users and reviews each other's code properly. Happy to start on whatever part of the stack needs hands.",
  },
];

const DOCUMENTS = [
  { src: "/Picture/Transcript.jpeg", title: "Academic transcript", tag: "UET Taxila", caption: "Official academic transcript — UET Taxila" },
  { src: "/Picture/Proviisional Certificate.jpeg", title: "Provisional certificate", tag: "Degree", caption: "Provisional degree certificate — UET Taxila" },
  { src: "/Picture/FYP Certificate.jpeg", title: "Best final year project", tag: "2026", caption: "Best final year project award" },
  { src: "/Picture/Supervised Learning.jpeg", title: "Machine learning", tag: "Stanford Online", caption: "Supervised Machine Learning — Stanford Online and DeepLearning.AI" },
  { src: "/Picture/Haashes.jpeg", title: "Experience letter", tag: "HAASHES", caption: "Internship experience letter — HAASHES" },
  { src: "/Picture/DLD DESIGN.png", title: "Lock circuit design", tag: "Digital logic", caption: "Digital security lock — logic gate circuit design" },
  { src: "/Picture/certificate_23962371785322889 (1).pdf", title: "Engineering Masterclass", tag: "NESTGEN 2026", caption: "NESTGEN Manufacturing & Engineering masterclass — Computer Engineering and Technology" },
  { src: "/Picture/certificate_23926871785322887 (2).pdf", title: "Marketing Masterclass", tag: "NESTGEN 2026", caption: "NESTGEN Digital & Marketing masterclass — Purpose-Driven & Sustainability Marketing" },
  { src: "/Picture/certificate_23697821785318872 (1).pdf", title: "Brand Masterclass", tag: "NESTGEN 2026", caption: "NESTGEN Digital & Marketing masterclass — Building a power brand through cultural relevance" },
];

const SKILLS = [
  {
    group: "Machine learning",
    items: ["Python, NumPy, pandas", "PyTorch, TensorFlow, Keras", "CNNs and transfer learning", "LSTM and sequence models", "T5 transformers", "scikit-learn, model evaluation"],
  },
  {
    group: "Web and product",
    items: ["React, JavaScript, HTML, CSS", "Tailwind and responsive layout", "PHP and MySQL", "REST APIs and auth flows", "Git and code review"],
  },
  {
    group: "Foundations",
    items: ["Data structures and algorithms", "Database design and SQL", "Digital logic design", "Operating systems", "Technical writing"],
  },
];

/* ============================================================
   Small pieces
   ============================================================ */

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function Portrait({ src, alt }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="plate-frame">
      {failed ? (
        <div className="plate-fallback">
          Portrait loads from
          <br />
          {src}
        </div>
      ) : (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
      <span className="plate-tag">{PROFILE.location}</span>
    </div>
  );
}

function Document({ doc, onOpen }) {
  const [failed, setFailed] = useState(false);
  
  // Quick check to see if it's a PDF. 
  // Standard <img> tags cannot render PDFs, so we render an embed or a fallback icon.
  const isPdf = doc.src.toLowerCase().endsWith(".pdf");

  return (
    <button className="specimen" onClick={() => onOpen(doc)}>
      <span className="specimen-img">
        {failed ? (
          <span className="specimen-miss">
            Document image
            <br />
            <strong>{doc.src}</strong>
            <br />
            not found in the public folder.
          </span>
        ) : isPdf ? (
          <iframe
            className="specimen-pdf"
            src={`${doc.src}#page=1&view=FitH`}
            title={`${doc.title} preview`}
          />
        ) : (
          <img src={doc.src} alt={doc.title} onError={() => setFailed(true)} />
        )}
      </span>
      <span className="specimen-cap">
        <b>{doc.title}</b>
        <span>{doc.tag}</span>
      </span>
    </button>
  );
}

function ProjectRow({ project, isOpen, onToggle }) {
  return (
    <article className="row">
      <button className="row-btn" aria-expanded={isOpen} aria-controls={`panel-${project.id}`} onClick={onToggle}>
        <span className="row-title">{project.title}</span>
        <span className="row-meta">{project.meta}</span>
        <span className="chev" aria-hidden="true">
          <PlusIcon />
        </span>
      </button>
      <div className={`row-panel${isOpen ? " open" : ""}`} id={`panel-${project.id}`}>
        <div>
          <div className="row-inner">
            <div>
              <p>{project.body}</p>
              <div className="chips">
                {project.chips.map((c) => (
                  <span className="chip" key={c}>{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="result">
                <b>{project.result}</b>
                <span>{project.resultNote}</span>
              </div>
              {project.note && <p className="row-note">{project.note}</p>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function App() {
  const [openProject, setOpenProject] = useState(PROJECTS[0].id);
  const [viewing, setViewing] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e) => e.key === "Escape" && setViewing(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewing]);

  const enter = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.2, 0.7, 0.3, 1] },
  });

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <a className="mark" href="#top">
            <span className="mark-badge">{PROFILE.initials}</span>
            <span className="mark-name">
              {PROFILE.name} <span>· {PROFILE.tagline}</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#path">Path</a>
            <a href="#credentials">Credentials</a>
            <a href="#skills">Skills</a>
          </div>
          <a className="nav-cta" href={`mailto:${PROFILE.email}`}>Get in touch</a>
        </div>
      </nav>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap hero-in">
            <div>
              <motion.p className="status" {...enter(0.05)}>
                <span className="dot" /> Open to graduate roles from July 2026
              </motion.p>
              <motion.h1 {...enter(0.14)}>
                I build machine learning systems and the software that carries them.
              </motion.h1>
              <motion.p className="lede" {...enter(0.24)}>
                Final-year computer science student at UET Taxila, graduating with a 3.66 CGPA. My final
                year project — a dermatological image classifier — was named best project of its cohort.
                Everything below is documented, and you can read the documents.
              </motion.p>
              <motion.div className="hero-actions" {...enter(0.34)}>
                <a className="btn btn-solid" href="#work">See the work</a>
                <a className="btn btn-line" href="#credentials">Verify credentials</a>
              </motion.div>
            </div>
            <motion.div className="plate" {...enter(0.2)}>
              <Portrait src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} />
            </motion.div>
          </div>
        </section>

        {/* SPEC READOUT */}
        <div className="readout">
          <dl className="wrap readout-in">
            {SPECS.map((s) => (
              <div className="spec" key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  {s.value}
                  <small>{s.note}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* WORK */}
        <section id="work" className="band">
          <div className="wrap">
            <div className="head">
              <h2>Selected work</h2>
              <p>Four projects, each picked for a different reason. Open one to read what it did and what it cost.</p>
            </div>
            <div className="rows">
              {PROJECTS.map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  isOpen={openProject === p.id}
                  onToggle={() => setOpenProject(openProject === p.id ? null : p.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* PATH */}
        <section id="path" className="band band-sunk">
          <div className="wrap">
            <div className="head">
              <h2>How I got here</h2>
              <p>Four years, in order.</p>
            </div>
            <ol className="track">
              {TIMELINE.map((t, i) => (
                <li className="stop" key={t.title}>
                  <span className="stop-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="stop-when">{t.when}</span>
                  <div className="stop-body">
                    <h3>{t.title}</h3>
                    <p className="stop-org">{t.org}</p>
                    <p>{t.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CREDENTIALS */}
        <section id="credentials" className="band paper-band">
          <div className="wrap">
            <div className="head">
              <h2>The paperwork</h2>
              <p>Every claim on this page has a document behind it. Select any one to read it full size.</p>
            </div>
            <div className="specimens">
              {DOCUMENTS.map((d) => (
                <Document key={d.src} doc={d} onOpen={setViewing} />
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="band">
          <div className="wrap">
            <div className="head">
              <h2>What I work in</h2>
              <p>Grouped by how often I actually reach for them.</p>
            </div>
            <div className="skills">
              {SKILLS.map((s) => (
                <div className="skill" key={s.group}>
                  <h3>{s.group}</h3>
                  <ul>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact band">
          <div className="wrap contact-in">
            <div>
              <h2>Looking for a graduate engineer?</h2>
              <p>
                I reply to every message. Tell me what your team is building and I'll tell you honestly
                whether I'm the right fit for it.
              </p>
            </div>
            <div className="contact-links">
              <a className="clink" href={`mailto:${PROFILE.email}`}>
                <span>{PROFILE.email}</span>
                <span>Email</span>
              </a>
              <a className="clink" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                <span>{PROFILE.name}</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap foot-in">
          <span>{PROFILE.name} — {PROFILE.location}</span>
          <span>Last updated {PROFILE.updated}</span>
        </div>
      </footer>

      {/* DOCUMENT VIEWER */}
      <AnimatePresence>
        {viewing && (
          <motion.div
            className="lb"
            role="dialog"
            aria-modal="true"
            aria-label="Document viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setViewing(null)}
          >
            <button className="lb-close" ref={closeRef} onClick={() => setViewing(null)}>
              Close
            </button>
            <motion.figure
              className="lb-fig"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              {viewing.src.toLowerCase().endsWith('.pdf') ? (
                <object data={viewing.src} type="application/pdf" width="100%" height="600px" style={{ background: "#fff", padding: "10px" }}>
                  <p>Unable to display PDF file. <a href={viewing.src}>Download instead.</a></p>
                </object>
              ) : (
                <img src={viewing.src} alt={viewing.caption} />
              )}
              <figcaption>{viewing.caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}