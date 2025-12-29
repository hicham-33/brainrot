import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Data & Types ---
interface Item {
  name: string;
  img: string;
  rarity?: string;
  backupImg?: string; // Fallback if main img fails
}

const CDN_BASE = "https://cdn.jsdelivr.net/gh/monorolls/sas@main/";
const FALLBACK_IMG = "https://static.wikia.nocookie.net/roblox/images/5/53/QuestionMark.png/revision/latest?cb=20210629000000"; // Generic placeholder

const ITEMS: Item[] = [
  // --- Working Items (Verified) ---
  { name: "mieteteira Bicicleteira", img: "https://i.postimg.cc/yYw4x5P5/offer-1761253033848-992213878.webp", rarity: "⭐ RARE" },
  { name: "67", img: "https://i.postimg.cc/qBbnJ8Gn/BOIIIIIII-SIX-SEVEN-3F3F3F3F3F.webp", rarity: "⭐ RARE" },
  { name: "chipso and queso", img: "https://i.postimg.cc/qMc4hYQR/Boombig.webp", rarity: "⭐ RARE" },
  { name: "Meowl", img: "https://i.postimg.cc/pLVG5BrF/Clear-background-clear-meowl-image.webp", rarity: "OG" },
  { name: "Strawberry Elephant", img: "https://static.wikia.nocookie.net/stealabr/images/5/58/Strawberryelephant.png", rarity: "⭐ RARE" },
  { name: "Eviledon", img: "https://i.postimg.cc/KcJJPWmr/Eviledon-removebg-preview.png", rarity: "COMMON" },
  { name: "Spooky and Pumpky", img: "https://i.postimg.cc/3NhL9yRd/Spooky-and-Pumpky.png", rarity: "COMMON" },
  { name: "Los Mobilis", img: "https://i.postimg.cc/pTrVrTxB/Los-Mobilis.png", rarity: "COMMON" },
  { name: "La Spooky Grande", img: "https://i.postimg.cc/0NnJTLXj/New-La-Grande-removebg-preview.png", rarity: "COMMON" },
  { name: "Burguro and Fryuro", img: "https://i.postimg.cc/HsPNGF9B/burguro-and-fryuro-removebg-preview.png", rarity: "⭐ RARE" },
  { name: "Los 67", img: "https://i.postimg.cc/yNsw1c2Y/Untitled-design-removebg-preview.png", rarity: "COMMON" },
  { name: "Chillin Chili", img: "https://i.postimg.cc/Lsxrnxxj/Gemini-Generated-Image-jt0mrkjt0mrkjt0m-removebg-preview.png", rarity: "⭐ RARE" },
  { name: "Yin Yang Elephant", img: "https://i.postimg.cc/RZ9s31zg/Screenshot-2025-09-28-at-00-44-35-removebg-preview.png", rarity: "⭐ RARE" },
  { name: "No My Examine", img: "https://i.postimg.cc/fLs0rFyh/Noo-My-Exam.png", rarity: "COMMON" },
  { name: "Skibidi Toilet", img: "https://i.postimg.cc/5ygHgRRv/images-(7).jpg", rarity: "LEGENDARY" },
  { name: "Smurf Cat", img: "https://i.postimg.cc/FHdRkzNh/images-(8).jpg", rarity: "EPIC" },
  { name: "Sigma Face", img: "https://i.postimg.cc/0QcxB1Pt/Sig-ma-Boy.webp", rarity: "LEGENDARY" },
  { name: "La Jolly Grande", img: "https://static.wikia.nocookie.net/stealabr/images/5/5d/Lajollygrande.png", rarity: "UNCOMMON" },
  { name: "Cooki and Milki", img: "https://static.wikia.nocookie.net/stealabr/images/9/9b/Cooki_and_milki.png", rarity: "UNCOMMON" },
  { name: "Guest 666", img: "https://i.postimg.cc/630tG03c/Guest-666.webp", rarity: "EPIC" },
  { name: "1x1x1x1", img: "https://static.wikia.nocookie.net/stealabr/images/f/f2/1x1x1x1.webp", rarity: "EPIC" },
  { name: "Headless Horseman", img: "https://i.postimg.cc/yxtC5FYq/Gemini-Generated-Image-fuv8dmfuv8dmfuv8-removebg-preview.png", rarity: "LEGENDARY" },
  { name: "Tang Tang Keletang", img: "https://i.postimg.cc/Y9HkPtCn/Tang-Tnag-Keletang.png", rarity: "RARE" },

  // --- Verified Full URLs from Snippet ---
  { name: "Golden Tralalero", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/GoldenTralaleroTralala.png", rarity: "LEGENDARY" },
  { name: "Lucky Block", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/LuckyBlock.png", rarity: "EPIC" },
  { name: "$1,000,000", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/$1000000.png", rarity: "MYTHIC" },
  { name: "Admin Commands", img: "https://tr.rbxcdn.com/180DAY-178986b13c3ddc14b00cd9d820ce36d5/150/150/Image/Webp/noFilter", rarity: "ADMIN" },
  { name: "VIP", img: "https://tr.rbxcdn.com/180DAY-46392a150c74bd4a11aca80270077e96/150/150/Image/Webp/noFilter", rarity: "LEGENDARY" },
  { name: "GoldenLos Tralaleritos", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/GoldenLosTralaleritos.png", rarity: "LEGENDARY" },
  { name: "Diamond Los Tralaleritos", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/DiamondLosTralaleritos.png", rarity: "GODLY" },
  { name: "Golden La Vacca", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/GoldenLaVaccaSaturnoSaturnita.png", rarity: "LEGENDARY" },
  { name: "Diamond La Vacca", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/DiamondLaVaccaSaturnoSaturnita.png", rarity: "GODLY" },
  { name: "La Grande Combinasion", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/LaGrandeCombinasion.png", rarity: "EPIC" },
  { name: "Odin Din Din Dun", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/OdinDinDinDun.png", rarity: "EPIC" },
  { name: "Tralalero Tralala", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/TralaleroTralala.png", rarity: "RARE" },
  { name: "Rainbow Tralalero", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/RainbowTralaleroTralala.png", rarity: "MYTHIC" },
  { name: "Rainbow Odin Din", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/RainbowOdinDinDinDun.png", rarity: "MYTHIC" },
  { name: "Los Tralaleritos", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/LosTralaleritos.png", rarity: "RARE" },
  { name: "La Vacca Saturno", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/LaVaccaSaturnoSaturnita.png", rarity: "RARE" },
  { name: "Graipuss Medussi", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/GraipussMedussi.png", rarity: "EPIC" },
  { name: "Golden Graipuss Medussi", img: "https://cdn.jsdelivr.net/gh/monorolls/sas@main/GoldenGraipussMedussi.png", rarity: "LEGENDARY" },
];

const USERS = ['Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James', 'Isabella', 'Logan', 'Mia', 'Mason', 'Charlotte'];
const CTA_TEXTS = ["Unlock Access", "Continue", "Verify Now", "Access Content"];

// --- Components ---

const FloatingBackground = () => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
    }}>
      {Array.from({ length: 15 }).map((_, i) => {
        const item = ITEMS[i % ITEMS.length];
        const left = Math.random() * 100;
        const width = 30 + Math.random() * 50;
        const duration = 10 + Math.random() * 20;
        const delay = -Math.random() * 20;

        return (
          <img
            key={i}
            src={item.img}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            alt=""
            style={{
              position: 'absolute',
              left: `${left}%`,
              width: `${width}px`,
              opacity: 0.1,
              animation: `floatUp ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              bottom: '-10vh' 
            }}
          />
        );
      })}
    </div>
  );
};

// Item Card Component with Fallback Logic
const ItemCard: React.FC<{ item: Item, onClaim: (i: Item) => void }> = ({ item, onClaim }) => {
  const [imgSrc, setImgSrc] = useState(item.img);

  const getRarityColor = (rarity: string = '') => {
    if (rarity.includes('GODLY')) return '#00FFFF'; // Cyan
    if (rarity.includes('MYTHIC')) return '#FF4C4C'; // Red
    if (rarity.includes('LEGENDARY')) return '#FFD700'; // Gold
    if (rarity.includes('EPIC')) return '#A335EE'; // Purple
    if (rarity.includes('RARE')) return '#00CFFF'; // Blue
    if (rarity.includes('OG')) return '#FF8F00'; // Orange
    if (rarity.includes('ADMIN')) return '#FF0000'; // Red
    return '#aaa'; // Grey (Common)
  };

  const rarityColor = getRarityColor(item.rarity);

  return (
    <div style={{
      background: 'rgba(30, 20, 60, 0.6)',
      border: `1px solid ${rarityColor}40`, // Low opacity border
      borderRadius: '16px', 
      padding: '10px',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      position: 'relative', 
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      height: '100%',
      cursor: 'pointer'
    }}
    className="item-card"
    onClick={() => onClaim(item)}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 10px 25px ${rarityColor}30`;
        e.currentTarget.style.borderColor = rarityColor;
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        e.currentTarget.style.borderColor = `${rarityColor}40`;
    }}
    >
      {/* Glow Effect behind image */}
      <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60px', height: '60px', background: rarityColor, opacity: 0.15, filter: 'blur(20px)', borderRadius: '50%'
      }}></div>

      <div style={{
        width: '80px', height: '80px', 
        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '10px',
        position: 'relative',
        zIndex: 2
      }}>
        <img 
            src={imgSrc} 
            alt={item.name} 
            onError={() => setImgSrc(FALLBACK_IMG)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }} 
        />
      </div>
      
      <div style={{ textAlign: 'center', width: '100%', zIndex: 2 }}>
        <div style={{ 
            fontWeight: 700, 
            fontSize: '0.9rem', 
            textShadow: '0 1px 2px rgba(0,0,0,0.8)', 
            lineHeight: '1.2',
            marginBottom: '4px',
            minHeight: '2.4em', // Ensure 2 lines of text align properly
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        }}>
          {item.name}
        </div>
        {item.rarity && (
            <div style={{ 
                fontSize: '0.65rem', 
                color: rarityColor,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: `${rarityColor}15`,
                padding: '2px 8px',
                borderRadius: '8px',
                display: 'inline-block',
                marginTop: '4px'
            }}>
                {item.rarity}
            </div>
        )}
      </div>

      <button 
        style={{
          background: `linear-gradient(90deg, ${rarityColor}AA, ${rarityColor})`,
          color: '#000', border: 'none', padding: '6px 0', width: '100%',
          borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem',
          cursor: 'pointer', marginTop: '10px',
          boxShadow: `0 2px 10px ${rarityColor}40`,
          fontFamily: "'Poppins', sans-serif",
          textTransform: 'uppercase',
          zIndex: 2
        }}
      >
        Claim
      </button>
    </div>
  );
}

const WinnerToast = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', item: '', img: '' });

  useEffect(() => {
    const showToast = () => {
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      setData({ name: user, item: item.name, img: item.img });
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    const loop = () => {
      const delay = 6000 + Math.random() * 4000;
      setTimeout(() => {
        showToast();
        loop();
      }, delay);
    };
    loop();
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100px)',
      background: 'rgba(20, 20, 30, 0.95)', border: '1px solid #00CFFF',
      padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px',
      zIndex: 2000, whiteSpace: 'nowrap', transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 5px 20px rgba(0,0,0,0.6)', opacity: visible ? 1 : 0
    }}>
      <img src={data.img} onError={(e) => e.currentTarget.src = FALLBACK_IMG} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #fff' }} />
      <div style={{ fontSize: '0.85rem' }}>
        <span style={{ color: '#00CFFF', fontWeight: 'bold' }}>{data.name}</span> claimed <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{data.item}</span>
      </div>
    </div>
  );
};

const App = () => {
  const [modalState, setModalState] = useState<'none' | 'username' | 'generator'>('none');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [username, setUsername] = useState('');
  
  // Hero State
  const [activeUsers, setActiveUsers] = useState(248);
  const [timeLeft, setTimeLeft] = useState(600);
  const [ctaText, setCtaText] = useState(CTA_TEXTS[0]);
  
  // Generator State
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [genProgress, setGenProgress] = useState(0);
  const [showVerify, setShowVerify] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  const itemsRef = useRef<HTMLDivElement>(null);
  const scrollToItems = () => itemsRef.current?.scrollIntoView({ behavior: 'smooth' });

  // --- Effects ---
  useEffect(() => {
    const interval = setInterval(() => setActiveUsers(prev => 200 + Math.floor(Math.random() * 100)), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(t => t <= 0 ? 600 : t - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => { idx = (idx + 1) % CTA_TEXTS.length; setCtaText(CTA_TEXTS[idx]); }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (modalState === 'generator') {
      setConsoleLogs(['> Initializing connection...']);
      setGenProgress(0);
      setShowVerify(false);

      const addLog = (msg: string) => setConsoleLogs(prev => [...prev, `> ${msg}`]);
      
      const progressInterval = setInterval(() => {
        setGenProgress(prev => {
          if (prev >= 100) { clearInterval(progressInterval); return 100; }
          return prev + Math.random() * 3;
        });
      }, 100);

      const sequence = async () => {
        await new Promise(r => setTimeout(r, 1500));
        addLog(`Searching for user '${username}'...`);
        await new Promise(r => setTimeout(r, 2000));
        addLog(`<span style="color:#00CFFF">User Found! Verified.</span>`);
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Injecting ${selectedItem?.name}...`);
        await new Promise(r => setTimeout(r, 2000));
        addLog(`Finalizing transaction...`);
        await new Promise(r => setTimeout(r, 1000));
        setGenProgress(100);
        addLog(`<span style="color:#FF4C4C">Automatic verification failed.</span>`);
        addLog(`Manual verification required.`);
        setShowVerify(true);
      };
      sequence();
      return () => clearInterval(progressInterval);
    }
  }, [modalState, username, selectedItem]);

  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [consoleLogs]);

  const handleClaim = (item: Item) => {
    setSelectedItem(item);
    setModalState('username');
  };

  const startGenerator = () => {
    if (username.length < 3) { alert("Please enter a valid username"); return; }
    setModalState('generator');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerify = () => {
    if ((window as any)._Ew) { (window as any)._Ew(); } else { console.warn("Locker script not loaded"); }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '20px 15px' }}>
      <FloatingBackground />
      <WinnerToast />

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeInDown 0.8s ease' }}>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive", fontSize: '2.8rem',
          background: 'linear-gradient(to right, #fff, #00CFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 15px rgba(0, 207, 255, 0.3)', marginBottom: '5px', lineHeight: '1.2'
        }}>
          STEAL A BRAINROT
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
          Official Reward Platform • Season 5
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '8px 15px',
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', marginBottom: '20px'
        }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#00ff00', borderRadius: '50%', boxShadow: '0 0 10px #00ff00', animation: 'pulse 1.5s infinite' }}></div>
          <span style={{ fontSize: '0.85rem' }}>{activeUsers} Online Users</span>
        </div>

        <div style={{
          background: 'rgba(255, 76, 76, 0.1)', border: '1px solid rgba(255, 76, 76, 0.3)',
          color: '#ffcccc', padding: '12px', borderRadius: '12px', fontSize: '0.95rem',
          marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px', margin: '0 auto 25px auto'
        }}>
          <span>⚠️ Limited Rewards Left</span>
          <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem' }}>{formatTime(timeLeft)}</span>
        </div>

        <button 
          onClick={scrollToItems}
          style={{
            background: 'linear-gradient(90deg, #FF4C4C, #FF8F00)', color: 'white', border: 'none', padding: '14px 40px',
            borderRadius: '50px', fontFamily: "'Fredoka One', cursive", fontSize: '1.3rem', cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(255, 76, 76, 0.5)', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
          }}
        >
          {ctaText}
          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)', transform: 'rotate(45deg)', animation: 'shine 3s infinite' }}></div>
        </button>
      </div>

      {/* Items Grid */}
      <div id="items-grid" ref={itemsRef} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', // Responsive Grid
          gap: '12px',
          paddingBottom: '50px'
      }}>
        {ITEMS.map((item, index) => (
          <ItemCard key={index} item={item} onClaim={handleClaim} />
        ))}
      </div>

      {/* Footer Badges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>🔒 SSL Secured</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>✓ Verified</div>
      </div>

      {/* Modals */}
      {modalState === 'username' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0d2e, #2d1b5e)', border: '2px solid #00CFFF', borderRadius: '25px', padding: '30px',
            width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'pulse 0.3s ease-out'
          }}>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', marginBottom: '10px' }}>Enter Username</h2>
            <div style={{marginBottom: '15px'}}>
               <img src={selectedItem?.img} onError={(e) => e.currentTarget.src = FALLBACK_IMG} style={{width: '60px', height: '60px', borderRadius: '10px', border: '1px solid #fff'}} />
            </div>
            <p style={{ color: '#ccc', fontSize: '0.9rem' }}>To receive your <span style={{ color: '#00CFFF', fontWeight: 'bold' }}>{selectedItem?.name}</span></p>
            <input 
              type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
              style={{
                width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1.1rem', margin: '20px 0', outline: 'none', textAlign: 'center'
              }}
            />
            <button 
              onClick={startGenerator}
              style={{
                width: '100%', fontSize: '1.2rem', padding: '15px', background: 'linear-gradient(90deg, #6A00FF, #00CFFF)',
                color: 'white', border: 'none', borderRadius: '20px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Continue
            </button>
            <button onClick={() => setModalState('none')} style={{marginTop: '15px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {modalState === 'generator' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0d2e, #2d1b5e)', border: '2px solid #00CFFF', borderRadius: '25px', padding: '30px',
            width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', marginBottom: '20px' }}>Processing...</h2>
            <div style={{
              width: '100%', height: '15px', background: '#000', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', border: '1px solid #333'
            }}>
              <div style={{
                height: '100%', width: `${genProgress}%`,
                background: 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)',
                backgroundSize: '200% 100%', animation: 'rainbowMove 2s linear infinite', transition: 'width 0.1s linear'
              }}></div>
            </div>
            <div ref={consoleRef} style={{
              fontFamily: 'monospace', textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px',
              height: '120px', overflowY: 'auto', marginBottom: '20px', fontSize: '0.85rem', color: '#00ff00', border: '1px solid rgba(0,255,0,0.2)'
            }}>
              {consoleLogs.map((log, i) => <div key={i} dangerouslySetInnerHTML={{ __html: log }} />)}
            </div>
            {showVerify && (
              <button 
                onClick={handleVerify}
                style={{
                  background: '#2196F3', color: 'white', fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', padding: '15px 0',
                  width: '100%', borderRadius: '50px', border: '3px solid white', cursor: 'pointer', boxShadow: '0 0 20px rgba(33, 150, 243, 0.6)', animation: 'pulse 1.5s infinite'
                }}
              >
                Verify
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);