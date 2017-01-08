import './../less/reset.less';
import './../less/styles.less';
import './../less/flickity.less';

import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from './containers/Application.jsx';
import configureStore from './store/configureStore';

const store = configureStore();

render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('root')
);
