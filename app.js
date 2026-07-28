const KEY='projektNizzaDataV4';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const todayISO=()=>new Date().toISOString().slice(0,10);
const addDays=(date,n)=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const fmtDate=d=>new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(d+'T12:00:00'));
const monthName=k=>new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(new Date(k+'-01T12:00:00'));
const uid=()=>crypto.randomUUID?.()||Math.random().toString(36).slice(2);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function seedPlan(){
 const start=todayISO();
 const weeks=[
  ['Ruhetag','Aktive Erholung',0,'—','Komplett erholen. Viel essen, trinken und schlafen. 10–15 Minuten lockere Mobility.'],
  ['Ruhetag','Zweiter Ruhetag',0,'—','Spaziergang möglich. Kein Leistungsdruck. Beine beobachten.'],
  ['Rad','Sehr lockerer Wiedereinstieg',45,'Z1–Z2','30–60 Minuten locker, flach und mit hoher Trittfrequenz.'],
  ['Mobility','Beweglichkeit & Rumpf',25,'locker','Knie, Hüfte, Rücken und Core. Keine schwere Beinbelastung.'],
  ['Rad','Grundlage locker',90,'Z2','Ruhiges Ausdauertraining. Nur verlängern, wenn die Beine frisch sind.'],
  ['Ruhetag','Erholung',0,'—','Ruhe oder Spaziergang.'],
  ['Rad','Lange ruhige Ausfahrt',150,'Z2','Ohne Gepäck. Verpflegung ab Stunde 1 konsequent testen.'],
  ['Kraft','Beine & Core',45,'RPE 6','Kniebeuge-Variante, Ausfallschritte, Waden, Core. Saubere Technik.'],
  ['Rad','Sweetspot Einstieg',60,'Z3–Z4','2×12 Minuten zügig, dazwischen 6 Minuten locker.'],
  ['Ruhetag','Ruhetag',0,'—','Schlaf und Ernährung priorisieren.'],
  ['Rad','Grundlage',105,'Z2','Konstant locker. Keine Jagd nach Durchschnitt.'],
  ['Mobility','Mobility',20,'locker','Hüfte, Oberschenkel, Rücken.'],
  ['Rad','Bergkraft',75,'Z3','5×5 Minuten niedrige Trittfrequenz am Berg oder Indoor.'],
  ['Rad','Lange Ausfahrt',210,'Z2','Erste längere Tour. 60–80 g Kohlenhydrate pro Stunde testen.'],
  ['Ruhetag','Erholung',0,'—','Aktiv erholen.'],
  ['Kraft','Beine & Core',50,'RPE 7','Moderates Krafttraining, nicht bis Muskelversagen.'],
  ['Rad','VO₂max Einstieg',55,'Z4–Z5','5×3 Minuten hart, 3 Minuten locker.'],
  ['Ruhetag','Ruhetag',0,'—','Komplett locker.'],
  ['Rad','Grundlage mit Gepäck',120,'Z2','Leicht beladen, Position und Taschen testen.'],
  ['Mobility','Mobility',20,'locker','Locker bewegen.'],
  ['Rad','Lange Ausfahrt mit Gepäck',240,'Z2','Mit moderatem Gepäck, gleichmäßige Verpflegung.']
 ];
 return weeks.map((x,i)=>({id:uid(),date:addDays(start,i),type:x[0],title:x[1],duration:x[2],zone:x[3],details:x[4],done:false}));
}
const defaultTeams=[
{name:'Alpine Horizon',riders:['Mārtiņš Ozols','Léo Marchand','Nico Bellini','Tomás Varela','Jonas Reiter','Emil Sørensen']},
{name:'Velocité Racing',riders:['Adrien Moreau','Mateo Kovač','Pietro Riva','Lukas Brandt','Kasper Holm','Diego Serra']},
{name:'Nordic Pulse',riders:['Elias Nyström','Mikkel Voss','Aron Lindberg','Sven Dahl','Ruben Falk','Tobias Mørk']},
{name:'Corsa Blu',riders:['Alessio Conti','Marco Bellucci','Dario Leone','Enzo Ricci','Fabio Greco','Luca Neri']}
];
const defaults={
 profile:{name:'Sebastian',targetDate:'2027-07-26',routeKm:1100,level:1,xp:0},
 settings:{monthlyKm:{},monthlyMax:{},monthlyHm:{},theme:'dark'},
 entries:[],plan:seedPlan(),photos:[],achievements:{},
 missions:{passes:[
  {name:'Kühtai bezwingen',done:false,note:'Versuch 2026: 5 km vor Kühtai umgedreht.'},
  {name:'Reschenpass mit Reserven',done:false,note:''},{name:'Stilfser Joch kontrolliert',done:false,note:''},
  {name:'3 Tage Bikepacking am Stück',done:false,note:''},{name:'2.000 hm mit Gepäck',done:false,note:''},{name:'120 km mit Gepäck',done:false,note:''}
 ]},
 route:[
  ['Haibach','Start'],['Wasserburg am Inn','Etappe 1'],['Schwaz','Etappe 2'],['Landeck','Etappe 3'],['Bormio','Stilfser Joch'],['Darfo Boario Terme','Etappe 5'],['Monteleone','Etappe 6'],['Novi Ligure','Etappe 7'],['Finale Ligure','Meer'],['Isolabona','Etappe 9'],['Nizza','Ziel 🌊']
 ],
 tour:{teams:defaultTeams,stages:[
  {name:'Etappe 1',km:132,type:'Sprint',results:[],sprint:[],mountain:[]},
  {name:'Etappe 2',km:151,type:'Hügel',results:[],sprint:[],mountain:[]},
  {name:'Etappe 3',km:164,type:'Berg',results:[],sprint:[],mountain:[]}
 ]}
};
function load(){try{const old=JSON.parse(localStorage.getItem(KEY)||'null');return old?deepMerge(structuredClone(defaults),old):structuredClone(defaults)}catch{return structuredClone(defaults)}}
function deepMerge(base,extra){for(const k in extra){if(extra[k]&&typeof extra[k]==='object'&&!Array.isArray(extra[k])&&base[k])deepMerge(base[k],extra[k]);else base[k]=extra[k]}return base}
let data=load(), page='dashboard', planFilter='Alle', tourTab='gc';
function save(msg){localStorage.setItem(KEY,JSON.stringify(data));render();if(msg)toast(msg)}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}

