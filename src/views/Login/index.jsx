import React from 'react';
import AuthLogin from './AuthLogin';
import logo from 'assets/images/justservice-logo.png';
import './Login.css';

const Login = () => (
  <div className="adm-auth-page">
    <div className="adm-auth-card">

      {/* Left */}
      <div className="adm-auth-left">
        <div className="adm-logo-wrap">
          <img src={logo} alt="JustService24" className="adm-logo-img" />
          <div>
            <div className="adm-brand-name">Just<span>Service24</span></div>
            <div className="adm-brand-tagline">Admin Dashboard</div>
          </div>
        </div>
        <div className="adm-left-body">
          <h2 className="adm-welcome-title">Welcome to Admin Panel!</h2>
          <p className="adm-welcome-desc">
            Manage your platform, users, businesses and more from one place.
          </p>
          <div className="adm-illustration">
            <div className="adm-illus-building">
              <div className="adm-illus-roof" />
              <div className="adm-illus-body">
                <div className="adm-illus-door" />
                <div className="adm-illus-window" />
                <div className="adm-illus-window" />
              </div>
            </div>
            <div className="adm-illus-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="adm-auth-right">
        <div className="adm-auth-right-inner">
          <div className="adm-auth-header">
            <h3>Welcome Back</h3>
            <p>Login to your admin account</p>
          </div>
          <AuthLogin />
          <hr className="adm-divider" />
          <p className="adm-terms">
            By continuing, you agree to the <a href="#">Terms & Conditions</a> and{' '}
            <a href="#">Privacy Policy</a> of JustService24.
          </p>
        </div>
      </div>

    </div>
  </div>
);

export default Login;
