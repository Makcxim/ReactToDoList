import React, { useState } from "react"; // Импорт библиотеки React и useState

// Определение компонента ToDoForm, принимающего функцию addTask
const ToDoForm = ({ addTask }) => {

  //useState создает переменные userInput и функцию для обновления значения input-а.
  const [userInput, setUserInput] = useState(""); // Начальное значение - пустая строка.

  // Обработчик изменения текста в поле ввода. Записывает введенное значение в state.
  const handleChange = (e) => {
    setUserInput(e.currentTarget.value);
};

  // Обработчик отправки формы.
  const handleSubmit = (e) => {
    e.preventDefault(); // Остановка стандартной отправки формы (перезагрузки страницы).
    addTask(userInput); // Передача введенного значения в родительский компонент для добавления задачи.
    setUserInput(""); // Сбрасываем поле ввода после отправки.
  };

  // Обработчик нажатия клавиш. Позволяет отправлять форму при нажатии Enter.
  const handleKeyPress = (e) => {
    if (e.key === "Enter") { // Проверяем, нажата ли клавиша Enter.
      handleSubmit(e); // Отправляем форму, аналогично submit-у.
    }
  };

  // Возвращаемый JSX-код: форма с полем ввода и кнопкой.
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={userInput}      // Текущее значение поля ввода берется из state.
        type="text"
        onChange={handleChange}      // Обработчик изменения содержимого ввода.
        onKeyDown={handleKeyPress}      // Обработчик нажатия клавиши Enter.
        placeholder="Введите значение..." // Подсказка в поле.
      />
      <button>Сохранить</button> {/* Кнопка для отправки формы. */}
    </form>
  );
};

export default ToDoForm; // Экспорт компонента для дальнейшего использования.