const monthKey=(d=todayISO())=>d.slice(0,7);
const entriesMonth=(k=monthKey())=>data.entries.filter(e=>e.date.startsWith(k));
const sum=(arr,key)=>arr.reduce((s,e)=>s+(+e[key]||0),0);
const kmMonth=k=>sum(entriesMonth(k),'km'), hmMonth=k=>sum(entriesMonth(k),'hm');
const totalKm=()=>sum(data.entries,'km'), totalHm=()=>sum(data.entries,'hm');
const currentTarget=()=>data.settings.monthlyKm[monthKey()]||500;
const currentMax=()=>data.settings.monthlyMax[monthKey()]||650;
const currentHmTarget=()=>data.settings.monthlyHm[monthKey()]||5000;
const daysToTarget=()=>Math.max(0,Math.ceil((new Date(data.profile.targetDate+'T12:00:00')-new Date())/86400000));
function calcXp(){return Math.round(data.entries.reduce((s,e)=>s+(+e.km||0)*1.15+(+e.hm||0)/45+(e.type==='Kraft'?50:0)+(e.type==='Mobility'?20:0)+(e.type==='Ruhetag'?15:0),0)+data.plan.filter(p=>p.done).length*20)}
const level=()=>Math.max(1,Math.floor(calcXp()/600)+1);
const levelName=l=>l<5?'Einsteiger':l<10?'Amateur':l<18?'Tourenfahrer':l<28?'Alpenfahrer':l<40?'Bikepacker':'Nizza Rider';
function completedDates(){return new Set([...data.entries.map(e=>e.date),...data.plan.filter(p=>p.done).map(p=>p.date)])}
function streak(){const c=completedDates();let n=0,d=new Date();for(let i=0;i<730;i++){let iso=d.toISOString().slice(0,10);if(c.has(iso)){n++;d.setDate(d.getDate()-1)}else if(i===0)d.setDate(d.getDate()-1);else break}return n}
function weekEntries(){const d=new Date(),day=(d.getDay()+6)%7,start=new Date(d);start.setDate(d.getDate()-day);start.setHours(0,0,0,0);return data.entries.filter(e=>new Date(e.date+'T12:00:00')>=start)}
function best(key){return data.entries.reduce((m,e)=>Math.max(m,+e[key]||0),0)}
function goalDone(n,gear){return data.entries.some(e=>(gear?e.gear:!e.gear)&&(+e.km>=n))}
function formatSec(s){s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return `${h?`${h}:`:''}${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`}

