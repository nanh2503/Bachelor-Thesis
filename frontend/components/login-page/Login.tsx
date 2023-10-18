import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!isShowPassword);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post('/api/login', {
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
          <h1 className="col-12 text-login">Login Form</h1>
          <form onSubmit={onSubmit}>
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
            {/* <div className="col-12" style={{ color: 'red' }}>
            {this.state.errMessage}
          </div> */}
            <div>
              <div>
                Do not have an Account?{' '}
                <span>
                  <Link href="/signup">Sign Up</Link>
                </span>
              </div>
            </div>
            <div className="col-12">
              <button className="btn-login" type="submit">
                Log in
              </button>
            </div>
            <div className="col-12">
              <span className="forgot-password">
                <Link href="/reset-password">Forgot your password?</Link>
              </span>
            </div>
          </form>
          <div className="col-12 orsignin">
            <span className=""> Or sign in with:</span>
          </div>
          <div className="col-12 social-login">
            <i className="fab fa-facebook-f facebook"></i>
            <i className="fab fa-twitter twitter"></i>
            <i className="fab fa-google-plus-g google"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
