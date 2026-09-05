import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Droplets,
  HeartPulse,
  Hexagon,
  Leaf,
  LineChart as LineChartIcon,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  Package,
  PackageCheck,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
  Sprout,
  Thermometer,
  TrendingUp,
  UserCircle2,
  Weight,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Route, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();

type PageKey = 'dashboard' | 'hives' | 'batches' | 'analytics' | 'alerts' | 'profile';

const trendData = [
  { date: '06 Sep', temp: 31, humidity: 62 },
  { date: '07 Sep', temp: 35, humidity: 68 },
  { date: '08 Sep', temp: 33, humidity: 60 },
  { date: '09 Sep', temp: 32, humidity: 71 },
  { date: '10 Sep', temp: 35, humidity: 64 },
  { date: '11 Sep', temp: 38, humidity: 70 },
  { date: '12 Sep', temp: 36, humidity: 67 },
];

const hives = [
  { id: 'HIVE-001', status: 'Healthy', temp: 32, humidity: 65, weight: 24, location: 'Uttarakhand', health: 92 },
  { id: 'HIVE-002', status: 'Attention needed', temp: 38, humidity: 72, weight: 19, location: 'Uttarakhand', health: 74 },
  { id: 'HIVE-003', status: 'Healthy', temp: 31, humidity: 63, weight: 27, location: 'Himachal Pradesh', health: 89 },
];

const batchStages = [
  { num: '01', title: 'Hive registered', desc: 'Origin recorded at HIVE-001 · Uttarakhand, India', time: '02 Sep 2026 · 10:00 AM', hash: '8f92a3…' },
  { num: '02', title: 'Harvest collected', desc: '18 kg of Multiflora honey collected', time: '02 Sep 2026 · 02:30 PM', hash: '3ac41e…' },
  { num: '03', title: 'Extraction complete', desc: 'Processed at certified local unit', time: '03 Sep 2026 · 11:20 AM', hash: '7bd921…' },
  { num: '04', title: 'Packaging sealed', desc: 'Jar group checked and sealed for dispatch', time: '04 Sep 2026 · 09:15 AM', hash: '92bd81…' },
  { num: '05', title: 'Retail ready', desc: 'Batch cleared for your kitchen shelf', time: '05 Sep 2026 · 01:00 PM', hash: 'ef13c9…' },
];

const alerts = [
  { title: 'High temperature detected', hive: 'HIVE-002', desc: 'Temperature reached 38°C, above the 35°C safe threshold.', warning: true, time: '18 min ago' },
  { title: 'Harvest ready', hive: 'HIVE-001', desc: 'AI model estimates this hive is ready for harvest within 5 days.', warning: false, time: 'Yesterday' },
];

const navItems: Array<{ key: PageKey; label: string; path: string; icon: LucideIcon }> = [];
navItems.push(
  { key: 'dashboard', label: 'Overview', path: '/dashboard', icon: Activity },
  { key: 'hives', label: 'My hives', path: '/hives', icon: Boxes },
  { key: 'batches', label: 'Batches', path: '/batches', icon: Package },
  { key: 'analytics', label: 'Analytics', path: '/analytics', icon: LineChartIcon },
  { key: 'alerts', label: 'Alerts', path: '/alerts', icon: Bell },
  { key: 'profile', label: 'Profile', path: '/profile', icon: UserCircle2 },
);

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-base font-extrabold tracking-[-.04em] ${dark ? 'text-[#f8f4e9]' : 'text-[#1e352b]'}`}>
      <span className={`relative grid h-7 w-7 place-items-center rounded-[9px] ${dark ? 'bg-[#e6a51a] text-[#17352a]' : 'bg-[#e0a11c] text-[#17352a]'}`}>
        <Hexagon size={17} strokeWidth={2.7} />
        <CircleDot size={5} className="absolute" fill="currentColor" />
      </span>
      HoneyChain
    </span>
  );
}

function Pill({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'green' | 'red' | 'slate' }) {
  const styles = {
    gold: 'bg-[#fff2c8] text-[#94600d] border-[#f0d88f]',
    green: 'bg-[#dcefe2] text-[#28734d] border-[#b7d8c1]',
    red: 'bg-[#f8dfd9] text-[#a4483b] border-[#edbdb3]',
    slate: 'bg-[#e9ece4] text-[#52645b] border-[#d5dbd0]',
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${styles[tone]}`}>{children}</span>;
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; value?: number }>; label?: string | number }) {
  if (!active || !payload?.length) return null;
  const temp = payload.find((item) => item.dataKey === 'temp')?.value;
  const humidity = payload.find((item) => item.dataKey === 'humidity')?.value;
  return (
    <div className="rounded-xl border border-[#315646] bg-[#17362b] px-3 py-2 text-[11px] text-[#f8f4e9] shadow-xl">
      <p className="mb-1 font-bold">{label}</p>
      <p className="text-[#e4ad28]">Temperature: {temp}°C</p>
      <p className="text-[#80c3d1]">Humidity: {humidity}%</p>
    </div>
  );
}

