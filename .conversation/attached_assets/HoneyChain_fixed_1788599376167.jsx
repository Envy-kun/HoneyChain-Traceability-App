import React, { useState } from "react";
import {
  Menu, Thermometer, Droplets, Weight, HeartPulse,
  QrCode, MapPin, ShieldCheck,
  LayoutDashboard, Boxes, LineChart as LineChartIcon, Bell, UserCircle2,
  LogOut, ArrowUpRight, CheckCircle2, Package, AlertTriangle, Leaf
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ---------------------------------- MOCK DATA ---------------------------------- */

const environmentalTrends = [
  { date: "6 Sep", temp: 31, humidity: 62 },
  { date: "7 Sep", temp: 35, humidity: 68 },
  { date: "8 Sep", temp: 33, humidity: 60 },
  { date: "9 Sep", temp: 32, humidity: 71 },
  { date: "10 Sep", temp: 35, humidity: 64 },
  { date: "11 Sep", temp: 38, humidity: 70 },
  { date: "12 Sep", temp: 36, humidity: 67 },
];

const batchStages = [
  { num: "1", title: "Hive", desc: "Hive registered\nLocation: Uttarakhand, India\n02-09-2026 | 10:00 AM", hash: "8f92a3..." },
  { num: "2", title: "Harvest", desc: "Honey collected\n18 kg\n02-09-2026 | 02:30 PM", hash: "3ac41e..." },
  { num: "3", title: "Extraction", desc: "Processed at local unit\n03-09-2026 | 11:20 AM", hash: "7bd921..." },
  { num: "4", title: "Packaging", desc: "Packaged and sealed\n04-09-2026 | 09:15 AM", hash: "92bd81..." },
  { num: "5", title: "Retail", desc: "Ready for market\n05-09-2026 | 01:00 PM", hash: "ef13c9..." },
];

const hives = [
  { id: "HIVE-001", status: "Healthy", temp: 32, humidity: 65, weight: 24, location: "Uttarakhand" },
  { id: "HIVE-002", status: "Attention Needed", temp: 38, humidity: 72, weight: 19, location: "Uttarakhand" },
  { id: "HIVE-003", status: "Healthy", temp: 31, humidity: 63, weight: 27, location: "Himachal Pradesh" },
];

const alerts = [
  { title: "High temperature detected", hive: "HIVE-002", desc: "Temperature reached 38°C, above the 35°C safe threshold.", warn: true },
  { title: "Harvest ready", hive: "HIVE-001", desc: "AI model estimates hive is ready for harvest within 5 days.", warn: false },
];

/* ---------------------------------- SHARED UI ---------------------------------- */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-[#2B353B] bg-[#12171A] p-2 text-xs text-[#E1E7EC] shadow-md">
        <p className="font-semibold">{label}</p>
        <p className="text-[#FBBF24]">Temp: {payload.find(p => p.dataKey === "temp")?.value}°C</p>
        <p className="text-[#38BDF8]">Humidity: {payload.find(p => p.dataKey === "humidity")?.value}%</p>
      </div>
    );
  }
  return null;
};

// Single source of truth for sidebar nav + destinations, shared by every
// dashboard-family page so links can't silently go dead on one screen but
// not another.
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "hives", label: "My Hives", icon: Boxes },
  { key: "createBatch", label: "Batches", icon: Package },
  { key: "analytics", label: "Analytics", icon: LineChartIcon },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "profile", label: "Profile", icon: UserCircle2 },
];

