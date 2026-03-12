import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════
   COMPREHENSIVE PRINTING PRESS LIBRARY
   Sources: Heidelberg / Komori / Manroland / KBA / Mitsubishi official
   technical datasheets & industry benchmarks (2015–2024).
   Power figures = rated installed power (kW) at full production load.
   β₁ (thermal coeff) derived from format size, UV presence & motor count.
   β₁ range: 0.28–0.42 (cross-seasonal avg from Section 3.4: ~0.35).
═══════════════════════════════════════════════════════════════════════ */
const PRESS_LIBRARY = [
  // ── HEIDELBERG SPEEDMASTER ──────────────────────────────────────────
  {
    id: "HD-GTO52",
    brand: "Heidelberg",
    model: "GTO 52-4",
    format: "B3",
    colors: 4,
    kw: 11.5,
    beta1: 0.28,
    year: 2005,
    uvCapable: false,
    category: "small",
    tier: "legacy",
    accent: "#e11d48",
    tags: ["small-format", "commercial", "entry"],
  },
  {
    id: "HD-SM52",
    brand: "Heidelberg",
    model: "Speedmaster SM 52-5",
    format: "B3",
    colors: 5,
    kw: 18.5,
    beta1: 0.3,
    year: 2010,
    uvCapable: false,
    category: "small",
    tier: "mid",
    accent: "#e11d48",
    tags: ["small-format", "commercial", "packaging"],
  },
  {
    id: "HD-XL75",
    brand: "Heidelberg",
    model: "Speedmaster XL 75-6",
    format: "B2+",
    colors: 6,
    kw: 38.0,
    beta1: 0.34,
    year: 2016,
    uvCapable: true,
    category: "medium",
    tier: "premium",
    accent: "#e11d48",
    tags: ["medium-format", "packaging", "UV"],
  },
  {
    id: "HD-SM74",
    brand: "Heidelberg",
    model: "Speedmaster SM 74-4",
    format: "B2",
    colors: 4,
    kw: 29.5,
    beta1: 0.33,
    year: 2008,
    uvCapable: false,
    category: "medium",
    tier: "mid",
    accent: "#e11d48",
    tags: ["medium-format", "commercial", "books"],
  },
  {
    id: "HD-CD102",
    brand: "Heidelberg",
    model: "Speedmaster CD 102-6",
    format: "B1",
    colors: 6,
    kw: 52.0,
    beta1: 0.37,
    year: 2012,
    uvCapable: false,
    category: "large",
    tier: "premium",
    accent: "#e11d48",
    tags: ["large-format", "commercial", "packaging"],
  },
  {
    id: "HD-SM102",
    brand: "Heidelberg",
    model: "Speedmaster SM 102-4",
    format: "B1",
    colors: 4,
    kw: 43.5,
    beta1: 0.35,
    year: 2007,
    uvCapable: false,
    category: "large",
    tier: "mid",
    accent: "#e11d48",
    tags: ["large-format", "books", "commercial"],
  },
  {
    id: "HD-XL106",
    brand: "Heidelberg",
    model: "Speedmaster XL 106-8",
    format: "B1",
    colors: 8,
    kw: 74.0,
    beta1: 0.4,
    year: 2020,
    uvCapable: true,
    category: "large",
    tier: "flagship",
    accent: "#e11d48",
    tags: ["large-format", "packaging", "UV", "flagship"],
  },
  {
    id: "HD-XL106C",
    brand: "Heidelberg",
    model: "Speedmaster XL 106-4+L",
    format: "B1",
    colors: 4,
    kw: 61.5,
    beta1: 0.38,
    year: 2018,
    uvCapable: false,
    category: "large",
    tier: "premium",
    accent: "#e11d48",
    tags: ["large-format", "coating", "commercial"],
  },
  // ── KOMORI LITHRONE ─────────────────────────────────────────────────
  {
    id: "KM-S26",
    brand: "Komori",
    model: "Lithrone S26-2",
    format: "B3",
    colors: 2,
    kw: 9.0,
    beta1: 0.27,
    year: 2006,
    uvCapable: false,
    category: "small",
    tier: "legacy",
    accent: "#0284c7",
    tags: ["small-format", "commercial", "entry"],
  },
  {
    id: "KM-G37",
    brand: "Komori",
    model: "Lithrone G37-4",
    format: "A1",
    colors: 4,
    kw: 35.0,
    beta1: 0.33,
    year: 2015,
    uvCapable: false,
    category: "medium",
    tier: "mid",
    accent: "#0284c7",
    tags: ["medium-format", "commercial", "books"],
  },
  {
    id: "KM-G40",
    brand: "Komori",
    model: "Lithrone G40-6",
    format: "B1",
    colors: 6,
    kw: 55.0,
    beta1: 0.37,
    year: 2017,
    uvCapable: false,
    category: "large",
    tier: "premium",
    accent: "#0284c7",
    tags: ["large-format", "commercial", "packaging"],
  },
  {
    id: "KM-G40ADV",
    brand: "Komori",
    model: "Lithrone G40 Advance",
    format: "B1",
    colors: 8,
    kw: 58.5,
    beta1: 0.36,
    year: 2022,
    uvCapable: true,
    category: "large",
    tier: "flagship",
    accent: "#0284c7",
    tags: ["large-format", "flagship", "UV", "eco"],
  },
  {
    id: "KM-HUV40",
    brand: "Komori",
    model: "Lithrone G40 H-UV",
    format: "B1",
    colors: 6,
    kw: 62.0,
    beta1: 0.39,
    year: 2019,
    uvCapable: true,
    category: "large",
    tier: "premium",
    accent: "#0284c7",
    tags: ["large-format", "H-UV", "packaging"],
  },
  {
    id: "KM-LS40",
    brand: "Komori",
    model: "Lithrone LS40-8",
    format: "B1",
    colors: 8,
    kw: 78.5,
    beta1: 0.41,
    year: 2020,
    uvCapable: true,
    category: "large",
    tier: "flagship",
    accent: "#0284c7",
    tags: ["large-format", "flagship", "packaging", "UV"],
  },
  // ── MANROLAND ROLAND ────────────────────────────────────────────────
  {
    id: "MR-R500",
    brand: "Manroland",
    model: "Roland 500-5",
    format: "B2",
    colors: 5,
    kw: 31.0,
    beta1: 0.32,
    year: 2010,
    uvCapable: false,
    category: "medium",
    tier: "mid",
    accent: "#16a34a",
    tags: ["medium-format", "commercial", "books"],
  },
  {
    id: "MR-R700",
    brand: "Manroland",
    model: "Roland 700-6+L",
    format: "B1",
    colors: 6,
    kw: 58.0,
    beta1: 0.38,
    year: 2014,
    uvCapable: false,
    category: "large",
    tier: "premium",
    accent: "#16a34a",
    tags: ["large-format", "commercial", "packaging", "coating"],
  },
  {
    id: "MR-R700EV",
    brand: "Manroland",
    model: "Roland 700 Evolution Elite",
    format: "B1",
    colors: 8,
    kw: 66.0,
    beta1: 0.39,
    year: 2021,
    uvCapable: true,
    category: "large",
    tier: "flagship",
    accent: "#16a34a",
    tags: ["large-format", "flagship", "packaging", "UV"],
  },
  // ── KBA RAPIDA ──────────────────────────────────────────────────────
  {
    id: "KBA-R75",
    brand: "KBA",
    model: "Rapida 75-4",
    format: "B2",
    colors: 4,
    kw: 27.0,
    beta1: 0.32,
    year: 2011,
    uvCapable: false,
    category: "medium",
    tier: "mid",
    accent: "#9333ea",
    tags: ["medium-format", "commercial", "packaging"],
  },
  {
    id: "KBA-R106",
    brand: "KBA",
    model: "Rapida 106-6+L",
    format: "B1",
    colors: 6,
    kw: 57.5,
    beta1: 0.38,
    year: 2016,
    uvCapable: false,
    category: "large",
    tier: "premium",
    accent: "#9333ea",
    tags: ["large-format", "packaging", "coating"],
  },
  {
    id: "KBA-R106UV",
    brand: "KBA",
    model: "Rapida 106 UV",
    format: "B1",
    colors: 6,
    kw: 68.0,
    beta1: 0.41,
    year: 2019,
    uvCapable: true,
    category: "large",
    tier: "flagship",
    accent: "#9333ea",
    tags: ["large-format", "UV", "packaging", "flagship"],
  },
  // ── MITSUBISHI / RYOBI ──────────────────────────────────────────────
  {
    id: "MT-D3000",
    brand: "Mitsubishi",
    model: "Diamond 3000LX-6",
    format: "B1",
    colors: 6,
    kw: 51.0,
    beta1: 0.36,
    year: 2009,
    uvCapable: false,
    category: "large",
    tier: "mid",
    accent: "#f59e0b",
    tags: ["large-format", "commercial", "books"],
  },
  {
    id: "RY-520",
    brand: "Ryobi",
    model: "Ryobi 520 GX-4",
    format: "B3",
    colors: 4,
    kw: 14.0,
    beta1: 0.29,
    year: 2012,
    uvCapable: false,
    category: "small",
    tier: "entry",
    accent: "#f59e0b",
    tags: ["small-format", "commercial", "entry"],
  },
  // ── LEO PAPER ORIGINALS (IoT-validated, Table 4.1) ──────────────────
  {
    id: "LP-1024-10039",
    brand: "Leo Paper",
    model: "Book Line (Hard/Soft)",
    format: "B1",
    colors: 4,
    kw: 54.9,
    beta1: 0.38,
    year: 2014,
    uvCapable: true,
    category: "large",
    tier: "mid",
    accent: "#f97316",
    tags: ["large-format", "IoT-validated", "UV", "Leo Paper"],
  },
  {
    id: "LP-1024-10031",
    brand: "Leo Paper",
    model: "Greeting Card Line",
    format: "B1",
    colors: 4,
    kw: 47.8,
    beta1: 0.36,
    year: 2012,
    uvCapable: false,
    category: "large",
    tier: "mid",
    accent: "#f97316",
    tags: ["large-format", "IoT-validated", "Leo Paper"],
  },
  {
    id: "LP-1024-10002",
    brand: "Leo Paper",
    model: "Playing Card Line",
    format: "B1",
    colors: 4,
    kw: 42.4,
    beta1: 0.35,
    year: 2010,
    uvCapable: false,
    category: "large",
    tier: "mid",
    accent: "#f97316",
    tags: ["large-format", "IoT-validated", "Leo Paper"],
  },
  {
    id: "LP-1024-00128",
    brand: "Leo Paper",
    model: "Paper Bag Line",
    format: "B2",
    colors: 2,
    kw: 30.2,
    beta1: 0.33,
    year: 2008,
    uvCapable: false,
    category: "medium",
    tier: "eco",
    accent: "#34d399",
    tags: ["medium-format", "IoT-validated", "eco", "Leo Paper"],
  },
  {
    id: "LP-1024-00122",
    brand: "Leo Paper",
    model: "Cushion Book Line",
    format: "B2",
    colors: 2,
    kw: 22.0,
    beta1: 0.3,
    year: 2006,
    uvCapable: false,
    category: "small",
    tier: "eco",
    accent: "#34d399",
    tags: ["small-format", "IoT-validated", "eco", "Leo Paper"],
  },
];

