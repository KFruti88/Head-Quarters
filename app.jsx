import React, { useEffect, useState, useCallback } from 'react';
import { 
  Tractor, Wrench, Package, RefreshCw, Factory,
  Thermometer, Clock, Leaf, Trophy, DollarSign,
  TrendingUp, HardDrive, Radio, Target, Info
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

const App = () => {
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
  const [connectionStatus, setConnectionStatus] = useState('offline');
  // LINKED TO YOUR REPOSITORY
  const [xmlUrl] = useState('https://raw.githubusercontent.com/KFruti88/Head-Quarters/main/live_vault.xml');
  
  const [data, setData] = useState({
    server: { name: "618 CREW HQ", playerCount: 0, isOnline: false },
    env: { time: "00:00", temp: 20, weather: "Clear" },
    fields: [],
    assets: { 1: { v: [], i: [], p: [] }, 2: { v: [], i: [], p: [] } },
    trophies: {},
    factories: [],
    farms: { 
      1: { name: "Funny Farm", money: 0, income: 2500000 }, 
      2: { name: "Ray Operations", money: 0, income: 2500000 } 
    }
  });

  const fetchData = useCallback(async () => {
    setConnectionStatus('syncing');
    try {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(xmlUrl)}`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");

      const trophiesMap = {};
      xml.querySelectorAll('Trophy').forEach(t => {
          trophiesMap[t.getAttribute('id')] = {
              progress: parseFloat(t.getAttribute('progress')) || 0,
              unlocked: t.getAttribute('unlocked') === "true"
          };
      });

      const newState = {
        server: { playerCount: xml.querySelector('Server')?.getAttribute('playerCount') || 0, isOnline: true },
        env: {
          time: xml.querySelector('Environment')?.getAttribute('gameTime') || "00:00",
          temp: 22,
          weather: "Clear"
        },
        fields: Array.from(xml.querySelectorAll('Field')).map(f => ({
            id: f.getAttribute('id'), fruit: f.getAttribute('fruit'), growth: f.getAttribute('growth')
        })),
        assets: { 1: { v: [], i: [], p: [] }, 2: { v: [], i: [], p: [] } },
        trophies: trophiesMap,
        factories: Array.from(xml.querySelectorAll('Point')).map(pt => ({
            name: pt.getAttribute('name'),
            farmId: pt.getAttribute('farmId'),
            active: pt.getAttribute('active') === "true",
            inputs: Array.from(pt.querySelectorAll('Input')).map(i => ({ type: i.getAttribute('type'), pct: i.getAttribute('pct') })),
            outputs: Array.from(pt.querySelectorAll('Output')).map(o => ({ type: o.getAttribute('type'), pct: o.getAttribute('pct') }))
        })),
        farms: { 
          1: { name: "Funny Farm", money: xml.querySelector('Farm[id="1"]')?.getAttribute('money') || 0, income: 2500000 }, 
          2: { name: "Ray Operations", money: xml.querySelector('Farm[id="2"]')?.getAttribute('money') || 0, income: 2500000 } 
        }
      };

      xml.querySelectorAll('Unit').forEach(item => {
          const fId = item.getAttribute('farmId');
          if (!newState.assets[fId]) return;
          const name = item.getAttribute('name') || "Gear";
          const damage = parseFloat(item.getAttribute('damage')) || 0;
          const asset = { id: item.getAttribute('id'), name: name, damage: damage };
          
          // Categorization logic
          if (name.includes("PALLET")) newState.assets[fId].p.push(asset);
          else if (name.includes("TRAILER") || name.includes("PLOW")) newState.assets[fId].i.push(asset);
          else newState.assets[fId].v.push(asset);
      });

      setData(newState);
      setConnectionStatus('stable');
    } catch (e) { setConnectionStatus('error'); }
  }, [xmlUrl]);

  useEffect(() => {
    const timer = setInterval(() => setSyncTime(new Date().toLocaleTimeString()), 1000);
    const sync = setInterval(fetchData, 30000); // 30s Refresh
    fetchData();
    return () => { clearInterval(timer); clearInterval(sync); };
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        
        {/* HQ MASTER HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900/80 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-xl gap-6">
            <div className="flex items-center gap-6">
                <div className={`w-4 h-4 rounded-full ${data.server.isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]' : 'bg-red-500'}`}></div>
                <div>
                  <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">618 Crew HQ Console</h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Radio size={12}/> Connection: {connectionStatus.toUpperCase()}
                  </p>
                </div>
            </div>
            <div className="flex gap-8 items-center bg-black/30 p-4 rounded-3xl border border-slate-800/50">
                <div className="text-right px-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase block tracking-widest">Real Time</span>
                    <span className="text-2xl font-black text-blue-400 tabular-nums">{syncTime}</span>
                </div>
                <div className="text-right border-l border-slate-700 px-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase block tracking-widest">Server Time</span>
                    <span className="text-2xl font-black text-amber-500 tabular-nums">{data.env.time}</span>
                </div>
                <button onClick={fetchData} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all active:scale-95">
                    <RefreshCw size={20} className={connectionStatus === 'syncing' ? 'animate-spin text-blue-400' : 'text-slate-400'}/>
                </button>
            </div>
        </header>

        {/* OPERATION ROWS */}
        {[1, 2].map(id => (
          <section key={id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* FARM STATS BAR */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-l-8 border-blue-600 pl-8">
                <div>
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{data.farms[id].name}</h2>
                  <p className="text-blue-500 font-bold tracking-widest uppercase text-xs mt-1">Operational Sector 0{id}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-end gap-2"><DollarSign size={12}/> Cash Reserves</div>
                    <div className="text-3xl font-black text-emerald-500 tabular-nums">${parseInt(data.farms[id].money).toLocaleString()}</div>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-8">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-end gap-2"><TrendingUp size={12}/> Hourly Projection</div>
                    <div className="text-3xl font-black text-amber-500 tabular-nums">${data.farms[id].income.toLocaleString()}</div>
                  </div>
                </div>
            </div>

            {/* DATA GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* VEHICLES */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 h-[550px] flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3"><Tractor size={20} className="text-blue-400"/><span className="text-xs font-black uppercase text-white tracking-widest">Fleet</span></div>
                        <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{data.assets[id].v.length} Units</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {data.assets[id].v.map((v, i) => (
                            <div key={i} className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-200 uppercase truncate w-32">{v.name}</span>
                                    <span className={`text-[10px] font-black ${v.damage > 0.5 ? 'text-red-500' : 'text-emerald-500'}`}>{Math.floor((1-v.damage)*100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${v.damage > 0.5 ? 'bg-red-500' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} style={{width: `${(1-v.damage)*100}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TROPHIES */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 h-[550px] flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3"><Trophy size={20} className="text-amber-500"/><span className="text-xs font-black uppercase text-white tracking-widest">Archive</span></div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {TROPHY_DEFINITIONS.map((trophy, i) => {
                          const status = data.trophies[trophy.id] || { progress: 0, unlocked: false };
                          return (
                            <div key={i} className={`p-4 rounded-xl border ${status.unlocked ? 'bg-amber-500/5 border-amber-500/30' : 'bg-black/20 border-slate-800 opacity-40'}`}>
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <h4 className="text-[9px] font-black uppercase text-white">{trophy.name}</h4>
                                  <span className="text-[9px] font-black text-amber-500">{Math.floor(status.progress)}%</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{width: `${status.progress}%`}}></div>
                                </div>
                            </div>
                          );
                        })}
                    </div>
                </div>

                {/* LOGISTICS */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 h-[550px] flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3"><Package size={20} className="text-emerald-400"/><span className="text-xs font-black uppercase text-white tracking-widest">Logistics</span></div>
                    </div>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block opacity-50">Assets & Storage</span>
                        {data.assets[id].p.map((p, idx) => (
                            <div key={idx} className="bg-black/30 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400">{p.name}</span>
                                <span className="text-[8px] font-black text-slate-700 italic">ID:{p.id}</span>
                            </div>
                        ))}
                        {data.assets[id].i.map((i, idx) => (
                            <div key={idx} className="bg-black/30 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400">{i.name}</span>
                                <Wrench size={10} className="text-slate-700"/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FACTORIES */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 h-[550px] flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3"><Factory size={20} className="text-purple-400"/><span className="text-xs font-black uppercase text-white tracking-widest">Production</span></div>
                    </div>
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {data.factories.filter(pt => String(pt.farmId) === String(id)).map((pt, idx) => (
                            <div key={idx} className="bg-black/40 border border-slate-800 rounded-2xl p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-white uppercase truncate pr-2">{pt.name}</h4>
                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${pt.active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {pt.active ? 'ONLINE' : 'STOPPED'}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {pt.inputs.slice(0, 2).map((inp, i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500">
                                                <span>{inp.type}</span>
                                                <span className="text-white">{Math.floor(inp.pct)}%</span>
                                            </div>
                                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{width: `${inp.pct}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </section>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.3); }
      `}</style>
    </div>
  );
};

export default App;