function LandingPage() {
  const [, setLocation] = useLocation();
  return (
    <main className="hc-reveal min-h-[100dvh] overflow-hidden bg-[#f4f1e8]">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <button data-testid="button-brand-home" onClick={() => setLocation('/')}><BrandMark /></button>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#62746a] md:flex">
          <button data-testid="link-home" className="text-[#1e352b]" onClick={() => setLocation('/')}>Home</button>
          <button data-testid="link-about" className="transition-colors hover:text-[#1e352b]" onClick={() => setLocation('/about')}>About</button>
          <button data-testid="link-verify" className="transition-colors hover:text-[#1e352b]" onClick={() => setLocation('/verify')}>Track honey</button>
          <button data-testid="link-beekeeper" className="transition-colors hover:text-[#1e352b]" onClick={() => setLocation('/dashboard')}>For beekeepers</button>
        </nav>
        <button data-testid="button-login" onClick={() => setLocation('/dashboard')} className="hc-button rounded-full bg-[#1e352b] px-5 py-2.5 text-xs font-bold text-[#f6f1e3] shadow-sm hover:bg-[#2c5946]">Sign in</button>
      </header>

      <section className="hc-grid relative mx-auto grid max-w-[1240px] overflow-hidden rounded-[28px] border border-[#d9d7c9] bg-[#eceadd] px-6 pb-14 pt-10 md:min-h-[600px] md:grid-cols-[1.05fr_.95fr] md:px-14 md:pb-12 md:pt-16">
        <div className="relative z-10 max-w-[590px] self-center">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.18em] text-[#a66c13]">
            <span className="h-px w-9 bg-[#d89d22]" /> Trace what matters
          </div>
          <h1 className="hc-hero-title font-display text-[clamp(4.8rem,9vw,8.5rem)] font-extrabold leading-[.84] tracking-[-.085em] text-[#1e352b]">
            From hive<br /><span className="text-[#cd8f15]">to home.</span>
          </h1>
          <p className="mt-7 max-w-[430px] text-base leading-7 text-[#52645b] md:text-lg">
            HoneyChain gives every jar a memory — the living hive, the hands that cared for it, and a record you can trust.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button data-testid="button-track-honey" onClick={() => setLocation('/verify')} className="hc-button inline-flex items-center gap-2 rounded-full bg-[#d99b1a] px-6 py-3.5 text-sm font-bold text-[#17352a] hover:bg-[#e7ad2d]">Track a jar <ArrowRight size={16} /></button>
            <button data-testid="button-beekeeper-login" onClick={() => setLocation('/dashboard')} className="hc-button rounded-full border border-[#bfc7b9] bg-[#f7f4ea] px-6 py-3.5 text-sm font-bold text-[#1e352b] hover:border-[#819287]">Beekeeper workspace</button>
          </div>
          <div className="mt-12 flex gap-9 border-t border-[#d1d2c4] pt-5">
            <Stat number="100+" label="beekeepers" />
            <Stat number="500+" label="verified batches" />
            <Stat number="100%" label="traceable" />
          </div>
        </div>
        <div className="relative mt-12 min-h-[360px] md:mt-0">
          <div className="absolute right-[9%] top-[10%] h-52 w-52 rounded-full border border-[#d8b758]/40 bg-[#ddb43f]/10 md:h-72 md:w-72" />
          <div className="absolute right-[16%] top-[20%] h-36 w-36 rounded-full border border-[#d8b758]/50 bg-[#d8a827]/15 md:h-48 md:w-48" />
          <div className="absolute right-[22%] top-[28%] h-24 w-24 rounded-full bg-[#d69a20] shadow-[0_20px_50px_rgba(183,125,18,.25)] md:h-32 md:w-32" />
          <div className="absolute right-[24%] top-[30%] grid h-20 w-20 place-items-center rounded-full border-4 border-[#f2d36a] bg-[#e5a622] md:h-28 md:w-28">
            <Hexagon size={58} className="text-[#1c4331]" strokeWidth={1.3} />
          </div>
          <div className="absolute bottom-[13%] left-[6%] flex items-center gap-3 rounded-2xl border border-[#d8d5c2] bg-[#f8f5ec]/90 px-4 py-3 shadow-lg backdrop-blur-sm">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#deeedf] text-[#2a7a51]"><ShieldCheck size={18} /></span>
            <span><strong className="block text-xs text-[#1e352b]">Verified at source</strong><small className="text-[10px] text-[#738077]">Immutable batch record</small></span>
          </div>
          <div className="absolute right-[3%] top-[8%] rounded-2xl border border-[#d8d5c2] bg-[#f8f5ec]/90 px-4 py-3 shadow-lg backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#a66c13]"><Activity size={12} /> Hive signal</div>
            <strong className="font-display text-2xl text-[#1e352b]">87%</strong><span className="ml-1 text-[10px] text-[#60756a]">healthy</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-5 px-5 py-16 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ae7416]">One honest chain</p>
          <h2 className="mt-3 max-w-sm font-display text-4xl font-extrabold leading-[.95] tracking-[-.05em] text-[#1e352b] md:text-5xl">A little more care in every handoff.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature icon={<Sprout size={18} />} title="Living origin" text="Sensors capture the conditions behind every harvest." />
          <Feature icon={<LockKeyhole size={18} />} title="Locked record" text="A tamper-evident journey follows the batch forward." />
          <Feature icon={<ScanLine size={18} />} title="Open proof" text="Scan one jar and see the people behind it." />
        </div>
      </section>
      <footer className="mx-auto flex max-w-[1240px] items-center justify-between border-t border-[#d8d7ca] px-5 py-6 text-xs text-[#758078] md:px-10">
        <BrandMark /><span>Field notes for a sweeter future · 2026</span>
      </footer>
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return <div><div className="font-display text-2xl font-extrabold text-[#1e352b]">{number}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#7b877e]">{label}</div></div>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="hc-card rounded-2xl p-5"><span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-[#e8f0e2] text-[#2f7550]">{icon}</span><h3 className="font-bold text-[#1e352b]">{title}</h3><p className="mt-2 text-sm leading-5 text-[#718078]">{text}</p></div>;
}