$$('.nav-btn').forEach(b=>b.onclick=()=>{page=b.dataset.page;$$('.nav-btn').forEach(x=>x.classList.toggle('active',x===b));render()});
function render(){data.profile.xp=calcXp();data.profile.level=level();({dashboard:renderDashboard,plan:renderPlan,log:renderLog,missions:renderMissions,tour:renderTour,more:renderMore}[page]||renderDashboard)()}
function planItem(p,full=false){return `<div class="list-item"><div><span class="badge ${p.done?'ok':''}">${fmtDate(p.date)}</span><h3 style="margin-top:7px">${esc(p.title)}</h3><p>${esc(p.type)} · ${p.duration?p.duration+' Min · ':''}${esc(p.zone)}</p>${full?`<p style="margin-top:5px">${esc(p.details)}</p>`:''}</div><div class="row"><button class="check ${p.done?'done':''}" onclick="togglePlan('${p.id}')">${p.done?'✓':''}</button>${full?`<button class="icon-btn" onclick="deletePlan('${p.id}')">⌫</button>`:''}</div></div>`}

function renderDashboard(){
 const km=kmMonth(),target=currentTarget(),max=currentMax(),hm=hmMonth(),hmTarget=currentHmTarget(),routeProg=clamp(totalKm()/data.profile.routeKm*100,0,100),today=data.plan.filter(p=>p.date===todayISO());
 const closer=(100/daysToTarget()).toFixed(2);
 $('#view').innerHTML=`
 <section class="card hero"><div class="row between"><span class="badge">🌊 Nizza 2027</span><span class="badge gold">Noch ${daysToTarget()} Tage</span></div><h2>${routeProg.toFixed(0)} % bis Nizza</h2><div class="progress"><span style="width:${routeProg}%"></span></div><p class="quote">Heute bist du durch jede gute Entscheidung näher am Ziel. Rechnerisch entspricht ein Trainingstag etwa ${closer}% deines Countdowns.</p></section>
 <section class="grid-4"><div class="stat"><small>🔥 Streak</small><strong>${streak()} Tage</strong></div><div class="stat"><small>🏆 Level</small><strong>${level()}</strong><span class="muted">${levelName(level())}</span></div><div class="stat"><small>⚡ XP</small><strong>${calcXp()}</strong></div><div class="stat"><small>🚴 Gesamt</small><strong>${totalKm().toFixed(0)} km</strong></div></section>
 <section class="card"><div class="section-title"><h2>Monatsmission ${monthName(monthKey())}</h2><button class="ghost-btn" onclick="openMonthSettings()">Anpassen</button></div><div class="row between"><strong>${km.toFixed(0)} / ${target} km</strong><span class="badge ${km>=target?'ok':''}">${Math.min(100,km/target*100).toFixed(0)}%</span></div><div class="progress gold" style="margin:9px 0"><span style="width:${clamp(km/target*100,0,100)}%"></span></div><div class="row between muted"><span>${hm.toFixed(0)} / ${hmTarget} hm</span><span>Obergrenze ${max} km</span></div>${km>max?'<div class="notice" style="margin-top:10px">Obergrenze überschritten: Jetzt Erholung ernst nehmen.</div>':''}</section>
 <section class="card"><div class="section-title"><h2>Heute</h2><span class="muted">${fmtDate(todayISO())}</span></div><div class="list">${today.length?today.map(p=>planItem(p)).join(''):'<div class="notice">Noch keine Einheit geplant.</div>'}</div></section>
 <section class="grid-2"><button class="card" style="text-align:left;color:white" onclick="goPage('log')"><span class="badge">＋ Einheit</span><h2>Training eintragen</h2><p class="muted">Kilometer, Höhenmeter, Gepäck und Gefühl.</p></button><button class="card" style="text-align:left;color:white" onclick="goPage('tour')"><span class="badge gold">♛ Tour de l’Ain</span><h2>Virtuelle Rundfahrt</h2><p class="muted">Etappen, Wertungen und Teams.</p></button></section>
 <section class="memory"><h3>27.07.2026 · Kühtai</h3><div class="muted">5 km vor der Passhöhe umgedreht. Nicht das Ende – der Start des stärkeren Anlaufs.</div></section>`;
}
function renderPlan(){
 const items=[...data.plan].filter(p=>planFilter==='Alle'||p.type===planFilter).sort((a,b)=>a.date.localeCompare(b.date));
 $('#view').innerHTML=`<section class="card"><div class="section-title"><h2>Trainingsplan</h2><button class="btn" onclick="openPlanForm()">＋ Einheit</button></div><div class="chips">${['Alle','Rad','Indoor','Kraft','Mobility','Ruhetag','Fußball'].map(x=>`<button class="chip ${planFilter===x?'active':''}" onclick="setPlanFilter('${x}')">${x}</button>`).join('')}</div><div class="list" style="margin-top:12px">${items.map(p=>planItem(p,true)).join('')}</div></section><section class="card"><div class="section-title"><h2>Planwerkzeuge</h2></div><div class="grid-2"><button class="ghost-btn" onclick="generateBaseMonth()">4 Wochen Grundlage erzeugen</button><button class="ghost-btn" onclick="clearFuturePlan()">Zukünftigen Plan löschen</button></div></section>`;
}
function renderLog(){
 const recent=[...data.entries].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);
 $('#view').innerHTML=`<section class="card"><div class="section-title"><h2>Training eintragen</h2><span class="badge">lokal gespeichert</span></div><form id="entryForm" class="form-grid">
 <div class="field"><label>Datum</label><input name="date" type="date" value="${todayISO()}" required></div><div class="field"><label>Art</label><select name="type"><option>Rad draußen</option><option>Indoor</option><option>Kraft</option><option>Mobility</option><option>Fußball</option><option>Ruhetag</option></select></div>
 <div class="field"><label>Kilometer</label><input name="km" type="number" min="0" step="0.1"></div><div class="field"><label>Höhenmeter</label><input name="hm" type="number" min="0"></div><div class="field"><label>Dauer (Min)</label><input name="minutes" type="number" min="0"></div><div class="field"><label>Belastung 1–10</label><input name="rpe" type="number" min="1" max="10" value="5"></div>
 <div class="field"><label>Mit Gepäck?</label><select name="gear"><option value="false">Nein</option><option value="true">Ja</option></select></div><div class="field"><label>Gepäckgewicht</label><input name="gearKg" type="number" min="0" step="0.5"></div><div class="field"><label>Beingefühl</label><select name="legs"><option>Sehr frisch</option><option>Gut</option><option selected>Okay</option><option>Schwer</option><option>Leer</option></select></div><div class="field"><label>Motivation 1–5</label><input name="motivation" type="number" min="1" max="5" value="4"></div>
 <div class="field full"><label>Notiz</label><textarea name="notes" placeholder="Verpflegung, Wetter, Schmerzen, was gut lief ..."></textarea></div><div class="field full"><button class="btn">Einheit speichern</button></div></form></section>
 <section class="card"><div class="section-title"><h2>Letzte Einheiten</h2></div><div class="list">${recent.length?recent.map(e=>`<div class="list-item"><div><h3>${fmtDate(e.date)} · ${esc(e.type)}</h3><p>${e.km||0} km · ${e.hm||0} hm · ${e.minutes||0} Min ${e.gear?'· mit Gepäck':''}</p><p>${esc(e.notes||'')}</p></div><button class="icon-btn" onclick="deleteEntry('${e.id}')">⌫</button></div>`).join(''):'<div class="notice">Noch keine Einheiten eingetragen.</div>'}</div></section>`;
 $('#entryForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);data.entries.push({id:uid(),date:f.get('date'),type:f.get('type'),km:+f.get('km')||0,hm:+f.get('hm')||0,minutes:+f.get('minutes')||0,rpe:+f.get('rpe')||0,gear:f.get('gear')==='true',gearKg:+f.get('gearKg')||0,legs:f.get('legs'),motivation:+f.get('motivation')||0,notes:f.get('notes')});save('Einheit gespeichert')}
}
function renderMissions(){
 const vals=Array.from({length:19},(_,i)=>20+i*10);
 $('#view').innerHTML=`<section class="card"><div class="section-title"><h2>Distanzziele</h2><span class="badge gold">20–200 km</span></div><div class="tabs"><button class="tab active" onclick="switchGoal(false,this)">Ohne Gepäck</button><button class="tab" onclick="switchGoal(true,this)">Mit Gepäck</button></div><div id="goalWrap" class="goal-grid" style="margin-top:12px">${vals.map(n=>`<div class="goal ${goalDone(n,false)?'done':''}">${goalDone(n,false)?'✓ ':''}${n} km</div>`).join('')}</div></section>
 <section class="card"><div class="section-title"><h2>Alpenmissionen</h2></div><div class="list">${data.missions.passes.map((m,i)=>`<div class="list-item"><div><h3>${esc(m.name)}</h3><p>${esc(m.note)}</p></div><button class="badge ${m.done?'ok':''}" onclick="togglePass(${i})">${m.done?'Geschafft':'Offen'}</button></div>`).join('')}</div></section>
 <section class="card"><div class="section-title"><h2>Persönliche Rekorde</h2></div><div class="grid-3"><div class="stat"><small>Längste Fahrt</small><strong>${best('km')} km</strong></div><div class="stat"><small>Meiste hm</small><strong>${best('hm')} hm</strong></div><div class="stat"><small>Gesamt hm</small><strong>${totalHm().toFixed(0)}</strong></div></div></section>`;
}
function gcRows(){const map={};data.tour.stages.forEach(s=>s.results.forEach(r=>map[r.rider]=(map[r.rider]||0)+(+r.seconds||0)));return Object.entries(map).sort((a,b)=>a[1]-b[1])}
function pointsRows(type){const map={};data.tour.stages.forEach(s=>(s[type]||[]).forEach(r=>map[r.rider]=(map[r.rider]||0)+(+r.points||0)));return Object.entries(map).sort((a,b)=>b[1]-a[1])}
function rankingTable(type){const rows=type==='gc'?gcRows():pointsRows(type),lead=rows[0]?.[1]||0;if(!rows.length)return '<div class="notice">Noch keine Ergebnisse vorhanden.</div>';return `<table class="tour-table"><thead><tr><th>#</th><th>Fahrer</th><th>${type==='gc'?'Zeit':'Punkte'}</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r[0])}</td><td>${type==='gc'?(i===0?'Leader':'+'+formatSec(r[1]-lead)):r[1]}</td></tr>`).join('')}</tbody></table>`}
function renderTour(){
 const stageCards=data.tour.stages.map((s,i)=>`<div class="list-item"><div><h3>${esc(s.name)}</h3><p>${s.km} km · ${esc(s.type)} · ${s.results.length} Resultate</p></div><button class="ghost-btn" onclick="openStageResult(${i})">Ergebnis</button></div>`).join('');
 $('#view').innerHTML=`<section class="card hero"><div class="row between"><div><span class="badge gold">♛ Virtuelle Rundfahrt</span><h2>Tour de l’Ain</h2></div><button class="btn" onclick="addStage()">＋ Etappe</button></div><p class="muted">Gesamtwertung, Sprintwertung, Bergwertung, Teams und Etappenhistorie.</p></section>
 <section class="card"><div class="tabs"><button class="tab ${tourTab==='gc'?'active':''}" onclick="setTourTab('gc')">Gesamt</button><button class="tab ${tourTab==='sprint'?'active':''}" onclick="setTourTab('sprint')">Sprint</button><button class="tab ${tourTab==='mountain'?'active':''}" onclick="setTourTab('mountain')">Berg</button></div><div style="margin-top:12px">${rankingTable(tourTab)}</div></section>
 <section class="card"><div class="section-title"><h2>Etappen</h2></div><div class="list">${stageCards}</div></section>
 <section class="card"><div class="section-title"><h2>Teams</h2><button class="ghost-btn" onclick="editTeam(-1)">＋ Team</button></div><div class="list">${data.tour.teams.map((t,i)=>`<div class="list-item"><div><h3>${esc(t.name)}</h3><p>${t.riders.map(esc).join(' · ')}</p></div><button class="icon-btn" onclick="editTeam(${i})">✎</button></div>`).join('')}</div></section>`;
}
function renderMore(){
 const months=[];for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);const k=d.toISOString().slice(0,7);months.push({k,km:kmMonth(k)})}const mx=Math.max(1,...months.map(x=>x.km));
 $('#view').innerHTML=`<section class="card"><div class="section-title"><h2>6-Monats-Entwicklung</h2></div><div class="chart">${months.map(m=>`<div class="bar" style="height:${Math.max(4,m.km/mx*100)}%"><span>${m.k.slice(5)}</span></div>`).join('')}</div></section>
 <section class="card"><div class="section-title"><h2>Virtuelle Reise nach Nizza</h2><span class="badge">${totalKm().toFixed(0)} / ${data.profile.routeKm} km</span></div><div class="route">${data.route.map((r,i)=>`<div class="route-stop"><strong>${esc(r[0])}</strong><div class="muted">${esc(r[1])}</div></div>`).join('')}</div></section>
 <section class="card"><div class="section-title"><h2>Daten & Einstellungen</h2></div><div class="grid-2"><button class="ghost-btn" onclick="exportData()">Backup exportieren</button><button class="ghost-btn" onclick="$('#importFile').click()">Backup importieren</button><button class="ghost-btn" onclick="openProfile()">Zieldatum ändern</button><button class="ghost-btn" onclick="resetApp()">App zurücksetzen</button></div></section>`;
}

window.goPage=p=>{page=p;$$('.nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.page===p));render()};
window.togglePlan=id=>{const p=data.plan.find(x=>x.id===id);if(p)p.done=!p.done;save('Plan aktualisiert')};
window.deletePlan=id=>{if(confirm('Einheit löschen?')){data.plan=data.plan.filter(x=>x.id!==id);save()}};
window.deleteEntry=id=>{if(confirm('Eintrag löschen?')){data.entries=data.entries.filter(x=>x.id!==id);save()}};
window.setPlanFilter=x=>{planFilter=x;render()};window.setTourTab=x=>{tourTab=x;render()};
window.togglePass=i=>{data.missions.passes[i].done=!data.missions.passes[i].done;save()};
window.switchGoal=(gear,btn)=>{$$('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const vals=Array.from({length:19},(_,i)=>20+i*10);$('#goalWrap').innerHTML=vals.map(n=>`<div class="goal ${goalDone(n,gear)?'done':''}">${goalDone(n,gear)?'✓ ':''}${n} km</div>`).join('')};
const modal=$('#modal'),modalContent=$('#modalContent');function showModal(h){modalContent.innerHTML=h;modal.showModal()}
window.openMonthSettings=()=>{const k=monthKey();showModal(`<h2>Monatsmission</h2><form id="mForm" class="form-grid"><div class="field full"><label>Monat</label><input name="month" type="month" value="${k}"></div><div class="field"><label>Kilometerziel</label><input name="target" type="number" value="${data.settings.monthlyKm[k]||500}"></div><div class="field"><label>Obergrenze</label><input name="max" type="number" value="${data.settings.monthlyMax[k]||650}"></div><div class="field full"><label>Höhenmeterziel</label><input name="hm" type="number" value="${data.settings.monthlyHm[k]||5000}"></div><div class="field full"><button class="btn">Speichern</button></div></form>`);$('#mForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),m=f.get('month');data.settings.monthlyKm[m]=+f.get('target');data.settings.monthlyMax[m]=+f.get('max');data.settings.monthlyHm[m]=+f.get('hm');modal.close();save('Monatsmission gespeichert')}};
window.openPlanForm=()=>{showModal(`<h2>Einheit planen</h2><form id="pForm" class="form-grid"><div class="field"><label>Datum</label><input name="date" type="date" value="${todayISO()}" required></div><div class="field"><label>Art</label><select name="type"><option>Rad</option><option>Indoor</option><option>Kraft</option><option>Mobility</option><option>Ruhetag</option><option>Fußball</option></select></div><div class="field full"><label>Titel</label><input name="title" required></div><div class="field"><label>Dauer</label><input name="duration" type="number"></div><div class="field"><label>Zone</label><input name="zone"></div><div class="field full"><label>Beschreibung</label><textarea name="details"></textarea></div><div class="field full"><button class="btn">Speichern</button></div></form>`);$('#pForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);data.plan.push({id:uid(),date:f.get('date'),type:f.get('type'),title:f.get('title'),duration:+f.get('duration')||0,zone:f.get('zone')||'—',details:f.get('details')||'',done:false});modal.close();save('Einheit geplant')}};
window.generateBaseMonth=()=>{const start=addDays(todayISO(),1),template=[['Rad','Grundlage locker',75,'Z2'],['Kraft','Beine & Core',45,'RPE 6'],['Ruhetag','Erholung',0,'—'],['Rad','Sweetspot',60,'Z3–Z4'],['Mobility','Mobility',20,'locker'],['Rad','Lange Ausfahrt',180,'Z2'],['Ruhetag','Ruhetag',0,'—']];for(let i=0;i<28;i++){const x=template[i%7];data.plan.push({id:uid(),date:addDays(start,i),type:x[0],title:x[1],duration:x[2],zone:x[3],details:'Automatisch erzeugter Grundlagenblock. Bei Erschöpfung reduzieren.',done:false})}save('4 Wochen erzeugt')};
window.clearFuturePlan=()=>{if(confirm('Alle zukünftigen Einheiten löschen?')){data.plan=data.plan.filter(p=>p.date<todayISO());save()}};
window.editTeam=i=>{const t=i>=0?data.tour.teams[i]:{name:'',riders:[]};showModal(`<h2>${i>=0?'Team bearbeiten':'Team hinzufügen'}</h2><form id="tForm" class="form-grid"><div class="field full"><label>Teamname</label><input name="name" value="${esc(t.name)}" required></div><div class="field full"><label>Fahrer, durch Komma getrennt</label><textarea name="riders">${esc(t.riders.join(', '))}</textarea></div><div class="field full"><button class="btn">Speichern</button></div></form>`);$('#tForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),obj={name:f.get('name'),riders:f.get('riders').split(',').map(x=>x.trim()).filter(Boolean)};if(i>=0)data.tour.teams[i]=obj;else data.tour.teams.push(obj);modal.close();save('Team gespeichert')}};
window.addStage=()=>{showModal(`<h2>Etappe hinzufügen</h2><form id="sForm" class="form-grid"><div class="field full"><label>Name</label><input name="name" value="Etappe ${data.tour.stages.length+1}" required></div><div class="field"><label>Kilometer</label><input name="km" type="number" required></div><div class="field"><label>Typ</label><select name="type"><option>Sprint</option><option>Hügel</option><option>Berg</option><option>Zeitfahren</option></select></div><div class="field full"><button class="btn">Speichern</button></div></form>`);$('#sForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);data.tour.stages.push({name:f.get('name'),km:+f.get('km'),type:f.get('type'),results:[],sprint:[],mountain:[]});modal.close();save('Etappe hinzugefügt')}};
window.openStageResult=idx=>{const riders=data.tour.teams.flatMap(t=>t.riders);showModal(`<h2>${esc(data.tour.stages[idx].name)} – Resultat</h2><form id="rForm" class="form-grid"><div class="field full"><label>Fahrer</label><select name="rider">${riders.map(r=>`<option>${esc(r)}</option>`).join('')}</select></div><div class="field"><label>Stunden</label><input name="h" type="number" value="3"></div><div class="field"><label>Minuten</label><input name="m" type="number" value="20"></div><div class="field"><label>Sekunden</label><input name="s" type="number" value="0"></div><div class="field"><label>Sprintpunkte</label><input name="sp" type="number" value="0"></div><div class="field"><label>Bergpunkte</label><input name="mp" type="number" value="0"></div><div class="field full"><button class="btn">Speichern</button></div></form>`);$('#rForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),r=f.get('rider'),st=data.tour.stages[idx],seconds=+f.get('h')*3600+(+f.get('m'))*60+(+f.get('s'));st.results.push({rider:r,seconds});if(+f.get('sp'))st.sprint.push({rider:r,points:+f.get('sp')});if(+f.get('mp'))st.mountain.push({rider:r,points:+f.get('mp')});modal.close();save('Ergebnis gespeichert')}};
window.openProfile=()=>{showModal(`<h2>Projektziel</h2><form id="profileForm" class="form-grid"><div class="field full"><label>Zieldatum</label><input name="date" type="date" value="${data.profile.targetDate}"></div><div class="field full"><label>Virtuelle Streckenlänge</label><input name="km" type="number" value="${data.profile.routeKm}"></div><div class="field full"><button class="btn">Speichern</button></div></form>`);$('#profileForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);data.profile.targetDate=f.get('date');data.profile.routeKm=+f.get('km');modal.close();save('Projektziel gespeichert')}};
window.exportData=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`projekt-nizza-v4-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(a.href)};
$('#importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{data=deepMerge(structuredClone(defaults),JSON.parse(r.result));save('Backup importiert')}catch{alert('Ungültige Backup-Datei')}};r.readAsText(f)};
window.resetApp=()=>{if(confirm('Wirklich alle App-Daten löschen?')){localStorage.removeItem(KEY);data=structuredClone(defaults);save('App zurückgesetzt')}};
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden')};
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
render();
