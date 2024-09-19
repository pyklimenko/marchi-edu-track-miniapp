const fs = require('fs');
const path = require('path');

// Папки и файлы, которые нужно игнорировать
const ignoredDirs = ['node_modules', '.vercel', '.git'];
const ignoredFiles = ['package-lock.json', 'collect-project-for-chatgpt.js', 'test-env.js', 'test-google-auth.js'];

// Функция для записи кода в файл
function writeFile(outputPath, content) {
    fs.appendFileSync(outputPath, content + '\n', (err) => {
        if (err) throw err;
    });
}

// Функция для рекурсивного обхода всех файлов и записи их содержимого в txt файл
function processDirectory(dir, outputPath) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(process.cwd(), fullPath);
        const stats = fs.statSync(fullPath);

        // Игнорируем папки и файлы из списка
        if (ignoredDirs.includes(file) || ignoredFiles.includes(file)) {
            return;
        }

        if (stats.isDirectory()) {
            processDirectory(fullPath, outputPath);
        } else if (stats.isFile()) {
            // Чтение файла и запись его содержимого в output.txt
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            writeFile(outputPath, `[${relativePath}]\n\n${fileContent}\n`);
        }
    });
}

// Путь к результирующему файлу
const outputFilePath = path.join(__dirname, 'utils', 'chatgpt-project-collection.txt');

// Удаление файла, если он уже существует
if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
}

// Создание папки Utils, если она не существует
if (!fs.existsSync(path.join(__dirname, 'utils'))) {
    fs.mkdirSync(path.join(__dirname, 'utils'));
}

// Запуск обработки файлов с текущей директории
processDirectory(process.cwd(), outputFilePath);

console.log('Файлы успешно объединены в chatgpt-project-collection.txt');