function AboutPage() {
  const [, setLocation] = useLocation();
  return (
    <main className="hc-reveal min-h-[100dvh] bg-[#f4f1e8]">
      <header className="mx-auto flex max-w-[1080px] items-center justify-between px-5 py-6 md:px-10"><button data-testid="button-about-brand" onClick={() => setLocation('/')}><BrandMark /></button><button data-testid="button-about-back" onClick={() => setLocation('/')} className="text-sm font-bold text-[#60756a] hover:text-[#1e352b]">Back home <ArrowRight className="ml-1 inline" size={14} /></button></header>
      <div className="mx-auto max-w-[1080px] px-5 pb-20 md:px-10">
        <div className="border-b border-[#d8d7ca] pb-14 pt-14 md:pt-20"><p className="text-xs font-bold uppercase tracking-[.17em] text-[#ad7417]">Why HoneyChain</p><h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[.92] tracking-[-.06em] text-[#1e352b] md:text-7xl">Trust should travel<br /><span className="text-[#cd8f15]">with the honey.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#62746a]">HoneyChain connects beekeepers, processors, and consumers through one clear record — from the first wingbeat at the hive to the first spoonful at home.</p></div>
        <div className="grid gap-5 py-14 md:grid-cols-3"><AboutCard index="01" title="Listen to the hive" text="Temperature, humidity, and colony signals give beekeepers a clearer view of the work happening inside each box." /><AboutCard index="02" title="Respect the handoff" text="Harvest and processing records are added as a batch moves through the people who make it possible." /><AboutCard index="03" title="Let people look closer" text="A simple scan turns an opaque label into a living story — with a source, a date, and proof." /></div>
        <div className="grid items-center gap-8 rounded-[28px] bg-[#1e352b] p-7 text-[#f8f4e9] md:grid-cols-[1fr_.8fr] md:p-12"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-[#dfaa2c]">The promise</p><h2 className="mt-4 max-w-lg font-display text-4xl font-extrabold leading-[.95] tracking-[-.05em] md:text-5xl">Make every jar feel close to its source.</h2></div><div className="border-l border-[#456653] pl-6 text-sm leading-7 text-[#bfd0c1]">Not more noise. Just better context, captured at the right moments and shared with the people who care.</div></div>
      </div>
    </main>
  );
}

function AboutCard({ index, title, text }: { index: string; title: string; text: string }) {
  return <article className="border-t-2 border-[#d69a20] pt-4"><span className="font-mono-app text-xs text-[#ad7417]">{index}</span><h2 className="mt-10 font-display text-2xl font-extrabold tracking-[-.04em] text-[#1e352b]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#718078]">{text}</p></article>;
}

function Sidebar({ page }: { page: PageKey }) {
  const [, setLocation] = useLocation();
  return (
    <aside className="hc-sidebar sticky top-5 flex h-fit flex-col justify-between rounded-[22px] bg-[#19382d] p-4 text-[#dce9dc] shadow-xl md:min-h-[calc(100dvh-40px)]">
      <div>
        <button data-testid="button-sidebar-home" onClick={() => setLocation('/')} className="mb-9 px-2"><BrandMark dark /></button>
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#789583]">Workspace</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return <button data-testid={`nav-${item.key}`} key={item.key} onClick={() => setLocation(item.path)} className={`hc-button flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${active ? 'bg-[#e1a523] text-[#17352a]' : 'text-[#a9c0ad] hover:bg-[#27503e] hover:text-[#f6f1e3]'}`}><Icon size={17} strokeWidth={active ? 2.5 : 1.8} /><span>{item.label}</span>{item.key === 'alerts' && <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#c76b4e] px-1 text-[10px] text-white">2</span>}</button>;
          })}
        </nav>
      </div>
      <div className="mt-8 border-t border-[#345843] pt-4"><button data-testid="button-sidebar-logout" onClick={() => setLocation('/')} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-[#a9c0ad] hover:text-white"><LogOut size={17} /> Sign out</button></div>
    </aside>
  );
}

