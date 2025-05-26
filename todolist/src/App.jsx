import React, { useState, useEffect } from 'react'; // Импортируем библиотеку React и хуки useState, useEffect
import './App.css'; // Подключаем стили приложения
import ToDoForm from "./AddTask"; // Импорт компонента формы добавления задач
import ToDo from "./Task"; // Импорт компонента отображения одной задачи
import axios from 'axios'; // Библиотека для выполнения HTTP запросов

// Константa для хранения списка задач в LocalStorage
const TASKS_STORAGE_KEY = 'tasks-list-project-web';
// Ключ API для получения данных о погоде
const weatherApiKey = 'c7616da4b68205c2f3ae73df2c31d177';
// Дефолтные координаты Краснодара
const KRASNODAR_LOCATION_LAT_LON = { lat: 45.039268, lon: 38.987221 };

// Функция для получения курсов валют
async function fetchCurrencyRates() {
  // Получаем данные о валютных курсах
  const currencyResponse = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
  if (!currencyResponse.data || !currencyResponse.data.Valute) {
    throw new Error('Нет данных о валюте.');
  }
  // Извлекаем и форматируем курсы доллара и евро
  const USDrate = currencyResponse.data.Valute.USD.Value.toFixed(4).replace('.', ',');
  const EURrate = currencyResponse.data.Valute.EUR.Value.toFixed(4).replace('.', ',');
  return { USDrate, EURrate };
}

// Функция для получения координат
function getUserCoordinates() {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude; // Широта
        const lon = position.coords.longitude; // Долгота
        resolve({ lat, lon });
      },
      () => {
        console.warn('Геолокация недоступна — беру Краснодар');
        resolve(KRASNODAR_LOCATION_LAT_LON);
      },
      { timeout: 10000 }
    );
  });
}

// Функция для получения данных о погоде по координатам
async function fetchWeatherByCoords(lat, lon) {
  // Запрашиваем данные о погоде
  const weatherResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
  );
  if (!weatherResponse.data.main) {
    throw new Error('Нет данных о погоде.');
  }
  return weatherResponse.data;
}

// Основной компонент приложения
function App() {
  const [rates, setRates] = useState({}); // Состояния для хранения валютных курсов
  const [weatherData, setWeatherData] = useState(null); //Состояние для хранения данных о погоде
  const [loading, setLoading] = useState(true); //Состояние для отображения загрузки
  const [error, setError] = useState(''); //Состояние для сообщений об ошибках

  // Инициализация задач из localStorage
  const [todos, setTodos] = useState(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY); // Читает задачи из хранилища по ключу
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks); // Парсит JSON с задачами
        if (Array.isArray(parsedTasks)) {
          return parsedTasks; // Восстановление задач
        } else {
          console.warn('Задача была найдена, но имеет неправильное содержимое:', parsedTasks);
        }
      } catch (error) {
        console.error('Ошибка при чтении задач из localStorage:', error.message);
      }
    }
    return [];
  });

  // Эффект для первичной загрузки данных о валюте
  useEffect(() => {
    async function loadRates() {
      try {
        const data = await fetchCurrencyRates();
        setRates(data);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки данных о валюте.');
      }
    }
    loadRates();
  }, []); // Пустой массив зависимостей гарантирует однократный запуск эффекта

  // Эффект для первичной загрузки данных о погоде
  useEffect(() => {
    async function loadWeather() {
      try {
        const { lat, lon } = await getUserCoordinates(); // Получаем координаты (или Краснодар)
        const data = await fetchWeatherByCoords(lat, lon); // Запрашиваем погоду
        setWeatherData(data);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки данных о погоде.');
      } finally {
        setLoading(false); // Завершаем этап загрузки
      }
    }
    loadWeather();
  }, []); // Пустой массив зависимостей гарантирует однократный запуск эффекта

  // Автосохранение задач в LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(todos)); // Сохранение задач в формате JSON
    } catch (error) {
      console.error('Ошибка при сохранении задач в localStorage:', error.message);
    }
  }, [todos]); // срабатывает при изменениях в tasks

  // Функция для добавления новой задачи
  const addTask = (userInput) => {
    if (userInput) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9), // Генерация идентификатора
        task: userInput, // Название задачи
        complete: false // Задача не выполнена по умолчанию
      };
      setTodos([...todos, newItem]); // Добавляем новую задачу в конец списка
    }
  };

  // Функция для удаления задачи
  const removeTask = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)]); // Оставляет задачи с id, не равным выбранному
  };

  // Функция для смены статуса задачи
  const handleToggle = (id) => {
    setTodos([
      ...todos.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : { ...task }
      )
    ]); // Меняем свойство complete для нужной задачи
  };

  // Возвращаемое представление компонента
  return (
    <>
      <div className="App">
        {loading && <p>Загрузка...</p>} {/* Индикатор загрузки */}
        {!loading && error && <p style={{ color: 'red' }}>{error}</p>} {/* Вывод ошибки, если она произошла */}
        {!loading && !error && ( // Если нет загрузки и ошибок, отображаем главное содержимое
          <>
            <div className='info'>
              <div className='money'> {/* Отображение курса евро и доллара*/}
                <div id="USD">Доллар США $ — {rates.USDrate} руб.</div>
                <div id="EUR">Евро € — {rates.EURrate} руб.</div>
              </div>
              {weatherData && ( // Отображение данных о погоде, если есть
                <div className="weather-info">
                  <div>
                    Погода сегодня: <br></br>
                    🌡️ {(weatherData.main.temp - 273.15).toFixed(1)}°C {" "}
                    💨 {weatherData.wind.speed} м/с{" "}
                    ☁️ {weatherData.clouds.all}%{" "}
                    <img
                      className='weather-icon'
                      src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                      alt="Иконка погоды"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <header>
          <h1 className='list-header'>Список задач: {todos.length}</h1>
        </header>
        <ToDoForm addTask={addTask} /> {/* Форма для добавления задач */}
        {todos.map((todo) => {// Цикл для отображения задач
          return (
            <ToDo
              todo={todo}
              key={todo.id}
              toggleTask={handleToggle}
              removeTask={removeTask}
            />
          );
        })}
      </div>
    </>
  );
}

// Экспорт компонента App
export default App;
