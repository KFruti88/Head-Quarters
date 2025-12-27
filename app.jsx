import React, { useEffect, useState, useCallback } from 'react';
import { 
  Tractor, Wrench, Package, RefreshCw, Factory,
  Clock, Leaf, Trophy, DollarSign, Target, Info,
  TrendingUp, Radio, Shield, Sun, Moon, MapPin, 
  CheckCircle2, Utensils, Box, Layers, Gauge
} from 'lucide-react';

const TROPHY_DEFINITIONS = [
  { id: "ACHIEVEMENT_01", name: "Farming is in our nature", desc: "Plant today - harvest tomorrow." },
  { id: "ACHIEVEMENT_02", name: "Road Trip", desc: "That thing wouldn't have fit onto the street anyway." },
  { id: "ACHIEVEMENT_03", name: "Plant get enough", desc: "A little help can go a long way." },
  { id: "ACHIEVEMENT_04", name: "The plot thickens", desc: "You won't rest until you've reached maximum efficiency." },
  { id: "ACHIEVEMENT_05", name: "Allez hopp", desc: "Oh, they can do THAT as well?" },
  { id: "ACHIEVEMENT_06", name: "You are not a kangaroo", desc: "Seriously, think of the poor animal!" },
  { id: "ACHIEVEMENT_07", name: "Giddy-up!", desc: "I could get used to getting around like this…" },
  { id: "ACHIEVEMENT_08", name: "Thoroughbred!", desc: "I'm a real cowboy, mom!" },
  { id: "ACHIEVEMENT_09", name: "Help me to help you", desc: "Sure, I can take care of that, neighbour." },
  { id: "ACHIEVEMENT_10", name: "Helper A does not stop … ever", desc: "What do you mean 'take care of my own farm as well'?" },
  { id: "ACHIEVEMENT_11", name: "It's just the beginning", desc: "I've never felt happier than here." },
  { id: "ACHIEVEMENT_12", name: "Just a sprinkle", desc: "You have to think about the future." },
  { id: "ACHIEVEMENT_13", name: "It's sow easy", desc: "Planting one bean will yield much green." },
  { id: "ACHIEVEMENT_14", name: "Own use", desc: "Reap what you sow." },
  { id: "ACHIEVEMENT_15", name: "Large-scale supplier", desc: "These are the fruits of your labour." },
  { id: "ACHIEVEMENT_16", name: "Field Trip", desc: "One vehicle for all of your needs." },
  { id: "ACHIEVEMENT_17", name: "Long haul", desc: "In it for the long game, I see." },
  { id: "ACHIEVEMENT_18", name: "van Gogh", desc: "Look at Mr. Fancypants over there." },
  { id: "ACHIEVEMENT_19", name: "It just fell off", desc: "It was only a matter of time…" },
  { id: "ACHIEVEMENT_20", name: "Fix me up", desc: "Seriously, you should consider a membership card." },
  { id: "ACHIEVEMENT_21", name: "Fluffiness", desc: "Building up my wool empire." },
  { id: "ACHIEVEMENT_22", name: "Three little piggies…", desc: "You'll be amazed how much food they need." },
  { id: "ACHIEVEMENT_23", name: "Clucky Streak", desc: "Now that's a lot of Easter eggs." },
  { id: "ACHIEVEMENT_24", name: "Bringing in the Honey", desc: "Well you've been one busy bee, haven't you?" },
  { id: "ACHIEVEMENT_25", name: "Cowherd", desc: "Bet you didn't think they'd be that much work, right?" },
  { id: "ACHIEVEMENT_26", name: "I like to switch it up", desc: "We're slowly getting there." },
  { id: "ACHIEVEMENT_27", name: "This is just my weekend vehicle", desc: "Yes, I need each and every one of these." },
  { id: "ACHIEVEMENT_28", name: "Vehicle fleet", desc: "Ok, I might have a problem…" },
  { id: "ACHIEVEMENT_29", name: "I read Shakespeare and stuff", desc: "The first step of any farmer." },
  { id: "ACHIEVEMENT_30", name: "Highly cultivated", desc: "I'm a little proud of this one myself." },
  { id: "ACHIEVEMENT_31", name: "Ultimutt Pawesomeness", desc: "Who's a good boy?" },
  { id: "ACHIEVEMENT_32", name: "That's a wrap", desc: "What's in the bale?" },
  { id: "ACHIEVEMENT_33", name: "Gone but not for cotton", desc: "Where would you even store them?!" },
  { id: "ACHIEVEMENT_34", name: "Raisin the stakes", desc: "It's Californian gold!" },
  { id: "ACHIEVEMENT_35", name: "Olea europaea", desc: "It's a fruit, not a vegetable!" },
  { id: "ACHIEVEMENT_36", name: "Original grain", desc: "My horses are crazy for it." },
  { id: "ACHIEVEMENT_37", name: "Rock on", desc: "The path to success is paved with rocks." },
  { id: "ACHIEVEMENT_38", name: "You wood not believe it", desc: "Taking a leaf of absence." },
  { id: "ACHIEVEMENT_39", name: "I'm stumped", desc: "If a tree falls in a forest and no one is around to hear it..." },
  { id: "ACHIEVEMENT_40", name: "Hard work pays off", desc: "You know you can also spend it, right?" },
  { id: "ACHIEVEMENT_41", name: "All out of Land", desc: "Everything the light touches...is mine." },
  { id: "ACHIEVEMENT_42", name: "Well-Oiled Machine", desc: "Hmm, we could franchise this…" },
  { id: "ACHIEVEMENT_43", name: "Pretty colourful", desc: "Childhood memories, brought back to your home." },
  { id: "ACHIEVEMENT_44", name: "Game on", desc: "I'm somewhat of a collector myself." },
  { id: "ACHIEVEMENT_45", name: "Cheese it", desc: "Anybody up for some fondue?" },
  { id: "ACHIEVEMENT_46", name: "It's never too late to farm", desc: "It feels good to be home." }
];