function DashboardShell({ page, title, subtitle, children }: { page: PageKey; title: string; subtitle: string; children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  return (
    <main className="hc-app hc-noise min-h-[100dvh] p-3 md:p-5">
      <div className="mx-auto grid max-w-[1450px] gap-5 md:grid-cols-[220px_1fr]">
        <Sidebar page={page} />
        <section className="min-w-0 px-1 pb-8 md:px-4">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#d8d7ca] pb-5">
            <div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a97418]"><button data-testid="button-breadcrumb-home" onClick={() => setLocation('/')} className="hover:text-[#1e352b]">HoneyChain</button><ChevronRight size={12} /><span>Workspace</span></div><h1 data-testid={`heading-${page}`} className="font-display text-3xl font-extrabold tracking-[-.055em] text-[#1e352b] md:text-4xl">{title}</h1><p className="mt-1 text-sm text-[#718078]">{subtitle}</p></div>
            <div className="hidden items-center gap-3 sm:flex"><div className="text-right"><div className="text-xs font-bold text-[#1e352b]">Rahul Kumar</div><div className="text-[10px] text-[#7a877f]">Uttarakhand, India</div></div><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#dfeddc] text-xs font-extrabold text-[#2c704c]">RK</div></div>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}

function DashboardPage() {
  return <DashboardShell page="dashboard" title="Good morning, Rahul." subtitle="Keep your hives healthy, keep the world sweeter."><div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={<Thermometer size={19} />} label="Temperature" value="32°C" status="Normal" tone="gold" /><Metric icon={<Droplets size={19} />} label="Humidity" value="65%" status="Normal" tone="blue" /><Metric icon={<Weight size={19} />} label="Hive weight" value="24 kg" status="+2 kg this week" tone="green" /><Metric icon={<HeartPulse size={19} />} label="Colony health" value="87%" status="Healthy" tone="green" /></div>
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><TrendPanel /><InsightPanel /></div>
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><RecentBatch /><QuickActions /></div>
  </div></DashboardShell>;
}

function Metric({ icon, label, value, status, tone }: { icon: React.ReactNode; label: string; value: string; status: string; tone: 'gold' | 'blue' | 'green' }) {
  const tones = { gold: 'bg-[#fff1c6] text-[#a86b12]', blue: 'bg-[#e1f1f2] text-[#387c88]', green: 'bg-[#deefdf] text-[#2e7950]' };
  return <div data-testid={`metric-${label.toLowerCase().replace(' ', '-')}`} className="hc-card flex items-center gap-3 rounded-2xl p-4"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>{icon}</span><span><span className="block text-[11px] font-bold uppercase tracking-[.08em] text-[#7b877f]">{label}</span><strong className="mt-0.5 block font-display text-2xl tracking-[-.04em] text-[#1e352b]">{value}</strong><small className="text-[10px] font-bold text-[#348155]">{status}</small></span></div>;
}

function TrendPanel() {
  return <section className="hc-card rounded-2xl p-5 md:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-lg font-extrabold tracking-[-.03em] text-[#1e352b]">Environmental trends</h2><p className="mt-1 text-xs text-[#7b877f]">Your most active hive · last 7 days</p></div><select data-testid="select-trend-range" className="rounded-lg border border-[#d8d7ca] bg-[#f8f6ed] px-2 py-2 text-[11px] font-bold text-[#62746a] outline-none"><option>Last 7 days</option><option>Last 30 days</option></select></div><div className="h-[245px] w-full"><ResponsiveContainer width="100%" height="100%"><RechartsLineChart data={trendData} margin={{ left: -20, right: 4, top: 8, bottom: 0 }}><CartesianGrid stroke="#e2e1d7" vertical={false} /><XAxis dataKey="date" stroke="#839088" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis yAxisId="temp" stroke="#c88716" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[20, 45]} /><YAxis yAxisId="humidity" orientation="right" stroke="#4b929d" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[40, 100]} /><Tooltip content={<TrendTooltip />} /><Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#d3981e" strokeWidth={2.5} dot={{ r: 3.5, fill: '#d3981e', strokeWidth: 2, stroke: '#fffaf0' }} /><Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#4e969f" strokeWidth={2.5} dot={{ r: 3.5, fill: '#4e969f', strokeWidth: 2, stroke: '#fffaf0' }} /></RechartsLineChart></ResponsiveContainer></div><div className="mt-1 flex gap-5 text-[10px] font-bold text-[#6f7f75]"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#d3981e]" />Temperature</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#4e969f]" />Humidity</span></div></section>;
}

function InsightPanel() {
  return <section className="hc-card-dark flex min-h-[330px] flex-col justify-between rounded-2xl p-6 text-[#f7f3e8]"><div><div className="flex items-center justify-between"><h2 className="font-display text-lg font-extrabold tracking-[-.03em]">Field note</h2><Pill tone="green">Healthy</Pill></div><p className="mt-5 max-w-xs text-sm leading-6 text-[#b9cdbb]">No signs of disease detected. HIVE-001 activity is steady and the forage window looks promising.</p><div className="mt-6 flex items-end gap-2"><span className="font-display text-5xl font-extrabold tracking-[-.07em] text-[#e5a926]">18</span><span className="pb-2 text-sm text-[#b9cdbb]">kg predicted<br />next harvest</span></div></div><div className="border-t border-[#3b604c] pt-4"><div className="flex items-center gap-2 text-xs font-bold text-[#a9c0ad]"><TrendingUp size={15} className="text-[#e1a523]" /> +12% from last month</div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#315644]"><div className="h-full w-[71%] rounded-full bg-[#dfaa2d]" /></div></div></section>;
}

function RecentBatch() {
  const [, setLocation] = useLocation();
  return <section className="hc-card rounded-2xl p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-lg font-extrabold text-[#1e352b]">Recent batch</h2><p className="mt-1 text-xs text-[#7b877f]">Your latest record in the chain</p></div><button data-testid="button-view-batch" onClick={() => setLocation('/blockchain')} className="text-xs font-bold text-[#a76e14] hover:text-[#1e352b]">View journey <ArrowUpRight className="ml-1 inline" size={13} /></button></div><div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#dedaca] bg-[#faf8ef] p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0c1] text-[#ae7417]"><PackageCheck size={21} /></span><span className="min-w-[120px] flex-1"><strong data-testid="text-recent-batch-id" className="font-mono-app text-sm text-[#1e352b]">HC2026-001</strong><small className="mt-1 block text-xs text-[#7b877f]">Multiflora · HIVE-001 · 18 kg</small></span><Pill tone="green">Verified</Pill><span className="text-right text-[10px] text-[#7b877f]"><span className="block font-bold text-[#1e352b]">05 Sep 2026</span>Last updated</span></div></section>;
}

function QuickActions() {
  const [, setLocation] = useLocation();
  return <section className="grid gap-3 sm:grid-cols-2"><button data-testid="button-quick-batch" onClick={() => setLocation('/batches')} className="hc-button flex min-h-[155px] flex-col justify-between rounded-2xl bg-[#dfa21f] p-5 text-left text-[#17352a] hover:bg-[#e9b236]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4cd69]"><Package size={18} /></span><span><strong className="block font-display text-xl font-extrabold tracking-[-.04em]">Register a batch</strong><small className="mt-1 block text-xs text-[#5b481d]">Turn your next harvest into a story.</small></span></button><button data-testid="button-quick-hives" onClick={() => setLocation('/hives')} className="hc-button flex min-h-[155px] flex-col justify-between rounded-2xl border border-[#cbd1c6] bg-[#e7eee2] p-5 text-left text-[#1e352b] hover:border-[#91a590]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c7ddc8] text-[#2e7950]"><Boxes size={18} /></span><span><strong className="block font-display text-xl font-extrabold tracking-[-.04em]">Check your hives</strong><small className="mt-1 block text-xs text-[#63766b]">Three colonies are in the field.</small></span></button></section>;
}

function HivesPage() {
  return <DashboardShell page="hives" title="My hives" subtitle="A clear view of the colonies in your care."><div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><Pill tone="green">2 healthy</Pill><Pill tone="gold">1 needs attention</Pill></div><span className="text-xs text-[#7b877f]">Last sync · 12 Sep 2026, 10:24 AM</span></div><div className="grid gap-4 lg:grid-cols-3">{hives.map((hive, index) => <HiveCard key={hive.id} hive={hive} index={index} />)}</div><div className="hc-card rounded-2xl p-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e7eee2] text-[#2f7550]"><MapPin size={17} /></span><div><h2 className="font-display font-extrabold text-[#1e352b]">Two field locations</h2><p className="text-xs text-[#7b877f]">Uttarakhand · 2 hives &nbsp; / &nbsp; Himachal Pradesh · 1 hive</p></div></div></div></div></DashboardShell>;
}

function HiveCard({ hive, index }: { hive: typeof hives[number]; index: number }) {
  const [, setLocation] = useLocation();
  const healthy = hive.status === 'Healthy';
  return <article data-testid={`card-hive-${hive.id}`} className={`hc-card hc-reveal rounded-2xl p-5 ${index ? '' : 'ring-1 ring-[#dfa21f]/40'}`} style={{ animationDelay: `${index * 80}ms` }}><div className="flex items-start justify-between"><div><div className="font-mono-app text-xs font-medium text-[#a66c13]">{hive.id}</div><h2 className="mt-1 font-display text-xl font-extrabold tracking-[-.04em] text-[#1e352b]">{hive.location}</h2></div><Pill tone={healthy ? 'green' : 'red'}>{healthy ? 'Healthy' : 'Attention'}</Pill></div><div className="mt-6 grid grid-cols-3 divide-x divide-[#dedaca] rounded-xl border border-[#dedaca] bg-[#faf8ef] py-3 text-center"><div><strong className="block text-sm text-[#1e352b]">{hive.temp}°C</strong><span className="text-[10px] text-[#7b877f]">Temp</span></div><div><strong className="block text-sm text-[#1e352b]">{hive.humidity}%</strong><span className="text-[10px] text-[#7b877f]">Humidity</span></div><div><strong className="block text-sm text-[#1e352b]">{hive.weight} kg</strong><span className="text-[10px] text-[#7b877f]">Weight</span></div></div><div className="mt-5 flex items-center justify-between"><span className="flex items-center gap-1.5 text-xs font-bold text-[#2e7950]"><Activity size={13} /> {hive.health}% colony health</span><button data-testid={`button-hive-${hive.id}`} onClick={() => setLocation('/analytics')} className="text-xs font-bold text-[#a66c13] hover:text-[#1e352b]">Inspect <ArrowRight className="ml-1 inline" size={13} /></button></div></article>;
}

function BatchesPage() {
  const [created, setCreated] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ hiveId: 'HIVE-001', name: 'Rahul Kumar', location: 'Uttarakhand, India', date: '02-09-2026', qty: '18', type: 'Multiflora', notes: 'Collected from natural forest region' });
  const [, setLocation] = useLocation();
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = () => { setIsSaving(true); window.setTimeout(() => { setCreated(true); setIsSaving(false); }, 650); };
  return <DashboardShell page="batches" title="Batches" subtitle="Record a harvest and give it a verifiable life beyond the hive."><div className="grid gap-5 xl:grid-cols-[.92fr_1.08fr]"><section className="hc-card rounded-2xl p-5 md:p-6"><div className="mb-6 flex items-start justify-between"><div><h2 className="font-display text-xl font-extrabold tracking-[-.04em] text-[#1e352b]">Register new harvest</h2><p className="mt-1 text-xs text-[#7b877f]">Every field becomes part of the batch record.</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0c1] text-[#a66c13]"><Package size={18} /></span></div><div className="space-y-4"><Field label="Hive ID" value={form.hiveId} onChange={update('hiveId')} testId="input-hive-id" /><Field label="Beekeeper name" value={form.name} onChange={update('name')} testId="input-beekeeper-name" /><Field label="Location" value={form.location} onChange={update('location')} testId="input-location" /><div className="grid grid-cols-2 gap-3"><Field label="Harvest date" value={form.date} onChange={update('date')} testId="input-harvest-date" /><Field label="Quantity (kg)" value={form.qty} onChange={update('qty')} testId="input-quantity" /></div><Field label="Honey type" value={form.type} onChange={update('type')} testId="input-honey-type" /><label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#64766b]">Additional notes <em className="font-normal not-italic text-[#9aa49c]">optional</em></span><textarea data-testid="input-notes" value={form.notes} onChange={update('notes')} rows={3} className="hc-input w-full resize-none rounded-xl border border-[#d8d7ca] bg-[#faf8ef] px-3.5 py-3 text-sm text-[#1e352b] placeholder:text-[#a5ada4]" /></label><button data-testid="button-create-batch" onClick={submit} disabled={isSaving} className="hc-button mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d99b1a] py-3.5 text-sm font-extrabold text-[#17352a] hover:bg-[#e8b232] disabled:cursor-wait disabled:opacity-70">{isSaving ? <><span className="h-4 w-4 animate-pulse rounded-full border-2 border-[#17352a] border-t-transparent" /> Securing record…</> : <><LockKeyhole size={16} /> Create secure batch</>}</button></div></section><BatchResult created={created} form={form} onBlockchain={() => setLocation('/blockchain')} onQR={() => setShowQR(true)} onCreate={submit} /></div>{showQR && <QRModal onClose={() => setShowQR(false)} />}</DashboardShell>;
}

