const DB_NAME = 'projekt-nizza-db';
const DB_VERSION = 1;
const STORE = 'workouts';
let db;
let currentView = 'week';
let anchorDate = new Date();
let workouts = [];

const $ = (id) => document.getElementById(id);
const els = {
  calendar: $('calendarView'), periodLabel: $('periodLabel'), periodTitle: $('periodTitle'),
  dialog: $('workoutDialog'), form: $('workoutForm'), backupDialog: $('backupDialog')
};

const typeColors = {
  Grundlage:'#4ea8de', Sweetspot:'#a78bfa', Bergtraining:'#ef476f', Regeneration:'#60d394',
  Fußball:'#ff9f1c', Punktspiel:'#ff595e', Kraft:'#8ac926', Ruhetag:'#7b879d'
};

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{const database=req.result;if(!database.objectStoreNames.contains(STORE)){const s=database.createObjectStore(STORE,{keyPath:'id'});s.createIndex('date','date',{unique:true});}};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
function tx(mode='readonly'){return db.transaction(STORE,mode).objectStore(STORE)}
function getAll(){return new Promise((res,rej)=>{const r=tx().getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function put(item){return new Promise((res,rej)=>{const r=tx('readwrite').put(item);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function remove(id){return new Promise((res,rej)=>{const r=tx('readwrite').delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function clearStore(){return new Promise((res,rej)=>{const r=tx('readwrite').clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}

function iso(d){const x=new Date(d);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)}
function parseDate(s){return new Date(`${s}T12:00:00`)}
function fmtDate(d,opts={weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'}){return new Intl.DateTimeFormat('de-DE',opts).format(d)}
function startOfWeek(d){const x=new Date(d);const day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);x.setHours(12,0,0,0);return x}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function workoutFor(date){return workouts.find(w=>w.date===iso(date))}

async function refresh(){workouts=await getAll();workouts.sort((a,b)=>a.date.localeCompare(b.date));render();renderHero()}
function render(){
  document.querySelectorAll('.view-switch button').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  if(currentView==='day') renderDay(); else if(currentView==='week') renderWeek(); else renderMonth();
}
function renderHero(){
  const today=iso(new Date());
  const next=workouts.find(w=>!w.done && w.date>=today) || workouts.find(w=>!w.done);
  if(!next){$('nextWorkoutTitle').textContent='Noch kein Training geplant';$('nextWorkoutMeta').textContent='Lege deinen ersten Trainingstag an.';$('openNextBtn').disabled=true;return}
  $('nextWorkoutTitle').textContent=next.title;
  $('nextWorkoutMeta').textContent=`${fmtDate(parseDate(next.date),{weekday:'short',day:'2-digit',month:'2-digit'})} · ${next.type}${next.plannedDuration?` · ${next.plannedDuration} Min.`:''}`;
  $('openNextBtn').disabled=false;$('openNextBtn').onclick=()=>openWorkout(next);
}
function dayCard(date){
  const w=workoutFor(date);const card=document.createElement('article');card.className=`day-card ${iso(date)===iso(new Date())?'today':''} ${w?.done?'done':''}`;card.style.setProperty('--type-color',typeColors[w?.type]||'#53627b');
  if(!w){card.classList.add('empty-card');card.innerHTML=`<div class="date-block"><strong>${fmtDate(date,{weekday:'long',day:'2-digit',month:'2-digit'})}</strong></div><p>Kein Training geplant</p><span>Tippen zum Anlegen</span>`;card.onclick=()=>openWorkout(null,date);return card}
  card.innerHTML=`<div class="day-head"><div class="date-block"><strong>${fmtDate(date,{weekday:'long'})}</strong><span>${fmtDate(date,{day:'2-digit',month:'2-digit',year:'numeric'})}</span></div><span class="status ${w.done?'done':''}">${w.done?'Erledigt':'Geplant'}</span></div><div class="workout-title">${escapeHtml(w.title)}</div><div class="workout-meta"><span class="meta-pill">${escapeHtml(w.type)}</span>${w.zone&&w.zone!=='-'?`<span class="meta-pill">${escapeHtml(w.zone)}</span>`:''}${w.plannedDuration?`<span class="meta-pill">${w.plannedDuration} Min.</span>`:''}${w.km?`<span class="meta-pill">${w.km} km</span>`:''}${w.hm?`<span class="meta-pill">${w.hm} hm</span>`:''}</div>`;
  card.onclick=()=>openWorkout(w);return card;
}
function renderDay(){
  els.periodLabel.textContent='Tagesansicht';els.periodTitle.textContent=fmtDate(anchorDate);els.calendar.innerHTML='';els.calendar.appendChild(dayCard(anchorDate));
}
function renderWeek(){
  const start=startOfWeek(anchorDate),end=addDays(start,6);els.periodLabel.textContent='Wochenansicht';els.periodTitle.textContent=`${fmtDate(start,{day:'2-digit',month:'2-digit'})} – ${fmtDate(end,{day:'2-digit',month:'2-digit',year:'numeric'})}`;els.calendar.innerHTML='';for(let i=0;i<7;i++)els.calendar.appendChild(dayCard(addDays(start,i)));
}
function renderMonth(){
  const y=anchorDate.getFullYear(),m=anchorDate.getMonth();els.periodLabel.textContent='Monatsansicht';els.periodTitle.textContent=new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(anchorDate);
  const grid=document.createElement('div');grid.className='month-grid';['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(x=>{const h=document.createElement('div');h.className='month-head';h.textContent=x;grid.appendChild(h)});
  const first=new Date(y,m,1,12),start=startOfWeek(first);for(let i=0;i<42;i++){const d=addDays(start,i),w=workoutFor(d),cell=document.createElement('div');cell.className=`month-day ${d.getMonth()!==m?'other':''} ${iso(d)===iso(new Date())?'today':''}`;cell.style.setProperty('--type-color',typeColors[w?.type]||'#53627b');cell.innerHTML=`<strong>${d.getDate()}</strong>${w?`<div class="dot"></div><div style="font-size:.68rem;margin-top:6px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${escapeHtml(w.title)}</div>`:''}`;cell.onclick=()=>w?openWorkout(w):openWorkout(null,d);grid.appendChild(cell)}els.calendar.innerHTML='';els.calendar.appendChild(grid);
}
function shiftPeriod(dir){if(currentView==='day')anchorDate=addDays(anchorDate,dir);else if(currentView==='week')anchorDate=addDays(anchorDate,dir*7);else anchorDate=new Date(anchorDate.getFullYear(),anchorDate.getMonth()+dir,1,12);render()}
function openWorkout(w,date=new Date()){
  $('dialogTitle').textContent=w?'Training bearbeiten':'Training anlegen';$('workoutId').value=w?.id||'';$('dateInput').value=w?.date||iso(date);$('titleInput').value=w?.title||'';$('typeInput').value=w?.type||'Grundlage';$('zoneInput').value=w?.zone||'-';$('plannedDurationInput').value=w?.plannedDuration||'';$('actualDurationInput').value=w?.actualDuration||'';$('kmInput').value=w?.km||'';$('hmInput').value=w?.hm||'';$('detailsInput').value=w?.details||'';$('doneInput').checked=!!w?.done;$('deleteWorkoutBtn').classList.toggle('hidden',!w);els.dialog.showModal();
}
function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

els.form.addEventListener('submit',async(e)=>{e.preventDefault();const id=$('workoutId').value||crypto.randomUUID();const item={id,date:$('dateInput').value,title:$('titleInput').value.trim(),type:$('typeInput').value,zone:$('zoneInput').value,plannedDuration:Number($('plannedDurationInput').value)||0,actualDuration:Number($('actualDurationInput').value)||0,km:Number($('kmInput').value)||0,hm:Number($('hmInput').value)||0,details:$('detailsInput').value.trim(),done:$('doneInput').checked,updatedAt:new Date().toISOString()};const existingSameDate=workouts.find(w=>w.date===item.date&&w.id!==id);if(existingSameDate&&!confirm('Für dieses Datum existiert bereits ein Training. Soll es ersetzt werden?'))return;if(existingSameDate)await remove(existingSameDate.id);await put(item);els.dialog.close();await refresh()});
$('deleteWorkoutBtn').onclick=async()=>{const id=$('workoutId').value;if(id&&confirm('Dieses Training wirklich löschen?')){await remove(id);els.dialog.close();await refresh()}};
$('addWorkoutBtn').onclick=()=>openWorkout(null,anchorDate);$('closeDialog').onclick=$('cancelBtn').onclick=()=>els.dialog.close();$('prevPeriod').onclick=()=>shiftPeriod(-1);$('nextPeriod').onclick=()=>shiftPeriod(1);
document.querySelectorAll('.view-switch button').forEach(b=>b.onclick=()=>{currentView=b.dataset.view;render()});
$('backupBtn').onclick=()=>els.backupDialog.showModal();$('closeBackupDialog').onclick=()=>els.backupDialog.close();
$('exportBackupBtn').onclick=async()=>{const payload={app:'projekt-nizza',version:1,exportedAt:new Date().toISOString(),workouts:await getAll()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`projekt-nizza-backup-${iso(new Date())}.json`;a.click();URL.revokeObjectURL(a.href)};
$('importBackupInput').onchange=async(e)=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.workouts))throw new Error('Ungültiges Backup');if(!confirm('Aktuelle Trainings durch dieses Backup ersetzen?'))return;await clearStore();for(const w of data.workouts)await put(w);els.backupDialog.close();await refresh();alert('Backup wurde wiederhergestellt.')}catch(err){alert(`Import fehlgeschlagen: ${err.message}`)}finally{e.target.value=''}};

(async()=>{try{db=await openDB();await refresh();if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}catch(err){console.error(err);alert('Die lokale Datenbank konnte nicht geöffnet werden.');}})();
