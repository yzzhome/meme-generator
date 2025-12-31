'use client';

import { useState } from 'react';
import { db } from '@/lib/db';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await db.auth.sendMagicCode({ email });
      setSentEmail(email);
    } catch (err: any) {
      setError(err.body?.message || '发送验证码失败，请重试');
      console.error('Error sending magic code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
      // 登录成功后，组件会自动通过 db.SignedIn 重新渲染
    } catch (err: any) {
      setError(err.body?.message || '验证码错误，请重试');
      console.error('Error verifying code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSentEmail('');
    setCode('');
    setError(null);
  };

  if (!sentEmail) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>登录</h2>
          <p className="login-subtitle">使用邮箱验证码登录</p>
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <label htmlFor="email">邮箱地址</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className="form-input"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary btn-full"
            >
              {isLoading ? '发送中...' : '发送验证码'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>输入验证码</h2>
        <p className="login-subtitle">
          我们已向 <strong>{sentEmail}</strong> 发送了验证码
        </p>
        <form onSubmit={handleVerifyCode}>
          <div className="form-group">
            <label htmlFor="code">验证码</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              required
              maxLength={6}
              disabled={isLoading}
              className="form-input code-input"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="btn-secondary"
            >
              返回
            </button>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="btn-primary"
            >
              {isLoading ? '验证中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
