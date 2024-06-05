import { createContext } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from 'app/app';
import { MantineProvider } from '@mantine/core';
import { theme } from 'app/styles/theme';
import UserStore from 'shared/store/user';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');

interface State {
  UStore: UserStore;
}

const UStore = new UserStore();

export const Context = createContext<State>({
  UStore,
});

let container: HTMLElement | null = null;

document.addEventListener('DOMContentLoaded', function (event) {
  if (!container) {
    container = document.getElementById('root') as HTMLElement;
    const root = ReactDOM.createRoot(container);
    root.render(
      <Context.Provider value={{ UStore }}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </Context.Provider>
    );
  }
});
