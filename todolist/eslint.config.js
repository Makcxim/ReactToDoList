import js from '@eslint/js'; // Базовые настройки ESLint для JavaScript
import globals from 'globals'; // Набор предопределённых глобальных объектов
import reactHooks from 'eslint-plugin-react-hooks'; // Плагин для проверки хуков React
import reactRefresh from 'eslint-plugin-react-refresh'; // Плагин для перезагрузки компонентов

// Экспорт основной конфигурации ESLint
export default [
  // Первая часть: Пропускает проверку файлов в директории dist
  {
    ignores: ['dist']
  },

  {
    files: ['**/*.{js,jsx}'], // Настройки применяются ко всем файлам .js и .jsx

    languageOptions: {
      ecmaVersion: 2020, // Устанавливаем поддержку последнего стабильного стандарта ES (ES2020)
      globals: {
        ...globals.browser // Добавляем список глобальных объектов браузера (window, document и др.)
      },
      parserOptions: {
        ecmaVersion: 'latest', // Всегда используем самую свежую версию ECMAscript
        ecmaFeatures: {
          jsx: true // Включаем обработку синтаксиса JSX (React-компоненты)
        },
        sourceType: 'module' // Используем модульную систему ES6+ (import/export)
      }
    },

    // Список подключаемых плагинов
    plugins: {
      'react-hooks': reactHooks, // Подключаем плагин для проверки хуков React
      'react-refresh': reactRefresh
    },

    // Список применяемых правил
    rules: {
      ...js.configs.recommended.rules, // Базовые рекомендуемые правила от ESLint
      ...reactHooks.configs.recommended.rules, // Рекомендации для хуков React
      'no-unused-vars': ['error', { // Запрет на неиспользованные переменные – не константы
        varsIgnorePattern: '^[A-Z_]' // Исключение переменных, начинающихся с большой буквы или _
      }],

      'react-refresh/only-export-components': [ // Проверяем экспорт компонентов
        'warn', // Предупреждение, если компонент неправильно экспортирован
        { allowConstantExport: true } // Разрешаем экспортировать постоянные значения
      ]
    }
  }
];