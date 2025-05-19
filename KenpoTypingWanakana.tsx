import React, { useState, useRef, useEffect } from "react";
// wanakanaをCDNで使う場合は、public/index.htmlに<script src="https://unpkg.com/wanakana"></script>を追加してください
// npmの場合は: npm install wanakana
import * as wanakana from "wanakana";

// 条文データ例
const ARTICLES = [
  {
    id: 1,
    title: '第一条',
    kanji: '第一条　天皇は、日本国の象徴であり日本国民統合の象徴であって、この地位は、主権の存する日本国民の総意に基く。',
    hiragana: 'だいいちじょう　てんのうは、にほんこくのしょうちょうでありにほんこくみんとうごうのしょうちょうであって、このちいは、しゅけんのそんするにほんこくみんのそういにもとづく。',
  },
  {
    id: 2,
    title: '第二条',
    kanji: '第二条　皇位は、世襲のものであって、国会の議決した皇室典範の定めるところにより、これを継承する。',
    hiragana: 'だいにじょう　こういは、せしゅうのものであって、こっかいのぎけつしたこうしつてんぱんのさだめるところにより、これをけいしょうする。',
  },
  {
    id: 3,
    title: '第三条',
    kanji: '第三条　天皇の国事に関するすべての行為には、内閣の助言と承認を必要とし、内閣が、その責任を負ふ。',
    hiragana: 'だいさんじょう　てんのうのこくじにかんするすべてのこういには、ないかくのじょげんとしょうにんをひつようとし、ないかくが、そのせきにんをおう。',
  },
  {
    id: 4,
    title: '第九条',
    kanji: '第九条　日本国民は、正義と秩序を基調とする国際平和を誠実に希求し、国権の発動たる戦争と、武力による威嚇又は武力の行使は、国際紛争を解決する手段としては、永久にこれを放棄する。',
    hiragana: 'だいきゅうじょう　にほんこくみんは、せいぎとちつじょをきちょうとするこくさいへいわをせいじつにききゅうし、こっけんのはつどうたるせんそうと、ぶりょくによるいかくまたはぶりょくのこうしは、こくさいふんそうをかいけつするしゅだんとしては、えいきゅうにこれをほうきする。',
  },
  // 追加可能
];

export default function KenpoTypingWanakana() {
  const [articleIdx, setArticleIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const article = ARTICLES[articleIdx];
  const targetHiragana = article.hiragana.replace(/[、。・：]/g, m => m).replace(/　/g, ' ');

  // 入力OK判定
  const converted = wanakana.toKana(userInput);
  const isCorrect = targetHiragana.startsWith(converted);
  const isComplete = converted === targetHiragana;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [articleIdx, completed]);

  useEffect(() => {
    setError(false);
    setCompleted(false);
    setUserInput('');
  }, [articleIdx]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (completed) return;
    const key = e.key;
    if (key.length === 1 && key.match(/[a-zA-Z0-9 ,.'-]/)) {
      const next = userInput + key.toLowerCase();
      const nextKana = wanakana.toKana(next);
      if (targetHiragana.startsWith(nextKana)) {
        setUserInput(next);
        setError(false);
        if (nextKana === targetHiragana) {
          setCompleted(true);
        }
      } else {
        setError(true);
      }
    }
    if (
      key === 'Backspace' ||
      key === 'Tab' ||
      key === 'Enter' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    ) {
      e.preventDefault();
    }
  };

  // 進行状況の可視化
  const progress = wanakana.toKana(userInput).length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6 tracking-wide">
          日本国憲法タイピング練習 <span className="text-xs text-indigo-600">wanakana版</span>
        </h1>
        <div className="mb-4">
          <label className="mr-2 text-gray-700 font-medium">条文を選択：</label>
          <select
            className="border border-indigo-300 rounded px-2 py-1 text-lg"
            value={articleIdx}
            onChange={e => setArticleIdx(Number(e.target.value))}
          >
            {ARTICLES.map((a, i) => (
              <option key={a.id} value={i}>{a.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 text-gray-800 text-lg font-semibold border-l-4 border-blue-400 pl-3 leading-relaxed bg-blue-50 rounded">
          {article.kanji}
        </div>
        <div className="mb-6 text-indigo-600 text-base font-mono tracking-wide bg-indigo-50 rounded px-3 py-2">
          {article.hiragana}
        </div>
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="hidden-input">
          ローマ字を1文字ずつタイプしてください（多様な方式OK）
        </label>
        <div className="font-mono text-lg flex flex-wrap break-all bg-gray-50 p-4 rounded mb-4 border border-indigo-200">
          {targetHiragana.split('').map((char, idx) => (
            <span
              key={idx}
              className={
                idx < progress
                  ? "text-green-600 font-bold"
                  : idx === progress
                  ? "bg-yellow-200 text-black font-bold underline"
                  : "text-gray-400"
              }
            >
              {char === ' ' ? <span className="mx-1 text-gray-300">␣</span> : char}
            </span>
          ))}
        </div>
        <input
          id="hidden-input"
          ref={inputRef}
          type="text"
          className="opacity-0 absolute pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          value=""
          tabIndex={0}
          aria-label="タイピング用隠し入力"
        />
        {!completed && (
          <div className="text-center mt-2 text-gray-500 text-sm">
            キーボードでローマ字をタイプしてください（スペースやカンマも含みます）
          </div>
        )}
        {error && (
          <div className="mt-3 text-center text-red-600 font-bold text-lg animate-pulse">
            ❌　間違いです！もう一度
          </div>
        )}
        {completed && (
          <div className="mt-6 text-center text-green-600 font-bold text-2xl animate-bounce">
            🎉 完了！おめでとうございます！
          </div>
        )}
        <div className="mt-8 text-xs text-gray-400">
          ※ wanakanaの変換ルールに準じて多様なローマ字方式に対応します。<br />
          条文もどんどん追加できます！
        </div>
      </div>
    </div>
  );
}
