<!-- pages/register.vue -->
<template>
  <div class="w-full max-w-md p-2">
    <UCard class="shadow-xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
      
      <!-- Header Area -->
      <template #header>
        <div class="text-center py-2">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-primary-50 dark:bg-primary-950/50 text-primary rounded-2xl ring-4 ring-primary-500/10">
              <UIcon name="i-lucide-user-plus" class="w-6 h-6" />
            </div>
          </div>
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Buat Akun Baru
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Daftar mandiri untuk mendapatkan hak akses ke sistem
          </p>
        </div>
      </template>

      <!-- Alert Notification Berbahaya/Gagal -->
      <UAlert
        v-if="errorMessage"
        color="danger"
        variant="subtle"
        icon="i-lucide-alert-circle"
        title="Registrasi Gagal"
        :description="errorMessage"
        class="mb-5 transition-all duration-300"
      />

      <!-- Form Area -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <UFormField label="Username" name="username" size="md">
          <UInput
            v-model="username"
            type="text"
            placeholder="Masukkan username baru"
            icon="i-lucide-user"
            class="w-full"
            required
          />
        </UFormField>

        <UFormField label="Email" name="email" size="md">
          <UInput
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            icon="i-lucide-mail"
            class="w-full"
            required
          />
        </UFormField>

        <UFormField label="Password" name="password" size="md">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-key-round"
            class="w-full"
            required
          />
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
            Daftar Sekarang
          </UButton>
        </div>
      </form>

      <!-- 🌟 Footer Modifikasi: Ditambahkan Link Kembali ke Login -->
      <template #footer>
        <div class="text-center text-xs text-gray-500 dark:text-gray-400">
          Sudah memiliki akun? 
          <NuxtLink to="/login" class="text-primary hover:underline font-semibold ml-1">
            Login di sini
          </NuxtLink>
        </div>
      </template>

    </UCard>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const username = ref('');
const email = ref('');
const password = ref('');

const { executeRegister, loading, errorMessage } = useAuth();

definePageMeta({
  layout: 'auth'
});

const handleRegister = async () => {
  if (username.value && email.value && password.value) {
    const payload = {
      username: username.value,
      email: email.value,
      password: password.value
    };

    const success = await executeRegister(payload);
    if (success) {
      // Jika berhasil, lempar pengguna ke login dengan mulus
      navigateTo('/login');
    }
  }
};
</script>