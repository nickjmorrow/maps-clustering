import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const app = <App />;
ReactDOM.render(app, document.getElementById('root') as HTMLElement);
registerServiceWorker();
