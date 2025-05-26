import React from "react"; // Импортируем библиотеку React.

      // Определяем компонент "To Do", принимающий props: объект to do, функции toggleTask и removeTask.
      const ToDo = ({ todo, toggleTask, removeTask }) => {
        return (
          <div key={todo.id + todo.key} className="item-todo">
            {/* Используем комбинацию id и ключа. */}


            {/* Блок с задачей с текстом и кнопкой удаления */}
            <div
              onClick={() => toggleTask(todo.id)} /* Обработчик события click для переключения статуса выполнения */
              className={
                todo.complete ? "item-text strike" : "item-text" /* Условие: если задача выполнена, добавляем класс "strike" для зачеркивания текста */
              }
            >
              {todo.task} {/* Сам текст задачи */}
            </div>

            {/* Второй дочерний элемент: кнопка удаления задачи. */}
            <div className="item-delete" onClick={() => removeTask(todo.id)}>
              x
            </div>
          </div>
        );
      };

export default ToDo;
