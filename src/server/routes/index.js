import compose from 'koa-compose';
import mount from 'koa-mount';

import assets from './assets';
import main from './main';
import clients from './clients';
import games from './games';

export default compose([
  assets,
  main,
  mount('/clients', clients),
  mount('/games', games),
]);
