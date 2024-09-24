#!/bin/bash

# Функция для временного переименования и последующего изменения регистра
rename_case() {
  local original_path=$1
  local temp_path="${original_path}_temp"

  # Переименование во временное имя
  git mv "$original_path" "$temp_path"
  git commit -m "Переименовал $original_path во временное имя для изменения регистра"

  # Переименование в окончательное имя с правильным регистром
  local desired_path=$(echo "$original_path" | sed 's/\b\(.\)/\u\1/g') # Пример преобразования первой буквы в верхний регистр
  git mv "$temp_path" "$desired_path"
  git commit -m "Переименовал $temp_path в $desired_path с изменением регистра"
}

# Пример использования функции для нескольких файлов
rename_case "src/components/home.js"
# rename_case "src/components/registrationForm.js"
# rename_case "src/components/protectedRoute.js"

# Продолжите добавлять вызовы функции для остальных файлов и папок
