// app/plugins/services.ts

import { AuthDatasource } from '~/infrastructure/drupal/Auth';
import { AuthService } from '~/services/AuthService';

export default defineNuxtPlugin(() => {

  const authDatasource = new AuthDatasource();

  const authService = new AuthService(
    authDatasource,
  );

  return {

    provide: {

      authService,

    },

  };

});