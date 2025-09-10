import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/* ===== POOLY ===== */
const POOLS = {
  b4: [
    "Tohle je showbusiness!",
    "Někdo začne rapovat/zpívat",
    "Le Sy se snaží uklidnit",
    "Vzduchem letí sklenička/piti",
    "Já tě sundám za xx vteřin!",
    "Kostým na scéně",
    "Na konci zavolá Tadeáš",
    "Chtěl bych pozdravit MG Fitmana",
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
    "Le Sy se značně směje",
    "Můžu jenom...?",
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

/* ===== Utils ===== */
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function pick25(pool) {
  const ext = [...pool];
  while (ext.length < 25) ext.push(...pool);
  return shuffle(ext).slice(0, 25);
}
function makeBoard(pool, includeFree = true) {
  const raw = pick25(pool).map((t, i) => ({
    id: `${Date.now()}_${i}_${Math.random()}`,
    text: t,
    checked: false,
  }));
  if (includeFree) {
    raw[12] = { ...raw[12], text: "ŽOLÍK", checked: true, center: true };
  }
  return raw;
}
function linesCompleted(cells) {
  const grid = Array.from({ length: 5 }, (_, r) => cells.slice(r * 5, r * 5 + 5));
  let c = 0;
  for (let r = 0; r < 5; r++) if (grid[r].every((x) => x.checked)) c++;
  for (let k = 0; k < 5; k++) if (grid.every((row) => row[k].checked)) c++;
  if ([0, 6, 12, 18, 24].every((i) => cells[i].checked)) c++;
  if ([4, 8, 12, 16, 20].every((i) => cells[i].checked)) c++;
  return c;
}
const hasAnyBingo = (cells) => linesCompleted(cells) > 0;
const isBoardFull = (cells) => cells.every((c) => c.checked);
const pad = (n) => n.toString().padStart(2, "0");
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${pad(m)}:${pad(s)}`;
}

/* ===== Leaderboard ===== */
const LS_KEY_DATA = "winnersData";
const LS_KEY_DATE = "winnersDate";
function currentResetDay() {
  const now = new Date();
  const resetPoint = new Date(now);
  resetPoint.setHours(6, 0, 0, 0);
  if (now < resetPoint) resetPoint.setDate(resetPoint.getDate() - 1);
  return resetPoint.toISOString().slice(0, 10);
}
function readWinnersFromLS() {
  const today = currentResetDay();
  const last = localStorage.getItem(LS_KEY_DATE);
  const saved = localStorage.getItem(LS_KEY_DATA);
  if (last === today && saved) {
    try {
      return JSON.parse(saved) ?? [];
    } catch {
      return [];
    }
  }
  localStorage.setItem(LS_KEY_DATE, today);
  localStorage.removeItem(LS_KEY_DATA);
  return [];
}
function writeWinnersToLS(winners) {
  localStorage.setItem(LS_KEY_DATA, JSON.stringify(winners));
}

/* ===== Easter egg vzor ===== */
const MEH_PATTERN = [0, 2, 3, 4, 5, 7, 10, 11, 12, 13, 14, 17, 19, 20, 21, 22, 24];
function matchesPattern(cells, pattern) {
  return pattern.every((i) => cells[i].checked);
}

/* ===== Banlist ===== */
const BANNED_WORDS = [
  "negr", "nigger", "cikan", "cikán", "cigan", "gypsy", "žid", "zid", "jude", "kike",
  "chink", "gook", "paki", "hitler", "nazi", "ss", "auschwitz", "holocaust",
  "buzerant", "faggot", "fag", "tranny", "kurva", "děvka", "devka", "slut", "whore",
  "mrdka", "píča", "pica", "cock", "cunt",
];
function normalizeNick(n) {
  return n
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");
}
function isNickAllowed(nick) {
  const norm = normalizeNick(nick);
  return !BANNED_WORDS.some((w) => norm.includes(w));
}

export default function App() {
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [freeSpace, setFreeSpace] = useState(true);
  const [dark, setDark] = useState(true);
  const [noRecord, setNoRecord] = useState(false);

  const [board, setBoard] = useState(() =>
    makeBoard(POOLS[DEFAULT_CATEGORY], true)
  );

  const [nickInput, setNickInput] = useState(""); // text v inputu
  const [nick, setNick] = useState(""); // potvrzený nick
  const [players, setPlayers] = useState([]); // seznam hráčů online

  const [winners, setWinners] = useState([]);
  const [bingoBanner, setBingoBanner] = useState(false);
  const [bannerType, setBannerType] = useState("bingo");
  const [warnBanner, setWarnBanner] = useState(false);
  const [banBanner, setBanBanner] = useState(false);
  const [mehBanner, setMehBanner] = useState(false);

  const [startAt, setStartAt] = useState(Date.now());
  const [hasBingo, setHasBingo] = useState(false);
  const [hasUltra, setHasUltra] = useState(false);
  const [mehShown, setMehShown] = useState(false); // nová logika pro meh

  const clickGuard = useRef(0);
  const bingoCount = useMemo(() => linesCompleted(board), [board]);

  /* ===== Leaderboard load / reset v 6:00 ===== */
  useEffect(() => {
    const local = readWinnersFromLS();
    setWinners(limitAndSort(local));

    const tick = setInterval(() => {
      const today = currentResetDay();
      const last = localStorage.getItem(LS_KEY_DATE);
      if (last && last !== today) {
        localStorage.setItem(LS_KEY_DATE, today);
        localStorage.removeItem(LS_KEY_DATA);
        setWinners([]);
      }
    }, 30_000);

    return () => clearInterval(tick);
  }, []);

  function limitAndSort(arr) {
    const toSec = (dur) => {
      if (!dur || typeof dur !== "string" || !dur.includes(":")) return Infinity;
      const [m, s] = dur.split(":").map((x) => parseInt(x, 10));
      return (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
    };
    return [...arr].sort((a, b) => toSec(a.duration) - toSec(b.duration)).slice(0, 300);
  }

  /* ===== auto-hide bannery ===== */
  useEffect(() => {
    if (bingoBanner) {
      const t = setTimeout(() => setBingoBanner(false), 2000);
      return () => clearTimeout(t);
    }
  }, [bingoBanner]);

  useEffect(() => {
    if (warnBanner) {
      const t = setTimeout(() => setWarnBanner(false), 2000);
      return () => clearTimeout(t);
    }
  }, [warnBanner]);

  useEffect(() => {
    if (banBanner) {
      const t = setTimeout(() => setBanBanner(false), 2500);
      return () => clearTimeout(t);
    }
  }, [banBanner]);

  useEffect(() => {
    if (mehBanner) {
      const t = setTimeout(() => setMehBanner(false), 2000);
      return () => clearTimeout(t);
    }
  }, [mehBanner]);

  /* ===== Hra funkce ===== */
  const regenerate = () => {
    const pool = POOLS[category] || POOLS[DEFAULT_CATEGORY];
    setBoard(makeBoard(pool, freeSpace));
    setStartAt(Date.now());
    setHasBingo(false);
    setHasUltra(false);
    setMehShown(false);
  };

  const tryRecord = (type) => {
    if (noRecord) return;

    const finishedAt = new Date();
    const time = finishedAt.toLocaleTimeString();
    const duration = formatDuration(finishedAt.getTime() - startAt);
    const catLabel = type === "ultra" ? `${category} + ULTRA` : category;

    const record = {
      nick: nick || "Anon",
      time,
      duration,
      category: catLabel,
      createdAt: finishedAt.toISOString(),
    };

    setBingoBanner(true);
    setBannerType(type);

    setWinners((prev) => {
      const next = limitAndSort([...prev, record]);
      writeWinnersToLS(next);
      return next;
    });
  };

  const toggleCell = (i) => {
    const now = Date.now();
    if (now - clickGuard.current < 250) return;
    clickGuard.current = now;

    if (!nick.trim() && !(i === 12 && board[12]?.center)) {
      setWarnBanner(true);
      return;
    }
    if (!isNickAllowed(nick)) {
      setBanBanner(true);
      return;
    }

    const next = [...board];
    if (i === 12 && next[12]?.center) return;

    next[i] = { ...next[i], checked: !next[i].checked };
    setBoard(next);

    // meh: přesně vzorec a nic navíc
    if (matchesPattern(next, MEH_PATTERN) && !mehShown) {
      const onlyPattern = next.every((cell, idx) =>
        MEH_PATTERN.includes(idx) ? cell.checked : !cell.checked
      );
      if (onlyPattern) {
        setMehBanner(true);
        setMehShown(true);
      }
    }

    if (!hasUltra && isBoardFull(next)) {
      tryRecord("ultra");
      setHasUltra(true);
      if (!hasBingo) setHasBingo(true);
      return;
    }
    if (!hasBingo && hasAnyBingo(next)) {
      tryRecord("bingo");
      setHasBingo(true);
      return;
    }
  };

  const onChangeCategory = (e) => {
    const v = e.target.value;
    setCategory(v);
    setBoard(makeBoard(POOLS[v], freeSpace));
    setStartAt(Date.now());
    setHasBingo(false);
    setHasUltra(false);
    setMehShown(false);
  };

  const onToggleFree = (e) => {
    const v = e.target.checked;
    setFreeSpace(v);
    setBoard(makeBoard(POOLS[category], v));
    setStartAt(Date.now());
    setHasBingo(false);
    setHasUltra(false);
    setMehShown(false);
  };

  const resetGame = () => {
    setBoard((prev) =>
      prev.map((c, idx) => (idx === 12 && c.center ? c : { ...c, checked: false }))
    );
    setBingoBanner(false);
    setWarnBanner(false);
    setStartAt(Date.now());
    setHasBingo(false);
    setHasUltra(false);
    setMehShown(false);
  };

  const grid = useMemo(
    () => Array.from({ length: 5 }, (_, r) => board.slice(r * 5, r * 5 + 5)),
    [board]
  );

  /* ===== potvrzení nicku Enterem ===== */
  const handleNickKey = (e) => {
    if (e.key === "Enter") {
      const newNick = nickInput.trim();
      if (!newNick) return;

      if (!isNickAllowed(newNick)) {
        setBanBanner(true);
        return;
      }

      setNick((oldNick) => {
        setPlayers((prev) => {
          const withoutOld = prev.filter((p) => p !== oldNick);
          return withoutOld.includes(newNick) ? withoutOld : [...withoutOld, newNick];
        });
        return newNick;
      });
    }
  };

  /* ===== RENDER ===== */
  return (
    <div className={`page ${dark ? "theme-dark" : "theme-light"}`}>
      {/* Topbar */}
      <header className="topbar">
        <h1 className="title" style={{ textAlign: "center", flex: 1 }}>
          Clash Bingo Generator
        </h1>
      </header>

      {/* Ovládací panel */}
      <div className="controls card center">
        {/* 1. řádek: kategorie + žolík + nezapisovat + nick */}
        <div className="row">
          <div className="control">
            <label style={{ marginRight: "6px" }}>Kategorie</label>
            <select value={category} onChange={onChangeCategory}>
              <option value="b4">B4 the Clash</option>
              <option value="tiskovka">Tiskovka</option>
              <option value="vazeni">Vážení</option>
              <option value="galavecer">Galavečer</option>
            </select>
          </div>

          <div className="control">
            <label>
              <input type="checkbox" checked={freeSpace} onChange={onToggleFree} />
              {" "}ŽOLÍK uprostřed
            </label>
          </div>

          <div className="control">
            <label>
              <input
                type="checkbox"
                checked={noRecord}
                onChange={(e) => setNoRecord(e.target.checked)}
              />
              {" "}Nezapisovat výsledky
            </label>
          </div>

          <div className="control" style={{ minWidth: 220 }}>
            <label style={{ marginRight: "6px" }}>Tvůj nick</label>
            <input
              type="text"
              placeholder="Nick"
              value={nickInput}
              onChange={(e) => setNickInput(e.target.value)}
              onKeyDown={handleNickKey}
            />
          </div>
        </div>

        {/* 2. řádek: akční tlačítka */}
        <div className="row">
          <button className="btn" onClick={regenerate}>
            Generovat novou kartu
          </button>

          <button className="btn" onClick={resetGame}>
            Reset
          </button>

          <button
            className="btn"
            onClick={() => {
              const rows = Array.from({ length: 5 }, (_, r) =>
                board
                  .slice(r * 5, r * 5 + 5)
                  .map((c) => (c.checked ? "[x] " : "[ ] ") + c.text)
                  .join(" | ")
              ).join("\n");
              navigator.clipboard.writeText(rows);
            }}
          >
            Kopírovat
          </button>

          <button className="btn" onClick={() => window.print()}>
            Tisk
          </button>

          <button className="btn" onClick={() => setDark((d) => !d)}>
            {dark ? "Světlý režim" : "Tmavý režim"}
          </button>
        </div>
      </div>

      {/* ===== Layout ===== */}
      <div className="layout-wrapper">
        <div className="layout" style={{ gridTemplateColumns: "320px auto 360px" }}>
          {/* Online hráči vlevo */}
          <aside className="card sidebar">
            <h3>Online hráči</h3>
            {players.length === 0 ? (
              <p className="muted">Nikdo není online</p>
            ) : (
              <ul className="players">
                {players.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </aside>

          {/* Herní grid uprostřed */}
          <div className="card grid-card">
            <div className="grid">
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const i = rIdx * 5 + cIdx;
                  const isCenter = i === 12 && cell.center;
                  return (
                    <button
                      key={cell.id}
                      className={`cell ${cell.checked ? "checked" : ""} ${
                        isCenter ? "center" : ""
                      }`}
                      onClick={() => toggleCell(i)}
                      disabled={isCenter}
                      title={cell.text}
                    >
                      <span className="cell-text">{cell.text}</span>
                      {cell.checked && <span className="tick">✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Výsledky vpravo */}
          <aside className="card sidebar">
            <h3>Stav hry</h3>
            <div className="stat">
              <span>Počet hotových řad:&nbsp;</span>
              <strong>{bingoCount}</strong>
            </div>

            <h4 className="mt">Výhry (TOP 300 dnes)</h4>
            {winners.length === 0 ? (
              <p className="muted">Zatím žádný záznam.</p>
            ) : (
              <ul className="winners">
                {winners.map((w, i) => (
                  <li key={i}>
                    <b>{w.nick}</b> — {w.time}{" "}
                    <span className="muted">({w.duration})</span>{" "}
                    <span className="pill">{w.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>

      {/* Bannery */}
      {bingoBanner && (
        <div className="bingo-banner">
          <div className="bingo-content">
            <div className="bingo-title">
              {bannerType === "ultra" ? "ULTRA BINGO!" : "BINGO!"}
            </div>
            <div className="bingo-sub">Zapsáno do výher vpravo</div>
          </div>
        </div>
      )}

      {warnBanner && (
        <div className="bingo-banner">
          <div className="bingo-content warn">
            <div className="bingo-title warn">UPOZORNĚNÍ</div>
            <div className="bingo-sub">Před začátkem hry zadej svůj nick</div>
          </div>
        </div>
      )}

      {banBanner && (
        <div className="bingo-banner">
          <div className="bingo-content warn">
            <div className="bingo-title warn">⚠️ Nepovolený nick</div>
            <div className="bingo-sub">Zvol si prosím jiný nick, tenhle nejde použít.</div>
          </div>
        </div>
      )}

      {mehBanner && (
        <div className="bingo-banner">
          <div className="bingo-content">
            <div className="bingo-title">meh</div>
          </div>
        </div>
      )}

      <footer className="footer">
        © {new Date().getFullYear()} Fan projekt v0.1.1 (online bude)
      </footer>
    </div>
  );
}
