// server/api/auth/register.post.ts

import { FetchError } from 'ofetch';
import type { RegisterRequest } from '~/model/AuthModel';

export default defineEventHandler(async (event) => {

  const body = await readBody<RegisterRequest>(event);

  const config = useRuntimeConfig();

  if (
    !body.username ||
    !body.email ||
    !body.password
  ) {

    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Username, email, dan password wajib diisi.',
    });

  }

  try {

    /**
     * Anonymous CSRF Token
     */
    const csrfToken = await $fetch<string>(
      `${config.public.drupalBaseUrl}/session/token`,
    );

    /**
     * Drupal Payload
     */
    const drupalPayload: Record<string, any> = {

      /**
       * Core User
       */
      name: [
        {
          value: body.username,
        },
      ],

      mail: [
        {
          value: body.email,
        },
      ],

      pass: [
        {
          value: body.password,
        },
      ],

      /**
       * Custom Fields
       */
      field_full_name: [
        {
          value: body.fullName,
        },
      ],

      field_phone: [
        {
          value: body.phone,
        },
      ],

      field_address: [
        {
          value: body.address,
        },
      ],

      field_birthdate: [
        {
          value: body.birthDate,
        },
      ],

      field_gender: [
        {
          value: body.gender,
        },
      ],

      field_familly_relation: [
        {
          value: body.familyRelation,
        },
      ],

    };

    /**
     * Baptism Date
     */
    if (body.baptismDate) {

      drupalPayload.field_baptism_date = [
        {
          value: body.baptismDate,
        },
      ];

    }

    /**
     * Wedding Date
     */
    if (body.weddingDate) {

      drupalPayload.field_wedding_date = [
        {
          value: body.weddingDate,
        },
      ];

    }

    /**
     * Occupation
     */
    if (body.occupation) {

      drupalPayload.field_occupation = [
        {
          value: body.occupation,
        },
      ];

    }

    /**
     * Emergency Contact
     */
    if (body.emergencyContact) {

      drupalPayload.field_emergency_contact = [
        {
          value: body.emergencyContact,
        },
      ];

    }

    /**
     * Jabatan
     */
    if (body.jabatan) {

      drupalPayload.field_jabatan = [
        {
          target_id: body.jabatan,
        },
      ];

    }

    /**
     * Parent
     */
    if (body.parent) {

      drupalPayload.field_parent = [
        {
          target_id: body.parent,
        },
      ];

    }

    /**
     * Register User
     */
    return await $fetch(
      `${config.public.drupalBaseUrl}/user/register?_format=json`,
      {

        method: 'POST',

        headers: {

          Accept: 'application/json',

          'Content-Type': 'application/json',

          'X-CSRF-Token': csrfToken,

        },

        body: drupalPayload,

      },
    );

  } catch (error) {

    if (error instanceof FetchError) {

      const data =
        error.response?._data ?? {};

      console.error(data);

      throw createError({

        statusCode:
          error.response?.status ?? 500,

        statusMessage:
          'Registrasi Gagal',

        message:
          data.message ??
          data.error ??
          JSON.stringify(data),

      });

    }

    throw error;

  }

});