// EARNED LOGS (Ray: 19 trophies | Funny: 9 trophies)
const EARNED_RAY = [
  "ACHIEVEMENT_01", "ACHIEVEMENT_02", "ACHIEVEMENT_03", "ACHIEVEMENT_05", "ACHIEVEMENT_06", 
  "ACHIEVEMENT_07", "ACHIEVEMENT_08", "ACHIEVEMENT_09", "ACHIEVEMENT_11", "ACHIEVEMENT_26", 
  "ACHIEVEMENT_27", "ACHIEVEMENT_28", "ACHIEVEMENT_29", "ACHIEVEMENT_31", "ACHIEVEMENT_32", 
  "ACHIEVEMENT_40", "ACHIEVEMENT_41", "ACHIEVEMENT_42", "ACHIEVEMENT_43"
];
const EARNED_FUNNY = [
  "ACHIEVEMENT_09", "ACHIEVEMENT_31", "ACHIEVEMENT_07", "ACHIEVEMENT_05", "ACHIEVEMENT_42", 
  "ACHIEVEMENT_41", "ACHIEVEMENT_38", "ACHIEVEMENT_39", "ACHIEVEMENT_40"
];

const App = () => {
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
  const [status, setStatus] = useState('offline');
  const [xmlUrl] = useState('https://raw.githubusercontent.com/KFruti88/Head-Quarters/main/live_vault.xml');
  
  const [localWeather, setLocalWeather] = useState({
    flora: { time: "--:--", temp: "--" },
    gainesville: { time: "--:--", temp: "--" }
  });

  const [data, setData] = useState({
    server: { isOnline: false, name: "618 CREW HQ", playerCount: 0 },
    env: { time: "12:00", weather: "Clear" },
    assets: { 1: { v: [], i: [], p: [] }, 2: { v: [], i: [], p: [] } },
    fields: [],
    factories: [],
    collectibles: 12,
    farms: { 
      1: { name: "Funny Farm", money: 0 }, 
      2: { name: "Ray Operations", money: 0 } 
    }
  });

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=38.67,29.65&longitude=-88.49,-82.32&current_weather=true&temperature_unit=fahrenheit`);
      const w = await res.json();
      const fmt = (tz) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', timeZone: tz, hour12: true }).format(new Date());
      setLocalWeather({
        flora: { time: fmt('America/Chicago'), temp: Math.round(w[0].current_weather.temperature) },
        gainesville: { time: fmt('America/New_York'), temp: Math.round(w[1].current_weather.temperature) }
      });
    } catch (e) { console.error(e); }
  }, []);

  const fetchData = useCallback(async () => {
    setStatus('syncing');
    try {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(xmlUrl)}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");

      const serverNode = xml.querySelector('Server');

      const newState = {
        server: { 
          isOnline: serverNode?.getAttribute('isOnline') === 'true' || true,
          name: serverNode?.getAttribute('name') || "618 CREW HQ",
          playerCount: parseInt(serverNode?.getAttribute('playerCount')) || 0
        },
        env: {
          time: xml.querySelector('Environment')?.getAttribute('gameTime') || "12:00",
          weather: xml.querySelector('Environment')?.getAttribute('weather') || "Clear"
        },
        collectibles: 12, 
        assets: { 1: { v: [], i: [], p: [] }, 2: { v: [], i: [], p: [] } },
        fields: Array.from(xml.querySelectorAll('Field')).map(f => ({
          id: f.getAttribute('id'), fruit: f.getAttribute('fruit'), growth: f.getAttribute('growth')
        })),
        factories: Array.from(xml.querySelectorAll('Point')).map(pt => ({
            name: pt.getAttribute('name'), farmId: pt.getAttribute('farmId'), active: pt.getAttribute('active') === "true",
            inputs: Array.from(pt.querySelectorAll('Input')).map(i => ({ type: i.getAttribute('type'), pct: i.getAttribute('pct') }))
        })),
        farms: { 
          1: { 
            money: parseFloat(xml.querySelector('Farm[id="1"]')?.getAttribute('money')) || 0, 
            contracts: 12 
          }, 
          2: { 
            money: parseFloat(xml.querySelector('Farm[id="2"]')?.getAttribute('money')) || 0, 
            contracts: 12 
          } 
        }
      };

      xml.querySelectorAll('Unit').forEach(item => {
          const fId = item.getAttribute('farmId');
          if (!newState.assets[fId]) return;
          const name = (item.getAttribute('name') || "Unit").toUpperCase();
          const asset = { id: item.getAttribute('id'), name: name, damage: parseFloat(item.getAttribute('damage')) || 0 };
          if (name.includes("PALLET") || name.includes("BALE") || name.includes("EGG") || name.includes("WOOL")) newState.assets[fId].p.push(asset);
          else if (name.includes("TRAILER") || name.includes("PLOW") || name.includes("HEADER") || name.includes("WEIGHT") || name.includes("MOWER") || name.includes("BALER")) newState.assets[fId].i.push(asset);
          else newState.assets[fId].v.push(asset);
      });

      setData(newState);
      setStatus('stable');
    } catch (e) { 
      setStatus('error');
      setData(prev => ({ ...prev, server: { ...prev.server, isOnline: false } }));
    }
  }, [xmlUrl]);

  useEffect(() => {
    const timer = setInterval(() => setSyncTime(new Date().toLocaleTimeString()), 1000);
    const dSync = setInterval(fetchData, 30000);
    const wSync = setInterval(fetchWeather, 600000);
    fetchData();
    fetchWeather();
    return () => { clearInterval(timer); clearInterval(dSync); clearInterval(wSync); };
  }, [fetchData, fetchWeather]);

  const getBg = () => {
    const hr = parseInt(data.env.time.split(":")[0]);
    return (hr < 6 || hr > 19) ? 'from-[#020c1b] via-[#0a192f] to-[#020c1b]' : 'from-[#0a192f] via-blue-900/40 to-[#0a192f]';
  };

  const Card = ({ children, title, icon: Icon, badge, color = "orange" }) => (
    <div className={`bg-white/5 backdrop-blur-xl border-2 border-${color}-500/30 rounded-[2.5rem] p-8 h-[550px] flex flex-col group hover:border-${color}-500 transition-all duration-500 shadow-2xl`}>
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Icon size={24} className={`text-${color}-500`}/>
          <span className="text-sm font-black uppercase text-white tracking-[0.2em]">{title}</span>
        </div>
        {badge && <span className={`text-xs font-black text-${color}-500 bg-${color}-500/10 px-4 py-1 rounded-full`}>{badge}</span>}
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBg()} text-slate-300 font-sans p-6 transition-all duration-1000`}>
      
      {/* HUD OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-700 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1920px] mx-auto space-y-10 relative z-10">
        
        {/* HEADER */}
        <header className="bg-white/5 backdrop-blur-3xl border-2 border-orange-500/50 p-8 rounded-[3rem] shadow-[0_0_50px_-15px_rgba(255,79,0,0.4)] flex flex-col xl:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
                <div className={`w-4 h-4 rounded-full ${data.server.isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`}></div>
                <div>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                    {data.server.name} <span className="text-orange-500 not-italic">Tactical Uplink</span>
                  </h1>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                      <Radio size={14} className="text-orange-500"/> {status.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                      <Shield size={14} className="text-orange-500"/> LINK_ESTABLISHED
                    </span>
                  </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white/5 border border-orange-500/30 p-4 rounded-3xl backdrop-blur-md min-w-[160px]">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-tighter">Flora, IL</p>
                <span className="text-sm font-bold text-white italic">{localWeather.flora.time} // {localWeather.flora.temp}°F</span>
              </div>
              <div className="bg-white/5 border border-orange-500/30 p-4 rounded-3xl backdrop-blur-md min-w-[160px]">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-tighter">Gainesville, FL</p>
                <span className="text-sm font-bold text-white italic">{localWeather.gainesville.time} // {localWeather.gainesville.temp}°F</span>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/40 p-4 rounded-3xl flex items-center gap-4">
                <Box size={24} className="text-orange-500"/>
                <div>
                  <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-tighter">Collectibles</p>
                  <span className="text-2xl font-black text-orange-500 italic tabular-nums">{data.collectibles} / 50</span>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/40 p-4 rounded-3xl flex items-center gap-4 shadow-lg shadow-orange-500/10">
                <Clock size={24} className="text-orange-500"/>
                <div>
                  <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-tighter">Server Clock</p>
                  <span className="text-2xl font-black text-orange-500 tabular-nums italic">{data.env.time}</span>
                </div>
              </div>
            </div>
        </header>

        {/* OPERATIONS GRID */}
        {[1, 2].map(id => {
          const earned = id === 1 ? EARNED_FUNNY : EARNED_RAY;
          const sortedTrophies = [...TROPHY_DEFINITIONS].sort((a, b) => {
            const aE = earned.includes(a.id);
            const bE = earned.includes(b.id);
            return (aE === bE) ? 0 : aE ? 1 : -1;
          });

          return (
            <div key={id} className="space-y-10 animate-in fade-in duration-1000 pb-12">
              {/* FARM BRANDING */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-6">
                  <div className="border-l-[12px] border-orange-600 pl-10">
                    <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none">{id === 1 ? 'Funny Farm' : 'Ray Operations'}</h2>
                    <p className="text-orange-500 font-bold tracking-[0.5em] uppercase mt-4 text-sm italic">Operational Grid Sector 0{id}</p>
                  </div>
                  <div className="bg-white/5 border-2 border-orange-500/40 p-8 rounded-[2.5rem] text-right min-w-[340px] backdrop-blur-xl shadow-xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">Liquid Account Balance</span>
                    <div className="text-5xl font-black text-orange-500 tabular-nums">${data.farms[id].money.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  </div>
              </div>

              {/* DASHBOARD LAYOUT */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 px-6">
                
                {/* PINNED OBJECTIVE */}
                <div className="xl:col-span-4 bg-white/5 border-2 border-orange-500/60 rounded-[3rem] p-10 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="bg-orange-600 p-5 rounded-[1.5rem] shadow-lg shadow-orange-600/30"><Target className="text-white" size={32}/></div>
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Strategic Objective</h3>
                                <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Goal: Help me to help you (Contract Efficiency Target)</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-black text-white tabular-nums">12 <span className="text-orange-500 italic">/ 50 Complete</span></span>
                        </div>
                    </div>
                    <div className="w-full h-6 bg-white/10 rounded-full border-2 border-white/10 overflow-hidden p-1">
                        <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_20px_#f97316] transition-all duration-2000" style={{width: '24%'}}></div>
                    </div>
                </div>

                {/* MODULES: FLEET, LOGISTICS, CROPS, PRODUCTION */}
                <Card title="Unit Deployment" icon={Tractor} badge={`${data.assets[id].v.length} Heavy Units`}>
                    <div className="space-y-4">
                        {data.assets[id].v.map((v, i) => (
                            <div key={i} className="bg-black/40 p-5 rounded-[1.5rem] border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-black text-slate-100 uppercase truncate w-36">{v.name}</span>
                                    <span className={`text-[10px] font-black ${v.damage > 0.5 ? 'text-red-500' : 'text-emerald-500'}`}>{Math.floor((1-v.damage)*100)}% HP</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${v.damage > 0.5 ? 'bg-red-500' : 'bg-orange-500 shadow-[0_0_8px_#f97316]'}`} style={{width: `${(1-v.damage)*100}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Asset Logistics" icon={Wrench}>
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-3">Attachments & Components</p>
                            <div className="space-y-3">
                                {data.assets[id].i.map((v, i) => (
                                    <div key={i} className="bg-black/30 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-300 truncate w-36">{v.name}</span>
                                        <Wrench size={16} className="text-orange-900"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-l-2 border-blue-500 pl-3">Cargo & Pallets</p>
                            <div className="space-y-3">
                                {data.assets[id].p.map((v, i) => (
                                    <div key={i} className="bg-black/30 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 truncate w-36">{v.name}</span>
                                        <Package size={16} className="text-blue-900"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Bio-Intel Feed" icon={Leaf} color="emerald">
                    <div className="space-y-4">
                        {data.fields.map((f, i) => (
                            <div key={i} className="bg-black/40 p-5 rounded-[1.5rem] border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-black text-white italic tracking-tighter uppercase">Sector {f.id}</span>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-3 py-1 rounded-lg">{f.fruit}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{width: `${f.growth}%`}}></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-600 uppercase">Growth Integrity: {f.growth}%</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Industrial Chain" icon={Factory}>
                    <div className="space-y-6">
                        {data.factories.filter(pt => String(pt.farmId) === String(id)).map((pt, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <Utensils size={16} className="text-orange-400"/>
                                        <h4 className="text-[10px] font-black text-white uppercase truncate w-32 tracking-tighter">{pt.name}</h4>
                                    </div>
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg ${pt.active ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-500'}`}>
                                        {pt.active ? 'ACTIVE' : 'IDLE'}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {pt.inputs.map((inp, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                                                <span>{inp.type}</span>
                                                <span className="text-white italic">{Math.floor(inp.pct)}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${inp.pct < 20 ? 'bg-red-500' : 'bg-orange-500'}`} style={{width: `${inp.pct}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ACHIEVEMENT ARCHIVE WITH PROGRESS BARS */}
                <div className="xl:col-span-4 bg-white/5 border-2 border-orange-500/40 rounded-[3rem] p-10 min-h-[600px] backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-8">
                        <div className="flex items-center gap-6">
                            <Trophy size={32} className="text-orange-500"/>
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tactical Progress Archive</h3>
                                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">Data: {earned.length} / 46 Secured</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sortedTrophies.map((trophy, i) => {
                          const isE = earned.includes(trophy.id);
                          return (
                            <div key={i} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col justify-between h-44 group/item ${isE ? 'bg-orange-500/10 border-orange-500/40 shadow-xl' : 'bg-white/5 border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl ${isE ? 'bg-orange-500 text-white shadow-[0_0_15px_#f97316]' : 'bg-white/10 text-slate-700'}`}>
                                        {isE ? <CheckCircle2 size={18}/> : <Trophy size={18}/>}
                                    </div>
                                    <span className={`text-[10px] font-black tracking-widest ${isE ? 'text-orange-500' : 'text-slate-800'}`}>
                                        {isE ? 'SECURED' : 'LOCKED'}
                                    </span>
                                </div>
                                <div className="mt-4 flex-1">
                                    <h4 className="text-[12px] font-black uppercase text-white leading-tight tracking-tighter group-hover/item:text-orange-500 transition-colors">{trophy.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-500 mt-1 italic leading-tight">{trophy.desc}</p>
                                </div>
                                {/* NEW INDIVIDUAL PROGRESS BAR */}
                                <div className="mt-4">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                          className={`h-full transition-all duration-1000 ${isE ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-slate-800'}`} 
                                          style={{width: isE ? '100%' : '5%'}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[8px] font-black uppercase text-slate-600 tracking-tighter">Status</span>
                                        <span className="text-[8px] font-black uppercase text-orange-500 tracking-tighter">{isE ? '100%' : '0%'}</span>
                                    </div>
                                </div>
                            </div>
                          );
                        })}
                    </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(249, 115, 22, 0.8); }
      `}</style>
    </div>
  );
};

export default App;
