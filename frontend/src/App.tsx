import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { TopNav } from './components/TopNav'
import { SideNav } from './components/SideNav'
import { Portfolio } from './components/Portfolio'
import { FuturesOptions } from './components/FuturesOptions'
import { Funds } from './components/Funds'
import { Profile } from './components/Profile'

export type TabType = 'dashboard' | 'portfolio' | 'fno' | 'funds' | 'profile';

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';
  symbol?: string;
  qty?: number;
  amount: number;
  date: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'app'>('login');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Lifted Global State
  const [walletBalance, setWalletBalance] = useState<number>(150000.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentView('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleTrade = (type: 'BUY' | 'SELL', symbol: string, qty: number, price: number) => {
    const totalAmount = qty * price;

    if (type === 'BUY' && walletBalance < totalAmount) {
      alert("Insufficient funds for this transaction!");
      return false;
    }

    const newTx: Transaction = {
      id: Math.random().toString(36).substring(7),
      type,
      symbol,
      qty,
      amount: totalAmount,
      date: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    if (type === 'BUY') {
      setWalletBalance(prev => prev - totalAmount);
    } else {
      setWalletBalance(prev => prev + totalAmount);
    }

    return true;
  };

  if (!currentUser && currentView === 'app') {
    setCurrentView('login');
  }

  return (
    <>
      {currentView === 'login' && (
        <Login
          onLogin={handleLogin}
          onGoToRegister={() => setCurrentView('register')}
        />
      )}

      {currentView === 'register' && (
        <Register
          onGoToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'app' && currentUser && (
        <div className="trading-platform">
          <TopNav user={currentUser} onLogout={handleLogout} activeTab={activeTab} walletBalance={walletBalance} />

          <div className="platform-body">
            <SideNav activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="main-content">
              {activeTab === 'dashboard' && <Dashboard onTrade={handleTrade} />}
              {activeTab === 'portfolio' && <Portfolio />}
              {activeTab === 'fno' && <FuturesOptions />}
              {activeTab === 'funds' && <Funds balance={walletBalance} transactions={transactions} />}
              {activeTab === 'profile' && <Profile user={currentUser} onLogout={handleLogout} />}
            </main>
          </div>
        </div>
      )}
    </>
  )
}

export default App
