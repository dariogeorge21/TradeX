"use client"

import React, { useState } from 'react';
import {
    Search,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Newspaper,
    MessageSquare,
    Star,
    Plus,
    X,
    ChevronRight,
    ChevronDown,
    User,
    LogOut,
    Settings,
    Bell,
    Menu,
    Sparkles,
    LineChart,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Calendar,
    Globe,
    Zap,
    Shield,
    AlertTriangle,
    CheckCircle,
    Info,
    Eye,
    MoreVertical,
    RefreshCw,
    Flame,
    Award,
    Crown,
    GitBranch,
    Activity,
    Fingerprint,
    Cpu,
    Database,
    Cloud,
    Server,
    Layout,
    Home,
    Search as SearchIcon,
    BarChart,
    TrendingUp as TrendingUpIcon,
    Newspaper as NewspaperIcon,
    MessageSquare as MessageSquareIcon,
    Bookmark,
    User as UserIcon,
    Settings as SettingsIcon,
    Bell as BellIcon,
    Menu as MenuIcon,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================
type RiskLevel = 'Low' | 'Medium' | 'High';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: string;
    sector: string;
    risk: RiskLevel;
    trend: string;
    strength: string;
    observations: string;
    factors: string;
    aiInsight: string;
}

interface NewsItem {
    id: string;
    headline: string;
    source: string;
    time: string;
    summary: string;
    affected: string;
}

interface WatchlistItem {
    symbol: string;
    name: string;
    price: number;
    change: number;
}

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_STOCKS: Stock[] = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 189.37,
        change: 2.45,
        changePercent: 1.31,
        marketCap: '2.94T',
        sector: 'Technology',
        risk: 'Low',
        trend: 'Bullish',
        strength: 'Strong',
        observations: 'Apple continues to show resilience with strong iPhone sales and growing services revenue. The stock is trading above its 50-day moving average.',
        factors: 'Strong earnings, positive analyst sentiment, robust consumer demand.',
        aiInsight: 'Apple remains a market leader with consistent growth. The services segment is becoming increasingly important, providing a stable revenue stream. Recent product launches have been well-received.',
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.42,
        change: -4.12,
        changePercent: -1.63,
        marketCap: '789.45B',
        sector: 'Automotive',
        risk: 'High',
        trend: 'Bearish',
        strength: 'Weak',
        observations: 'Tesla is facing headwinds from increased competition and margin pressure. The stock has been volatile amid concerns about demand.',
        factors: 'Price cuts, competition from Chinese EV makers, margin concerns.',
        aiInsight: 'Tesla is at a critical juncture. While the company remains a leader in EVs, increasing competition and pricing pressure are challenging its premium valuation. Watch for delivery numbers.',
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: 495.22,
        change: 8.34,
        changePercent: 1.71,
        marketCap: '1.22T',
        sector: 'Semiconductors',
        risk: 'Medium',
        trend: 'Bullish',
        strength: 'Very Strong',
        observations: 'NVIDIA continues to dominate the AI chip market with unprecedented demand for its GPUs. The stock is hitting new highs.',
        factors: 'AI boom, data center growth, gaming recovery, strong guidance.',
        aiInsight: 'NVIDIA is the poster child for the AI revolution. Its GPUs are the backbone of modern AI systems, and demand shows no signs of slowing. The valuation is high but justified by growth.',
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 388.71,
        change: 5.23,
        changePercent: 1.36,
        marketCap: '2.89T',
        sector: 'Technology',
        risk: 'Low',
        trend: 'Bullish',
        strength: 'Strong',
        observations: 'Microsoft\'s cloud and AI investments are paying off. The company is well-positioned for the next phase of technological growth.',
        factors: 'Azure growth, AI integration, strong enterprise demand.',
        aiInsight: 'Microsoft is a diversified tech giant with strong fundamentals. Its investment in OpenAI and AI integration across products gives it a competitive edge. The stock is a solid long-term hold.',
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 185.34,
        change: 2.87,
        changePercent: 1.57,
        marketCap: '1.92T',
        sector: 'Consumer',
        risk: 'Medium',
        trend: 'Neutral',
        strength: 'Moderate',
        observations: 'Amazon is seeing a recovery in e-commerce and strong growth in AWS. The stock is consolidating after a strong run.',
        factors: 'AWS growth, e-commerce recovery, advertising strength.',
        aiInsight: 'Amazon is a powerhouse in both e-commerce and cloud computing. AWS continues to be a major profit driver. The company is investing heavily in AI and robotics to improve efficiency.',
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.65,
        change: -1.23,
        changePercent: -0.86,
        marketCap: '1.78T',
        sector: 'Technology',
        risk: 'Medium',
        trend: 'Bearish',
        strength: 'Moderate',
        observations: 'Alphabet is facing challenges in ad revenue growth and increased competition in AI. The stock is under pressure.',
        factors: 'Ad slowdown, AI competition, regulatory concerns.',
        aiInsight: 'Alphabet is a dominant force in search and advertising, but faces headwinds from AI competitors like ChatGPT. The company is fighting back with its own AI initiatives. Watch for innovation.',
    },
];

