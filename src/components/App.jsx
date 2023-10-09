import React, { useState, useEffect } from 'react';
import { fetchImgs } from '../API/PixabayAPI';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import css from './App.module.css';

function App() {
  // Використовуємо хуки для управління станом компонента
  const [gallery, setGallery] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  // Функція для обробки пошуку
  const handleSearch = newSearchQuery => {
    if (searchQuery === newSearchQuery) {
      return alert(
        `You are watching "${newSearchQuery}" category. Enter a different category`
      );
    }

    setSearchQuery(newSearchQuery);
    setGallery([]);
    setPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoader(true);
        const { data } = await fetchImgs(page, searchQuery);
        if (data.hits.length === 0) {
          return Notify.failure('Sorry, but nothing found');
        }
        const hasImages =
          data.total > data.hits.length && data.total - page * 12 >= 0;

        setShowBtn(hasImages);
        setGallery(prevGallery => [...prevGallery, ...data.hits]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoader(false);
      }
    };

    if (searchQuery && (page === 1 || page > 1)) {
      fetchData();
    }
  }, [page, searchQuery]);

  // Функція для обробки кліку на кнопку "Load more"
  const handleClickButton = () => {
    setPage(prevPage => prevPage + 1);
    setShowBtn(false);
  };

  // Перевірка наявності зображень
  const hasImages = gallery.length > 0;

  return (
    <div className={css.container}>
      <Searchbar handleSearch={handleSearch} />
      {hasImages && <ImageGallery gallery={gallery} alt={searchQuery} />}
      {isLoader && <Loader />}
      {showBtn && <Button onClick={handleClickButton} hasImages={hasImages} />}
    </div>
  );
}

export default App;
