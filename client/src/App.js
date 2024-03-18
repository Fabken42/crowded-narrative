import { BrowserRouter, Routes, Route } from 'react-router-dom';

import EnterStory from './pages/EnterStory.js';
import CreateStory from './pages/CreateStory.js';
import CreateChapter from './pages/CreateChapter.js';
import ChapterList from './pages/ChapterList.js';
import ChapterView from './pages/ChapterView.js';
import StoryList from './pages/StoryList.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';
import Home from './pages/Home.js';
import Profile from './pages/Profile.js';
import SearchStory from './pages/SearchStory.js';
import SignIn from './pages/SignIn.js';
import SignUp from './pages/SignUp.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import PrivateRoute from './components/PrivateRoute.js';
import { faMagnifyingGlass, faBook, faCopy, faX } from '@fortawesome/free-solid-svg-icons';
library.add(faMagnifyingGlass, faBook, faCopy, faX);

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/narrativa/:storyId' element={<ChapterList />} />
        <Route path='/narrativa/:storyId/:chapterNumber' element={<ChapterView />} />
        <Route path='/entrar' element={<SignIn />} />
        <Route path='/registrar' element={<SignUp />} />
        <Route path='/search-story' element={<SearchStory />} /> {/* MOSTRA CATEGORIAS DE HISTÓRIA */}
        <Route element={<PrivateRoute />}>
          <Route path='/entrar-em-narrativa' element={<EnterStory />} />
          <Route path='/criar-narrativa' element={<CreateStory />} />
          <Route path='/narrativa/:storyId/criar-capitulo' element={<CreateChapter />} />
          <Route path='/lista-de-narrativas' element={<StoryList />} />
          <Route path='/perfil' element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </BrowserRouter>
  );
}