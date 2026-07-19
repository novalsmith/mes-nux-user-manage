<template>
  <div class="w-full max-w-5xl py-6 mx-auto">

    <UCard>

      <template #header>

        <div class="space-y-1">

          <h1 class="text-2xl font-bold">
            Registrasi Jemaat
          </h1>

          <p class="text-sm text-gray-500">
            Lengkapi data sesuai identitas.
          </p>

        </div>

      </template>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
        class="mb-5"
      />

      <form
        class="space-y-6"
        @submit.prevent="handleRegister"
      >

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- ========================= -->
          <!-- FOTO -->
          <!-- ========================= -->

          <UFormField
            label="Foto"
          >

            <UInput
              type="file"
              accept="image/*"
              @change="handlePicture"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- FULL NAME -->
          <!-- ========================= -->

          <UFormField
            label="Nama Lengkap"
            required
          >

            <UInput
              v-model="form.fullName"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- USERNAME -->
          <!-- ========================= -->

          <UFormField
            label="Username"
            required
          >

            <UInput
              v-model="form.username"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- EMAIL -->
          <!-- ========================= -->

          <UFormField
            label="Email"
            required
          >

            <UInput
              v-model="form.email"
              type="email"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- PASSWORD -->
          <!-- ========================= -->

          <UFormField
            label="Password"
            required
          >

            <UInput
              v-model="form.password"
              type="password"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- PHONE -->
          <!-- ========================= -->

          <UFormField
            label="Nomor HP"
            required
          >

            <UInput
              v-model="form.phone"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- ADDRESS -->
          <!-- ========================= -->

          <UFormField
            label="Alamat"
            required
            class="lg:col-span-2"
          >

            <UTextarea
              v-model="form.address"
              :rows="3"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- BIRTH -->
          <!-- ========================= -->

          <UFormField
            label="Tanggal Lahir"
            required
          >

            <UInput
              v-model="form.birthDate"
              type="date"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- WEDDING -->
          <!-- ========================= -->

          <UFormField
            label="Tanggal Nikah"
          >

            <UInput
              model="form.weddingDate"
              type="date"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- BAPTISM -->
          <!-- ========================= -->

          <UFormField
            label="Tanggal Baptis"
          >

            <UInput
              model="form.baptismDate"
              type="date"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- PHONE DARURAT -->
          <!-- ========================= -->

          <UFormField
            label="Kontak Darurat"
          >

            <UInput
              v-model="form.emergencyContact"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- OCCUPATION -->
          <!-- ========================= -->

          <UFormField
            label="Pekerjaan"
          >

            <UInput
              v-model="form.occupation"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- GENDER -->
          <!-- ========================= -->

          <UFormField
            label="Jenis Kelamin"
            required
          >

            <USelect
              v-model="form.gender"
              :items="genderOptions"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- FAMILY -->
          <!-- ========================= -->

          <UFormField
            label="Hubungan Dalam Keluarga"
            required
          >

            <USelect
              v-model="form.familyRelation"
              :items="familyRelationOptions"
            />

          </UFormField>

          <!-- ========================= -->
          <!-- JABATAN -->
          <!-- ========================= -->

          <UFormField
            label="Jabatan"
          >

            <USelectMenu
              @model="form.jabatan"
              :items="jabatanOptions"
              value-key="value"
              label-key="label"
            />

          </UFormField>

        </div>

        <div class="flex justify-end gap-3 pt-6">

          <UButton
            to="/login"
            color="neutral"
            variant="ghost"
          >
            Batal
          </UButton>

          <UButton
            type="submit"
            color="primary"
            :loading="loading"
          >
            Daftar
          </UButton>

        </div>

      </form>

    </UCard>

  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

import type {
  RegisterRequest,
  Gender,
  FamilyRelation,
} from '~/model/AuthModel';

import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'auth',
});

const {
  executeRegister,
  loading,
  errorMessage,
} = useAuth();

/**
 * Form
 */
const form = reactive<RegisterRequest>({
  username: '',
  email: '',
  password: '',

  fullName: '',
  phone: '',
  address: '',

  birthDate: '',

  weddingDate: null,

  baptismDate: null,

  gender: 'laki_laki',

  familyRelation: 'kepala_keluarga',

  jabatan: null,

  parent: null,

  emergencyContact: '',

  occupation: '',

  /**
   * Upload foto akan kita aktifkan nanti.
   */
  picture: null,
});

/**
 * Gender
 */
const genderOptions = [
  {
    label: 'Laki-laki',
    value: 'laki_laki' satisfies Gender,
  },
  {
    label: 'Perempuan',
    value: 'female' satisfies Gender,
  },
];

/**
 * Family Relation
 */
const familyRelationOptions = [
  {
    label: 'Kepala Keluarga',
    value: 'kepala_keluarga' satisfies FamilyRelation,
  },
  {
    label: 'Istri',
    value: 'istri' satisfies FamilyRelation,
  },
  {
    label: 'Anak',
    value: 'anak' satisfies FamilyRelation,
  },
  {
    label: 'Anggota Lain',
    value: 'anggota_lain' satisfies FamilyRelation,
  },
];

/**
 * Taxonomy Jabatan
 */
const jabatanOptions = ref<
  {
    label: string;
    value: number;
  }[]
>([]);

/**
 * Upload Picture
 *
 * Untuk sementara hanya disimpan
 * di form. Belum dikirim ke server.
 */
const handlePicture = (
  event: Event,
) => {

  const input =
    event.target as HTMLInputElement;

  form.picture =
    input.files?.[0] ?? null;

};

/**
 * Load Jabatan
 */
const loadJabatan = async () => {

  /**
   * TODO:
   * Ambil dari
   * /api/taxonomy/jabatan
   */

  jabatanOptions.value = [];

};

onMounted(loadJabatan);

/**
 * Submit
 */
const handleRegister = async () => {

  const payload: RegisterRequest = {

    ...form,

    /**
     * Upload foto belum aktif.
     * Jangan kirim File ke server.
     */
    picture: null,

  };

  const success =
    await executeRegister(payload);

  if (!success) {
    return;
  }

  await navigateTo('/login');

};
</script>