function Field({ label, value, onChange, testId }: { label: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; testId: string }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#64766b]">{label}</span><input data-testid={testId} value={value} onChange={onChange} className="hc-input w-full rounded-xl border border-[#d8d7ca] bg-[#faf8ef] px-3.5 py-3 text-sm text-[#1e352b]" /></label>;
}

function BatchResult({ created, form, onBlockchain, onQR, onCreate }: { created: boolean; form: Record<string, string>; onBlockchain: () => void; onQR: () => void; onCreate: () => void }) {
  return <section className={`hc-card flex min-h-[540px] flex-col items-center justify-center rounded-2xl p-6 text-center ${created ? 'bg-[#f5f5e9]' : 'hc-grid'}`}>{created ? <div className="hc-reveal w-full max-w-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#dcefe2] text-[#2c7b50]"><CheckCircle2 size={28} /></span><h2 data-testid="status-batch-created" className="mt-4 font-display text-2xl font-extrabold tracking-[-.04em] text-[#1e352b]">Batch created successfully</h2><p className="mt-1 text-sm text-[#718078]">Your harvest is now part of a tamper-evident record.</p><div className="my-7 space-y-3 rounded-2xl border border-[#dedaca] bg-[#faf8ef] p-4 text-left text-xs"><SummaryRow label="Batch ID" value="HC2026-001" mono /><SummaryRow label="Hive ID" value={form.hiveId} /><SummaryRow label="Origin" value={form.location} /><SummaryRow label="Harvest date" value={form.date} /><SummaryRow label="Quantity" value={`${form.qty} kg`} /></div><div className="grid grid-cols-2 gap-3"><button data-testid="button-view-blockchain" onClick={onBlockchain} className="hc-button rounded-xl border border-[#bdc7bd] py-3 text-xs font-bold text-[#1e352b] hover:bg-[#e8eee4]">View journey</button><button data-testid="button-generate-qr" onClick={onQR} className="hc-button inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e352b] py-3 text-xs font-bold text-[#f8f4e9] hover:bg-[#2e604b]"><QrCode size={15} /> Generate QR</button></div></div> : <div className="max-w-xs"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7eee2] text-[#739079]"><PackageCheck size={27} /></span><h2 className="mt-5 font-display text-2xl font-extrabold tracking-[-.04em] text-[#1e352b]">Your next story starts here.</h2><p className="mt-3 text-sm leading-6 text-[#7b877f]">Fill in the harvest details to generate a verified batch record, then share it with every handoff.</p><button data-testid="button-result-create" onClick={onCreate} className="mt-6 text-xs font-bold text-[#a66c13] hover:text-[#1e352b]">Create the record <ArrowRight className="ml-1 inline" size={13} /></button></div>}</section>;
}

function SummaryRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="flex items-center justify-between gap-4 border-b border-[#e2e1d7] pb-2 last:border-0 last:pb-0"><span className="text-[#7b877f]">{label}</span><span className={`${mono ? 'font-mono-app' : ''} text-right font-bold text-[#1e352b]`}>{value}</span></div>;
}

