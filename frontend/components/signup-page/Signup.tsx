import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';

const Signup = () => {
  const [username, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isShowPassword, setShowPassword] = useState(false);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!isShowPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!isShowConfirmPassword);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post('/api/signup', {
        email,
        password,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content">
          <h1 className="col-12 text-login">Sign Up Form</h1>
          <form onSubmit={onSubmit}>
            <div className="col-12 form-group login-input">
              <label>Username:</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username..."
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Email:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Password:</label>
              <div className="eye-show-password">
                <input
                  className="form-control"
                  type={isShowPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <span onClick={handleShowPassword}>
                  <i className={isShowPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input">
              <label>Confirm Password:</label>
              <div className="eye-show-password">
                <input
                  className="form-control"
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter your confirm password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                />
                <span onClick={handleShowConfirmPassword}>
                  <i className={isShowConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              </div>
            </div>
            {/* <div className="col-12" style={{ color: 'red' }}>
              {this.state.errMessage}
            </div> */}
            <div>
              Already have an Account?{' '}
              <span className="text-blue-900">
                <Link href="/login">Login</Link>
              </span>
            </div>
            <div className="col-12">
              <button className="btn-login" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
