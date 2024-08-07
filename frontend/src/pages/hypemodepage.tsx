import { useState, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Layout } from "../components";
import { useNavigate } from 'react-router-dom';
import { decodeToken } from "../utilities/helperfFunction";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to right, #ffffa1 0%, #ffc800 100%);
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    justify-content: flex-start;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const SubscriptionBox = styled.div`
  padding: 15px;
  border: 2px dashed #000;
  text-align: center;
  width: 90%;
  margin: 10px 0;
  background-color: #fff;

  @media (min-width: 768px) {
    width: 270px;
    margin: 10px;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #000;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  margin-bottom: 15px;
  color: #000;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Button = styled.button`
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const ToggleButton = styled.button`
  color: #000;
  border: 2px solid #000;
  padding: 8px 15px;
  margin-bottom: 30px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    margin-top: 80px;
    font-size: 14px;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px;
  background: #fff;
  border: 2px solid #000;
  z-index: 1000;
  max-width: 90%;
  box-sizing: border-box;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const HypeModeProfile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadGoogleIdentityScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: '854144808645-t4jd10ehpngjnfvki8mcuq7q0uvr2kjo.apps.googleusercontent.com',
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton') as HTMLDivElement,
            { theme: 'outline', size: 'large' }
          );
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleIdentityScript();
  }, []);

  const handleGoogleResponse = async (response: any) => {
    const user = decodeToken(response.credential);
    const email = user.email;
    const username = user.name;
    const avatar = user.picture;

    try {
      const callback = () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });

      if (isSignup) {
        await registerUser(username, email, avatar, callback);
      } else {
        await loginUser(email, callback);
      }
    } catch (error) {
      console.error('Failed to get token:', error);
      setPopupMessage('Failed to get token. Please try again.');
      setShowPopup(true);
    }
  };

  const registerUser = async (username: string, email: string, avatar: string, callback?: any) => {
    try {
      const res = await axios.post('https://wecinema-main-vcam.onrender.com/user/signup', {
        username,
        email,
        avatar,
        dob: "20192020"
      });

      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        setPopupMessage('Registration successful and logged in!');
        setIsLoggedIn(true);
        setUserId(userId);
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error === 'Email already exists.') {
        setPopupMessage('Email already exists.');
      } else {
        setPopupMessage('Registration failed. Please try again.');
      }
      setShowPopup(true);
    }
  };

  const loginUser = async (email: string, callback?: any) => {
    try {
      const res = await axios.post('https://wecinema-main-vcam.onrender.com/user/signin', { email });

      const backendToken = res.data.token;
      const userId = res.data.id;

      if (backendToken) {
        localStorage.setItem('token', backendToken);
        setIsLoggedIn(true);
        setUserId(userId);
        setPopupMessage('Login successful!');
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response) {
        setPopupMessage(error.response.data.message || 'Login failed.');
      } else {
        setPopupMessage('Login failed.');
      }
      setShowPopup(true);
    }
  };

  const handleEmailSignup = async () => {
    try {
      const res = await axios.post('https://wecinema-main-vcam.onrender.com/user/signup', { email, password });
      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserId(userId);
        setPopupMessage('Registration successful!');
        setShowPopup(true);
        navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });
      }
    } catch (error: any) {
      console.error('Email signup failed:', error);
      if (error.response) {
        setPopupMessage(error.response.data.message || 'Email signup failed.');
      } else {
        setPopupMessage('Email signup failed.');
      }
      setShowPopup(true);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const res = await axios.post('https://wecinema-main-vcam.onrender.com/user/signin', { email, password });
      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserId(userId);
        setPopupMessage('Login successful!');
        setShowPopup(true);
        navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });
      }
    } catch (error: any) {
      console.error('Email login failed:', error);
      if (error.response) {
        setPopupMessage(error.response.data.message || 'Email login failed.');
      } else {
        setPopupMessage('Email login failed.');
      }
      setShowPopup(true);
    }
  };

  const handleGoogleLogout = async () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.revoke('YOUR_GOOGLE_CLIENT_ID', () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setPopupMessage('Logout successful.');
        setShowPopup(true);
      });
    } else {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setPopupMessage('Logout successful.');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubscriptionClick = (subscriptionType: string) => {
    setSelectedSubscription(subscriptionType);
    if (isLoggedIn) {
      const amount = subscriptionType === 'user' ? 5 : subscriptionType === 'studio' ? 10 : 0;
      navigate('/payment', { state: { subscriptionType, amount, userId } });
    }
  };

  const toggleSignupSignin = () => {
    setIsSignup(!isSignup);
    // Clear email and password when toggling
    setEmail('');
    setPassword('');
  };

  return (
    <Layout expand={false} hasHeader={false}>
      <MainContainer>
        <ToggleButton onClick={toggleSignupSignin}>
          {isSignup ? "Already have an account? Switch to Sign in" : "Don't have an account? Switch to Sign up"}
        </ToggleButton>

        <RightContainer>
          {isLoggedIn ? (
            <SubscriptionContainer>
              <SubscriptionBox>
                <Title>Logout</Title>
                <Button onClick={handleGoogleLogout}>Logout</Button>
              </SubscriptionBox>
            </SubscriptionContainer>
          ) : (
            <SubscriptionContainer>
              <SubscriptionBox onClick={() => handleSubscriptionClick('user')}>
                <Title>User Subscription</Title>
                <Description>$5 a month to buy and sell films and scripts</Description>
              </SubscriptionBox>
              <SubscriptionBox onClick={() => handleSubscriptionClick('studio')}>
                <Title>Studio Subscription</Title>
                <Description>$10 a month to buy and sell, get early access to new features</Description>
              </SubscriptionBox>
              <SubscriptionBox>
                <h3>{isSignup ? 'Register' : 'Login'} with Google</h3>
                <div id="googleSignInButton"></div>
              </SubscriptionBox>
              <SubscriptionBox>
                <h3>{isSignup ? 'Register' : 'Login'} with Email</h3>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={isSignup ? handleEmailSignup : handleEmailLogin}>
                  {isSignup ? 'Register' : 'Login'}
                </Button>
              </SubscriptionBox>
            </SubscriptionContainer>
          )}
        </RightContainer>
      </MainContainer>
      {showPopup && (
        <>
          <Overlay onClick={closePopup} />
          <Popup>
            <p>{popupMessage}</p>
            <Button onClick={closePopup}>Close</Button>
          </Popup>
        </>
      )}
    </Layout>
  );
};

export default HypeModeProfile;