function Sidebar({ page, go }) {
  return (
    <div className="md:col-span-3 flex flex-col justify-between bg-[#12171A] p-4 rounded-xl border border-[#232B30] min-h-[500px]">
      <div>
        <button onClick={() => go("landing")} className="flex items-center gap-2 font-semibold text-white text-sm mb-6">
          <span className="text-[#FBBF24]">🐝</span> HoneyChain
        </button>
        <nav className="space-y-1 text-xs">
          {NAV_ITEMS.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  active
                    ? "bg-[#272315] text-[#FBBF24] font-medium"
                    : "text-[#828E96] hover:bg-[#1A2024] hover:text-white"
                }`}
              >
                <item.icon size={16} /> {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <button onClick={() => go("landing")} className="flex items-center gap-2 text-xs text-[#828E96] hover:text-white px-3 py-2">
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}

/* ---------------------------------- SECTIONS ---------------------------------- */

/* 1. Landing Page */
function LandingPage({ go }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#232B30] bg-[#0F1315] p-6 md:p-10">
      <div className="flex items-center justify-between pb-8 border-b border-[#1E262B]">
        <button onClick={() => go("landing")} className="flex items-center gap-2 font-semibold text-white text-lg">
          <span className="text-[#FBBF24]">🐝</span> HoneyChain
        </button>
        <div className="hidden md:flex items-center gap-6 text-xs text-[#9DA8B0]">
          <button className="text-white hover:text-[#FBBF24]" onClick={() => go("landing")}>Home</button>
          <button className="hover:text-white" onClick={() => go("about")}>About</button>
          <button className="hover:text-white" onClick={() => go("consumer")}>Track Honey</button>
          <button className="hover:text-white" onClick={() => go("dashboard")}>For Beekeepers</button>
        </div>
        {/* Prototype has no separate auth flow yet, so "Login" goes straight
            to the dashboard rather than a state the router can't render. */}
        <button
          onClick={() => go("dashboard")}
          className="rounded-lg bg-[#FBBF24] px-5 py-2 text-xs font-semibold text-[#0B0E11] hover:bg-[#f59e0b]"
        >
          Login
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">HoneyChain</h1>
          <h2 className="text-xl md:text-2xl font-serif text-[#FBBF24] mt-1">From Hive to Home</h2>
          <p className="text-xs text-[#828E96] mt-2 font-medium">Transparent. Authentic. Sustainable.</p>
          <p className="text-xs text-[#9DA8B0] mt-4 leading-relaxed max-w-sm">
            A digital ecosystem connecting beekeepers, processing units, and consumers through IoT, AI, and Blockchain.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => go("consumer")} className="rounded-lg bg-[#FBBF24] px-5 py-2.5 text-xs font-semibold text-[#0B0E11] hover:bg-[#f59e0b]">
              Track Honey
            </button>
            <button onClick={() => go("dashboard")} className="rounded-lg border border-[#37434B] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#1E262B]">
              Beekeeper Login
            </button>
          </div>
          <div className="flex items-center gap-8 mt-10 pt-6 border-t border-[#1E262B]">
            <div><div className="text-xl font-bold text-white">100+</div><div className="text-[10px] text-[#828E96]">Beekeepers</div></div>
            <div><div className="text-xl font-bold text-white">500+</div><div className="text-[10px] text-[#828E96]">Verified Batches</div></div>
            <div><div className="text-xl font-bold text-white">100%</div><div className="text-[10px] text-[#828E96]">Traceable</div></div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-full max-w-sm h-72 rounded-2xl overflow-hidden border border-[#232B30]">
            <img
              src="https://images.pexels.com/photos/2198671/pexels-photo-2198671.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Bee pollinating a flower"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <p className="font-serif italic text-lg leading-tight">Small bees.</p>
              <p className="font-serif italic text-lg leading-tight">Big impact.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* About (was linked from nav but never existed) */
function AboutPage({ go }) {
  return (
    <div className="rounded-xl border border-[#232B30] bg-[#0F1315] p-6 md:p-10">
      <button onClick={() => go("landing")} className="mb-6 text-xs text-[#828E96] hover:text-white">← Back to Home</button>
      <h2 className="text-xl font-serif text-white">Built on trust, backed by technology</h2>
      <p className="mt-3 max-w-lg text-xs text-[#9DA8B0] leading-relaxed">
        HoneyChain connects every hand honey passes through — from the beekeeper tending the hive to the
        consumer opening the jar — into one transparent, tamper-evident record.
      </p>
    </div>
  );
}

/* 2. Beekeeper Dashboard */
function BeekeeperDashboard({ go }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <Sidebar page="dashboard" go={go} />

      <div className="md:col-span-9 space-y-5">
        <div className="flex justify-between items-center bg-[#12171A] p-4 rounded-xl border border-[#232B30]">
          <div>
            <h2 className="text-lg font-semibold text-white">Welcome, Rahul Kumar</h2>
            <p className="text-[11px] text-[#828E96]">Keep your hives healthy, keep the world sweeter.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="flex items-center gap-1 text-[#9DA8B0]"><MapPin size={12} /> Uttarakhand, India</div>
              <div className="text-[10px] text-[#828E96]">12 Sept 2026, 10:24 AM</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#272315] border border-[#FBBF24]/30 text-[#FBBF24] flex items-center justify-center font-bold text-xs">RK</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#12171A] p-3.5 rounded-xl border border-[#232B30] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#272315] text-[#FBBF24]"><Thermometer size={18} /></div>
            <div><div className="text-base font-bold text-white">32°C</div><div className="text-[10px] text-[#828E96]">Temperature</div><div className="text-[9px] text-[#34D399]">Normal</div></div>
          </div>
          <div className="bg-[#12171A] p-3.5 rounded-xl border border-[#232B30] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#182830] text-[#38BDF8]"><Droplets size={18} /></div>
            <div><div className="text-base font-bold text-white">65%</div><div className="text-[10px] text-[#828E96]">Humidity</div><div className="text-[9px] text-[#34D399]">Normal</div></div>
          </div>
          <div className="bg-[#12171A] p-3.5 rounded-xl border border-[#232B30] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#182820] text-[#34D399]"><Weight size={18} /></div>
            <div><div className="text-base font-bold text-white">24 kg</div><div className="text-[10px] text-[#828E96]">Hive Weight</div><div className="text-[9px] text-[#34D399]">+2 kg this week</div></div>
          </div>
          <div className="bg-[#12171A] p-3.5 rounded-xl border border-[#232B30] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#182820] text-[#34D399]"><HeartPulse size={18} /></div>
            <div><div className="text-base font-bold text-white">87%</div><div className="text-[10px] text-[#828E96]">Colony Health</div><div className="text-[9px] text-[#34D399]">Healthy</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-[#12171A] p-4 rounded-xl border border-[#232B30]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-white">Environmental Trends</h3>
              <select className="bg-[#0B0E11] text-[10px] text-[#828E96] border border-[#232B30] rounded-md px-2 py-1 outline-none">
                <option>Last 7 days</option>
              </select>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={environmentalTrends}>
                  <CartesianGrid stroke="#1E262B" vertical={false} />
                  <XAxis dataKey="date" stroke="#828E96" tick={{ fontSize: 10 }} axisLine={false} />
                  {/* Separate axes so temp (~30-38) isn't crushed against
                      the bottom of a 0-100 scale shared with humidity. */}
                  <YAxis yAxisId="temp" stroke="#FBBF24" tick={{ fontSize: 10 }} axisLine={false} domain={[20, 45]} />
                  <YAxis yAxisId="humidity" orientation="right" stroke="#38BDF8" tick={{ fontSize: 10 }} axisLine={false} domain={[40, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#FBBF24" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#12171A] p-4 rounded-xl border border-[#232B30] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-white">AI Insights</h3>
                <span className="bg-[#182820] text-[#34D399] text-[9px] px-2 py-0.5 rounded-full font-medium">Healthy</span>
              </div>
              <p className="text-[11px] text-[#828E96] mt-3">No signs of disease detected. Hive activity is normal.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1E262B]">
              <div className="text-[10px] text-[#828E96]">Predicted Honey Production</div>
              <div className="text-xl font-bold text-white mt-1">18 kg</div>
              <div className="text-[10px] text-[#34D399] flex items-center gap-0.5 mt-0.5"><ArrowUpRight size={12} /> +12% from last month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* My Hives (previously missing — sidebar linked to it from every page but it didn't exist) */
function HivesPage({ go }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <Sidebar page="hives" go={go} />
      <div className="md:col-span-9 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">My Hives</h2>
          <p className="text-[11px] text-[#828E96]">All registered hives across your locations.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hives.map((h) => (
            <div key={h.id} className="bg-[#12171A] p-4 rounded-xl border border-[#232B30]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">{h.id}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${h.status === "Healthy" ? "bg-[#182820] text-[#34D399]" : "bg-[#2B1F14] text-[#F59E0B]"}`}>{h.status}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-[#828E96]"><MapPin size={10} /> {h.location}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div><div className="text-white">{h.temp}°C</div><div className="text-[9px] text-[#828E96]">Temp</div></div>
                <div><div className="text-white">{h.humidity}%</div><div className="text-[9px] text-[#828E96]">Humidity</div></div>
                <div><div className="text-white">{h.weight} kg</div><div className="text-[9px] text-[#828E96]">Weight</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Analytics (linked from sidebar but previously undefined) */
function AnalyticsPage({ go }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <Sidebar page="analytics" go={go} />
      <div className="md:col-span-9 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Analytics</h2>
          <p className="text-[11px] text-[#828E96]">Production and environmental trends across your hives.</p>
        </div>
        <div className="bg-[#12171A] p-4 rounded-xl border border-[#232B30]">
          <h3 className="text-xs font-semibold text-white mb-3">Temperature &amp; Humidity · Last 7 days</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={environmentalTrends}>
                <CartesianGrid stroke="#1E262B" vertical={false} />
                <XAxis dataKey="date" stroke="#828E96" tick={{ fontSize: 10 }} axisLine={false} />
                <YAxis yAxisId="temp" stroke="#FBBF24" tick={{ fontSize: 10 }} axisLine={false} domain={[20, 45]} />
                <YAxis yAxisId="humidity" orientation="right" stroke="#38BDF8" tick={{ fontSize: 10 }} axisLine={false} domain={[40, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#FBBF24" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Alerts (linked from sidebar but previously undefined) */
function AlertsPage({ go }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <Sidebar page="alerts" go={go} />
      <div className="md:col-span-9 space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Alerts</h2>
          <p className="text-[11px] text-[#828E96]">AI-generated notifications from your hives.</p>
        </div>
        {alerts.map((a, i) => (
          <div key={i} className="bg-[#12171A] p-3.5 rounded-xl border border-[#232B30] flex items-start gap-3">
            {a.warn ? <AlertTriangle size={16} className="text-[#F87171] mt-0.5" /> : <CheckCircle2 size={16} className="text-[#34D399] mt-0.5" />}
            <div>
              <div className="text-xs font-medium text-white">{a.title}</div>
              <p className="text-[11px] text-[#828E96] mt-0.5">{a.desc}</p>
              <span className="text-[10px] text-[#FBBF24]">{a.hive}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Profile (linked from sidebar but previously undefined) */
function ProfilePage({ go }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <Sidebar page="profile" go={go} />
      <div className="md:col-span-9">
        <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
        <div className="bg-[#12171A] p-4 rounded-xl border border-[#232B30] max-w-sm space-y-2 text-xs">
          {[["Name", "Rahul Kumar"], ["Email", "rahul.kumar@honeychain.in"], ["Hives Registered", "3"], ["Member Since", "March 2025"]].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-[#1E262B] pb-2">
              <span className="text-[#828E96]">{k}</span><span className="text-white">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3. Create Batch Form */
function CreateBatch({ go }) {
  const [created, setCreated] = useState(false);
  const [showQR, setShowQR] = useState(false);
  // Previously these were uncontrolled `defaultValue` inputs, so anything
  // typed was thrown away and the result card always showed the seed data.
  const [form, setForm] = useState({
    hiveId: "HIVE-001",
    name: "Rahul Kumar",
    location: "Uttarakhand, India",
    date: "02-09-2026",
    qty: "18",
    type: "Multiflora",
    notes: "Collected from natural forest region",
  });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <Sidebar page="createBatch" go={go} />

      <div className="md:col-span-9 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Register New Honey Batch</h2>
          <p className="text-[11px] text-[#828E96]">Record your harvest and make it traceable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="bg-[#12171A] p-4 rounded-xl border border-[#232B30] space-y-3">
            <div>
              <label className="text-[10px] text-[#828E96] block mb-1">Hive ID</label>
              <input value={form.hiveId} onChange={update("hiveId")} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
            </div>
            <div>
              <label className="text-[10px] text-[#828E96] block mb-1">Beekeeper Name</label>
              <input value={form.name} onChange={update("name")} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
            </div>
            <div>
              <label className="text-[10px] text-[#828E96] block mb-1">Location</label>
              <input value={form.location} onChange={update("location")} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#828E96] block mb-1">Harvest Date</label>
                <input value={form.date} onChange={update("date")} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
              </div>
              <div>
                <label className="text-[10px] text-[#828E96] block mb-1">Quantity (kg)</label>
                <input value={form.qty} onChange={update("qty")} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#828E96] block mb-1">Honey Type</label>
              <input value={form.type} onChange={update("type")} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
            </div>
            <div>
              <label className="text-[10px] text-[#828E96] block mb-1">Additional Notes (optional)</label>
              <textarea value={form.notes} onChange={update("notes")} rows={2} className="w-full bg-[#0B0E11] border border-[#232B30] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#FBBF24]" />
            </div>
            <button onClick={() => setCreated(true)} className="w-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0B0E11] font-semibold text-xs py-2 rounded-lg mt-2">
              Create Secure Batch
            </button>
          </div>

          <div className="bg-[#12171A] p-5 rounded-xl border border-[#232B30] text-center flex flex-col items-center justify-center min-h-[340px]">
            {created ? (
              <>
                <div className="h-10 w-10 rounded-full bg-[#182820] text-[#34D399] flex items-center justify-center mb-2">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-sm font-semibold text-white">Batch Created Successfully!</h3>
                <div className="w-full text-left bg-[#0B0E11] p-3 rounded-lg border border-[#232B30] my-4 space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-[#828E96]">Batch ID</span><span className="text-white font-mono">HC2026-001</span></div>
                  <div className="flex justify-between"><span className="text-[#828E96]">Hive ID</span><span className="text-white">{form.hiveId}</span></div>
                  <div className="flex justify-between"><span className="text-[#828E96]">Location</span><span className="text-white">{form.location}</span></div>
                  <div className="flex justify-between"><span className="text-[#828E96]">Harvest Date</span><span className="text-white">{form.date}</span></div>
                  <div className="flex justify-between"><span className="text-[#828E96]">Quantity</span><span className="text-white">{form.qty} kg</span></div>
                </div>
                <div className="flex gap-2 w-full">
                  <button onClick={() => go("blockchain")} className="flex-1 bg-transparent border border-[#37434B] hover:bg-[#1E262B] text-white text-[11px] py-1.5 rounded-lg">View on Blockchain</button>
                  <button onClick={() => setShowQR(true)} className="flex-1 bg-transparent border border-[#37434B] hover:bg-[#1E262B] text-white text-[11px] py-1.5 rounded-lg">Generate QR Code</button>
                </div>
              </>
            ) : (
              <div className="text-[#828E96] text-xs">Fill the form to generate a verified batch record.</div>
            )}
          </div>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6" onClick={() => setShowQR(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xs rounded-2xl border border-[#232B30] bg-[#12171A] p-6 text-center">
            <QrCode size={120} className="mx-auto mb-3 text-white" strokeWidth={1} />
            <div className="text-sm text-white">Batch HC2026-001</div>
            <div className="mt-1 text-xs text-[#828E96]">Scan to verify authenticity</div>
            <button onClick={() => setShowQR(false)} className="mt-4 w-full rounded-lg border border-[#37434B] py-2 text-xs text-[#828E96]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 4. Blockchain Traceability */
function BlockchainTraceability({ go }) {
  return (
    <div className="bg-[#0B0E11] p-4 md:p-6 rounded-xl border border-[#1E262B]">
      <button onClick={() => go("createBatch")} className="mb-3 text-[10px] text-[#828E96] hover:text-white">← Back to Batches</button>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Batch Journey</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-white font-mono">HC2026-001</span>
          <span className="bg-[#182820] text-[#34D399] text-[10px] px-2 py-0.5 rounded-full font-medium">Verified</span>
        </div>
        <p className="text-[10px] text-[#828E96] mt-0.5">All records are immutable and tamper-proof.</p>
      </div>
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#232B30]">
        {batchStages.map((stage) => (
          <div key={stage.num} className="relative flex items-start gap-3">
            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-[#182820] border border-[#34D399] text-[#34D399] font-bold text-[10px] flex items-center justify-center">
              {stage.num}
            </div>
            <div className="flex-1 bg-[#12171A] p-3 rounded-lg border border-[#232B30] flex justify-between items-start">
              <div>
                <h4 className="text-xs font-semibold text-white">{stage.num}. {stage.title}</h4>
                <p className="text-[10px] text-[#828E96] whitespace-pre-line mt-1">{stage.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-[#828E96] bg-[#0B0E11] px-1.5 py-0.5 rounded border border-[#232B30]">{stage.hash}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 5. Consumer View (QR Scan) */
function ConsumerView() {
  return (
    <div className="max-w-md mx-auto bg-[#FFFBF0] text-[#1A2024] p-5 rounded-xl border border-[#E2E8F0] shadow-xl">
      <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0] mb-4">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#0B0E11]"><span className="text-[#FBBF24]">🐝</span> HoneyChain</div>
        <Menu size={16} />
      </div>

      <div className="text-center">
        <div className="h-10 w-10 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 size={20} />
        </div>
        <h2 className="text-base font-bold text-[#0B0E11]">Authentic Honey</h2>
        <p className="text-[10px] text-[#64748B]">This product is verified on HoneyChain</p>

        {/* Was reusing the landing page's bee photo mislabeled as a honey
            jar. Replaced with an actual jar illustration. */}
        <div className="relative h-40 my-4 flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="h-full">
            <rect x="28" y="14" width="44" height="10" rx="3" fill="#8a7a5a" />
            <rect x="32" y="24" width="36" height="8" rx="2" fill="#6b5d43" />
            <path d="M22 34 h56 l-4 74 a8 8 0 0 1 -8 8 h-32 a8 8 0 0 1 -8 -8 z" fill="#F5B93D" stroke="#D97706" strokeWidth="1.5" />
            <rect x="26" y="50" width="48" height="30" fill="#fff6df" opacity="0.25" />
            <text x="50" y="70" textAnchor="middle" fontSize="10" fill="#4a3a12" fontFamily="serif">honey</text>
          </svg>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-left text-xs space-y-2 mb-4">
          <div className="flex items-center justify-between"><span className="text-[#64748B] text-[11px]">Batch ID</span><span className="font-semibold text-[#0B0E11]">HC2026-001</span></div>
          <div className="flex items-center justify-between"><span className="text-[#64748B] text-[11px]">Beekeeper</span><span className="font-semibold text-[#0B0E11]">Rahul Kumar</span></div>
          <div className="flex items-center justify-between"><span className="text-[#64748B] text-[11px]">Origin</span><span className="font-semibold text-[#0B0E11]">Uttarakhand, India</span></div>
          <div className="flex items-center justify-between"><span className="text-[#64748B] text-[11px]">Harvest Date</span><span className="font-semibold text-[#0B0E11]">02-09-2026</span></div>
          <div className="flex items-center justify-between"><span className="text-[#64748B] text-[11px]">Hive Health</span><span className="font-semibold text-[#10B981]">Healthy (87%)</span></div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B] text-[11px]">Blockchain Status</span>
            <span className="font-semibold text-[#10B981] flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>
          </div>
        </div>

        <div className="text-left mb-4">
          <h4 className="text-xs font-bold text-[#0B0E11] mb-2">Journey of this Honey</h4>
          <div className="flex justify-between items-center text-center">
            {["Hive", "Harvest", "Processing", "Packaging", "Retail"].map((step, idx) => (
              <div key={step} className="flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-[10px] font-bold mb-1">{idx + 1}</div>
                <span className="text-[9px] text-[#64748B]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[#059669] font-medium flex items-center justify-center gap-1">
          <Leaf size={12} /> Thank you for supporting ethical beekeeping!
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- MAIN SHELL ---------------------------------- */

export default function App() {
  const [page, setPage] = useState("landing");
  const go = (p) => setPage(p);

  return (
    <div className="min-h-screen bg-[#07090B] text-[#E1E7EC] p-4 md:p-8 font-sans">
      {page === "landing" && <LandingPage go={go} />}
      {page === "about" && <AboutPage go={go} />}
      {page === "dashboard" && <BeekeeperDashboard go={go} />}
      {page === "hives" && <HivesPage go={go} />}
      {page === "createBatch" && <CreateBatch go={go} />}
      {page === "blockchain" && <BlockchainTraceability go={go} />}
      {page === "analytics" && <AnalyticsPage go={go} />}
      {page === "alerts" && <AlertsPage go={go} />}
      {page === "profile" && <ProfilePage go={go} />}
      {page === "consumer" && <ConsumerView />}
    </div>
  );
}
