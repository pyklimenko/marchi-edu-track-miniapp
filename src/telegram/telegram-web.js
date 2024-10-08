// src/telegram/telegram-web.js
export function getTelegramUser() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user;
    } else {
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
        return null;
    }
}