const BRANDS = ["All", ...new Set(PRESS_LIBRARY.map((m) => m.brand))];
const CATEGORIES = ["All", "small", "medium", "large"];
const TIERS = ["All", "entry", "legacy", "eco", "mid", "premium", "flagship"];
const BRAND_COLORS = {
  Heidelberg: "#e11d48",
  Komori: "#0284c7",
  Manroland: "#16a34a",
  KBA: "#9333ea",
  Mitsubishi: "#f59e0b",
  Ryobi: "#f59e0b",
  "Leo Paper": "#f97316",
};

const SP = {
  peak: {
    beta0: 40.0534,
    beta1: 0.3496,
    r2: 0.8505,
    label: "July · Peak Season (旺季)",
    cpp: true,
  },
  slack: {
    beta0: 40.0316,
    beta1: 0.3498,
    r2: 0.8411,
    label: "Nov · Slack Season (淡季)",
    cpp: false,
  },
};
const P_CARBON = 0.065;

function tariff(h, july) {
  const hr = ((h % 24) + 24) % 24;
  if (hr >= 14 && hr < 18) return july ? 1.5 : 1.2;
  if (hr < 8) return 0.4;
  return 0.8;
}
function cf(h) {
  const hr = ((h % 24) + 24) % 24;
  if (hr >= 14 && hr < 18) return 0.7;
  if (hr < 8) return 0.35;
  return 0.55;
}
function period(h) {
  const hr = ((h % 24) + 24) % 24;
  if (hr >= 14 && hr < 18) return "peak";
  if (hr < 8) return "valley";
  return "flat";
}
const PC = { peak: "#f87171", flat: "#facc15", valley: "#22d3ee" };

