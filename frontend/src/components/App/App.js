import {useEffect, useState} from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup';
import ImagePopup from '../ImagePopup/ImagePopup';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup';
import defaultUserPic from '../../images/userpic-jacques.jpg';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup';
import ConfirmActionPopup from '../ConfirmActionPopup/ConfirmActionPopup';
import Login from '../Login/Login';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import Register from '../Register/Register';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import * as auth from '../../utils/auth';
import api from '../../utils/api';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

const DEFAULT_USER = {
  name: 'Имя...',
  about: 'Описание...',
  avatar: defaultUserPic,
};

const DEFAULT_TOOLTIP = {
  isOpen: false,
  isError: false,
  errorMessage: '',
};

const App = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardsList, setCardsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [infoTooltipState, setInfoTooltipState] = useState(DEFAULT_TOOLTIP);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmActionPopupOpen, setIsConfirmActionPopupOpen] =
    useState(false);
  const [confirmActionPopupData, setConfirmActionPopupData] = useState({});

  const isPopupOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isConfirmActionPopupOpen ||
    selectedCard.link ||
    infoTooltipState.isOpen;

  useEffect(() => {
    const closeByEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    if (isPopupOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isPopupOpen]);

  useEffect(() => {
    checkUser().then((isLogged) => (isLogged ? initAppContent() : undefined));
  }, []);

  const initAppContent = () =>
    api
      .initializeAppData()
      .then(([user, cards]) => {
        setCurrentUser(user.data);
        setCardsList(cards.data);
        onLoginSuccess(user.data.email);
      })
      .catch(console.error);

  const onLoginSuccess = (email) => {
    localStorage.setItem('email', email);
    setIsLoggedIn(true);
    navigate('/', {replace: true});
  };

  const checkUser = () => {
    const email = localStorage.getItem('email');

    if (!email) {
      return Promise.resolve(false);
    }

    return api
      .getUserData()
      .then(({data}) => Boolean(data))
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  const onLogin = ({email, password}) => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    return auth
      .login(email, password)
      .then(initAppContent)
      .catch(callErrorTooltip)
      .finally(() => setIsLoading(false));
  };

  const onRegister = ({email, password}) => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    return auth
      .register(email, password)
      .then(({data}) => {
        if (!data) {
          return;
        }

        callSuccessTooltip();
        navigate('signin', {replace: true});
      })
      .catch(callErrorTooltip)
      .finally(() => setIsLoading(false));
  };

  const onSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('email');
    navigate('/signin', {replace: true});
    auth.logout().catch(console.error);
  };

  const callSuccessTooltip = () =>
    setInfoTooltipState({
      isOpen: true,
      isError: false,
      errorMessage: '',
    });

  const callErrorTooltip = (error) =>
    setInfoTooltipState({
      isOpen: true,
      isError: true,
      errorMessage: error.message,
    });

  const closeInfoTooltip = () =>
    setInfoTooltipState({
      ...infoTooltipState,
      isOpen: false,
    });

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);
  const handleDeleteCardClick = (data) => {
    setIsConfirmActionPopupOpen(true);
    setConfirmActionPopupData(data);
  };

  const handleCardLike = (selectedCard) => {
    const isLiked = selectedCard.likes.some(
      (user) => user._id === currentUser._id
    );
    const request = isLiked
      ? api.unsetCardLike(selectedCard._id)
      : api.setCardLike(selectedCard._id);

    return request
      .then((newCard) =>
        setCardsList((cards) =>
          cards.map((card) =>
            card._id === selectedCard._id ? newCard.data : card
          )
        )
      )
      .catch(console.error);
  };

  const handleCardDelete = (card) => {
    const cardId = card._id;
    setIsLoading(true);

    return api
      .deleteCard(cardId)
      .then(() => {
        setCardsList((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleUpdateUser = ({name, about}) => {
    setIsLoading(true);

    return api
      .updateUserInfo({name, about})
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleUpdateAvatar = ({avatar}) => {
    setIsLoading(true);

    return api
      .updateUserAvatar({avatar})
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleAddPlaceSubmit = ({name, link}) => {
    setIsLoading(true);

    return api
      .addNewCard({name, link})
      .then((newCard) => {
        setCardsList([newCard.data, ...cardsList]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmActionPopupOpen(false);
    setSelectedCard({});
    closeInfoTooltip();
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header isLoggedIn={isLoggedIn} onSignOut={onSignOut}/>

      <Routes>
        <Route
          path=""
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Main
                cardsList={cardsList}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteCardClick}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="signin"
          element={<Login onSubmit={onLogin} isLoading={isLoading}/>}
        />
        <Route
          path="signup"
          element={<Register onSubmit={onRegister} isLoading={isLoading}/>}
        />
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlaceSubmit={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      <ConfirmActionPopup
        isOpen={isConfirmActionPopupOpen}
        title="Вы уверены?"
        submitText="Да"
        onSubmit={handleCardDelete}
        onClose={closeAllPopups}
        data={confirmActionPopupData}
        isLoading={isLoading}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

      <InfoTooltip
        isOpen={infoTooltipState.isOpen}
        isError={infoTooltipState.isError}
        errorMessage={infoTooltipState.errorMessage}
        onClose={closeInfoTooltip}
      />

      {isLoggedIn && <Footer/>}
    </CurrentUserContext.Provider>
  );
};

export default App;
