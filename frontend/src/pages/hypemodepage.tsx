import { useState } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Layout } from "../components";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { googleProvider } from "./firebase";

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

  const registerUser = async (username:string, email:string, avatar:string, callback:any) => {
    try {
      const res = await axios.post('https://wecinema-main.vercel.app/user/signup', {
        username,
        email,
        avatar,
        dob: "--------"
      });

      const token = res.data.token;
      const userId = res.data.id;

      console.log('Registration Response:', res); // Debugging line
      setPopupMessage('Registration successful Go back to logged in!');
      setShowPopup(true);

      if (token) {
        setIsLoggedIn(true);
        setUserId(userId);

        setTimeout(() => {
          setShowPopup(false);
          if (callback) callback();
        }, 2000); // Show popup for 2 seconds before executing the callback
      }
    } catch (error:any) {
      console.error('Registration Error:', error); // Debugging line
      if (error.response && error.response.data && error.response.data.error === 'Email already exists.') {
        setPopupMessage('Email already exists.');
      } else {
        setPopupMessage('Registration failed. Please try again.');
      }
      setShowPopup(true);
    }
  };

  const loginUser = async (email:any, callback:any) => {
    try {
      const res = await axios.post('https://wecinema-main.vercel.app/user/signin', { email });

      const backendToken = res.data.token;
      const userId = res.data.id;

      console.log('Login Response:', res); // Debugging line

      if (backendToken) {
        localStorage.setItem('token', backendToken);
        setIsLoggedIn(true);
        setUserId(userId);
        setPopupMessage('Login successful!');
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error:any) {
      console.error('Login Error:', error); // Debugging line
      if (error.response) {
        setPopupMessage(error.response.data.message || 'Login failed.');
      } else {
        setPopupMessage('Login failed.');
      }
      setShowPopup(true);
    }
  };

  const onLoginSuccess = async (user:any) => {
    const profile = user.providerData[0];
    const email = profile.email;
    const username = profile.displayName;
    const avatar = profile.photoURL;

    try {
      const callback = () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });

      if (isSignup) {
        await registerUser(username, email, avatar, callback);
      } else {
        await loginUser(email, callback);
      }
    } catch (error) {
      console.error('Failed to get Firebase token:', error);
      setPopupMessage('Failed to get Firebase token. Please try again.');
      setShowPopup(true);
    }
  };

  const onLoginFailure = (error:any) => {
    console.error('Google login failed:', error);
    setPopupMessage('Google login failed. Please try again.');
    setShowPopup(true);
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await onLoginSuccess(user);
    } catch (error) {
      onLoginFailure(error);
    }
  };

  const handleGoogleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setPopupMessage('Logout successful.');
      setShowPopup(true);
    } catch (error) {
      console.error('Logout failed:', error);
      setPopupMessage('Logout failed. Please try again.');
      setShowPopup(true);
    }
  };

  const handleEmailSignup = async () => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await onLoginSuccess(user);
    } catch (error:any) {
      console.error('Email signup failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        setPopupMessage('Email already in use. Please try logging in.');
      } else {
        setPopupMessage('Email signup failed. Please try again.');
      }
      setShowPopup(true);
    }
  };
  
  const handleEmailLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await onLoginSuccess(user);
    } catch (error:any) {
      console.error('Email login failed:', error);
      if (error.code === 'auth/user-not-found') {
        setPopupMessage('No user found with this email. Please sign up.');
      } else if (error.code === 'auth/wrong-password') {
        setPopupMessage('Incorrect password. Please try again.');
      } else {
        setPopupMessage('Email login failed. Please try again.');
      }
      setShowPopup(true);
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubscriptionClick = (subscriptionType:any) => {
    setSelectedSubscription(subscriptionType);
    if (isLoggedIn) {
      const amount = subscriptionType === 'user' ? 5 : subscriptionType === 'studio' ? 10 : 0;
      navigate('/payment', { state: { subscriptionType, amount, userId } });
    }
  };

  const toggleSignupSignin = () => {
    setIsSignup(!isSignup);
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
                <Button onClick={handleGoogleLogin}>{isSignup ? "Sign up with Google" : "Sign in with Google"}</Button>
              </SubscriptionBox>
              <SubscriptionBox onClick={() => handleSubscriptionClick('studio')}>
                <Title>Studio Subscription</Title>
                <Description>$10 a month to buy and sell, get early access to new features</Description>
                <Button onClick={handleGoogleLogin}>{isSignup ? "Sign up with Google" : "Sign in with Google"}</Button>
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