function QRModal({ onClose }: { onClose: () => void }) {
  return <div data-testid="modal-qr" className="fixed inset-0 z-50 grid place-items-center bg-[#132a20]/65 px-5 backdrop-blur-sm" onClick={onClose}><div className="hc-reveal w-full max-w-sm rounded-[26px] bg-[#faf8ef] p-6 text-center shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.15em] text-[#a66c13]">Authenticity pass</span><button data-testid="button-close-qr" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-[#e8eee4] text-[#60756a] hover:text-[#1e352b]"><X size={16} /></button></div><div className="mx-auto grid h-48 w-48 place-items-center rounded-2xl border-8 border-[#1e352b] bg-[#f8f5e9] text-[#1e352b]"><QrCode size={142} strokeWidth={1.1} /></div><h2 className="mt-5 font-display text-xl font-extrabold text-[#1e352b]">HC2026-001</h2><p className="mt-1 text-xs text-[#7b877f]">Scan to verify this honey's journey.</p><button data-testid="button-modal-close" onClick={onClose} className="mt-5 w-full rounded-xl border border-[#bdc7bd] py-3 text-xs font-bold text-[#1e352b] hover:bg-[#e8eee4]">Done</button></div></div>;
}

function BlockchainPage() {
  const [, setLocation] = useLocation();
  return <main className="hc-app hc-noise min-h-[100dvh] p-3 md:p-5"><div className="mx-auto max-w-[1040px]"><button data-testid="button-back-batches" onClick={() => setLocation('/batches')} className="mb-6 flex items-center gap-2 text-xs font-bold text-[#718078] hover:text-[#1e352b]"><ArrowRight size={14} className="rotate-180" /> Back to batches</button><section className="hc-card rounded-[26px] p-5 md:p-9"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#dedaca] pb-7"><div><div className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a66c13]">Immutable record</div><h1 className="font-display text-3xl font-extrabold tracking-[-.05em] text-[#1e352b] md:text-4xl">Batch journey</h1><div className="mt-3 flex flex-wrap items-center gap-2"><span data-testid="text-blockchain-batch-id" className="font-mono-app text-sm font-bold text-[#1e352b]">HC2026-001</span><Pill tone="green">Verified</Pill></div><p className="mt-2 text-xs text-[#718078]">All records are immutable and tamper-evident.</p></div><div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#deefdf] text-[#2b7950]"><ShieldCheck size={31} /></div></div><div className="relative mt-8 space-y-4 before:absolute before:bottom-7 before:left-[21px] before:top-7 before:w-px before:bg-[#cbd7c9]">{batchStages.map((stage, index) => <div data-testid={`stage-${stage.num}`} key={stage.num} className="relative flex gap-4"><div className={`z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 ${index === batchStages.length - 1 ? 'border-[#dba127] bg-[#fff0c1] text-[#a66c13]' : 'border-[#65a47b] bg-[#e1f0e2] text-[#2e7950]'} font-mono-app text-xs font-bold`}>{stage.num}</div><div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3 rounded-2xl border border-[#dedaca] bg-[#faf8ef] p-4"><div><h2 className="font-bold text-[#1e352b]">{stage.title}</h2><p className="mt-1 text-xs text-[#718078]">{stage.desc}</p><p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#a66c13]"><Clock3 size={12} /> {stage.time}</p></div><span className="font-mono-app rounded-lg bg-[#eef0e8] px-2 py-1 text-[10px] text-[#718078]">{stage.hash}</span></div></div>)}</div></section></div></main>;
}

function ConsumerPage() {
  const [, setLocation] = useLocation();
  const [batchId, setBatchId] = useState('HC2026-001');
  const [verified, setVerified] = useState(true);
  return <main className="min-h-[100dvh] bg-[#1e352b] px-3 py-4 md:px-6 md:py-8"><div className="mx-auto max-w-[980px]"><header className="mb-4 flex items-center justify-between text-[#f7f3e8]"><button data-testid="button-consumer-brand" onClick={() => setLocation('/')}><BrandMark dark /></button><button data-testid="button-consumer-menu" onClick={() => setLocation('/about')} className="rounded-full border border-[#456653] p-2 hover:bg-[#2b5944]"><Menu size={17} /></button></header><div className="grid overflow-hidden rounded-[28px] bg-[#f8f5e9] md:grid-cols-[.8fr_1.2fr]"><section className="relative overflow-hidden bg-[#e8ebdc] p-7 md:p-10"><div className="absolute -right-20 -top-14 h-64 w-64 rounded-full border-[26px] border-[#e0ab28]/20" /><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a66c13]">Consumer verification</p><h1 className="mt-4 max-w-sm font-display text-5xl font-extrabold leading-[.88] tracking-[-.07em] text-[#1e352b] md:text-6xl">Know what’s in your <span className="text-[#cd8f15]">jar.</span></h1><p className="mt-5 max-w-xs text-sm leading-6 text-[#66766d]">Scan the code on your label or enter a batch ID to see the people, place, and path behind this honey.</p><div className="relative mx-auto mt-10 flex h-60 w-48 items-end justify-center"><div className="absolute bottom-3 h-44 w-32 rounded-[20px_20px_27px_27px] border-2 border-[#c78213] bg-[#e3a326] shadow-[12px_15px_0_rgba(154,102,14,.12)]"><div className="absolute left-[-5px] right-[-5px] top-[-16px] h-8 rounded-lg border-2 border-[#947348] bg-[#aa9066]" /><div className="absolute left-3 right-3 top-16 rounded-lg bg-[#ffedbd] px-2 py-3 text-center"><div className="font-display text-xl font-extrabold tracking-[-.05em] text-[#4f482e]">honey</div><div className="mt-1 text-[8px] font-bold uppercase tracking-[.18em] text-[#a66c13]">forest multiflora</div></div></div><div className="absolute bottom-1 left-1/2 h-3 w-44 -translate-x-1/2 rounded-full bg-[#967631]/20 blur-sm" /></div></section><section className="p-7 md:p-10"><div className="flex items-center justify-between border-b border-[#dfded4] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#a66c13]">HoneyChain record</p><h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.05em] text-[#1e352b]">Authenticity check</h2></div>{verified && <span className="grid h-11 w-11 place-items-center rounded-full bg-[#dcefe2] text-[#2c7b50]"><CheckCircle2 size={22} /></span>}</div><div className="mt-6 flex gap-2"><input data-testid="input-consumer-batch" value={batchId} onChange={(event) => { setBatchId(event.target.value); setVerified(false); }} className="hc-input min-w-0 flex-1 rounded-xl border border-[#d8d7ca] bg-[#fffdf7] px-3.5 py-3 text-sm font-mono-app font-bold uppercase text-[#1e352b]" /><button data-testid="button-verify-batch" onClick={() => setVerified(true)} className="hc-button rounded-xl bg-[#1e352b] px-4 text-xs font-bold text-[#f8f4e9] hover:bg-[#2f614b]">Verify</button></div>{verified ? <div className="hc-reveal"><div className="mt-6 rounded-2xl border border-[#bfe0c8] bg-[#eef8ee] p-4"><div className="flex items-center gap-2 text-sm font-bold text-[#28734d]"><ShieldCheck size={17} /> Authentic honey</div><p data-testid="status-authentic-honey" className="mt-1 text-xs text-[#5f7c68]">This product is verified on HoneyChain.</p></div><div className="mt-5 space-y-3"><SummaryRow label="Batch ID" value={batchId || 'HC2026-001'} mono /><SummaryRow label="Beekeeper" value="Rahul Kumar" /><SummaryRow label="Origin" value="Uttarakhand, India" /><SummaryRow label="Harvest date" value="02 Sep 2026" /><SummaryRow label="Hive health" value="Healthy · 87%" /></div><div className="mt-7 border-t border-[#dfded4] pt-5"><h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#66766d]">Journey of this honey</h3><div className="mt-4 grid grid-cols-5 gap-1">{['Hive', 'Harvest', 'Process', 'Seal', 'Retail'].map((step, index) => <div data-testid={`consumer-stage-${step}`} key={step} className="text-center"><div className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-[#fff0c1] font-mono-app text-[10px] font-bold text-[#a66c13]">{index + 1}</div><span className="mt-2 block text-[10px] font-bold text-[#718078]">{step}</span></div>)}</div></div><p className="mt-7 flex items-center justify-center gap-1.5 text-xs font-bold text-[#2d7b50]"><Leaf size={14} /> Supporting ethical beekeeping</p></div> : <div className="py-12 text-center text-sm text-[#718078]"><Search className="mx-auto mb-3 text-[#a66c13]" size={24} />Enter a batch ID to inspect its record.</div>}</section></div><button data-testid="button-consumer-blockchain" onClick={() => setLocation('/blockchain')} className="mx-auto mt-5 block text-xs font-bold text-[#b9cdbb] hover:text-[#f1d27a]">See the full blockchain journey <ArrowRight className="ml-1 inline" size={13} /></button></div></main>;
}

function AnalyticsPage() {
  const averages = useMemo(() => ({ temp: Math.round(trendData.reduce((sum, day) => sum + day.temp, 0) / trendData.length), humidity: Math.round(trendData.reduce((sum, day) => sum + day.humidity, 0) / trendData.length) }), []);
  return <DashboardShell page="analytics" title="Analytics" subtitle="Patterns from the field, so you can act before the hive asks."><div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><AnalyticsStat label="Avg temperature" value={`${averages.temp}°C`} note="Within safe range" /><AnalyticsStat label="Avg humidity" value={`${averages.humidity}%`} note="Stable this week" /><AnalyticsStat label="Forecast harvest" value="18 kg" note="+12% from last month" /></div><TrendPanel /><div className="grid gap-5 md:grid-cols-2"><section className="hc-card rounded-2xl p-5"><h2 className="font-display text-lg font-extrabold text-[#1e352b]">Colony health</h2><p className="mt-1 text-xs text-[#7b877f]">Current health score by hive</p><div className="mt-6 space-y-5">{hives.map((hive) => <div key={hive.id}><div className="mb-2 flex justify-between text-xs font-bold text-[#1e352b]"><span>{hive.id}</span><span className="text-[#2e7950]">{hive.health}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#e1e5db]"><div className={`h-full rounded-full ${hive.health < 80 ? 'bg-[#d38646]' : 'bg-[#4c9a68]'}`} style={{ width: `${hive.health}%` }} /></div></div>)}</div></section><section className="hc-card rounded-2xl p-5"><h2 className="font-display text-lg font-extrabold text-[#1e352b]">Reading the season</h2><p className="mt-3 text-sm leading-6 text-[#718078]">Your hives are holding steady through a warm spell. HIVE-002 is worth a closer look before the next field visit.</p><div className="mt-5 flex items-center gap-2 rounded-xl bg-[#fff0c1] p-3 text-xs font-bold text-[#805b16]"><CalendarDays size={15} /> Next recommended check · 14 Sep 2026</div></section></div></div></DashboardShell>;
}

function AnalyticsStat({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="hc-card rounded-2xl p-4"><span className="text-[10px] font-bold uppercase tracking-[.1em] text-[#7b877f]">{label}</span><strong className="mt-2 block font-display text-3xl font-extrabold tracking-[-.05em] text-[#1e352b]">{value}</strong><span className="mt-1 block text-[10px] font-bold text-[#2e7950]">{note}</span></div>;
}

function AlertsPage() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter((alert) => !dismissed.includes(alert.title));
  return <DashboardShell page="alerts" title="Alerts" subtitle="Small signals worth your attention, before they become big problems."><div className="space-y-3">{visible.length ? visible.map((alert) => <article data-testid={`alert-${alert.hive}`} key={alert.title} className={`hc-card flex items-start gap-4 rounded-2xl p-5 ${alert.warning ? 'border-l-4 border-l-[#d4754d]' : 'border-l-4 border-l-[#5b9b6f]'}`}><span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${alert.warning ? 'bg-[#f8dfd9] text-[#ac4d3d]' : 'bg-[#dcefe2] text-[#2d7b50]'}`}>{alert.warning ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold text-[#1e352b]">{alert.title}</h2><time className="text-[10px] text-[#87938a]">{alert.time}</time></div><p className="mt-1 text-sm leading-6 text-[#718078]">{alert.desc}</p><span className="mt-3 inline-block rounded-md bg-[#f0eee4] px-2 py-1 font-mono-app text-[10px] font-bold text-[#a66c13]">{alert.hive}</span></div><button data-testid={`button-dismiss-${alert.hive}`} onClick={() => setDismissed((items) => [...items, alert.title])} className="rounded-lg p-2 text-[#8d9990] hover:bg-[#e9eee4] hover:text-[#1e352b]"><X size={15} /></button></article>) : <div data-testid="empty-alerts" className="hc-card rounded-2xl p-12 text-center"><CheckCircle2 className="mx-auto text-[#4f9866]" size={30} /><h2 className="mt-4 font-display text-xl font-extrabold text-[#1e352b]">All clear in the field.</h2><p className="mt-1 text-sm text-[#718078]">You’re caught up on every hive signal.</p></div>}<div className="hc-card mt-7 flex items-center gap-3 rounded-2xl p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e7eee2] text-[#2f7550]"><Bell size={17} /></span><p className="text-xs leading-5 text-[#718078]">HoneyChain checks your field signals continuously and surfaces only the moments that need a human eye.</p></div></div></DashboardShell>;
}

function ProfilePage() {
  const [saved, setSaved] = useState(false);
  return <DashboardShell page="profile" title="Profile" subtitle="Your beekeeper identity and field details."><div className="max-w-2xl space-y-5"><section className="hc-card rounded-2xl p-6"><div className="flex items-center gap-4 border-b border-[#dedaca] pb-6"><div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#dfeddc] font-display text-xl font-extrabold text-[#2c704c]">RK</div><div><h2 className="font-display text-2xl font-extrabold tracking-[-.04em] text-[#1e352b]">Rahul Kumar</h2><p className="mt-1 text-sm text-[#718078]">Independent beekeeper · Uttarakhand, India</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><ProfileRow label="Email" value="rahul.kumar@honeychain.in" /><ProfileRow label="Member since" value="March 2025" /><ProfileRow label="Hives registered" value="3 colonies" /><ProfileRow label="Verified batches" value="12 records" /></div></section><section className="hc-card rounded-2xl p-6"><h2 className="font-display text-lg font-extrabold text-[#1e352b]">Field preferences</h2><div className="mt-5 space-y-4"><label className="flex items-center justify-between gap-4 text-sm text-[#52645b]"><span><strong className="block text-[#1e352b]">Temperature alerts</strong><small className="text-xs text-[#7b877f]">Notify me above 35°C</small></span><input data-testid="toggle-temperature-alerts" type="checkbox" defaultChecked className="h-5 w-5 accent-[#d99b1a]" /></label><label className="flex items-center justify-between gap-4 text-sm text-[#52645b]"><span><strong className="block text-[#1e352b]">Harvest forecasts</strong><small className="text-xs text-[#7b877f]">Weekly AI field notes</small></span><input data-testid="toggle-harvest-forecasts" type="checkbox" defaultChecked className="h-5 w-5 accent-[#d99b1a]" /></label></div><button data-testid="button-save-profile" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); }} className="hc-button mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1e352b] px-5 py-3 text-xs font-bold text-[#f8f4e9] hover:bg-[#2f604b]">{saved ? <><Check size={15} /> Saved</> : 'Save preferences'}</button></section></div></DashboardShell>;
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[#faf8ef] p-3"><span className="block text-[10px] font-bold uppercase tracking-[.1em] text-[#8b968d]">{label}</span><span className="mt-1 block text-sm font-bold text-[#1e352b]">{value}</span></div>;
}

function NotFoundPage() {
  const [, setLocation] = useLocation();
  return <main className="grid min-h-[100dvh] place-items-center bg-[#f4f1e8] px-5 text-center"><div><Hexagon className="mx-auto text-[#d99b1a]" size={42} /><h1 className="mt-5 font-display text-4xl font-extrabold text-[#1e352b]">That trail went quiet.</h1><p className="mt-2 text-sm text-[#718078]">This page isn’t part of the current chain.</p><button data-testid="button-not-found-home" onClick={() => setLocation('/')} className="mt-6 rounded-full bg-[#1e352b] px-5 py-3 text-xs font-bold text-[#f8f4e9]">Return home</button></div></main>;
}

function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={LandingPage} /><Route path="/about" component={AboutPage} /><Route path="/verify" component={ConsumerPage} /><Route path="/dashboard" component={DashboardPage} /><Route path="/hives" component={HivesPage} /><Route path="/batches" component={BatchesPage} /><Route path="/blockchain" component={BlockchainPage} /><Route path="/analytics" component={AnalyticsPage} /><Route path="/alerts" component={AlertsPage} /><Route path="/profile" component={ProfilePage} /><Route component={NotFoundPage} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;