
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const SAVE_KEY = "board-breakers-class10-v1";

const WORLDS = [
  { id: "All", symbol: "✦", title: "Exam Vault", subtitle: "All four subject worlds", color: "violet" },
  { id: "Mathematics", symbol: "∑", title: "Maths Dimension", subtitle: "Equations, geometry and logic", color: "blue" },
  { id: "Science", symbol: "⚛", title: "Science Reactor", subtitle: "Physics, chemistry and biology", color: "green" },
  { id: "English", symbol: "Aa", title: "Word Kingdom", subtitle: "Grammar and vocabulary", color: "orange" },
  { id: "Social Science", symbol: "⌖", title: "History Lab", subtitle: "History, geography and civics", color: "pink" },
];

const MODES = [
  { id: "Explorer", name: "Explorer", icon: "☁", seconds: 45, multiplier: 0.8, detail: "Relaxed learning" },
  { id: "Classic", name: "Classic", icon: "⚡", seconds: 30, multiplier: 1, detail: "Balanced challenge" },
  { id: "Blitz", name: "Blitz", icon: "🔥", seconds: 20, multiplier: 1.5, detail: "Fast-thinking mode" },
];

const BANK = [
  // MATHEMATICS
  {
    id: "M01", subject: "Mathematics", topic: "Polynomials",
    room: "The Root Vault", symbol: "x²", level: "Easy", points: 100,
    question: "The polynomial x² − 5x + 6 has two zeroes. What is their sum?",
    options: ["−5", "5", "6", "−6"], answer: "5",
    hint: "For ax² + bx + c, use the relationship between the coefficient of x and the sum of zeroes.",
    explanation: "For ax² + bx + c, the sum of zeroes is −b/a. Here it is −(−5)/1 = 5.",
  },
  {
    id: "M02", subject: "Mathematics", topic: "Arithmetic Progressions",
    room: "Sequence Chamber", symbol: "AP", level: "Medium", points: 120,
    question: "An arithmetic progression begins 3, 7, 11, 15, ... What is its 10th term?",
    options: ["35", "37", "39", "43"], answer: "39",
    hint: "The common difference is constant. Count nine jumps from the first term.",
    explanation: "Here a = 3 and d = 4. The 10th term is a + 9d = 3 + 36 = 39.",
  },
  {
    id: "M03", subject: "Mathematics", topic: "Pair of Linear Equations",
    room: "Twin-Code Lock", symbol: "x+y", level: "Hard", points: 150,
    question: "Solve 2x + y = 11 and x − y = 1. What is the ordered pair (x, y)?",
    options: ["(3, 5)", "(4, 3)", "(5, 1)", "(2, 7)"], answer: "(4, 3)",
    hint: "Add the two equations to eliminate y, then substitute back.",
    explanation: "Adding gives 3x = 12, so x = 4. Then 4 − y = 1, giving y = 3. The pair is (4, 3).",
  },
  {
    id: "M04", subject: "Mathematics", topic: "Quadratic Equations",
    room: "The Equation Forge", symbol: "x²", level: "Medium", points: 120,
    question: "The equation x² − 7x + 12 = 0 has two roots. What is the smaller root?",
    options: ["2", "3", "4", "6"], answer: "3",
    hint: "Find two numbers whose product is 12 and whose sum is 7.",
    explanation: "x² − 7x + 12 = (x − 3)(x − 4) = 0. The roots are 3 and 4, so the smaller root is 3.",
  },
  {
    id: "M05", subject: "Mathematics", topic: "Trigonometry",
    room: "The Angle Reactor", symbol: "sin", level: "Medium", points: 120,
    question: "If sin θ = 3/5 and θ is an acute angle, what is cos θ?",
    options: ["3/4", "4/5", "5/4", "5/3"], answer: "4/5",
    hint: "Imagine a right triangle whose opposite side and hypotenuse have lengths 3 and 5.",
    explanation: "Using sin² θ + cos² θ = 1 gives cos² θ = 1 − 9/25 = 16/25. Since θ is acute, cos θ = 4/5.",
  },
  {
    id: "M06", subject: "Mathematics", topic: "Probability",
    room: "The Chance Engine", symbol: "◉", level: "Easy", points: 100,
    question: "A fair six-sided die is rolled once. What is the probability of obtaining a prime number?",
    options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/2",
    hint: "Identify the prime numbers among the possible results 1, 2, 3, 4, 5 and 6.",
    explanation: "The prime outcomes are 2, 3 and 5. Therefore P(prime) = 3/6 = 1/2.",
  },

  // SCIENCE
  {
    id: "S01", subject: "Science", topic: "Electricity",
    room: "The Current Core", symbol: "Ω", level: "Easy", points: 100,
    question: "A 6 Ω resistor is connected across a 12 V battery. What current flows through it?",
    options: ["0.5 A", "2 A", "6 A", "72 A"], answer: "2 A",
    hint: "Use Ohm's law to relate voltage, current and resistance.",
    explanation: "Ohm's law gives I = V/R = 12/6 = 2 A.",
  },
  {
    id: "S02", subject: "Science", topic: "Light: Reflection and Refraction",
    room: "The Mirror Maze", symbol: "↗", level: "Medium", points: 120,
    question: "An object is placed beyond the centre of curvature of a concave mirror. Where is its image formed?",
    options: [
      "Behind the mirror, enlarged",
      "Between the focus and pole, virtual",
      "Between the focus and centre of curvature, diminished",
      "At the centre of curvature, same size",
    ],
    answer: "Between the focus and centre of curvature, diminished",
    hint: "Use the standard image-formation rules for a concave mirror.",
    explanation: "For an object beyond C, a concave mirror forms a real, inverted, diminished image between C and F.",
  },
  {
    id: "S03", subject: "Science", topic: "Acids, Bases and Salts",
    room: "The pH Laboratory", symbol: "pH", level: "Easy", points: 100,
    question: "Which solution is the most acidic, assuming the values refer to comparable aqueous solutions at the same temperature?",
    options: ["pH 2", "pH 5", "pH 7", "pH 10"], answer: "pH 2",
    hint: "On the usual pH scale, lower values indicate greater acidity.",
    explanation: "A lower pH corresponds to a higher hydrogen-ion concentration. Among these choices, pH 2 is the most acidic.",
  },
  {
    id: "S04", subject: "Science", topic: "Carbon and Its Compounds",
    room: "The Carbon Vault", symbol: "C", level: "Easy", points: 100,
    question: "What is the molecular formula of ethanol?",
    options: ["CH₄", "C₂H₆", "C₂H₅OH", "CH₃COOH"], answer: "C₂H₅OH",
    hint: "Ethanol is the two-carbon alcohol commonly written as CH₃CH₂OH.",
    explanation: "Ethanol has the structural formula CH₃CH₂OH and molecular formula C₂H₆O, commonly written C₂H₅OH.",
  },
  {
    id: "S05", subject: "Science", topic: "Life Processes",
    room: "The Biology Nexus", symbol: "⌬", level: "Medium", points: 120,
    question: "Which functional unit of the kidney filters blood and helps form urine?",
    options: ["Neuron", "Nephron", "Alveolus", "Villus"], answer: "Nephron",
    hint: "This kidney structure contains a filtration unit and a tubule.",
    explanation: "The nephron is the structural and functional unit of the kidney. It filters blood and modifies the filtrate to form urine.",
  },
  {
    id: "S06", subject: "Science", topic: "Our Environment",
    room: "The Ozone Shield", symbol: "O₃", level: "Easy", points: 100,
    question: "What important role does the ozone layer play in Earth's atmosphere?",
    options: [
      "It blocks all visible sunlight",
      "It absorbs much of the Sun's harmful ultraviolet radiation",
      "It produces all atmospheric oxygen",
      "It prevents every greenhouse effect",
    ],
    answer: "It absorbs much of the Sun's harmful ultraviolet radiation",
    hint: "Think about the protection it offers living organisms from high-energy solar radiation.",
    explanation: "Stratospheric ozone absorbs much of the Sun's harmful ultraviolet radiation, helping protect life on Earth.",
  },

  // ENGLISH
  {
    id: "E01", subject: "English", topic: "Reported Speech",
    room: "The Speech Decoder", symbol: "❝", level: "Medium", points: 120,
    question: "Change to reported speech: Ravi said, 'I am tired.'",
    options: [
      "Ravi said that I am tired.",
      "Ravi said that he was tired.",
      "Ravi says that he had tired.",
      "Ravi said that he is tire.",
    ],
    answer: "Ravi said that he was tired.",
    hint: "With a past reporting verb, the present continuous-like linking structure 'am' commonly changes to 'was' here.",
    explanation: "In reported speech with 'said', 'I' changes to 'he' and 'am' usually backshifts to 'was': Ravi said that he was tired.",
  },
  {
    id: "E02", subject: "English", topic: "Active and Passive Voice",
    room: "The Voice Switch", symbol: "↻", level: "Medium", points: 120,
    question: "Choose the correct passive form of: 'The students completed the project.'",
    options: [
      "The project is completed by the students.",
      "The project was completed by the students.",
      "The project has complete by the students.",
      "The students were completed by the project.",
    ],
    answer: "The project was completed by the students.",
    hint: "Preserve the simple past tense when changing the active sentence into passive voice.",
    explanation: "The object 'the project' becomes the subject. The simple past passive uses 'was/were + past participle': was completed.",
  },
  {
    id: "E03", subject: "English", topic: "Subject–Verb Agreement",
    room: "The Grammar Lock", symbol: "Aa", level: "Easy", points: 100,
    question: "Choose the correct verb: 'Neither of the two boys ___ arrived yet.'",
    options: ["have", "has", "were", "are"], answer: "has",
    hint: "In formal standard English, 'neither' is treated as singular in this sentence.",
    explanation: "'Neither' takes a singular verb in this construction, so 'has arrived' is the expected form.",
  },
  {
    id: "E04", subject: "English", topic: "Reported Questions",
    room: "The Question Decoder", symbol: "?", level: "Medium", points: 120,
    question: "Choose the correct reported form: She asked me, 'Where do you live?'",
    options: [
      "She asked me where did I live.",
      "She asked me where I lived.",
      "She asked me where do I lived.",
      "She said me where I live?",
    ],
    answer: "She asked me where I lived.",
    hint: "Reported questions use statement word order rather than question word order.",
    explanation: "In a reported question, the subject comes before the verb. With the past reporting verb 'asked', 'do you live' normally changes to 'I lived'.",
  },
  {
    id: "E05", subject: "English", topic: "Vocabulary",
    room: "The Word Mirror", symbol: "⇄", level: "Easy", points: 100,
    question: "Choose the word closest in meaning to 'reluctant'.",
    options: ["Eager", "Unwilling", "Cheerful", "Certain"], answer: "Unwilling",
    hint: "A reluctant person is hesitant rather than enthusiastic about doing something.",
    explanation: "'Reluctant' means unwilling or hesitant to do something. 'Unwilling' is the closest option.",
  },
  {
    id: "E06", subject: "English", topic: "Idioms",
    room: "The Idiom Vault", symbol: "◇", level: "Easy", points: 100,
    question: "What does the idiom 'once in a blue moon' mean?",
    options: ["Every evening", "Very rarely", "Immediately", "Without planning"], answer: "Very rarely",
    hint: "The expression describes something that happens infrequently.",
    explanation: "'Once in a blue moon' means very rarely or not very often.",
  },

  // SOCIAL SCIENCE
  {
    id: "H01", subject: "Social Science", topic: "Power Sharing",
    room: "The Democracy Vault", symbol: "⚖", level: "Medium", points: 120,
    question: "What is a key reason democratic systems use power sharing?",
    options: [
      "To concentrate all power in one office",
      "To reduce conflict and accommodate different groups",
      "To remove the need for elections",
      "To end all disagreement permanently",
    ],
    answer: "To reduce conflict and accommodate different groups",
    hint: "Think about how sharing authority can help a diverse society remain stable.",
    explanation: "Power sharing helps manage social diversity, reduces the risk of conflict, and supports democratic participation.",
  },
  {
    id: "H02", subject: "Social Science", topic: "Resources and Development",
    room: "The Geography Engine", symbol: "◈", level: "Easy", points: 100,
    question: "Which soil type is particularly suitable for growing cotton in India?",
    options: ["Laterite soil", "Black soil", "Mountain soil", "Desert soil"], answer: "Black soil",
    hint: "This soil is also called regur soil and is well known in the Deccan region.",
    explanation: "Black soil retains moisture and is particularly suitable for cotton cultivation. It is also known as regur soil.",
  },
  {
    id: "H03", subject: "Social Science", topic: "Manufacturing Industries",
    room: "The Industry Lab", symbol: "⚙", level: "Medium", points: 120,
    question: "Why is the iron and steel industry called a basic industry?",
    options: [
      "It mainly produces luxury consumer goods",
      "It supplies materials used by many other industries",
      "It uses no raw materials",
      "It operates only in rural areas",
    ],
    answer: "It supplies materials used by many other industries",
    hint: "Consider the role steel plays in machinery, construction and transport equipment.",
    explanation: "Iron and steel provides essential inputs for engineering, construction, transport and many other industries; therefore, it is a basic industry.",
  },
  {
    id: "H04", subject: "Social Science", topic: "Nationalism in India",
    room: "The Freedom Archive", symbol: "✦", level: "Medium", points: 120,
    question: "In which year did Mahatma Gandhi begin the Dandi March against the British salt tax?",
    options: ["1919", "1922", "1930", "1942"], answer: "1930",
    hint: "The march from Sabarmati to Dandi was a landmark event in the Civil Disobedience Movement.",
    explanation: "Gandhi began the Dandi March in March 1930 and reached Dandi in April, where he broke the colonial salt law.",
  },
  {
    id: "H05", subject: "Social Science", topic: "Money and Credit",
    room: "The Exchange Chamber", symbol: "₹", level: "Medium", points: 120,
    question: "How does money solve the problem of the double coincidence of wants?",
    options: [
      "It requires both traders to want each other's goods",
      "It acts as a commonly accepted medium of exchange",
      "It makes goods unnecessary",
      "It guarantees unlimited credit to everyone",
    ],
    answer: "It acts as a commonly accepted medium of exchange",
    hint: "A buyer does not have to offer a good that the seller personally wants.",
    explanation: "Money acts as a medium of exchange, allowing a person to sell one item for money and use that money to buy a different item.",
  },
  {
    id: "H06", subject: "Social Science", topic: "Federalism",
    room: "The Constitution Code", symbol: "§", level: "Easy", points: 100,
    question: "What is the defining feature of federalism?",
    options: [
      "All authority belongs to one local council",
      "Power is constitutionally divided between different levels of government",
      "Courts cannot interpret laws",
      "Elections are never held",
    ],
    answer: "Power is constitutionally divided between different levels of government",
    hint: "Look for the arrangement in which central and regional governments each have constitutionally defined powers.",
    explanation: "Federalism divides authority between levels of government, with powers protected by a constitution.",
  },
];

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function readSave() {
  const empty = { bestScore: 0, crystals: 0, sessions: 0 };

  try {
    if (typeof window === "undefined") return empty;
    const value = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");

    return {
      bestScore: Number(value.bestScore) || 0,
      crystals: Number(value.crystals) || 0,
      sessions: Number(value.sessions) || 0,
    };
  } catch {
    return empty;
  }
}

