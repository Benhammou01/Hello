import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginCard,
  Title,
  ToggleContainer,
  ToggleButton,
  Form,
  Input,
  LoginButton,
  ErrorMessage,
  RegisterButton,
  RegisterLink
} from '../styles/LoginStyles';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'client' | 'admin'>('client');
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
  });
  const [error, setError] = useState<string>('');

  const ADMIN_CREDENTIALS = {
    email: 'admin@carrental.com',
    password: 'admin123'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userType === 'admin') {
      if (formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userType', 'admin');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Use admin@carrental.com / admin123');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === formData.email);

      if (!user) {
        setError('User not found');
        return;
      }

      if (user.status === 'suspended') {
        setError('Your account has been suspended. Please contact support.');
        return;
      }

      if (user.status === 'pending') {
        setError('Your account is pending approval.');
        return;
      }

      if (user.role === 'blacklisted') {
        setError('Access denied. Your account has been blacklisted.');
        return;
      }

      if (user.password !== formData.password) {
        setError('Invalid password');
        return;
      }

      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userType', 'client');
      sessionStorage.setItem('userId', user.id);
      navigate('/client/dashboard');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some((u: any) => u.email === registerData.email)) {
      setError('Email already registered');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: registerData.name,
      email: registerData.email,
      password: registerData.password, // In real app, should be hashed
      phone: registerData.phone,
      status: 'pending',
      role: 'client',
      licenseNumber: registerData.licenseNumber,
      licenseExpiry: registerData.licenseExpiry,
      verificationStatus: 'pending',
      joinDate: new Date().toISOString(),
      rentalHistory: []
    };

    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    alert('Registration successful! Please wait for admin approval to login.');
    setShowRegister(false);
    setRegisterData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: '',
    });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome to CarRental</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ToggleContainer>
          <ToggleButton
            active={userType === 'client'}
            onClick={() => setUserType('client')}
          >
            Client
          </ToggleButton>
          <ToggleButton
            active={userType === 'admin'}
            onClick={() => setUserType('admin')}
          >
            Admin
          </ToggleButton>
        </ToggleContainer>

        {!showRegister ? (
          <>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <LoginButton type="submit">
                Login as {userType === 'admin' ? 'Admin' : 'Client'}
              </LoginButton>
            </Form>
            {userType === 'client' && (
              <RegisterLink>
                Don't have an account?{' '}
                <RegisterButton onClick={() => setShowRegister(true)}>
                  Register here
                </RegisterButton>
              </RegisterLink>
            )}
          </>
        ) : (
          <Form onSubmit={handleRegisterSubmit}>
            <Input
              type="text"
              placeholder="Full Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({ ...registerData, confirmPassword: e.target.value })
              }
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={registerData.phone}
              onChange={(e) =>
                setRegisterData({ ...registerData, phone: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Driver's License Number"
              value={registerData.licenseNumber}
              onChange={(e) =>
                setRegisterData({ ...registerData, licenseNumber: e.target.value })
              }
              required
            />
            <Input
              type="date"
              placeholder="License Expiry Date"
              value={registerData.licenseExpiry}
              onChange={(e) =>
                setRegisterData({ ...registerData, licenseExpiry: e.target.value })
              }
              required
            />
            <LoginButton type="submit">Register</LoginButton>
            <RegisterLink>
              Already have an account?{' '}
              <RegisterButton onClick={() => setShowRegister(false)}>
                Login here
              </RegisterButton>
            </RegisterLink>
          </Form>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 