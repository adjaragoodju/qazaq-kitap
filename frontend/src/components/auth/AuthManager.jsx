import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthManager = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const openLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const openRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return {
    showLoginModal,
    showRegisterModal,
    openLogin,
    openRegister,
    closeModals,
    renderModals: () => (
      <>
        {showLoginModal && (
          <LoginModal onClose={closeModals} onSwitchToRegister={openRegister} />
        )}
        {showRegisterModal && (
          <RegisterModal onClose={closeModals} onSwitchToLogin={openLogin} />
        )}
      </>
    ),
  };
};

export default AuthManager;