function getRank(score) {
  if (score >= 1800) return { name: "Vault Legend", icon: "👑" };
  if (score >= 1200) return { name: "Puzzle Master", icon: "🧠" };
  if (score >= 700) return { name: "Elite Scholar", icon: "🚀" };
  if (score >= 300) return { name: "Code Breaker", icon: "🔐" };
  return { name: "Vault Explorer", icon: "🔎" };
}

function playTone(correct) {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;

    const context = new Audio();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = correct ? 660 : 220;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
    oscillator.onended = () => context.close();
  } catch {
    // Sound is optional; the game continues if audio is unavailable.
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [playerName, setPlayerName] = useState("Explorer");
  const [subject, setSubject] = useState("All");
  const [mode, setMode] = useState("Classic");
  const [roundSize, setRoundSize] = useState(12);

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [outcome, setOutcome] = useState("answer");

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintUsed, setHintUsed] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const [timeLeft, setTimeLeft] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [exitDialog, setExitDialog] = useState(false);

  const [save, setSave] = useState(readSave);
  const savedResult = useRef(false);

  const selectedMode = MODES.find((item) => item.id === mode) || MODES[1];
  const question = questions[current];
  const total = questions.length;

  const correctCount = answers.filter((item) => item.correct).length;
  const accuracy = answers.length
    ? Math.round((correctCount / answers.length) * 100)
    : 0;
  const rank = getRank(score);

  const availableQuestions = useMemo(
    () => BANK.filter((item) => subject === "All" || item.subject === subject),
    [subject]
  );

  const startGame = () => {
    const pool = shuffle(
      BANK.filter((item) => subject === "All" || item.subject === subject)
    );

    const chosen = pool.slice(0, Math.min(roundSize, pool.length)).map((item) => ({
      ...item,
      options: shuffle(item.options),
    }));

    savedResult.current = false;
    setQuestions(chosen);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setOutcome("answer");

    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setHintsLeft(3);
    setHintUsed(false);
    setFiftyUsed(false);
    setHiddenOptions([]);

    setTimeLeft(selectedMode.seconds);
    setElapsed(0);
    setAnswers([]);
    setExitDialog(false);
    setScreen("game");
  };

  const submitAnswer = useCallback(
    (option, reason = "answer") => {
      if (revealed || !question) return;

      const correct = reason === "answer" && option === question.answer;
      const nextStreak = correct ? streak + 1 : 0;
      const timeBonus = correct ? Math.max(0, timeLeft) * 2 : 0;
      const comboBonus = correct ? Math.min(streak, 5) * 12 : 0;

      const earned = correct
        ? Math.max(
            0,
            Math.round(
              question.points * selectedMode.multiplier +
                timeBonus +
                comboBonus -
                (hintUsed ? 20 : 0)
            )
          )
        : 0;

      setSelected(option);
      setRevealed(true);
      setOutcome(reason);
      setScore((value) => value + earned);
      setStreak(nextStreak);
      setBestStreak((value) => Math.max(value, nextStreak));

      if (!correct) {
        setLives((value) => Math.max(0, value - 1));
      }

      setAnswers((previous) => [
        ...previous,
        {
          id: question.id,
          subject: question.subject,
          topic: question.topic,
          question: question.question,
          chosen:
            reason === "timeout"
              ? "Time expired"
              : reason === "skip"
                ? "Skipped"
                : option,
          expected: question.answer,
          correct,
          earned,
          explanation: question.explanation,
        },
      ]);

      if (soundOn) playTone(correct);
    },
    [
      revealed,
      question,
      streak,
      timeLeft,
      selectedMode.multiplier,
      hintUsed,
      soundOn,
    ]
  );

  useEffect(() => {
    if (screen !== "game" || revealed || !question) return undefined;

    const timer = window.setTimeout(() => {
      setElapsed((value) => value + 1);

      if (timeLeft <= 1) {
        setTimeLeft(0);
        submitAnswer(null, "timeout");
      } else {
        setTimeLeft((value) => value - 1);
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [screen, revealed, question, current, timeLeft, submitAnswer]);

  const nextQuestion = () => {
    if (lives <= 0 || current + 1 >= total) {
      setScreen("results");
      return;
    }

    setCurrent((value) => value + 1);
    setSelected(null);
    setRevealed(false);
    setOutcome("answer");
    setHintUsed(false);
    setFiftyUsed(false);
    setHiddenOptions([]);
    setTimeLeft(selectedMode.seconds);
  };

  const useHint = () => {
    if (!question || revealed || hintUsed || hintsLeft <= 0) return;
    setHintsLeft((value) => value - 1);
    setHintUsed(true);
  };

  const useFiftyFifty = () => {
    if (!question || revealed || fiftyUsed) return;

    const wrong = shuffle(
      question.options.filter((option) => option !== question.answer)
    ).slice(0, 2);

    setHiddenOptions(wrong);
    setFiftyUsed(true);
  };

  useEffect(() => {
    if (screen !== "results" || answers.length === 0 || savedResult.current) return;

    savedResult.current = true;

    const updated = {
      bestScore: Math.max(save.bestScore, score),
      crystals: save.crystals + Math.floor(score / 100),
      sessions: save.sessions + 1,
    };

    setSave(updated);

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
    } catch {
      // The game still works if local storage is disabled.
    }
  }, [screen, answers.length, score, save]);

  const goHome = () => {
    setExitDialog(false);
    setScreen("home");
  };

  if (screen === "home") {
    return (
      <main className="vault-app">
        <header className="topbar">
          <button className="brand" onClick={goHome} aria-label="Board Breakers home">
            <span className="brand-mark">B</span>
            <span className="brand-text">
              <strong>BOARD BREAKERS</strong>
              <small>CLASS X · LEARNING ARCADE</small>
            </span>
          </button>
          <div className="topbar-right">
            <span className="crystal-chip">◇ {save.crystals} <small>CRYSTALS</small></span>
            <span className="avatar">{(playerName.trim()[0] || "E").toUpperCase()}</span>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> CBSE CLASS X · ESCAPE THE EXAM VAULT</div>
            <h1>Beat the board.<br /><span className="gradient-text">Crack the vault.</span></h1>
            <p>
              Welcome to your ultimate Class 10 brain adventure. Solve exam-level
              puzzles, unlock secret chambers, protect your lives and prove that
              knowledge is your strongest superpower.
            </p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => document.getElementById("mission-control")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                Enter the vault <span>↗</span>
              </button>
              <span className="hero-note"><b>✦ ✦ ✦</b><small>THINK · SOLVE · CONQUER</small></span>
            </div>
            <div className="hero-stats">
              <div><strong>24</strong><span>Curated challenges</span></div>
              <div><strong>04</strong><span>Subject dimensions</span></div>
              <div><strong>03</strong><span>Difficulty modes</span></div>
            </div>
          </div>

          <div className="vault-visual">
            <div className="visual-grid" />
            <div className="vault-ring ring-back" />
            <div className="vault-ring ring-front" />
            <div className="vault-door"><span>B</span><i className="door-lock">✦</i></div>
            <div className="floating-symbol math-symbol"><strong>∑</strong><small>MATHS</small></div>
            <div className="floating-symbol science-symbol"><strong>⚛</strong><small>SCIENCE</small></div>
            <div className="floating-symbol word-symbol"><strong>Aa</strong><small>LANGUAGE</small></div>
            <div className="vault-status"><span className="status-dot" /> FOUR WORLDS · ONE CHAMPION</div>
          </div>
        </section>

        <section className="setup-layout" id="mission-control">
          <section className="setup-panel panel">
            <div className="section-heading">
              <div><span className="section-kicker">MISSION CONTROL / 01</span><h2>Design your challenge</h2><p>Choose a subject world and prepare for your mission.</p></div>
              <span className="section-symbol">⌘</span>
            </div>

            <label className="field-label" htmlFor="player-name">EXPLORER NAME</label>
            <input id="player-name" className="name-input" value={playerName} onChange={(event) => setPlayerName(event.target.value.slice(0, 22))} maxLength={22} placeholder="Enter your name" />

            <div className="field-heading">
              <div><span className="field-label">CHOOSE YOUR SUBJECT WORLD</span><small>Every chamber tests a different skill.</small></div>
              <span className="subtle-label">05 ROUTES</span>
            </div>

            <div className="world-grid">
              {WORLDS.map((world) => (
                <button key={world.id} className={`world-card ${world.color} ${subject === world.id ? "active" : ""}`} onClick={() => setSubject(world.id)} aria-pressed={subject === world.id}>
                  <span className="world-icon">{world.symbol}</span><span className="world-check">{subject === world.id ? "✓" : "+"}</span>
                  <strong>{world.title}</strong><small>{world.subtitle}</small>
                  <span className="world-description">{world.id === "All" ? "A mixed expedition across all four subjects." : world.id === "Mathematics" ? "Solve algebra, trigonometry and probability puzzles." : world.id === "Science" ? "Decode electricity, optics, chemistry and biology." : world.id === "English" ? "Crack grammar, reported speech and vocabulary." : "Explore democracy, resources, history and economics."}</span>
                </button>
              ))}
            </div>

            <div className="field-heading mode-heading"><div><span className="field-label">SET YOUR DIFFICULTY</span><small>Challenge yourself at your own pace.</small></div></div>
            <div className="mode-grid">
              {MODES.map((item) => (
                <button key={item.id} className={`mode-card ${mode === item.id ? "active" : ""}`} onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>
                  <span className="mode-icon">{item.icon}</span><strong>{item.name}</strong><small>{item.detail}</small>
                  <span className="mode-time">{item.seconds}s per puzzle</span>
                  {item.id === "Blitz" && <span className="xp-badge">1.5× XP</span>}
                </button>
              ))}
            </div>

            <div className="round-control">
              <div><span className="field-label">EXPEDITION LENGTH</span><p>{Math.min(roundSize, availableQuestions.length)} puzzles <i>·</i> 3 lives <i>·</i> 3 hints</p></div>
              <div className="round-buttons">
                {[6, 12, 18, 24].map((count) => (
                  <button key={count} className={roundSize === count ? "active" : ""} onClick={() => setRoundSize(count)} aria-pressed={roundSize === count}>{count}</button>
                ))}
              </div>
            </div>

            <div className="mission-summary">
              <span className="summary-symbol">✦</span>
              <div><strong>{WORLDS.find((item) => item.id === subject)?.title} is ready</strong><small>{Math.min(roundSize, availableQuestions.length)} puzzles · {mode} mode · 3 shields</small></div>
              <span className="ready-label">READY</span>
            </div>

            <button className="primary-button launch-button" onClick={startGame}>Unlock the first chamber <span>→</span></button>
            <p className="fine-print">Your best score and crystals are saved locally on this device.</p>
          </section>

          <aside className="side-panels">
            <section className="panel profile-panel">
              <div className="panel-label-row"><span className="section-kicker">EXPLORER PROFILE</span><span className="saved-label">LOCAL SAVE</span></div>
              <div className="profile-row"><span className="profile-avatar">{(playerName.trim()[0] || "E").toUpperCase()}</span><div><strong>{playerName.trim() || "Explorer"}</strong><small>Rank: {getRank(save.bestScore).name}</small></div></div>
              <div className="record-grid"><div><span>BEST SCORE</span><strong>{save.bestScore.toLocaleString()}</strong></div><div><span>MISSIONS</span><strong>{save.sessions}</strong></div></div>
              <div className="collection-progress"><div><span>CRYSTAL COLLECTION</span><strong>◇ {save.crystals}</strong></div><div className="crystal-track"><div style={{ width: `${save.crystals % 100}%` }} /></div></div>
            </section>

            <section className="panel map-panel">
              <div className="panel-label-row"><span className="section-kicker">THE VAULT MAP</span><span className="map-symbol">⌖</span></div>
              {[
                ["01", "Initiation Hall", "Warm-up challenges"],
                ["02", "The Logic Lab", "Think and calculate"],
                ["03", "Knowledge Vault", "Master the concepts"],
                ["04", "Final Nexus", "Conquer the challenge"],
              ].map(([number, name, subtitle]) => (
                <div className="road-row" key={number}><span className="road-number">{number}</span><div><strong>{name}</strong><small>{subtitle}</small></div><span className="open-label">OPEN</span></div>
              ))}
              <div className="map-note"><span>✧</span> Each correct answer brings you closer to mastery.</div>
            </section>

            <section className="tip-panel"><span>✦</span><div><strong>Vault intelligence</strong><p>Use hints wisely, build answer streaks and learn from every explanation. Accuracy matters as much as speed.</p></div></section>
          </aside>
        </section>

        <footer className="site-footer"><span className="footer-brand">BOARD BREAKERS</span><span>Built for curious Class 10 minds</span><span>THINK SMARTER · GO FURTHER</span></footer>
      </main>
    );
  }

  if (screen === "results") {
    const flawless = answers.length > 0 && correctCount === answers.length;
    const newRecord = score > 0 && score >= save.bestScore;
    const achievements = [
      ...(flawless ? [{ icon: "💎", name: "Flawless Thinker" }] : []),
      ...(bestStreak >= 4 ? [{ icon: "🔥", name: "Combo Champion" }] : []),
      ...(score >= 500 ? [{ icon: "⚡", name: "XP Hunter" }] : []),
      ...(answers.length >= 12 ? [{ icon: "🗺", name: "Deep Explorer" }] : []),
    ];

    return (
      <main className="vault-app results-screen">
        <header className="topbar"><button className="brand" onClick={goHome}><span className="brand-mark">B</span><span className="brand-text"><strong>BOARD BREAKERS</strong><small>CLASS X · LEARNING ARCADE</small></span></button><span className="report-chip">✦ MISSION REPORT</span></header>

        <section className="results-hero">
          <div className="result-emblem">{rank.icon}</div>
          <span className="eyebrow">{lives === 0 ? "MISSION ENDED · TRY ANOTHER ROUTE" : "EXPEDITION COMPLETE"}</span>
          <h1>{playerName.trim() || "Explorer"},<br /><span className="gradient-text">{lives === 0 ? "your next level awaits." : "the vault is conquered."}</span></h1>
          <p>Every challenge is a lesson. Every mistake is a clue. Here is your mission report.</p>
        </section>

        <section className="results-dashboard">
          <div className="panel final-score-panel">
            <div className="panel-label-row"><span className="section-kicker">YOUR FINAL SCORE</span>{newRecord && <span className="record-badge">✦ PERSONAL RECORD</span>}</div>
            <div className="final-score">{score.toLocaleString()} <small>XP</small></div>
            <div className="result-progress"><div style={{ width: `${accuracy}%` }} /></div>
            <div className="result-progress-labels"><span>{accuracy}% accuracy</span><span>{correctCount}/{answers.length} correct</span></div>
            <div className="rank-banner"><span className="rank-icon">{rank.icon}</span><div><small>ACADEMY RANK</small><strong>{rank.name}</strong></div><span className="rank-stars">✦ ✦ ✦</span></div>
          </div>

          <div className="metric-grid">
            <div className="panel metric-card"><span className="metric-icon green-icon">✓</span><small>CORRECT ANSWERS</small><strong>{correctCount}<i> / {answers.length}</i></strong><span>Knowledge unlocked</span></div>
            <div className="panel metric-card"><span className="metric-icon orange-icon">🔥</span><small>BEST STREAK</small><strong>{bestStreak}</strong><span>Consecutive correct</span></div>
            <div className="panel metric-card"><span className="metric-icon blue-icon">◷</span><small>TIME PLAYED</small><strong>{Math.floor(elapsed / 60)}<i>m </i>{elapsed % 60}<i>s</i></strong><span>Time in the vault</span></div>
            <div className="panel metric-card"><span className="metric-icon violet-icon">◇</span><small>CRYSTALS EARNED</small><strong>+{Math.floor(score / 100)}</strong><span>Added to your record</span></div>
          </div>
        </section>

        <section className="panel achievements-panel">
          <div className="section-heading"><div><span className="section-kicker">YOUR ACHIEVEMENTS</span><h2>Badges of brilliance</h2></div><span className="section-symbol">✧</span></div>
          {achievements.length ? <div className="achievement-grid">{achievements.map((item) => <div className="achievement" key={item.name}><span>{item.icon}</span><strong>{item.name}</strong><small>UNLOCKED</small></div>)}</div> : <div className="empty-achievements"><span>✧</span><div><strong>Your next badge is waiting.</strong><p>Build a long streak, earn more XP or finish a perfect round.</p></div></div>}
        </section>

        <section className="review-section">
          <div className="section-heading"><div><span className="section-kicker">MISSION DEBRIEF</span><h2>Review every puzzle</h2><p>Understand the answer and strengthen your concepts.</p></div><span className="answered-count">{answers.length} ANSWERED</span></div>
          <div className="review-list">
            {answers.map((item, index) => (
              <article className="panel review-card" key={`${item.id}-${index}`}>
                <span className={`review-mark ${item.correct ? "is-correct" : "is-wrong"}`}>{item.correct ? "✓" : "×"}</span>
                <div className="review-body">
                  <div className="review-meta"><span>{item.subject}</span><span>·</span><span>{item.topic}</span></div>
                  <h3>{item.question}</h3>
                  <div className="answer-line"><span>Your answer</span><strong className={item.correct ? "good-answer" : "bad-answer"}>{item.chosen}</strong></div>
                  {!item.correct && <div className="answer-line"><span>Correct answer</span><strong className="good-answer">{item.expected}</strong></div>}
                  <p>{item.explanation}</p>
                </div>
                <span className={`review-points ${item.correct ? "points-earned" : ""}`}>+{item.earned} XP</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel next-mission"><span className="next-emblem">✦</span><div><span className="section-kicker">READY FOR THE NEXT EXPEDITION?</span><h2>The next mystery awaits.</h2><p>Choose a new subject or difficulty to discover another path.</p></div><button className="primary-button" onClick={goHome}>Play another round <span>→</span></button></section>

        <footer className="site-footer"><span className="footer-brand">BOARD BREAKERS</span><span>Progress over perfection</span><span>KEEP THINKING · KEEP GROWING</span></footer>
      </main>
    );
  }

  return (
    <main className="vault-app game-screen">
      <header className="topbar game-topbar">
        <button className="brand" onClick={() => setExitDialog(true)}><span className="brand-mark">B</span><span className="brand-text"><strong>BOARD BREAKERS</strong><small>CLASS X · LEARNING ARCADE</small></span></button>
        <div className="global-progress-wrap"><div className="progress-caption"><span>VAULT PROGRESS</span><strong>{current + 1} / {total}</strong></div><div className="global-progress"><div style={{ width: `${((current + 1) / total) * 100}%` }} /></div></div>
        <div className="game-actions"><button className="sound-button" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "Mute sound" : "Enable sound"}>{soundOn ? "♫" : "♪"}</button><button className="exit-button" onClick={() => setExitDialog(true)}>Exit ↗</button></div>
      </header>

      {question && <>
        <div className="breadcrumb"><span>EXAM VAULT</span><i>/</i><span>{question.subject.toUpperCase()}</span><i>/</i><strong>CHAMBER {String(current + 1).padStart(2, "0")}</strong></div>

        <section className="game-layout">
          <div className="challenge-column">
            <div className="challenge-heading"><div><span className="section-kicker">ACTIVE CHALLENGE</span><h1>Crack the <span className="gradient-text">code.</span></h1></div><div className="room-chip"><span>{question.symbol}</span><div><strong>{question.room}</strong><small>VAULT CHALLENGE SYSTEM</small></div></div></div>

            <section className="panel puzzle-card">
              <div className="puzzle-topline"><span>✧ &nbsp;{question.room.toUpperCase()}</span><small>NX-{question.id}</small></div>
              <div className="puzzle-art"><div className="puzzle-ring puzzle-ring-a" /><div className="puzzle-ring puzzle-ring-b" /><div className="puzzle-symbol">{question.symbol}</div><span className="puzzle-corner corner-a">+</span><span className="puzzle-corner corner-b">×</span><span className="puzzle-corner corner-c">÷</span><span className="puzzle-corner corner-d">=</span></div>

              <div className="question-block"><div className="question-label">PUZZLE {String(current + 1).padStart(2, "0")} <i>·</i> {question.topic.toUpperCase()} <span className={`level-tag level-${question.level.toLowerCase()}`}>{question.level}</span></div><h2>{question.question}</h2><p>Choose the best answer to unlock the next chamber.</p></div>

              <div className="answer-grid">
                {question.options.map((option, index) => {
                  const hidden = hiddenOptions.includes(option);
                  const correct = option === question.answer;
                  const chosen = selected === option;
                  let className = "answer-choice";
                  if (hidden) className += " answer-hidden";
                  if (revealed && correct) className += " answer-correct";
                  if (revealed && chosen && !correct) className += " answer-wrong";

                  return (
                    <button key={`${question.id}-${option}`} className={className} disabled={revealed || hidden} onClick={() => submitAnswer(option)}>
                      <span className="choice-letter">{String.fromCharCode(65 + index)}</span><span className="choice-text">{option}</span><span className="choice-action">{revealed && correct ? "✓" : revealed && chosen ? "×" : "↗"}</span>
                    </button>
                  );
                })}
              </div>

              {hintUsed && !revealed && <div className="hint-box"><span>✧</span><div><small>ACADEMY CLUE</small><p>{question.hint}</p></div></div>}

              {revealed && <div className={`feedback-box ${selected === question.answer ? "feedback-success" : "feedback-error"}`}>
                <div className="feedback-heading"><span>{selected === question.answer ? "✓" : "!"}</span><div><strong>{selected === question.answer ? "Brilliant deduction!" : outcome === "timeout" ? "The clock ran out." : outcome === "skip" ? "Chamber skipped." : "Not quite this time."}</strong><small>{selected === question.answer ? `+${answers[answers.length - 1]?.earned ?? 0} XP earned` : `Correct answer: ${question.answer}`}</small></div></div>
                <p>{question.explanation}</p>
                <button className="continue-button" onClick={nextQuestion}>{lives <= 0 ? "View mission report" : current + 1 >= total ? "Complete expedition" : "Unlock next chamber"} <span>→</span></button>
              </div>}

              <div className="puzzle-footer"><span>✦ &nbsp;{question.points} BASE XP</span><span>THINK BEFORE YOU LOCK IN</span></div>
            </section>

            {!revealed && <section className="powerups-section">
              <div className="powerups-heading"><div><span className="section-kicker">FIELD TOOLS</span><h3>Need a clue?</h3></div><span>USE WISELY</span></div>
              <div className="powerup-grid">
                <button className="powerup-card" disabled={hintUsed || hintsLeft <= 0} onClick={useHint}><span className="powerup-icon hint-icon">✧</span><span className="powerup-copy"><strong>Reveal a clue</strong><small>{hintUsed ? "Used this chamber" : "Get a helpful hint"}</small></span><span className="powerup-status">{hintsLeft} left</span></button>
                <button className="powerup-card" disabled={fiftyUsed} onClick={useFiftyFifty}><span className="powerup-icon fifty-icon">½</span><span className="powerup-copy"><strong>50 : 50</strong><small>{fiftyUsed ? "Used this chamber" : "Remove two wrong options"}</small></span><span className="powerup-status">{fiftyUsed ? "USED" : "READY"}</span></button>
                <button className="powerup-card" onClick={() => submitAnswer(null, "skip")}><span className="powerup-icon skip-icon">↷</span><span className="powerup-copy"><strong>Skip chamber</strong><small>Skip with a life penalty</small></span><span className="powerup-status">−1 ♥</span></button>
              </div>
            </section>}
          </div>

          <aside className="game-sidebar">
            <section className={`panel timer-panel ${timeLeft <= 8 ? "timer-warning" : ""}`}>
              <div className="panel-label-row"><span className="section-kicker">TIME REMAINING</span><span className="live-label">LIVE</span></div>
              <div className="timer-dial" style={{ "--time-progress": `${(timeLeft / selectedMode.seconds) * 100}%` }}><div className="timer-inner"><span>◷</span><strong>{String(timeLeft).padStart(2, "0")}</strong><small>SECONDS</small></div></div>
              <p className="timer-caption">{timeLeft <= 8 ? "Hurry! Lock in your answer." : "Think clearly. Stay focused."}</p>
              <div className="timer-mode"><span>DIFFICULTY</span><strong>{mode.toUpperCase()}</strong></div>
            </section>

            <section className="panel performance-panel">
              <div className="panel-label-row"><span className="section-kicker">YOUR PERFORMANCE</span><span className="score-star">✦</span></div>
              <div className="score-display"><span>⚡</span><div><small>TOTAL EXPERIENCE</small><strong>{score.toLocaleString()} <i>XP</i></strong></div></div>
              <div className="stat-row"><span>Current combo</span><strong>×{(1 + Math.min(streak, 5) * 0.1).toFixed(1)}</strong></div>
              <div className="stat-row"><span>XP multiplier</span><strong>×{selectedMode.multiplier}</strong></div>
              <div className="combo-note">{streak >= 2 ? `🔥 ${streak} correct answers in a row!` : "Correct answers build your combo."}</div>
            </section>

            <section className="panel lives-panel">
              <div className="panel-label-row"><span className="section-kicker">ENERGY SHIELDS</span><strong>{lives} / 3</strong></div>
              <div className="hearts">{[0, 1, 2].map((heart) => <span key={heart} className={heart < lives ? "heart-on" : "heart-off"}>♥</span>)}</div>
              <div className="lives-track"><div style={{ width: `${(lives / 3) * 100}%` }} /></div>
              <p>{lives === 3 ? "All shields charged. Protect them." : lives === 2 ? "One shield lost. Stay sharp." : lives === 1 ? "Final shield. Choose carefully." : "No shields remain."}</p>
            </section>

            <section className="panel mini-map">
              <div className="panel-label-row"><span className="section-kicker">CHAMBER MAP</span><span>⌖</span></div>
              <div className="map-grid">{questions.map((item, index) => <div key={item.id} title={`Chamber ${index + 1}: ${item.topic}`} className={`map-cell ${index === current ? "map-current" : ""} ${index < answers.length ? answers[index]?.correct ? "map-success" : "map-failed" : ""}`}>{index < answers.length ? answers[index]?.correct ? "✓" : "×" : index === current ? "◆" : String(index + 1).padStart(2, "0")}</div>)}</div>
              <div className="map-legend"><span><i className="legend-cleared" /> Cleared</span><span><i className="legend-current" /> Current</span></div>
              <div className="map-bottom"><span>CHAMBERS EXPLORED</span><strong>{answers.length} / {total}</strong></div>
            </section>

            <section className="sidebar-tip"><span>✧</span><div><strong>Exam intelligence</strong><p>Accuracy builds confidence. Read each question, show your reasoning, and learn from the explanation.</p></div></section>
          </aside>
        </section>
      </>}

      <footer className="site-footer game-footer"><span className="footer-brand">BOARD BREAKERS</span><span>Stay curious. Stay focused.</span><span>CLASS X LEARNING ARCADE</span></footer>

      {exitDialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setExitDialog(false); }}><section className="panel exit-dialog" role="dialog" aria-modal="true" aria-labelledby="exit-title"><span className="exit-symbol">↗</span><span className="section-kicker">PAUSE EXPEDITION</span><h2 id="exit-title">Leaving the vault?</h2><p>Your current round will end, and its score will not be added to your saved expedition record.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setExitDialog(false)}>Stay and solve</button><button className="primary-button" onClick={goHome}>Exit mission <span>→</span></button></div></section></div>}
    </main>
  );
}
