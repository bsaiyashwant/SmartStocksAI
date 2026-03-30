import { Search, Bell, User, ChevronDown, Wallet } from 'lucide-react';

interface TopNavProps {
    user: any;
    onLogout: () => void;
    activeTab: string;
    walletBalance: number;
}

export function TopNav({ user, onLogout, activeTab, walletBalance }: TopNavProps) {
    return (
        <nav className="top-nav">
            <div className="nav-left">
                <div className="brand-logo">
                    <div className="logo-mark">S</div>
                    <span>SmartStocks AI</span>
                </div>

                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search stocks, options, mutual funds..." />
                </div>
            </div>

            <div className="nav-right">
                <div className="market-status">
                    <span className="live-dot"></span> Market Open
                </div>

                <div className="wallet-summary">
                    <Wallet size={18} className="text-muted" />
                    <span>₹{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <button className="icon-btn" onClick={() => alert('Opening Notifications (Mock)')}>
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>

                <div className="profile-dropdown">
                    <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                    <span>{user?.name?.split(' ')[0] || 'User'}</span>
                    <ChevronDown size={16} className="text-muted" />

                    <div className="dropdown-menu">
                        <div className="dropdown-header">
                            <p className="user-name">{user?.name}</p>
                            <p className="user-email text-muted">{user?.email}</p>
                        </div>
                        <button className="dropdown-item" onClick={() => alert('Redirecting to Account Settings (Mock)')}>Account Settings</button>
                        <button className="dropdown-item text-danger" onClick={onLogout}>logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
