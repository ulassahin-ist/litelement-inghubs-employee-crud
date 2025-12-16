import {Router} from '@vaadin/router';

export function navigateTo(path) {
  Router.go(path.startsWith('/') ? path : `/${path}`);
}
