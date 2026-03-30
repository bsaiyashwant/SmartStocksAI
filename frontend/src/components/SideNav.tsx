import { LayoutDashboard, PieChart, TrendingUp, Wallet, UserCircle } from 'lucide-react';

interface SideNavProps {
    activeTab: string;
    setActiveTab: (tab: 'dashboard' | 'portfolio' | 'fno' | 'funds' | 'profile') => void;
}

export function SideNav({ activeTab, setActiveTab }: SideNavProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'portfolio', label: 'Portfolio', icon: PieChart },
        { id: 'fno', label: 'F&O', icon: TrendingUp },
        { id: 'funds', label: 'Funds', icon: Wallet },
        { id: 'profile', label: 'Profile', icon: UserCircle },
    ];

    return (
        <aside className="side-nav">
            <ul className="nav-list">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <li key={item.id}>
                            <button
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id as any)}
                            >
                                <Icon size={20} className="nav-icon" />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