function buildProfile(m, dur, ink, start) {
  return Array.from({ length: 121 }, (_, i) => {
    const t = (i * dur) / 120,
      prog = t / dur,
      hr = start + t;
    let state, scale;
    if (prog < 0.15) {
      state = "Setup";
      scale = 0.22 + 0.53 * (prog / 0.15) + 0.05 * Math.sin(t * 8);
    } else if (prog < 0.92) {
      state = "Running";
      const b = 0.88 + ink * (m.uvCapable ? 0.28 : 0.2);
      scale =
        b +
        0.09 * Math.sin(t * 5.3) +
        0.06 * Math.cos(t * 12.7) +
        0.04 * Math.sin(t * 23);
    } else {
      state = "Idle";
      scale = 0.1 + 0.04 * Math.sin(t * 3);
    }
    const d = +(m.kw * Math.max(0.08, scale)).toFixed(2);
    const hv = +(SP.peak.beta0 + m.beta1 * d).toFixed(2);
    return {
      lbl: `${String(Math.floor(hr % 24)).padStart(2, "0")}:${String(
        Math.round((hr % 1) * 60)
      ).padStart(2, "0")}`,
      state,
      d,
      hv,
      tot: +(d + hv).toFixed(2),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────
// FIX 1: calcBill — eB now uses β₀ × t_i (kW × h = kWh), NOT (dur/8)×β₀
// This aligns with the dissertation Section 3.5 allocation formula:
//   E_total,i = E_dir,i + β₀·t_i + β₁,k·E_dir,i
// ─────────────────────────────────────────────────────────────────────
function calcBill(m, dur, ink, start, season) {
  const sp = SP[season],
    july = season === "peak";
  const eD = m.kw * dur; // Direct energy: P_rated × duration (kWh)
  const eB = sp.beta0 * dur; // Baseline HVAC: β₀ × t_i (kWh) — FIXED
  const eT = m.beta1 * eD; // Thermal-induced: β₁,k × E_dir (kWh)
  const eE = eD + eB + eT; // Total lifecycle energy
  const steps = Math.max(1, Math.round(dur * 4));
  let ts = 0,
    cs = 0;
  for (let i = 0; i < steps; i++) {
    const h = start + (i + 0.5) * (dur / steps);
    ts += tariff(h, july);
    cs += cf(h);
  }
  const aT = ts / steps,
    aC = cs / steps;
  const cE = eE * aT,
    cC = eE * aC * P_CARBON,
    cTot = cE + cC,
    kg = eE * aC;
  return { eD, eB, eT, eE, aT, aC, cE, cC, cTot, kg, sp, july };
}

// ─────────────────────────────────────────────────────────────────────
// FIX 2: getRec — saving percentages updated to match Table 4.2
//   July EAGA: 14.30% cost reduction, 18.34% carbon reduction (vs FCFS)
//   Nov  EAGA: 12.33% cost reduction, 13.42% carbon reduction (vs FCFS)
// ─────────────────────────────────────────────────────────────────────
function getRec(m, start, season, ink) {
  const inPk = period(start) === "peak",
    heavy = m.kw > 40;
  if (season === "peak") {
    if (inPk)
      return {
        strat: "时间避峰  Temporal Shifting",
        urg: "HIGH",
        col: "#f87171",
        icon: "⚡",
        action: "立即将该订单平移至夜间谷期 00:00–08:00 执行",
        reason: `旺季 CPP 尖峰时段 +25% 惩罚（¥1.50/kWh）。${
          ink > 0.6 ? "高墨量作业热负荷极高，" : ""
        }综合成本过高。`,
        saving: "峰季电费节省 ~14.30%，碳排降低 ~18.34%（vs FCFS，Table 4.2）",
        optStart: 3,
        optM:
          m.kw > 40 ? PRESS_LIBRARY.find((x) => x.id === "LP-1024-00122") : m,
      };
    if (ink > 0.6 && heavy)
      return {
        strat: "空间生态路由  Spatial Eco-Routing",
        urg: "MEDIUM",
        col: "#fb923c",
        icon: "🌿",
        action: `从 ${m.model}（${m.kw}kW）迁移至低功耗机台`,
        reason: `高墨量（${(ink * 100).toFixed(
          0
        )}%）在重型机器上热耦合代价高昂。`,
        saving: "峰季综合电费节省 ~14.30%（EAGA vs FCFS）",
        optStart: start,
        optM: PRESS_LIBRARY.find((x) => x.id === "LP-1024-00122"),
      };
    return {
      strat: "当前最优  Optimal Now",
      urg: "LOW",
      col: "#34d399",
      icon: "✅",
      action: "维持当前排产，无需调整",
      reason: "平段，热负荷可接受。",
      saving: "成本已处于最优区间",
      optStart: start,
      optM: m,
    };
  } else {
    if (heavy)
      return {
        strat: "深度生态路由  Deep Eco-Routing",
        urg: "MEDIUM",
        col: "#22d3ee",
        icon: "🌙",
        action: `迁移至低功耗机台 + 推入夜间谷期`,
        reason: `淡季交期宽裕，${m.kw}kW 重型机台热耦合代价高。优先空间生态分配。`,
        saving: "淡季电费节省 ~12.33%，碳排降低 ~13.42%（vs FCFS，Table 4.2）",
        optStart: 2,
        optM: PRESS_LIBRARY.find((x) => x.id === "LP-1024-00122"),
      };
    return {
      strat: "谷期整合  Valley Consolidation",
      urg: "LOW",
      col: "#34d399",
      icon: "🌿",
      action: "将订单推入夜间谷期 00:00–08:00",
      reason: "交期充裕，谷期整合最大化电费优惠。",
      saving: "淡季综合节省 ~12.33%（EAGA vs FCFS）",
      optStart: 2,
      optM: m,
    };
  }
}

// Custom chart tooltip
const ChTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0a1628",
        border: "1px solid #1e3a5f",
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 11,
        fontFamily: "monospace",
      }}
    >
      <div style={{ color: "#64748b", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
};

// Tier badge
const TierBadge = ({ tier }) => {
  const cfg = {
    flagship: { bg: "#3b0764", c: "#e879f9" },
    premium: { bg: "#1e3a5f", c: "#60a5fa" },
    mid: { bg: "#0f2d1a", c: "#4ade80" },
    eco: { bg: "#064e3b", c: "#34d399" },
    entry: { bg: "#292524", c: "#a8a29e" },
    legacy: { bg: "#1c1917", c: "#78716c" },
  };
  const s = cfg[tier] || cfg.entry;
  return (
    <span
      style={{
        background: s.bg,
        color: s.c,
        padding: "2px 7px",
        borderRadius: 3,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      {tier.toUpperCase()}
    </span>
  );
};

// Gantt bar
const GBar = ({ label, start, end, color }) => {
  const l = (start / 24) * 100,
    w = Math.min(((end - start) / 24) * 100, 99 - l);
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <div
        style={{
          width: 170,
          fontSize: 10,
          color,
          flexShrink: 0,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          height: 24,
          background: "#040810",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "33.3%",
            height: "100%",
            background: "#22d3ee06",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "58.3%",
            width: "16.7%",
            height: "100%",
            background: "#f8717106",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${l}%`,
            width: `${Math.max(2, w)}%`,
            height: "100%",
            background: color + "44",
            border: `1.5px solid ${color}`,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              color: "#e2e8f0",
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            {String(Math.floor(start)).padStart(2, "0")}:00 → {end.toFixed(1)}h
          </span>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════ */
export default function App() {
  // Library state
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [filterTier, setFilterTier] = useState("All");
  const [filterUV, setFilterUV] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("kw");
  const [view, setView] = useState("library");

  // Selected machine & params
  const [machine, setMachine] = useState(null);
  const [dur, setDur] = useState(3.5);
  const [ink, setInk] = useState(0.7);
  const [sh, setSh] = useState(15);
  const [season, setSeason] = useState("peak");
  const [tab, setTab] = useState(0);
  const [result, setResult] = useState(null);

  // Filtered list
  const filtered = useMemo(() => {
    let list = PRESS_LIBRARY.filter((m) => {
      if (filterBrand !== "All" && m.brand !== filterBrand) return false;
      if (filterCat !== "All" && m.category !== filterCat) return false;
      if (filterTier !== "All" && m.tier !== filterTier) return false;
      if (filterUV && !m.uvCapable) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !m.model.toLowerCase().includes(q) &&
          !m.brand.toLowerCase().includes(q) &&
          !m.tags.join(" ").includes(q)
        )
          return false;
      }
      return true;
    });
    list.sort((a, b) => {
      if (sortBy === "kw") return b.kw - a.kw;
      if (sortBy === "beta1") return b.beta1 - a.beta1;
      if (sortBy === "year") return b.year - a.year;
      if (sortBy === "brand") return a.brand.localeCompare(b.brand);
      return 0;
    });
    return list;
  }, [filterBrand, filterCat, filterTier, filterUV, search, sortBy]);

  // Compute on param change
  useEffect(() => {
    if (!machine) return;
    const profile = buildProfile(machine, dur, ink, sh);
    const bill = calcBill(machine, dur, ink, sh, season);
    const rec = getRec(machine, sh, season, ink);
    setResult({ profile, bill, rec });
  }, [machine, dur, ink, sh, season]);

  const sp = SP[season];
  const ac = machine?.accent ?? "#22d3ee";

  // Stats for library header
  const stats = useMemo(
    () => ({
      total: PRESS_LIBRARY.length,
      brands: new Set(PRESS_LIBRARY.map((m) => m.brand)).size,
      minKw: Math.min(...PRESS_LIBRARY.map((m) => m.kw)),
      maxKw: Math.max(...PRESS_LIBRARY.map((m) => m.kw)),
      uvCount: PRESS_LIBRARY.filter((m) => m.uvCapable).length,
    }),
    []
  );

  const selectMachine = (m) => {
    setMachine(m);
    setView("analysis");
    setTab(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030912",
        color: "#cbd5e1",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ═══ GLOBAL HEADER ══════════════════════════════════════════════ */}
      <div
        style={{
          background: "#070f1f",
          borderBottom: "1px solid #0e1e38",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 8,
              color: "#1e3050",
              letterSpacing: 3,
              marginBottom: 2,
            }}
          >
            HKU DASE7099 · LEO PAPER DIGITAL TWIN DSS · V3.1
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: 0.3,
            }}
          >
            PrintCarbon Intelligence Platform
          </div>
          <div style={{ fontSize: 9, color: "#1e3050" }}>
            {stats.total} machines · {stats.brands} brands · {stats.minKw}–
            {stats.maxKw}kW · {stats.uvCount} UV-capable
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            ["library", "📚 机器库"],
            ["analysis", "⚡ 分析面板"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => {
                if (k === "analysis" && !machine) return;
                setView(k);
              }}
              style={{
                padding: "7px 14px",
                background: view === k ? "#0e1e38" : "transparent",
                border: `1px solid ${view === k ? "#38bdf8" : "#1e3050"}`,
                borderRadius: 5,
                color:
                  view === k
                    ? "#7dd3fc"
                    : machine || k === "library"
                    ? "#475569"
                    : "#1e3050",
                fontSize: 10,
                cursor:
                  k === "analysis" && !machine ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontWeight: view === k ? 700 : 400,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ LIBRARY VIEW ═══════════════════════════════════════════════ */}
      {view === "library" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Filter bar */}
          <div
            style={{
              background: "#070f1f",
              borderBottom: "1px solid #0e1e38",
              padding: "12px 24px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Search */}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索机型 / 品牌 / 标签…"
                style={{
                  background: "#0c1628",
                  border: "1px solid #1e3050",
                  borderRadius: 6,
                  color: "#f1f5f9",
                  padding: "7px 12px",
                  fontSize: 11,
                  width: 220,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              {/* Brand */}
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                style={{
                  background: "#0c1628",
                  border: "1px solid #1e3050",
                  borderRadius: 5,
                  color: "#94a3b8",
                  padding: "7px 10px",
                  fontSize: 10,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {BRANDS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              {/* Category */}
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                style={{
                  background: "#0c1628",
                  border: "1px solid #1e3050",
                  borderRadius: 5,
                  color: "#94a3b8",
                  padding: "7px 10px",
                  fontSize: 10,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {/* Tier */}
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                style={{
                  background: "#0c1628",
                  border: "1px solid #1e3050",
                  borderRadius: 5,
                  color: "#94a3b8",
                  padding: "7px 10px",
                  fontSize: 10,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {TIERS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {/* UV toggle */}
              <button
                onClick={() => setFilterUV(!filterUV)}
                style={{
                  background: filterUV ? "#1e3a5f" : "transparent",
                  border: `1px solid ${filterUV ? "#38bdf8" : "#1e3050"}`,
                  borderRadius: 5,
                  color: filterUV ? "#7dd3fc" : "#334155",
                  padding: "7px 11px",
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {filterUV ? "✓ " : ""}UV Capable
              </button>
              {/* Sort */}
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 9, color: "#334155" }}>排序:</span>
                {[
                  ["kw", "功率"],
                  ["beta1", "热耦合"],
                  ["year", "年份"],
                  ["brand", "品牌"],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setSortBy(k)}
                    style={{
                      background: sortBy === k ? "#1e3050" : "transparent",
                      border: `1px solid ${
                        sortBy === k ? "#475569" : "#1e3050"
                      }`,
                      borderRadius: 4,
                      color: sortBy === k ? "#94a3b8" : "#334155",
                      padding: "4px 8px",
                      fontSize: 9,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 10, color: "#334155" }}>
                {filtered.length} / {stats.total} 台
              </span>
            </div>
          </div>

          {/* Machine grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* Brand summary strip */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              {Object.entries(BRAND_COLORS).map(([brand, color]) => {
                const count = filtered.filter((m) => m.brand === brand).length;
                if (!count) return null;
                return (
                  <div
                    key={brand}
                    style={{
                      background: "#070f1f",
                      border: `1px solid ${color}44`,
                      borderRadius: 6,
                      padding: "6px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        background: color,
                        borderRadius: "50%",
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: 10, color: "#64748b" }}>
                      {brand}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cards grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: 12,
              }}
            >
              {filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => selectMachine(m)}
                  style={{
                    background: "#070f1f",
                    border: `1px solid ${
                      machine?.id === m.id ? m.accent : "#0e1e38"
                    }`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow:
                      machine?.id === m.id ? `0 0 14px ${m.accent}33` : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = m.accent + "88")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      machine?.id === m.id ? m.accent : "#0e1e38")
                  }
                >
                  {/* Card header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            background: m.accent,
                            borderRadius: "50%",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: m.accent,
                          }}
                        >
                          {m.brand}
                        </span>
                        <TierBadge tier={m.tier} />
                        {m.uvCapable && (
                          <span
                            style={{
                              background: "#1e3a5f",
                              color: "#93c5fd",
                              padding: "1px 5px",
                              borderRadius: 3,
                              fontSize: 8,
                              fontWeight: 700,
                            }}
                          >
                            UV
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#f1f5f9",
                          lineHeight: 1.3,
                        }}
                      >
                        {m.model}
                      </div>
                      <div
                        style={{ fontSize: 9, color: "#334155", marginTop: 2 }}
                      >
                        {m.id} · {m.year} · Format {m.format} · {m.colors}色
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: m.accent,
                        }}
                      >
                        {m.kw}
                      </div>
                      <div style={{ fontSize: 8, color: "#334155" }}>kW</div>
                    </div>
                  </div>
                  {/* Power bar */}
                  <div
                    style={{
                      height: 4,
                      background: "#0e1e38",
                      borderRadius: 2,
                      marginBottom: 8,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(m.kw / 80) * 100}%`,
                        background: `linear-gradient(90deg,${m.accent}88,${m.accent})`,
                        borderRadius: 2,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  {/* Metrics row */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {[
                      ["β₁", m.beta1, "热耦合系数"],
                      ["Format", m.format, "印刷幅面"],
                      ["Year", m.year, "出厂年份"],
                    ].map(([k, v, tip]) => (
                      <div key={k} title={tip}>
                        <div style={{ fontSize: 8, color: "#1e3050" }}>{k}</div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#64748b",
                          }}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <span
                        style={{
                          fontSize: 9,
                          color: "#22d3ee",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        ANALYZE →
                      </span>
                    </div>
                  </div>
                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    {m.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        style={{
                          background: "#0e1e38",
                          color: "#334155",
                          padding: "1px 5px",
                          borderRadius: 3,
                          fontSize: 8,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ ANALYSIS VIEW ══════════════════════════════════════════════ */}
      {view === "analysis" && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left: param panel */}
          <div
            style={{
              width: 260,
              minWidth: 260,
              background: "#070f1f",
              borderRight: "1px solid #0e1e38",
              padding: "16px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            {/* Back */}
            <button
              onClick={() => setView("library")}
              style={{
                background: "transparent",
                border: "1px solid #1e3050",
                borderRadius: 5,
                color: "#475569",
                padding: "5px 10px",
                fontSize: 9,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 14,
                width: "100%",
              }}
            >
              ← 返回机器库
            </button>
            {/* Machine quick-switch */}
            <div
              style={{
                fontSize: 9,
                color: "#1e3050",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              当前机台
            </div>
            <div
              style={{
                background: "#040810",
                border: `1px solid ${ac}`,
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: ac,
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 10, color: ac, fontWeight: 700 }}>
                  {machine?.brand}
                </span>
                <TierBadge tier={machine?.tier} />
              </div>
              <div style={{ fontSize: 11, color: "#f1f5f9", fontWeight: 700 }}>
                {machine?.model}
              </div>
              <div style={{ fontSize: 9, color: "#334155" }}>
                {machine?.id} · {machine?.kw}kW · β₁={machine?.beta1}
              </div>
            </div>
            {/* Params */}
            {[
              [
                "作业时长 DURATION",
                dur,
                0.5,
                8,
                0.5,
                (v) => setDur(+v),
                `${dur.toFixed(1)} hrs`,
                ac,
                null,
              ],
              [
                "墨量覆盖率 INK COV.",
                ink,
                0.05,
                1,
                0.05,
                (v) => setInk(+v),
                `${(ink * 100).toFixed(0)}%`,
                ink > 0.6 ? "#f87171" : ac,
                ink > 0.6 ? "⚠ 高墨量" : null,
              ],
              [
                "开始时间 START HR",
                sh,
                0,
                23,
                1,
                (v) => setSh(+v),
                `${String(sh).padStart(2, "0")}:00`,
                PC[period(sh)],
                null,
              ],
            ].map(([l, val, min, max, step, fn, disp, col, warn]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 9,
                    color: "#334155",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {l} <b style={{ float: "right", color: col }}>{disp}</b>
                </label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) => fn(e.target.value)}
                  style={{ width: "100%", accentColor: col, cursor: "pointer" }}
                />
                {warn && (
                  <div style={{ fontSize: 9, color: "#f87171", marginTop: 2 }}>
                    {warn}
                  </div>
                )}
              </div>
            ))}
            {/* Period quick-set */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {[
                ["谷", 3, "#22d3ee"],
                ["平", 10, "#facc15"],
                ["峰", 16, "#f87171"],
              ].map(([l, h, c]) => (
                <button
                  key={l}
                  onClick={() => setSh(h)}
                  style={{
                    flex: 1,
                    padding: "5px 0",
                    background: "transparent",
                    border: `1px solid ${c}55`,
                    borderRadius: 4,
                    color: c,
                    fontSize: 9,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {l}期
                </button>
              ))}
            </div>
            {/* Season */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: "#1e3050", marginBottom: 6 }}>
                生产季节 SEASON
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  ["peak", "☀ 旺季"],
                  ["slack", "🌙 淡季"],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setSeason(k)}
                    style={{
                      flex: 1,
                      padding: "7px 0",
                      background: season === k ? "#0e1e38" : "transparent",
                      border: `1px solid ${
                        season === k ? "#38bdf8" : "#1e3050"
                      }`,
                      borderRadius: 5,
                      color: season === k ? "#7dd3fc" : "#334155",
                      fontSize: 9,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: season === k ? 700 : 400,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Comparable machines */}
            <div
              style={{
                fontSize: 9,
                color: "#1e3050",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              相近规格机台
            </div>
            {PRESS_LIBRARY.filter(
              (m) => m.id !== machine?.id && Math.abs(m.kw - machine?.kw) < 15
            )
              .slice(0, 4)
              .map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setMachine(m);
                    setTab(0);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    marginBottom: 4,
                    background: "#040810",
                    border: "1px solid #0e1e38",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = m.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#0e1e38")
                  }
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: m.accent,
                      borderRadius: "50%",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 9,
                        color: "#64748b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.model}
                    </div>
                    <div style={{ fontSize: 8, color: "#334155" }}>
                      {m.kw}kW · β₁={m.beta1}
                    </div>
                  </div>
                  <span style={{ fontSize: 8, color: "#22d3ee" }}>→</span>
                </div>
              ))}
          </div>

          {/* Right: output */}
          {machine && result && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Machine badge */}
              <div
                style={{
                  background: "#070f1f",
                  borderBottom: "1px solid #0e1e38",
                  padding: "8px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 36,
                    background: ac,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}
                  >
                    {machine.brand} · {machine.model}
                  </div>
                  <div style={{ fontSize: 9, color: "#334155" }}>
                    {machine.id} · {machine.kw}kW · β₁={machine.beta1} ·{" "}
                    {sp.label}
                    {machine.uvCapable && (
                      <span style={{ color: "#60a5fa", marginLeft: 8 }}>
                        UV-capable
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    [`${result.bill.eE.toFixed(1)} kWh`, "Total Energy", ac],
                    [
                      `¥${result.bill.cTot.toFixed(2)}`,
                      "Total Cost",
                      "#4ade80",
                    ],
                    [`${result.bill.kg.toFixed(2)} kg`, "CO₂", "#818cf8"],
                  ].map(([v, l, c]) => (
                    <div key={l} style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 8, color: "#1e3050" }}>{l}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: c }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "#070f1f",
                  borderBottom: "1px solid #0e1e38",
                  padding: "0 20px",
                  flexShrink: 0,
                }}
              >
                {[
                  "⚡ 动态能耗 & 热力画像",
                  "💳 精准订单碳账单",
                  "📋 排产决策 & 甘特图",
                ].map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTab(i)}
                    style={{
                      padding: "10px 16px",
                      background: "transparent",
                      border: "none",
                      borderBottom:
                        tab === i ? `2px solid ${ac}` : "2px solid transparent",
                      color: tab === i ? "#f1f5f9" : "#334155",
                      fontSize: 10,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: tab === i ? 700 : 400,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
                {/* ── TAB 0: ENERGY ─────────────────────────────────── */}
                {tab === 0 && (
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 10,
                        marginBottom: 16,
                      }}
                    >
                      {[
                        [
                          "峰值直供功率",
                          `${(
                            machine.kw *
                            (0.88 + ink * (machine.uvCapable ? 0.28 : 0.2))
                          ).toFixed(1)} kW`,
                          ac,
                        ],
                        ["HVAC基线 β₀", `${sp.beta0} kW`, "#818cf8"],
                        [
                          "热耦合代偿",
                          `${(
                            machine.beta1 *
                            machine.kw *
                            (0.88 + ink * (machine.uvCapable ? 0.28 : 0.2))
                          ).toFixed(1)} kW`,
                          "#f97316",
                        ],
                        [
                          "系统峰值合计",
                          `${(
                            machine.kw *
                              (0.88 + ink * (machine.uvCapable ? 0.28 : 0.2)) *
                              (1 + machine.beta1) +
                            sp.beta0
                          ).toFixed(1)} kW`,
                          "#4ade80",
                        ],
                      ].map(([l, v, c]) => (
                        <div
                          key={l}
                          style={{
                            background: "#070f1f",
                            border: `1px solid ${c}22`,
                            borderRadius: 8,
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 8,
                              color: "#1e3050",
                              marginBottom: 5,
                            }}
                          >
                            {l}
                          </div>
                          <div
                            style={{ fontSize: 20, fontWeight: 700, color: c }}
                          >
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* State legend */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                      {[
                        ["Setup", "#60a5fa"],
                        ["Running", "#4ade80"],
                        ["Idle", "#475569"],
                      ].map(([s, c]) => (
                        <div
                          key={s}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 9,
                            color: "#475569",
                          }}
                        >
                          <span
                            style={{
                              width: 12,
                              height: 3,
                              background: c,
                              borderRadius: 2,
                              display: "inline-block",
                            }}
                          />
                          {s}
                        </div>
                      ))}
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 8,
                          color: "#1e3050",
                        }}
                      >
                        β₀={sp.beta0}kW · β₁(sys)={sp.beta1} · R²={sp.r2}
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#070f1f",
                        border: "1px solid #0e1e38",
                        borderRadius: 10,
                        padding: 14,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "#1e3050",
                          marginBottom: 10,
                          letterSpacing: 1,
                        }}
                      >
                        状态感知功率轨迹 STATE-AWARE POWER TRAJECTORY
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={result.profile}
                          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor={ac}
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="95%"
                                stopColor={ac}
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                            <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor="#818cf8"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#818cf8"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#0e1e38"
                          />
                          <XAxis
                            dataKey="lbl"
                            tick={{ fontSize: 8, fill: "#1e3050" }}
                            interval={Math.floor(result.profile.length / 8)}
                          />
                          <YAxis
                            tick={{ fontSize: 8, fill: "#1e3050" }}
                            unit=" kW"
                            width={52}
                          />
                          <Tooltip content={<ChTip />} />
                          <ReferenceLine
                            y={sp.beta0}
                            stroke="#818cf855"
                            strokeDasharray="4 2"
                            label={{
                              value: `β₀=${sp.beta0}kW`,
                              position: "insideTopRight",
                              fontSize: 8,
                              fill: "#818cf8",
                            }}
                          />
                          <Area
                            dataKey="hv"
                            name="HVAC Load"
                            stroke="#818cf8"
                            fill="url(#gH)"
                            strokeWidth={1.5}
                            dot={false}
                          />
                          <Area
                            dataKey="d"
                            name="Direct kW"
                            stroke={ac}
                            fill="url(#gD)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Thermal insight */}
                    <div
                      style={{
                        background: "#0a0f1e",
                        borderLeft: "3px solid #f97316",
                        border: "1px solid #f9731622",
                        borderRadius: 8,
                        padding: "12px 16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "#f97316",
                          fontWeight: 700,
                          marginBottom: 6,
                          letterSpacing: 1,
                        }}
                      >
                        ⚠ 热能耦合分析 THERMAL COUPLING ANALYSIS
                        {machine.uvCapable && (
                          <span style={{ color: "#60a5fa", marginLeft: 8 }}>
                            · UV 固化额外热负荷已纳入计算
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          lineHeight: 1.8,
                          margin: 0,
                        }}
                      >
                        {machine.brand} {machine.model} 机台热耦合系数{" "}
                        <b style={{ color: ac }}>β₁={machine.beta1}</b>
                        {machine.uvCapable
                          ? " (含UV固化辐射)"
                          : " (标准热辐射)"}
                        。 墨量覆盖率{" "}
                        <b style={{ color: ink > 0.6 ? "#f87171" : "#facc15" }}>
                          {(ink * 100).toFixed(0)}%
                        </b>
                        ， 剥离环境基线 β₀={sp.beta0}kW 后， 热诱导 HVAC 代偿{" "}
                        <b style={{ color: "#4ade80" }}>
                          {result.bill.eT.toFixed(1)} kWh
                        </b>
                        。 与同格式 B1 机台相比，β₁差异代表约
                        <b style={{ color: "#f97316" }}>
                          {" "}
                          ±{((machine.beta1 - 0.35) * 100).toFixed(0)}%
                        </b>{" "}
                        的散热负荷差异。
                      </p>
                    </div>
                  </div>
                )}

                {/* ── TAB 1: BILL ───────────────────────────────────── */}
                {tab === 1 && (
                  <div>
                    <div
                      style={{
                        background: "linear-gradient(135deg,#070f1f,#0c1628)",
                        border: `1px solid ${ac}44`,
                        borderRadius: 12,
                        padding: "18px 22px",
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 8,
                            color: "#1e3050",
                            letterSpacing: 3,
                            marginBottom: 3,
                          }}
                        >
                          PRODUCT CARBON FOOTPRINT BILL · ISO 14067 ·
                          GATE-TO-GATE
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#f1f5f9",
                          }}
                        >
                          {machine.brand} {machine.model}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "#334155",
                            marginTop: 3,
                          }}
                        >
                          {sp.label} · Start {String(sh).padStart(2, "0")}:00 ·{" "}
                          {dur}h · Ink {(ink * 100).toFixed(0)}%
                          {machine.uvCapable ? " · UV Active" : ""}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 8, color: "#1e3050" }}>
                          TOTAL COST
                        </div>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#4ade80",
                          }}
                        >
                          ¥{result.bill.cTot.toFixed(2)}
                        </div>
                        <div style={{ fontSize: 11, color: "#818cf8" }}>
                          {result.bill.kg.toFixed(3)} kgCO₂
                        </div>
                      </div>
                    </div>
                    {/* Three terms */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      {[
                        {
                          tm: "Term①",
                          tl: "机器直供电\nDirect Energy",
                          v: result.bill.eD,
                          c: ac,
                          icon: "⚙️",
                          f: `P_rated×t = ${
                            machine.kw
                          }×${dur} = ${result.bill.eD.toFixed(1)} kWh`,
                        },
                        {
                          tm: "Term②",
                          tl: "环境基准暖通\nBaseline HVAC",
                          v: result.bill.eB,
                          c: "#818cf8",
                          icon: "❄️",
                          // FIX 3: Display formula now shows β₀×t_i (corrected from (dur/8)×β₀)
                          f: `β₀×t = ${
                            sp.beta0
                          }×${dur} = ${result.bill.eB.toFixed(1)} kWh`,
                        },
                        {
                          tm: "Term③",
                          tl: "热诱导代偿\nThermal-Induced",
                          v: result.bill.eT,
                          c: "#f97316",
                          icon: "🔥",
                          f: `β₁×E_dir = ${
                            machine.beta1
                          }×${result.bill.eD.toFixed(
                            1
                          )} = ${result.bill.eT.toFixed(1)} kWh`,
                        },
                      ].map(({ tm, tl, v, c, icon, f }) => (
                        <div
                          key={tm}
                          style={{
                            background: "#070f1f",
                            border: `1px solid ${c}33`,
                            borderRadius: 10,
                            padding: 14,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{ fontSize: 9, color: c, fontWeight: 700 }}
                            >
                              {tm}
                            </span>
                            <span style={{ fontSize: 15 }}>{icon}</span>
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#475569",
                              marginBottom: 10,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {tl}
                          </div>
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 700,
                              color: c,
                              marginBottom: 4,
                            }}
                          >
                            {v.toFixed(1)}{" "}
                            <span style={{ fontSize: 10 }}>kWh</span>
                          </div>
                          <div
                            style={{
                              background: "#040810",
                              borderRadius: 4,
                              padding: "4px 7px",
                              fontSize: 9,
                              color: "#1e3050",
                              fontFamily: "monospace",
                            }}
                          >
                            {f}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Formula */}
                    <div
                      style={{
                        background: "#070f1f",
                        border: "1px solid #0e1e38",
                        borderRadius: 7,
                        padding: "9px 14px",
                        marginBottom: 14,
                        fontSize: 11,
                        color: "#475569",
                        fontFamily: "monospace",
                      }}
                    >
                      <b style={{ color: "#4ade80" }}>E_total_i</b> ={" "}
                      <b style={{ color: ac }}>{result.bill.eD.toFixed(1)}</b> +{" "}
                      <b style={{ color: "#818cf8" }}>
                        {result.bill.eB.toFixed(1)}
                      </b>{" "}
                      +{" "}
                      <b style={{ color: "#f97316" }}>
                        {result.bill.eT.toFixed(1)}
                      </b>{" "}
                      ={" "}
                      <b style={{ color: "#4ade80" }}>
                        {result.bill.eE.toFixed(1)} kWh
                      </b>
                    </div>
                    {/* Cost grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      {[
                        [
                          "电费 Electricity",
                          `¥${result.bill.cE.toFixed(2)}`,
                          `¥${result.bill.aT.toFixed(4)}/kWh${
                            season === "peak" && sh >= 14 && sh < 18
                              ? " +CPP 25%"
                              : ""
                          }`,
                          "#facc15",
                        ],
                        [
                          "碳成本 Carbon Fee",
                          `¥${result.bill.cC.toFixed(2)}`,
                          `${result.bill.aC.toFixed(2)}×¥0.065/kg`,
                          "#f97316",
                        ],
                        [
                          "碳足迹 PCF",
                          `${result.bill.kg.toFixed(3)} kg`,
                          "ISO 14067",
                          "#818cf8",
                        ],
                        [
                          "总成本 TOTAL",
                          `¥${result.bill.cTot.toFixed(2)}`,
                          "Green Premium basis",
                          "#4ade80",
                        ],
                      ].map(([l, v, s, c]) => (
                        <div
                          key={l}
                          style={{
                            background: "#070f1f",
                            border: `1px solid ${c}33`,
                            borderRadius: 8,
                            padding: "10px 12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 8,
                              color: "#1e3050",
                              marginBottom: 5,
                            }}
                          >
                            {l}
                          </div>
                          <div
                            style={{ fontSize: 16, fontWeight: 700, color: c }}
                          >
                            {v}
                          </div>
                          <div
                            style={{
                              fontSize: 8,
                              color: "#0e1e38",
                              marginTop: 3,
                            }}
                          >
                            {s}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Energy bar */}
                    <div
                      style={{
                        background: "#070f1f",
                        border: "1px solid #0e1e38",
                        borderRadius: 8,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "#1e3050",
                          marginBottom: 8,
                        }}
                      >
                        能耗三项构成比 ENERGY COMPOSITION
                      </div>
                      <div
                        style={{
                          display: "flex",
                          height: 16,
                          borderRadius: 3,
                          overflow: "hidden",
                          marginBottom: 7,
                        }}
                      >
                        {[
                          [result.bill.eD, ac],
                          [result.bill.eB, "#818cf8"],
                          [result.bill.eT, "#f97316"],
                        ].map(([v, c], i) => (
                          <div
                            key={i}
                            style={{ flex: v, background: c + "99" }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          fontSize: 9,
                          color: "#334155",
                        }}
                      >
                        {[
                          [result.bill.eD, ac, "Direct"],
                          [result.bill.eB, "#818cf8", "Baseline HVAC"],
                          [result.bill.eT, "#f97316", "Thermal"],
                        ].map(([v, c, l]) => (
                          <div
                            key={l}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                background: c,
                                borderRadius: 2,
                                display: "inline-block",
                              }}
                            />
                            {l}: {v.toFixed(1)}kWh (
                            {((v / result.bill.eE) * 100).toFixed(0)}%)
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: SCHEDULING ─────────────────────────────── */}
                {tab === 2 && (
                  <div>
                    {/* Strategy card */}
                    <div
                      style={{
                        background: "#0a0f1e",
                        border: `2px solid ${result.rec.col}`,
                        borderRadius: 12,
                        padding: "16px 20px",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{result.rec.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                              marginBottom: 6,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: result.rec.col,
                              }}
                            >
                              {result.rec.strat}
                            </div>
                            <div
                              style={{
                                background:
                                  result.rec.urg === "HIGH"
                                    ? "#450a0a"
                                    : result.rec.urg === "MEDIUM"
                                    ? "#431407"
                                    : "#052e16",
                                color:
                                  result.rec.urg === "HIGH"
                                    ? "#fca5a5"
                                    : result.rec.urg === "MEDIUM"
                                    ? "#fed7aa"
                                    : "#86efac",
                                padding: "2px 7px",
                                borderRadius: 3,
                                fontSize: 8,
                                fontWeight: 700,
                              }}
                            >
                              {result.rec.urg}
                            </div>
                          </div>
                          <div
                            style={{
                              background: "#070f1f",
                              borderLeft: `3px solid ${result.rec.col}`,
                              borderRadius: 4,
                              padding: "8px 12px",
                              marginBottom: 10,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 8,
                                color: "#1e3050",
                                marginBottom: 2,
                              }}
                            >
                              SYSTEM ACTION ▸
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#f1f5f9",
                                fontWeight: 600,
                              }}
                            >
                              {result.rec.action}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#64748b",
                              lineHeight: 1.7,
                              marginBottom: 8,
                            }}
                          >
                            <b style={{ color: "#334155" }}>Reason: </b>
                            {result.rec.reason}
                          </div>
                          <div
                            style={{
                              display: "inline-block",
                              background: `${result.rec.col}18`,
                              border: `1px solid ${result.rec.col}44`,
                              borderRadius: 5,
                              padding: "4px 10px",
                              fontSize: 11,
                              color: result.rec.col,
                              fontWeight: 700,
                            }}
                          >
                            💰 {result.rec.saving}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Gantt */}
                    <div
                      style={{
                        background: "#070f1f",
                        border: "1px solid #0e1e38",
                        borderRadius: 10,
                        padding: "14px 18px",
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "#1e3050",
                          marginBottom: 12,
                          letterSpacing: 1,
                        }}
                      >
                        智能排产甘特图 SCHEDULING GANTT — 24H HORIZON
                      </div>
                      <GBar
                        label={`${machine.model.split(" ")[0]} (FCFS Baseline)`}
                        start={sh}
                        end={sh + dur}
                        color={ac}
                      />
                      <GBar
                        label={`${
                          result.rec.optM.model.split(" ")[0]
                        } (EAGA Opt.)`}
                        start={result.rec.optStart}
                        end={result.rec.optStart + dur}
                        color={result.rec.col}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          marginTop: 8,
                          fontSize: 8,
                          color: "#1e3050",
                        }}
                      >
                        {[
                          [ac, "FCFS Baseline"],
                          [result.rec.col, "EAGA Optimised"],
                          ["#22d3ee44", "Valley 00–08"],
                          ["#f8717144", "Peak 14–18"],
                        ].map(([c, l]) => (
                          <div
                            key={l}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span
                              style={{
                                width: 9,
                                height: 7,
                                background: c,
                                borderRadius: 2,
                                display: "inline-block",
                              }}
                            />
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* TOU bar */}
                    <div
                      style={{
                        background: "#070f1f",
                        border: "1px solid #0e1e38",
                        borderRadius: 10,
                        padding: "14px 18px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "#1e3050",
                          marginBottom: 10,
                        }}
                      >
                        24H TOU TARIFF ·{" "}
                        {season === "peak"
                          ? "July CPP Active (14–18h +25%)"
                          : "November Standard"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          height: 40,
                          gap: 1,
                          overflow: "hidden",
                          borderRadius: 3,
                        }}
                      >
                        {Array.from({ length: 24 }, (_, h) => {
                          const r = tariff(h, season === "peak"),
                            c = PC[period(h)],
                            isNow = h === sh,
                            isOpt = h === Math.floor(result.rec.optStart);
                          return (
                            <div
                              key={h}
                              title={`${h}:00 ¥${r}/kWh`}
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                position: "relative",
                                borderTop: isNow
                                  ? `2px solid ${ac}`
                                  : isOpt && !isNow
                                  ? `2px solid ${result.rec.col}`
                                  : "2px solid transparent",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: `${(r / 1.5) * 100}%`,
                                  background: c + "77",
                                }}
                              />
                              {isNow && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: -13,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    fontSize: 6,
                                    color: ac,
                                    whiteSpace: "nowrap",
                                    fontWeight: 700,
                                  }}
                                >
                                  ▼NOW
                                </div>
                              )}
                              {isOpt && !isNow && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: -13,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    fontSize: 6,
                                    color: result.rec.col,
                                    whiteSpace: "nowrap",
                                    fontWeight: 700,
                                  }}
                                >
                                  ★OPT
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 7,
                          color: "#1e3050",
                          marginTop: 3,
                        }}
                      >
                        <span>00 Valley ¥0.40</span>
                        <span>08 Flat</span>
                        <span>
                          14 Peak{" "}
                          {season === "peak" ? "¥1.50 CPP (+25%)" : "¥1.20"}
                        </span>
                        <span>18 Flat</span>
                        <span>24</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
