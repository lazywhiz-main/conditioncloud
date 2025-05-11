'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { categories } from '../../data/questions';

interface Cloud {
  category: string;
  score: number;
  color: string;
  position: { x: number; y: number };
  size: number;
  id: string;
}

function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scores = JSON.parse(decodeURIComponent(searchParams.get('scores') || '{}'));
    
    // vividColor変換関数
    function getVividColor(color: string) {
      switch(color) {
        case '#E6D3B3': return '#ff5252'; // 休息（脳）
        case '#B3D6C6': return '#ff4081'; // 運動
        case '#F5E6B3': return '#ffd600'; // 腸活
        case '#D3C1E6': return '#eeff41'; // 変化
        case '#F5C1B3': return '#4db6ac'; // 娯楽・探究
        case '#B3C7F5': return '#0091ea'; // 表現
        case '#B3E6E2': return '#00b8d4'; // 交流
        case '#E6B3B3': return '#8e24aa'; // 休息（身体）
        default: return color;
      }
    }

    // 雲の位置を調整（縦長の楕円形に）
    const basePositions = [
      { x: 50, y: 15 },  // 上（休息・脳）
      { x: 35, y: 30 },  // 左上（運動）
      { x: 65, y: 30 },  // 右上（腸活）
      { x: 40, y: 50 },  // 中央左（変化）
      { x: 60, y: 50 },  // 中央右（娯楽・探究）
      { x: 35, y: 70 },  // 左下（表現）
      { x: 65, y: 70 },  // 右下（交流）
      { x: 50, y: 85 },  // 下（休息・身体）
    ];
    
    const newClouds = categories.map((category, i) => {
      const basePosition = basePositions[i % basePositions.length];
      const position = {
        x: basePosition.x + (Math.random() * 6 - 3),
        y: basePosition.y + (Math.random() * 6 - 3),
      };
      const score = scores[category.id] || 0;
      const baseSize = 80;
      const size = baseSize + (score / 100) * 55;
      const vividColor = getVividColor(category.color);
      return {
        category: category.name,
        score,
        color: vividColor,
        position,
        size,
        id: category.id,
      };
    });
    
    console.log("生成された雲データ:", newClouds); // デバッグ用
    setClouds(newClouds);
  }, [searchParams]);

  // キャンバスに雲を描画する関数
  useEffect(() => {
    if (!canvasRef.current || clouds.length === 0) {
      console.log('canvasRef.current:', canvasRef.current);
      console.log('clouds:', clouds);
      return;
    }
    
    console.log("描画開始: 雲の数", clouds.length); // デバッグ用
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      console.error("キャンバスコンテキストの取得に失敗"); // デバッグ用
      return;
    }
    
    // 型アサーションでctxがnullでないことを保証
    const ctx = context as CanvasRenderingContext2D;
    
    // キャンバスのリサイズとクリア
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        console.log(`キャンバスサイズ: ${canvas.width}x${canvas.height}`); // デバッグ用
      }
      
      // キャンバスを完全な白で塗りつぶす
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 雲を描画する関数
      const drawClouds = () => {
        console.log("雲の描画開始"); // デバッグ用
        clouds.forEach((cloud, index) => {
          const x = (cloud.position.x / 100) * canvas.width;
          const y = (cloud.position.y / 100) * canvas.height;
          console.log(`雲[${index}] - カテゴリ: ${cloud.category}, 位置: (${x}, ${y}), サイズ: ${cloud.size}, 色: ${cloud.color}`); // デバッグ用
          drawCloud(ctx, x, y, cloud.size, cloud.color);
        });
      };
      drawClouds();
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [clouds]);

  // 雲を描画する関数
  function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.save();

    // 1. さらに外側のぼかしを増やす
    ctx.globalAlpha = 0.10;
    ctx.filter = 'blur(16px)';
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = size * 0.32 + Math.random() * size * 0.28;
      const cx = x + Math.cos(angle) * dist;
      const cy = y + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * (0.48 + Math.random() * 0.22), size * (0.41 + Math.random() * 0.18), Math.random() * Math.PI * 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.filter = 'none';

    // 2. メインの雲（中心部もややぼかす）
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const dist = size * 0.15 + Math.random() * size * 0.13;
      const cx = x + Math.cos(angle) * dist;
      const cy = y + Math.sin(angle) * dist;
      ctx.globalAlpha = 0.28 + Math.random() * 0.22;
      ctx.filter = 'blur(3px)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * (0.33 + Math.random() * 0.18), size * (0.29 + Math.random() * 0.15), Math.random() * Math.PI * 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.filter = 'none';
    }

    // 3. 粒子（小さな円）を周囲に散らす
    ctx.globalAlpha = 0.09;
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = size * 0.45 + Math.random() * size * 0.35;
      const cx = x + Math.cos(angle) * dist;
      const cy = y + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(cx, cy, size * (0.08 + Math.random() * 0.09), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // 4. 中心部もややぼかしつつ濃く
    ctx.globalAlpha = 0.5;
    ctx.filter = 'blur(2px)';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.23, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.filter = 'none';

    // 5. ハイライト（白い粒子）
    ctx.globalAlpha = 0.09;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = size * 0.22 + Math.random() * size * 0.18;
      const cx = x + Math.cos(angle) * dist;
      const cy = y + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(cx, cy, size * (0.07 + Math.random() * 0.06), 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }

    ctx.restore();
  }
  
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* ヘッダー部分 */}
      <div className="text-center py-8 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          <b>あなたのリカバリーバランス</b>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          今のあなたの状態をもとに、8つの視点から休息バランスを可視化しています。
        </p>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col md:flex-row px-2 md:px-12 gap-4 md:gap-8 items-stretch md:items-center justify-center w-full">
        {/* 判例部分 */}
        <aside className="w-full md:w-72 flex-shrink-0 mb-4 md:mb-0">
          <div className="md:sticky md:top-8 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-[var(--sub-color)]" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] border-b border-[var(--sub-color)] pb-3">休息の要素</h2>
            <ul className="space-y-4">
              {categories.map(cat => {
                const catScore = clouds.find(c => c.id === cat.id)?.score || 0;
                const vividColor = clouds.find(c => c.id === cat.id)?.color || cat.color;
                return (
                  <li key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span 
                        className="inline-block w-5 h-5 rounded-full" 
                        style={{background: vividColor, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}
                      />
                      <span className="text-[var(--text-primary)] text-sm">{cat.name}</span>
                    </div>
                    <span className="font-bold text-[var(--main-color)]">{Math.round(catScore)}%</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/')}
                className="btn btn-primary rounded-full py-3 px-6 w-full"
              >
                トップに戻る
              </button>
            </div>
          </div>
        </aside>
        {/* キャンバス部分 */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative w-full max-w-2xl aspect-auto md:aspect-[4/3] bg-white rounded-lg shadow-md overflow-hidden border border-[var(--sub-color)] flex items-center justify-center min-h-[320px] md:min-h-[320px] min-w-0">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full block"
              style={{ touchAction: 'none', backgroundColor: '#ffffff', minHeight: 320, minWidth: 0 }}
              width={600}
              height={450}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
}
