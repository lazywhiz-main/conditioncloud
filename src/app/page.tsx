'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--sub-color-light)] via-[var(--sub-color)] to-white relative overflow-hidden">
      {/* 背景の雲装飾 */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[8%] left-[10%] w-40 h-40 rounded-full bg-[var(--sub-color)] blur-2xl" />
        <div className="absolute top-[35%] right-[12%] w-56 h-56 rounded-full bg-[var(--main-color-light)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] w-48 h-48 rounded-full bg-[var(--sub-color)] blur-2xl" />
      </div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg"
          >
            あなたの<span className="text-[var(--main-color)]">「休息の質」</span>を
            <br />
            <span className="text-[var(--main-color)]">美しく可視化</span>する
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto font-semibold"
          >
            8つの視点から今の状態を診断し、<br />
            <span className="text-[var(--main-color)]">あなただけの最適な休息メソッド</span>を提案します。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/questions"
              className="btn btn-primary text-lg tracking-wide rounded-full py-5 px-12 shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-200"
            >
              3分で休息診断を始める
            </Link>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/95 p-8 rounded-2xl shadow-lg border border-[var(--sub-color)] flex flex-col items-center min-h-[220px] hover:scale-105 hover:shadow-2xl transition-transform duration-200"
          >
            <div className="text-[var(--main-color)] text-4xl mb-6">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-[var(--main-color)]">多角的な8つの視点</h3>
            <p className="text-[var(--text-secondary)] text-base text-center">「脳の休息」「身体の動き」「腸内環境」など、<br />現代人の休息に必要な8つの要素を網羅。</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/95 p-8 rounded-2xl shadow-lg border border-[var(--sub-color)] flex flex-col items-center min-h-[220px] hover:scale-105 hover:shadow-2xl transition-transform duration-200"
          >
            <div className="text-[var(--main-color)] text-4xl mb-6">📊</div>
            <h3 className="text-xl font-semibold mb-3 text-[var(--main-color)]">直感的に状態を把握</h3>
            <p className="text-[var(--text-secondary)] text-base text-center">独自の「雲アルゴリズム」で、あなたの休息状態を<br />美しいビジュアルで一目で理解できます。</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-white/95 p-8 rounded-2xl shadow-lg border border-[var(--sub-color)] flex flex-col items-center min-h-[220px] hover:scale-105 hover:shadow-2xl transition-transform duration-200"
          >
            <div className="text-[var(--main-color)] text-4xl mb-6">💡</div>
            <h3 className="text-xl font-semibold mb-3 text-[var(--main-color)]">あなただけの休息提案</h3>
            <p className="text-[var(--text-secondary)] text-base text-center">データから導き出された、あなた固有の<br />休息メソッドをカスタマイズしてお届け。</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}