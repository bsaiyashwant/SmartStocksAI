import { UserCircle, Settings, Shield, CreditCard, LogOut } from 'lucide-react';

interface ProfileProps {
    user: any;
    onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
    return (
        <div className="tab-view profile-view">
            <div className="view-header">
                <h2 className="view-title">My Profile</h2>
                <p className="text-muted">Manage your personal information and preferences.</p>
            </div>

            <div className="profile-layout">
                <div className="profile-sidebar">
                    <div className="profile-header-card">
                        <div className="avatar-large">{user?.name?.charAt(0) || 'U'}</div>
                        <h3>{user?.name || 'Guest User'}</h3>
                        <p className="text-muted">{user?.username}</p>
                        <div className="kyc-badge mt-2">KYC Verified</div>
                    </div>

                    <div className="profile-nav">
                        <button className="profile-nav-item active" onClick={() => alert('Navigating to Personal Details (Mock)')}><UserCircle size={18} /> Personal Details</button>
                        <button className="profile-nav-item" onClick={() => alert('Navigating to Bank Details (Mock)')}><CreditCard size={18} /> Bank Details</button>
                        <button className="profile-nav-item" onClick={() => alert('Navigating to Security & Privacy (Mock)')}><Shield size={18} /> Security & Privacy</button>
                        <button className="profile-nav-item" onClick={() => alert('Opening App Settings (Mock)')}><Settings size={18} /> App Settings</button>
                        <button className="profile-nav-item text-danger" onClick={onLogout}><LogOut size={18} /> Logout</button>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="glass-panel w-full">
                        <h3 className="mb-6">Personal Details</h3>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="text-muted">Full Name</span>
                                <p className="strong">{user?.name || 'N/A'}</p>
                            </div>

                            <div className="detail-item">
                                <span className="text-muted">Username</span>
                                <p className="strong">{user?.username || 'N/A'}</p>
                            </div>

                            <div className="detail-item">
                                <span className="text-muted">Email ID</span>
                                <p className="strong">{user?.email || 'N/A'}</p>
                            </div>

                            <div className="detail-item">
                                <span className="text-muted">Phone Number</span>
                                <p className="strong">+91 {user?.phone || 'N/A'}</p>
                            </div>

                            <div className="detail-item">
                                <span className="text-muted">Age</span>
                                <p className="strong">{user?.age || 'N/A'} Years</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <button className="secondary-btn" onClick={() => alert('Edit Details Modal Opened (Mock)')}>Edit Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
