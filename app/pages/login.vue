<!-- pages/login.vue -->
<template>
  <div class="w-full max-w-md p-2">
    <!-- Card Container dengan efek Glassmorphism tipis / bayangan lembut -->
    <UCard class="shadow-xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
      
      <!-- Header Area -->
      <template #header>
        <div class="text-center py-2">
          <!-- Ganti dengan komponen <Logo /> Anda jika ingin menampilkan logo di atas -->
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

      <!-- Alert Notification Berbahaya/Gagal -->
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
        
        <!-- Field Username / Email -->
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

        <!-- Field Password dengan Fitur Toggle Mata -->
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
            <!-- Slot tombol mata di sebelah kanan input -->
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

        <!-- Tombol Submit -->
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

      <!-- Footer Tambahan (Opsional) -->
      <template #footer>
        <div class="text-center text-[11px] text-gray-400 dark:text-gray-500">
          Dilindungi oleh sistem enkripsi terintegrasi Drupal OAuth2.
        </div>
      </template>

    </UCard>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

// Pasang layout polos khusus auth agar berbeda tema dengan dashboard internal
definePageMeta({
  layout: 'auth'
});

const username = ref('');
const password = ref('');
const showPassword = ref(false); // State untuk toggle visibilitas password

const { executeLogin, loading, errorMessage } = useAuth();

const handleFormLogin = () => {
  if (username.value && password.value) {
    executeLogin(username.value, password.value);
  }
};
</script>