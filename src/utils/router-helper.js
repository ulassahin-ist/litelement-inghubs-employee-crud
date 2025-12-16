import {Router} from '@vaadin/router';

export function navigateTo(path) {
  console.log('here');
  Router.go(path.startsWith('/') ? path : `/${path}`);
}
