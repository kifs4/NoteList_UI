import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// Глобальний мок для fetch, оскільки у нас реальні запити будуть використовуватись в Cypress, 
// а для Unit-тестів Jest краще не робити реальні запити (хоча ви просили реальний бекенд).
// Якщо ви хочете, щоб Jest теж робив реальні запити, використовуйте поліфіл для fetch (напр. whatwg-fetch) 
// або Node 18+. Але для ізольованості компонентів ми їх мокаємо тут.
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('{}'),
  })
);
