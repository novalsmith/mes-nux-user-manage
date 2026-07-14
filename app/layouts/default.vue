<!-- layouts/default.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  addMidleware: ['auth']
})
 

const route = useRoute()
const { user, logout } = useAuth()

// BY DEFAULT HILANG: Set nilai awal menjadi false
const open = ref(false)

// Navigasi Utama Aplikasi
const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Home', to: '/', active: route.path === '/', icon: 'i-lucide-house' },
  { label: 'Artikel', to: '/articles', active: route.path === '/articles', icon: 'i-lucide-book-open' },
  { label: 'Ulang Tahun', to: '/birthdays', active: route.path === '/birthdays', icon: 'i-lucide-calendar' },
  { label: 'Ulang Tahun Pernikahan', to: '/anniversaries', active: route.path === '/anniversaries', icon: 'i-lucide-calendar' },
  // { label: 'Recipes', to: '/recipes', active: route.path === '/recipes', icon: 'i-lucide-chef-hat' },
  // { label: 'Releases', to: 'https://github.com/nuxt/ui/releases', target: '_blank', icon: 'i-lucide-git-branch' }
])

// Menu Pengaturan khusus User
const userSettingsItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Profile Settings', to: '/user/profile', icon: 'i-lucide-user-cog' },
  { label: 'Account Security', to: '/user/security', icon: 'i-lucide-shield-check' }
])

// Fungsi bantu untuk menutup sidebar otomatis saat navigasi atau logout
const handleLogout = () => {
  open.value = false
  logout()
}
</script>

<template>
  <div class="flex flex-1 min-h-screen">
    
    <!-- 2. SIDEBAR DENGAN MODE OFFCANVAS -->
    <USidebar
      v-model:open="open"
      variant="floating"
      collapsible="offcanvas" 
      side="left"
      :ui="{
        container: 'h-full flex flex-col justify-between'
      }"
    >
      <!-- Header Sidebar (Logo & Tombol Tutup internal jika diperlukan) -->
      <template #header>
        <div class="flex items-center justify-between w-full overflow-hidden">
          <Logo class="h-6 w-auto shrink-0" />
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="lg:hidden"
            @click="open = false"
          />
        </div>
      </template>

      <!-- Body Sidebar (Navigasi) -->
      <div class="flex-1 flex flex-col gap-4 overflow-y-auto py-4">
        <!-- Tambahkan Navigasi Utama di dalam Sidebar khusus untuk resolusi Mobile/Tablet -->
        <div class="block lg:hidden">
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            :ui="{ link: 'p-1.5 overflow-hidden' }"
            @click="open = false"  
          />
          <UDivider class="my-4" />
        </div>

        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Settings</p>
          <UNavigationMenu
            :items="userSettingsItems"
            orientation="vertical"
            :ui="{ link: 'p-1.5 overflow-hidden' }"
            @click="open = false"  
          />
        </div>
      </div>

      <!-- Footer Sidebar (Info User & Logout) -->
      <template #footer>
        <div class="w-full flex flex-col gap-2 overflow-hidden">
          <div v-if="user" class="flex items-center gap-2 p-2 rounded-lg bg-default/50 border border-default">
            <UAvatar :alt="user.name" size="sm" class="bg-primary text-white font-semibold" />
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-semibold truncate">{{ user.name }}</span>
              <span class="text-[10px] text-neutral-400 truncate">{{ user.email }}</span>
            </div>
          </div>

          <UButton
            icon="i-lucide-log-out"
            color="warning"
            variant="ghost"
            label="Keluar Aplikasi"
            block
            class="overflow-hidden"
            @click="handleLogout"
          />
        </div>
      </template>
    </USidebar>

    <!-- 3. AREA KONTEN UTAMA -->
    <div
      class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default"
    >
      <!-- Top Bar Header Konten dengan pembagian 3 sisi -->
      <div class="h-(--ui-header-height) shrink-0 flex items-center justify-between px-4 border-b border-default bg-background/50 backdrop-blur">
        
        <!-- Sisi Kiri: Hamburger Menu & Logo (Lebar minimum dikunci) -->
        <div class="flex items-center gap-3 min-w-[240px]">
          <UButton
            icon="i-lucide-menu"  
            color="neutral"
            variant="ghost"
            aria-label="Open menu"
            @click="open = !open"
          />
          <Logo class="h-5 w-auto" />
        </div>

        <!-- Sisi Tengah: Menu Navigasi Utama (Hanya muncul di layar Desktop / lg) -->
        <div class="hidden lg:flex items-center justify-center flex-1 mx-4">
          <UNavigationMenu  
            :items="items"
            orientation="horizontal"
            :ui="{ link: 'p-1.5 overflow-hidden' }"
          />
        </div>

        <!-- Sisi Kanan: Global Tools (Lebar minimum dikunci untuk menyeimbangkan Sisi Kiri) -->
        <div class="flex items-center gap-3 min-w-[240px] justify-end">
          <SearchBox />
          <UColorModeButton />

          <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
            <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/nuxt/ui"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
            />
          </UTooltip>
        </div>
      </div>

      <!-- Isi Slot Halaman Web Anda -->
      <main class="flex-1 overflow-y-auto p-6">
        <UContainer>
          <slot />
        </UContainer>
      </main>

    </div>
  </div>
</template>