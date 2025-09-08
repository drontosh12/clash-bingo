import { useEffect, useMemo, useState } from "react";
import "./App.css";

// === POOLY (tvoje) ===
const POOLS = {
  b4: [
    "Tohle je showbusiness!",
    "Někdo začne rapovat/zpívat",
    "Le Sy se snaží uklidnit",
    "Vzduchem letí sklenička/piti",
    "Já tě sundám za xx vteřin!",
    "Kostým na scéně",
    "Na konci zavolá Tadeáš",
    "Chtěl bych pozdravit Emdžího Titmana"
    "Ochranka musí zasáhnout",
    "Trapné ticho po urážce",
    "Já jsem tady hvězda!",
    "Na konci zavolá někdo z místních fighterů",
    "Já jsem profík, ty nic!",
    "Osobní urážka rodiny",
    "Někdo přijde pozdě",
    "Výzva na zápas mimo kartu",
    "Staredown fight",
    "Začít attack, počkat na security, pokračovat",
    "Fanoušci křičí Jíra ven!",
    "Důkazní materiál na mobilu",
    "Moderátor to ztratil",
    "Svlékání trika u stolu",
    "Hozený předmět",
    "Dáme lokty a kolena?",
    "Zmínka o nejhorším zápase",
    "Napodobení soupeře",
    "Já se tě nebojím!",
    "Předání dárku",
    "Přijde Kaluba",
    "Parodie na OSS",
    "Soupeři si dají nechtěnou pusu na čelo",
    "Zápasník začne ironicky tleskat soupeři",
    "Dojde na obviňování z dopingu",
    "Padne řeč o penězích",
    "„Já tě naučím respektu!“",
    "Někdo si stoupne na židli",
    "Random výbuch emocí -> attack",
    "Někdo to vezme přes nebo pod stůl",
    "Lesy se značně směje",
    "„Můžu jenom...?“",
    "Výmluva",
  ],
  tiskovka: [
    "Narušitel z publika začne řvát",
    "Problém s mikrofonem",
    "Zachovej respekt!",
    "Zápasník odejde z podia",
    "Dortem proti rakovině",
    "Ztrapnění statistikou",
    "Já mám víc views než ty!",
    "Přísahá na člena rodiny",
    "Srovnání s UFC",
    "Slib KO v prvním kole",
    "Pískot a potlesk zároveň",
    "Selfie na pódiu",
    "Sponzorská rekvizita na stole",
    "Parodie na OSS",
    "Spor o váhu i mimo vážení",
    "Letí předmět",
    "Moderátor to ztratí",
    "Řev fanoušků přehluší řeč",
    "Někdo se urazí a mlčí 5 minut",
    "Měj respekt ke sportu!",
    "Dáme lokty a kolena?",
    "Padne téma OnlyFans",
    "Já jsem legenda, ty jsi no name",
    "Po zápase si to zopakujem!",
    "Boj o mikrofon",
    "Důkazní materiál na mobilu",
    "Někdo odmítne odpovídat na otázky",
    "Přijde někdo „z ulice“ a začne se nabízet na fight",
    "Padne řeč o drogách/alkoholu",
    "Výmluva",
  ],
  vazeni: [
    "Nedoržení váhy",
    "Trenýrková provokace",
    "Ochranka odděluje staredown",
    "TikTok taneček u váhy",
    "Přehnané svalové pózy",
    "Kostým/maska na scéně",
    "Výzva na challenge na podiu",
    "Podívej se, jak vypadáš!",
    "Zvedne soupeře v náručí",
    "Předstíraný konflikt",
    "Le Sy se směje",
    "Trener nedorazil",
    "Fighter nedorazil",
    "Fanoušci skandují jméno",
    "Staredown se zraněním",
    "Protein shake jako dárek",
    "Vzájemné strčení",
    "Zítra jdeš k zemi",
    "Předvede se tetování",
    "Výmluva na špatnou váhu",
    "Kotrmelec na podiu",
    "Promotér vleze mezi ně",
    "Trenér se nasere víc než zápasník",
    "Lapování bez lapu",
    "Parodie na OSS",
    "Výmluva",

  ],
  galavecer: [
    "Parodie na OSS",
    "Brutální KO, publikum šílí",
    "Ring girl zastíní fightera",
    "Rozhodčí špatně přeruší fight",
    "Lékař kontroluje zrak",
    "Cutman v akci",
    "Nevyleze na klec na první pokus při oslavě",
    "Showboating uprostřed boje",
    "Prohra protestem",
    "Ring girls dance",
    "Výhra na split decision",
    "Tohle bylo domluvený! z publika",
    "Ztracený chránič zubů",
    "Replay ukáže jiný zásah",
    "Oznámení nejnabitější karty v historii clashe",
    "Překvapivý rematch oznámení",
    "Děkuju rodině",
    "Kick rozhodne fight",
    "Komentátor hlásí meme větu",
    "Zranění během fightu",
    "Ring svítí šíleně",
    "Oslava ve Fortnite tanci",
    "Tady není UFC, tohle je Clash!",
    "Fanoušci zpívají chorál",
    "Zápas trvá max 10 sekund",
    "Prohra na DQ kvůli blbosti",
    "Někdo nepřijde do ringu",
    "Odmítnutý handshake",
    "Přijde si někdo pro fight, protože si ho zaslouží",
    "Výmluva",
  ],
};

