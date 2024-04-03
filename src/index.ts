import './scss/styles.scss';
import {CardAPI} from "./components/larekApi";
import { CDN_URL, API_URL } from './utils/constants';
// import { AppState } from './components/AppData';
// import { EventEmitter } from './components/base/events';
//

//реализем проект на основе "Оно тебе надо"

// const events = new EventEmitter();
const api = new CardAPI(CDN_URL, API_URL);

// Модель данных приложения
// const appData = new AppState({}, events);

// Получаем лоты с сервера
api.getLotList().then(( result) => {
    console.log(result); //выводим карточки в консоль
})
    // .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(` ошибка ${err}`);
});