const MOCK_NEWS: NewsItem[] = [
    {
        id: '1',
        headline: 'Federal Reserve Signals Potential Rate Cuts in 2026',
        source: 'Financial Times',
        time: '2 hours ago',
        summary: 'The Federal Reserve indicated that it may begin cutting interest rates in the second half of 2026 as inflation shows signs of cooling.',
        affected: 'Banking, Real Estate, Technology',
    },
    {
        id: '2',
        headline: 'NVIDIA Unveils Next-Generation AI Chip at GTC Conference',
        source: 'Reuters',
        time: '4 hours ago',
        summary: 'NVIDIA announced its new Blackwell architecture, promising a 4x performance boost for AI training workloads.',
        affected: 'Semiconductors, AI, Technology',
    },
    {
        id: '3',
        headline: 'Tesla Reports Record Deliveries in Q2 Despite Price Cuts',
        source: 'Bloomberg',
        time: '6 hours ago',
        summary: 'Tesla delivered a record number of vehicles in the second quarter, exceeding analyst expectations despite aggressive price cuts.',
        affected: 'Automotive, EV, Technology',
    },
    {
        id: '4',
        headline: 'Apple Explores Partnership with OpenAI for Next-Gen Siri',
        source: 'TechCrunch',
        time: '8 hours ago',
        summary: 'Apple is in early discussions with OpenAI to integrate advanced AI capabilities into Siri and other services.',
        affected: 'Technology, AI, Consumer Electronics',
    },
    {
        id: '5',
        headline: 'Oil Prices Surge on Middle East Supply Concerns',
        source: 'CNBC',
        time: '10 hours ago',
        summary: 'Crude oil prices jumped 3% amid rising tensions in the Middle East that could disrupt global supply chains.',
        affected: 'Energy, Oil & Gas, Transportation',
    },
];

const MOCK_WATCHLIST: WatchlistItem[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.37, change: 1.31 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 1.71 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 388.71, change: 1.36 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.34, change: 1.57 },
];

const MOCK_TRENDING = [
    { symbol: 'NVDA', name: 'NVIDIA Corp.', change: 8.34 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', change: 4.56 },
    { symbol: 'META', name: 'Meta Platforms', change: 3.21 },
    { symbol: 'AAPL', name: 'Apple Inc.', change: 2.45 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', change: 5.23 },
];

// ============================================================
// UI COMPONENTS
// ============================================================

// --- Badge ---
const Badge: React.FC<{
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-white/10 text-white border border-white/10',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/20',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/20',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
        outline: 'bg-transparent text-white/70 border border-white/20',
    };
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

// --- Button ---
const Button: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick, icon }) => {
    const variants = {
        primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20',
        secondary: 'bg-white/10 hover:bg-white/20 text-white',
        outline: 'border border-white/20 hover:bg-white/10 text-white',
        ghost: 'hover:bg-white/10 text-white/70 hover:text-white',
        danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-base',
    };
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
        >
            {icon}
            {children}
        </button>
    );
};

// --- Card ---
const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}> = ({ children, className = '', hover = false }) => (
    <div
        className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300' : ''} ${className}`}
    >
        {children}
    </div>
);