const DEFAULT_CATEGORY = "b4";

// utils
function shuffle(a){const arr=[...a];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function pick25(pool){const ext=[...pool];while(ext.length<25)ext.push(...pool);return shuffle(ext).slice(0,25);}
function makeBoard(pool,includeFree=true){
  const raw=pick25(pool).map((t,i)=>({id:`${Date.now()}_${i}_${Math.random()}`,text:t,checked:false}));
  if(includeFree){ raw[12]={...raw[12],text:"FREE SPACE",checked:true,center:true}; }
  return raw;
}
function linesCompleted(cells){
  const grid=Array.from({length:5},(_,r)=>cells.slice(r*5,r*5+5));
  let c=0;
  for(let r=0;r<5;r++) if(grid[r].every(x=>x.checked)) c++;
  for(let k=0;k<5;k++) if(grid.every(row=>row[k].checked)) c++;
  if([0,6,12,18,24].every(i=>cells[i].checked)) c++;
  if([4,8,12,16,20].every(i=>cells[i].checked)) c++;
  return c;
}
function hasAnyBingo(cells){ return linesCompleted(cells) > 0; }

export default function App(){
  const [category,setCategory]=useState(DEFAULT_CATEGORY);
  const [freeSpace,setFreeSpace]=useState(true);
  const [dark,setDark]=useState(true); // default tmavý
  const [board,setBoard]=useState(()=>makeBoard(POOLS[DEFAULT_CATEGORY],true));
  const [nick,setNick]=useState("");
  const [winners,setWinners]=useState([]); // {nick,time,category}
  const [bingoBanner,setBingoBanner]=useState(false);
  const bingoCount=useMemo(()=>linesCompleted(board),[board]);

  useEffect(()=>{ if(bingoBanner){ const t=setTimeout(()=>setBingoBanner(false),2000); return ()=>clearTimeout(t);} },[bingoBanner]);

  const regenerate=()=>{ const pool=POOLS[category]||POOLS[DEFAULT_CATEGORY]; setBoard(makeBoard(pool,freeSpace)); };
  const toggleCell=(i)=>{
    const next=[...board];
    if(i===12 && next[12]?.center) return;
    next[i]={...next[i],checked:!next[i].checked};
    setBoard(next);
    if(!bingoBanner && hasAnyBingo(next)){
      const time=new Date().toLocaleTimeString();
      setWinners(w=>[...w,{nick:nick||"Anon",time,category}]);
      setBingoBanner(true);
    }
  };
  const onChangeCategory=(e)=>{ const v=e.target.value; setCategory(v); setBoard(makeBoard(POOLS[v],freeSpace)); };
  const onToggleFree=(e)=>{ const v=e.target.checked; setFreeSpace(v); setBoard(makeBoard(POOLS[category],v)); };

  // Reset = jen odškrtnout, nepřelosovat
  const resetGame=()=>{ 
    setBoard(prev => prev.map((c, idx) => (idx === 12 && c.center) ? c : { ...c, checked: false }));
    setBingoBanner(false);
  };

  const grid=useMemo(()=>Array.from({length:5},(_,r)=>board.slice(r*5,r*5+5)),[board]);

  return (
    <div className={`page ${dark ? "theme-dark" : "theme-light"}`}>
      <header className="topbar">
        <div>
          <h1 className="title">Clash Bingo Generator</h1>
          <p className="subtitle">Vyber kategorii, vygeneruj kartu, hraj, žolíka můžeš vypnout.</p>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={()=>{
            const rows=Array.from({length:5},(_,r)=>board.slice(r*5,r*5+5).map(c=>(c.checked?"[x] ":"[ ] ")+c.text).join(" | ")).join("\n");
            navigator.clipboard.writeText(rows);
          }}>Kopírovat</button>
          <button className="btn ghost" onClick={()=>window.print()}>Tisk</button>
          <button className="btn" onClick={()=>setDark(d=>!d)}>{dark ? "Světlý režim" : "Tmavý režim"}</button>
        </div>
      </header>

      {/* Ovládání – vycentrované */}
      <div className="controls card center">
        <div className="row">
          <div className="control">
            <label>Kategorie</label>
            <select value={category} onChange={onChangeCategory}>
              <option value="b4">B4 the Clash</option>
              <option value="tiskovka">Tiskovka</option>
              <option value="vazeni">Vážení</option>
              <option value="galavec">Galavečer</option>
            </select>
          </div>
          <div className="control">
            <label><input type="checkbox" checked={freeSpace} onChange={onToggleFree}/> ŽOLÍK uprostřed</label>
          </div>
          <button className="btn" onClick={regenerate}>Generovat novou kartu</button>
        </div>
      </div>

      {/* Layout – centrovaný blok s mřížkou + sidebarem */}
      <div className="layout-wrapper">
        <div className="layout">
          <div className="card grid-card">
            <div className="grid">
              {grid.map((row,rIdx)=>row.map((cell,cIdx)=>{
                const i=rIdx*5+cIdx;
                const isCenter=i===12 && cell.center;
                return (
                  <button
                    key={cell.id}
                    className={`cell ${cell.checked?"checked":""} ${isCenter?"center":""}`}
                    onClick={()=>toggleCell(i)}
                    disabled={isCenter}
                    title={cell.text}
                  >
                    <span className="cell-text">{cell.text}</span>
                    {cell.checked && <span className="tick">✓</span>}
                  </button>
                );
              }))}
            </div>
          </div>

          <aside className="card sidebar">
            <h3>Stav hry</h3>
            <div className="stat">
              <span>Počet hotových řad</span>
              <strong>{bingoCount}</strong>
            </div>

            <div className="control" style={{marginTop:12}}>
              <label>Tvůj nick</label>
              <input type="text" placeholder="Nick" value={nick} onChange={(e)=>setNick(e.target.value)} />
            </div>

            <div className="buttons">
              <button className="btn" onClick={resetGame}>Reset</button>
            </div>

            <h4 className="mt">Výhry</h4>
            {winners.length===0 ? (
              <p className="muted">Zatím žádný záznam.</p>
            ) : (
              <ul className="winners">
                {winners.map((w,i)=>(
                  <li key={i}><b>{w.nick}</b> — {w.time} <span className="pill">{w.category}</span></li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>

      {bingoBanner && (
        <div className="bingo-banner">
          <div className="bingo-content">
            <div className="bingo-title">BINGO!</div>
            <div className="bingo-sub">Zapsáno do výher vpravo</div>
          </div>
        </div>
      )}

      <footer className="footer">© {new Date().getFullYear()} Clash Bingo • Fan projekt (neoficiální)</footer>
    </div>
  );
}
