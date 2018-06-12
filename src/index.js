import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.component';
import './index.css';
import isMobile from 'is-mobile';

if (isMobile()) {
    const isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOs) {
        window.location = 'https://itunes.apple.com/us/app/google-tasks-get-things-done/id1353634006?mt=8';
    } else {
        window.location = 'https://play.google.com/store/apps/details?id=com.google.android.apps.tasks&hl=en';
    }
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}