// --- Input ---
const Input: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}> = ({ value, onChange, placeholder = '', className = '', icon, onKeyDown }) => (
    <div className={`relative flex items-center ${className}`}>
        {icon && <span className="absolute left-4 text-white/40">{icon}</span>}
        <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all ${icon ? 'pl-11' : ''}`}
        />
    </div>
);

// ============================================================
// MAIN MOCKUP COMPONENT
// ============================================================
export const TradeXMockup: React.FC = () => {
    // --- State ---
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStock, setSelectedStock] = useState<Stock | null>(MOCK_STOCKS[0]);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'news' | 'chat' | 'watchlist'>(
        'dashboard'
    );
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        {
            role: 'assistant',
            content:
                "Hi! I'm your AI market research assistant. Ask me anything about the markets, stocks, or investing. For example: 'Analyze Tesla' or 'What sectors look strong today?'",
        },
    ]);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // --- Handlers ---
    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const found = MOCK_STOCKS.find(
                (s) =>
                    s.symbol.toLowerCase() === searchQuery.toLowerCase() ||
                    s.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (found) {
                setSelectedStock(found);
                setActiveTab('analysis');
                setSearchQuery('');
            }
        }
    };

    const handleStockSelect = (stock: Stock) => {
        setSelectedStock(stock);
        setActiveTab('analysis');
    };

    const handleAddToWatchlist = (stock: Stock) => {
        if (!watchlist.find((w) => w.symbol === stock.symbol)) {
            setWatchlist([
                ...watchlist,
                {
                    symbol: stock.symbol,
                    name: stock.name,
                    price: stock.price,
                    change: stock.changePercent,
                },
            ]);
        }
    };

    const handleRemoveFromWatchlist = (symbol: string) => {
        setWatchlist(watchlist.filter((w) => w.symbol !== symbol));
    };

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput.trim();
        setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');

        // Simulate AI response
        let response = "I'm analyzing your question. Let me provide some insights...";
        if (userMsg.toLowerCase().includes('tesla')) {
            response =
                "Tesla (TSLA) is currently trading at $248.42, down 1.63% today. The stock shows a bearish trend with weak strength. Key factors: price cuts, competition from Chinese EV makers, and margin pressure. Risk level: High. The company is facing headwinds but remains a leader in EVs. Watch delivery numbers for the next quarter.";
        } else if (userMsg.toLowerCase().includes('apple')) {
            response =
                "Apple (AAPL) is trading at $189.37, up 1.31% today. The stock shows a bullish trend with strong strength. Key factors: strong earnings, positive analyst sentiment, and robust consumer demand. Risk level: Low. Apple's services segment is growing, providing stable revenue. The stock is a solid long-term hold.";
        } else if (userMsg.toLowerCase().includes('market') || userMsg.toLowerCase().includes('today')) {
            response =
                "Today's market is showing mixed signals. Technology and semiconductor stocks are leading gains, with NVIDIA up 1.71% and Microsoft up 1.36%. Banking stocks are under pressure due to rate cut speculation. Energy sector is outperforming on oil price surges. The overall sentiment is cautiously optimistic with the Fed signaling potential rate cuts.";
        } else if (userMsg.toLowerCase().includes('rsi')) {
            response =
                "RSI (Relative Strength Index) is a momentum oscillator that measures the speed and change of price movements. RSI values range from 0 to 100. Traditionally, RSI above 70 indicates overbought conditions, while RSI below 30 indicates oversold conditions. This helps traders identify potential trend reversals and entry/exit points.";
        } else if (userMsg.toLowerCase().includes('sector')) {
            response =
                "Looking at today's sector performance: Technology (+1.8%) and Semiconductors (+2.3%) are leading. Energy (+1.5%) is also strong on oil price moves. Banking (-0.8%) and Real Estate (-0.5%) are under pressure. Consumer discretionary is flat. The AI boom continues to drive tech sector gains.";
        } else {
            response =
                "That's a great question! Let me break it down for you. The markets are currently driven by several key factors: Fed rate policy, AI innovation, and earnings season. If you're looking for specific analysis, try asking about a particular stock like 'Tesla' or 'Apple', or ask about market trends, sectors, or technical indicators.";
        }
        setTimeout(() => {
            setChatMessages((prev) => [...prev, { role: 'assistant', content: response }]);
        }, 600);
    };

    // --- Risk Badge ---
    const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
        const config = {
            Low: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Low Risk' },
            Medium: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Medium Risk' },
            High: { icon: Shield, color: 'text-red-400', bg: 'bg-red-500/20', label: 'High Risk' },
        };
        const { icon: Icon, color, bg, label } = config[level];
        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${bg} ${color}`}>
                <Icon className="w-4 h-4" />
                {label}
            </span>
        );
    };

    // ============================================================
    // SECTIONS
    // ============================================================

    // --- Sidebar ---
    const Sidebar = () => (
        <div className="w-64 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">TradeX</span>
                    <span className="text-xs text-emerald-400 font-medium ml-auto bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        AI
                    </span>
                </div>
                <p className="text-xs text-white/40 mt-1">AI Market Research</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: Layout },
                    { id: 'analysis', label: 'Stock Analysis', icon: BarChart },
                    { id: 'news', label: 'News & Trends', icon: Newspaper },
                    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
                    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center">
                        <span className="text-sm font-semibold text-emerald-400">JD</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">John Doe</p>
                        <p className="text-xs text-white/40 truncate">john@example.com</p>
                    </div>
                    <button className="text-white/40 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Dashboard Tab ---
    const DashboardTab = () => (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-white/40 text-sm">What's happening in the market today?</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
                        Refresh
                    </Button>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Market Open</span>
                    </div>
                </div>
            </div>

            {/* AI Daily Insight */}
            <Card className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border-emerald-500/20">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-emerald-400">AI Daily Insight</span>
                            <Badge variant="success">Updated Today</Badge>
                        </div>
                        <p className="text-white/90 mt-1 text-sm leading-relaxed">
                            Technology and semiconductor stocks are leading today's market rally, driven by strong AI demand
                            and positive earnings. NVIDIA and Microsoft are hitting new highs, while banking stocks face
                            pressure from rate cut speculation. Energy sector is outperforming on oil price surges. Overall
                            market sentiment is cautiously optimistic.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">S&P 500</span>
                        <Badge variant="success">+0.87%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">5,432.67</p>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+46.82</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">Nasdaq</span>
                        <Badge variant="success">+1.24%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">17,234.89</p>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+211.45</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">Dow Jones</span>
                        <Badge variant="default">+0.34%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">38,982.13</p>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+132.45</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">VIX</span>
                        <Badge variant="default">-2.1%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">13.42</p>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>-0.29</span>
                    </div>
                </Card>
            </div>

            {/* Trending & Top Movers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white/70 font-medium text-sm">🔥 Trending Stocks</span>
                        <span className="text-white/30 text-xs">Real-time</span>
                    </div>
                    <div className="space-y-3">
                        {MOCK_TRENDING.map((item) => (
                            <div
                                key={item.symbol}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                                onClick={() => {
                                    const stock = MOCK_STOCKS.find((s) => s.symbol === item.symbol);
                                    if (stock) handleStockSelect(stock);
                                }}
                            >
                                <div>
                                    <span className="text-white font-medium text-sm">{item.symbol}</span>
                                    <span className="text-white/40 text-xs ml-2">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/60 text-sm">+{item.change.toFixed(2)}</span>
                                    <Badge variant="success">+{((item.change / 100) * 100).toFixed(2)}%</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white/70 font-medium text-sm">📊 Top Movers</span>
                        <span className="text-white/30 text-xs">Today</span>
                    </div>
                    <div className="space-y-3">
                        {MOCK_STOCKS.slice(0, 4).map((stock) => (
                            <div
                                key={stock.symbol}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                                onClick={() => handleStockSelect(stock)}
                            >
                                <div>
                                    <span className="text-white font-medium text-sm">{stock.symbol}</span>
                                    <span className="text-white/40 text-xs ml-2">{stock.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/60 text-sm">${stock.price.toFixed(2)}</span>
                                    <Badge variant={stock.change >= 0 ? 'success' : 'danger'}>
                                        {stock.change >= 0 ? '+' : ''}
                                        {stock.changePercent.toFixed(2)}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- Analysis Tab ---
    const AnalysisTab = () => (
        <div className="space-y-6 p-6">
            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search any stock (e.g., AAPL, Tesla)..."
                        icon={<Search className="w-4 h-4" />}
                        onKeyDown={handleSearch}
                    />
                </div>
                {selectedStock && (
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<Star className="w-3.5 h-3.5" />}
                        onClick={() => handleAddToWatchlist(selectedStock)}
                    >
                        Add to Watchlist
                    </Button>
                )}
            </div>

            {selectedStock ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Stock Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold text-white">{selectedStock.symbol}</span>
                                <RiskBadge level={selectedStock.risk} />
                            </div>
                            <p className="text-white/60 text-sm">{selectedStock.name}</p>
                            <div className="mt-4 flex items-end gap-3">
                                <span className="text-3xl font-bold text-white">${selectedStock.price.toFixed(2)}</span>
                                <span
                                    className={`text-sm font-medium ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                                >
                                    {selectedStock.change >= 0 ? '+' : ''}
                                    {selectedStock.changePercent.toFixed(2)}%
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-white/30 text-xs">Market Cap</p>
                                    <p className="text-white font-medium">{selectedStock.marketCap}</p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-xs">Sector</p>
                                    <p className="text-white font-medium">{selectedStock.sector}</p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-xs">Trend</p>
                                    <p className={`font-medium ${selectedStock.trend === 'Bullish' ? 'text-emerald-400' : selectedStock.trend === 'Bearish' ? 'text-red-400' : 'text-amber-400'}`}>
                                        {selectedStock.trend}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-xs">Strength</p>
                                    <p className="text-white font-medium">{selectedStock.strength}</p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-white/70 font-medium text-sm mb-3">AI Risk Assessment</h3>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <RiskBadge level={selectedStock.risk} />
                                <p className="text-white/60 text-xs flex-1">
                                    {selectedStock.risk === 'Low' &&
                                        'Low volatility with strong fundamentals. Good entry point for long-term investors.'}
                                    {selectedStock.risk === 'Medium' &&
                                        'Moderate risk with some uncertainty. Consider position sizing and stop-losses.'}
                                    {selectedStock.risk === 'High' &&
                                        'High volatility with significant downside risk. Only for risk-tolerant investors.'}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Right: AI Analysis */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-emerald-400">AI Stock Analysis</span>
                                    <p className="text-white/90 mt-1 text-sm leading-relaxed">
                                        {selectedStock.aiInsight}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-white/70 font-medium text-sm mb-3">Key Observations</h3>
                            <p className="text-white/80 text-sm leading-relaxed">{selectedStock.observations}</p>
                        </Card>

                        <Card>
                            <h3 className="text-white/70 font-medium text-sm mb-3">Important Factors</h3>
                            <p className="text-white/80 text-sm leading-relaxed">{selectedStock.factors}</p>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Current Trend</span>
                                </div>
                                <p className={`text-lg font-semibold mt-1 ${selectedStock.trend === 'Bullish' ? 'text-emerald-400' : selectedStock.trend === 'Bearish' ? 'text-red-400' : 'text-amber-400'}`}>
                                    {selectedStock.trend}
                                </p>
                            </Card>
                            <Card>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Activity className="w-4 h-4" />
                                    <span>Stock Strength</span>
                                </div>
                                <p className="text-lg font-semibold mt-1 text-white">{selectedStock.strength}</p>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Search for a stock to see AI-powered analysis</p>
                    </div>
                </div>
            )}
        </div>
    );

    // --- News Tab ---
    const NewsTab = () => (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Financial News</h2>
                    <p className="text-white/40 text-sm">AI-summarized news affecting the markets</p>
                </div>
                <Badge variant="info">Live Feed</Badge>
            </div>

            <div className="space-y-4">
                {MOCK_NEWS.map((item) => (
                    <Card key={item.id} hover>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                <Newspaper className="w-5 h-5 text-white/40" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-white font-medium text-sm">{item.headline}</h3>
                                    <span className="text-white/30 text-xs whitespace-nowrap">{item.time}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-white/40 text-xs">{item.source}</span>
                                    <Badge variant="outline" className="text-[10px]">
                                        {item.affected}
                                    </Badge>
                                </div>
                                <div className="mt-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-white/70 text-xs leading-relaxed">
                                            <span className="text-emerald-400 font-medium">AI Summary:</span> {item.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Market Trends */}
            <Card className="bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-emerald-400">Market Trends</span>
                        <p className="text-white/80 mt-1 text-sm leading-relaxed">
                            Technology and semiconductor sectors are gaining momentum, driven by AI demand. Banking stocks
                            are under pressure as rate cut expectations weigh on margins. Energy sector is outperforming
                            on oil price strength. Consumer discretionary shows resilience with strong spending data.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    // --- Chat Tab ---
    const ChatTab = () => (
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white">AI Market Chat</h2>
                    <p className="text-white/40 text-sm">Ask me anything about the markets</p>
                </div>
                <Badge variant="success" className="gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px] pr-2">
                {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                ? 'bg-emerald-500/30 text-white border border-emerald-500/20'
                                : 'bg-white/5 text-white/90 border border-white/10'
                                }`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs font-medium text-emerald-400">TradeX AI</span>
                                </div>
                            )}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question... e.g., 'Analyze Tesla'"
                    className="flex-1"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendChat();
                    }}
                />
                <Button onClick={handleSendChat} icon={<SendIcon className="w-4 h-4" />}>
                    Send
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {['Analyze Tesla', 'Explain today\'s market', 'Why is Apple falling?', 'Compare TCS and Infosys', 'Explain RSI', 'What sectors look strong today?'].map(
                    (prompt) => (
                        <button
                            key={prompt}
                            className="text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 transition-all"
                            onClick={() => {
                                setChatInput(prompt);
                                setTimeout(() => handleSendChat(), 100);
                            }}
                        >
                            {prompt}
                        </button>
                    )
                )}
            </div>
        </div>
    );

    // --- Watchlist Tab ---
    const WatchlistTab = () => (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Watchlist</h2>
                    <p className="text-white/40 text-sm">Stocks you're monitoring</p>
                </div>
                <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                    Add Stock
                </Button>
            </div>

            {watchlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {watchlist.map((item) => {
                        const stock = MOCK_STOCKS.find((s) => s.symbol === item.symbol);
                        return (
                            <Card key={item.symbol} hover>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-white font-bold text-lg">{item.symbol}</span>
                                        <p className="text-white/40 text-xs">{item.name}</p>
                                    </div>
                                    <button
                                        className="text-white/20 hover:text-red-400 transition-colors"
                                        onClick={() => handleRemoveFromWatchlist(item.symbol)}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-end justify-between">
                                    <span className="text-2xl font-bold text-white">${item.price.toFixed(2)}</span>
                                    <span className={`text-sm font-medium ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {item.change >= 0 ? '+' : ''}
                                        {item.change.toFixed(2)}%
                                    </span>
                                </div>
                                {stock && (
                                    <button
                                        className="mt-3 w-full text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 py-1.5 rounded-lg transition-all"
                                        onClick={() => {
                                            setSelectedStock(stock);
                                            setActiveTab('analysis');
                                        }}
                                    >
                                        View Analysis →
                                    </button>
                                )}
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                        <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Your watchlist is empty</p>
                        <p className="text-white/20 text-sm">Search for stocks and add them to your watchlist</p>
                    </div>
                </div>
            )}
        </div>
    );

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="min-h-screen w-full bg-[#0a0a0f] text-white font-sans flex items-center justify-center p-4">
            {/* Main container with glass effect */}
            <div className="w-full max-w-[1400px] h-[900px] bg-[#0f0f1a] rounded-3xl border border-white/10 shadow-2xl shadow-emerald-500/5 overflow-hidden flex relative">

                {/* Sidebar - hidden on mobile */}
                <div className="hidden lg:block h-full">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            {/* Mobile menu button */}
                            <button
                                className="lg:hidden text-white/60 hover:text-white transition-colors"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="lg:hidden flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-bold text-white">TradeX</span>
                            </div>
                            <span className="text-white/40 text-sm hidden lg:block">
                                {activeTab === 'dashboard' && 'Welcome back, John'}
                                {activeTab === 'analysis' && 'Stock Analysis'}
                                {activeTab === 'news' && 'News & Trends'}
                                {activeTab === 'chat' && 'AI Chat Assistant'}
                                {activeTab === 'watchlist' && 'Your Watchlist'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="text-white/40 hover:text-white transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
                            </button>
                            <div className="hidden lg:flex items-center gap-2 text-sm text-white/40">
                                <span>|</span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    Live
                                </span>
                            </div>
                            <div className="lg:hidden flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-emerald-400">JD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Sidebar */}
                    {showMobileMenu && (
                        <div className="lg:hidden absolute top-0 left-0 w-64 h-full bg-[#0f0f1a] border-r border-white/10 z-50 p-4 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white">TradeX</span>
                                </div>
                                <button
                                    className="text-white/40 hover:text-white"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                {[
                                    { id: 'dashboard', label: 'Dashboard', icon: Layout },
                                    { id: 'analysis', label: 'Stock Analysis', icon: BarChart },
                                    { id: 'news', label: 'News & Trends', icon: Newspaper },
                                    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
                                    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveTab(item.id as any);
                                                setShowMobileMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
                                    <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-emerald-400">JD</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">John Doe</p>
                                        <p className="text-xs text-white/40 truncate">john@example.com</p>
                                    </div>
                                    <button className="text-white/40 hover:text-white transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {activeTab === 'dashboard' && <DashboardTab />}
                        {activeTab === 'analysis' && <AnalysisTab />}
                        {activeTab === 'news' && <NewsTab />}
                        {activeTab === 'chat' && <ChatTab />}
                        {activeTab === 'watchlist' && <WatchlistTab />}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.5);
                }
            `}</style>
        </div>
    );
};

// --- Send Icon (custom) ---
const SendIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

export default TradeXMockup;