'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';

export default function Questions() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  console.log('questions:', questions);

  // 前の質問に戻る処理
  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
    }
  };

  const handleChange = (qid: number, option: string) => {
    setAnswers(prev => {
      const arr = prev[qid] || [];
      return {
        ...prev,
        [qid]: arr.includes(option) ? arr.filter(o => o !== option) : [...arr, option]
      };
    });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      // スコア計算
      const scores: Record<string, number> = {};
      questions.forEach(q => {
        const checked = (answers[q.id] || []).length;
        scores[q.category] = (checked / q.options.length) * 100;
      });
      router.push(`/results?scores=${encodeURIComponent(JSON.stringify(scores))}`);
    }
  };

  const q = questions[current];
  const selectedCount = (answers[q.id] || []).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--neutral-lightest)] to-[var(--sub-color-light)] p-6 md:p-10 relative overflow-hidden">
      {/* 背景の雲模様 - 控えめに */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-32 h-32 rounded-full bg-[var(--sub-color)] blur-2xl"></div>
        <div className="absolute top-[40%] right-[15%] w-40 h-40 rounded-full bg-[var(--main-color-light)] blur-3xl"></div>
        <div className="absolute bottom-[15%] left-[35%] w-36 h-36 rounded-full bg-[var(--sub-color)] blur-2xl"></div>
      </div>
      
      <div className="max-w-3xl mx-auto relative">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[var(--text-secondary)] text-xs font-medium">質問 {current + 1} / {questions.length}</p>
            {/* カテゴリー名を表示 */}
            <p className="text-[var(--main-color)] text-xs font-medium">
              {(() => {
                // カテゴリーIDを人間が読める形式に変換
                const categoryMap: Record<string, string> = {
                  'rest-brain': '休息（脳）',
                  'exercise': '運動',
                  'gut': '腸活',
                  'change': '変化',
                  'entertainment': '娯楽・探究',
                  'expression': '表現',
                  'communication': '交流',
                  'rest-body': '休息（身体）',
                };
                return categoryMap[q.category] || q.category;
              })()}
            </p>
          </div>
          <div className="w-full bg-[var(--neutral-light)] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[var(--main-color)] h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white/95 p-5 md:p-6 rounded-lg shadow-md border border-[var(--sub-color)] relative">
          {/* 設問タイトルと説明の視覚的階層を明確化 */}
          <h2 className="text-base md:text-lg font-bold mb-2 text-[var(--text-primary)] leading-normal md:leading-relaxed">{q.text}</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-4 font-normal">あてはまるものをすべて選択してください（複数選択可）</p>
          
          {/* 選択済みアイテム数のカウンター */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-[var(--main-color)] text-xs font-medium">
              {selectedCount > 0 ? `${selectedCount}個選択中` : '選択されていません'}
            </p>
          </div>
          
          {/* 選択肢リスト - グリッドレイアウトに変更（画面幅に応じて1列または2列） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
            {q.options.map((option, i) => (
              <div 
                key={i}
                className="relative"
              >
                <label 
                  className={`flex items-start space-x-3 p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-200 w-full
                    ${(answers[q.id] || []).includes(option) 
                      ? 'bg-[var(--sub-color-light)] border border-[var(--sub-color)]' 
                      : 'hover:bg-[var(--neutral-lighter)] border border-transparent'}`}
                >
                  <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={(answers[q.id] || []).includes(option)}
                      onChange={() => handleChange(q.id, option)}
                      className="appearance-none h-4 w-4 border border-[var(--neutral)] rounded checked:bg-[var(--main-color)] transition-colors duration-200"
                    />
                    {(answers[q.id] || []).includes(option) && (
                      <svg 
                        className="absolute w-2.5 h-2.5 text-white pointer-events-none" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-[var(--text-primary)] text-sm leading-relaxed">{option}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* 前後ナビゲーションボタン */}
        <div className="mt-4 flex justify-between items-center sticky bottom-4 z-10">
          <button
            onClick={handlePrevious}
            disabled={current === 0}
            className={`${current === 0 ? 'opacity-0 pointer-events-none' : ''} 
                      bg-white border border-[var(--sub-color-dark)] text-[var(--text-secondary)] font-medium py-2 px-6 rounded-full 
                      transition-colors duration-300 shadow-md hover:shadow`}
          >
            戻る
          </button>
          
          <button
            onClick={handleNext}
            className="btn btn-primary py-2 px-8 rounded-full shadow-lg hover:shadow-xl"
          >
            {current < questions.length - 1 ? '次へ' : '結果を見る'}
          </button>
        </div>
      </div>
    </main>
  );
}