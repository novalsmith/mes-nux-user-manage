<!-- pages/login.vue -->
<template>
  <div class="w-full max-w-md p-2">
    <UCard class="shadow-xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
      
      <!-- Header Area -->
      <template #header>
        <div class="text-center py-2">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-primary-50 dark:bg-primary-950/50 text-primary rounded-2xl ring-4 ring-primary-500/10">
              <UIcon name="i-lucide-lock" class="w-6 h-6" />
            </div>
          </div>
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Selamat Datang Kembali
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Silakan masuk untuk mengakses dashboard sistem Anda
          </p>
        </div>
      </template>

      <!-- Alert Notification -->
      <UAlert
        v-if="errorMessage"
        color="danger"
        variant="subtle"
        icon="i-lucide-alert-circle"
        title="Otentikasi Gagal"
        :description="errorMessage"
        class="mb-5 transition-all duration-300"
      />

      <!-- Form Area -->
      <form @submit.prevent="handleFormLogin" class="space-y-4">
        <UFormField label="Username atau Email" name="username" size="md">
          <UInput
            v-model="username"
            type="text"
            placeholder="nama@email.com atau username"
            icon="i-lucide-user"
            autocomplete="username"
            class="w-full"
            required
          />
        </UFormField>

        <UFormField label="Password" name="password" size="md">
          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            icon="i-lucide-key-round"
            autocomplete="current-password"
            class="w-full"
            required
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <div class="pt-2">
          <UButton 
            type="submit" 
            color="primary" 
            variant="solid" 
            block 
            size="md"
            class="font-medium shadow-sm transition-all duration-200 active:scale-[0.98]"
            :loading="loading"
            loading-placement="leading"
          >
            Masuk ke Dashboard
          </UButton>
        </div>
      </form>

      <!-- 🌟 Footer Modifikasi: Ditambahkan Link ke Halaman Register -->
      <template #footer>
        <div class="flex flex-col items-center gap-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
          <div>Dilindungi oleh sistem enkripsi terintegrasi Drupal OAuth2.</div>
          <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">
            Belum punya akun? 
            <NuxtLink to="/register" class="text-primary hover:underline font-semibold ml-1">
              Daftar di sini
            </NuxtLink>
          </div>
        </div>
      </template>

    </UCard>
  </div>
</template>
 
<script setup>
import { useAuth } from '~/composables/useAuth';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const { executeLogin, loading, errorMessage } = useAuth();

definePageMeta({
  layout: 'auth'
});

const handleFormLogin = async () => {
  if (username.value && password.value) {
    const success = await executeLogin(username.value, password.value);
    if (success) {
      navigateTo('/');
    }
  }
};
</script>