<script setup lang="ts">
import { h, resolveComponent, ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useUsersManagement } from '~/composables/useUsers'
import type { UserModel } from '~/model/UserModel'
 
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

// Panggil composable managemen user + reactive filter states
const { 
  users, 
  totalItems, 
  itemsPerPage, 
  page, 
  searchKeyword, 
  selectedRelation, 
  selectedStatus, 
  pending, 
  error 
} = useUsersManagement()

// Opsi pilihan dropdown sesuai kriteria filter di Drupal Views Anda
const relationOptions = [
  { label: 'Semua Hubungan', value: '' },
  { label: 'Kepala Keluarga', value: 'Kepala Keluarga' },
  { label: 'Istri', value: 'Istri' },
  { label: 'Anak', value: 'Anak' },
  { label: 'Anggota Lain', value: 'Anggota Lain' }
]

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: '1' },
  { label: 'Non-Aktif', value: '0' }
]

// Konfigurasi Kolom Tabel Utama
const columns: TableColumn<UserModel>[] = [
  {
    accessorKey: 'avatar',
    header: '',
    cell: ({ row }) => {
      return h(UAvatar, {
        src: row.getValue('avatar') || undefined,
        alt: row.original.fullName,
        size: 'sm'
      })
    }
  },
  {
    accessorKey: 'fullName',
    header: 'Nama Lengkap',
    cell: ({ row }) => h('span', { class: 'font-semibold text-gray-900 dark:text-white' }, row.getValue('fullName'))
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => h('span', { class: 'text-gray-500' }, `@${row.getValue('username')}`)
  },
  {
    accessorKey: 'familyRelation',
    header: 'Hubungan Keluarga',
    cell: ({ row }) => {
      const relation = row.getValue('familyRelation') as string
      const color = relation === 'Kepala Keluarga' ? 'primary' : relation === 'Istri' ? 'secondary' : 'neutral'
      return h(UBadge, { variant: 'flat', color, size: 'sm' }, () => relation)
    }
  },
  {
    accessorKey: 'birthDate',
    header: 'Tanggal Lahir',
    cell: ({ row }) => row.getValue('birthDate') || '-'
  },
  {
    accessorKey: 'weddingDate',
    header: 'Tanggal Pernikahan',
    cell: ({ row }) => row.getValue('weddingDate') || '-'
  },
  {
    accessorKey: 'roles',
    header: 'Hak Akses',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as string[]
      return h('div', { class: 'flex flex-wrap gap-1' }, 
        roles.map(role => h(UBadge, { size: 'sm', variant: 'outline', color: 'neutral' }, () => role))
      )
    }
  }
]
</script>

<template>
  <div class="flex flex-col gap-4 p-6 flex-1">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          👥 Manajemen Data Warga
        </h1>
        <p class="text-sm text-gray-500">Menampilkan seluruh data warga terdaftar (Total: {{ totalItems }} Jiwa)</p>
      </div>
    </div>

    <!-- Filter Control Area (Header Table) -->
    <div class="flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
      <div class="w-full sm:w-72">
        <!-- Input Search Nama -->
        <UInput
          v-model="searchKeyword"
          icon="i-heroicons-magnifying-glass"
          placeholder="Cari nama warga..."
          size="sm"
          class="w-full"
          type="search"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center">
        <!-- Filter Dropdown Hubungan Keluarga -->
        <USelect
          v-model="selectedRelation"
          :options="relationOptions"
          option-attribute="label"
          value-attribute="value"
          size="sm"
          class="w-full sm:w-44"
        />

        <!-- Filter Dropdown Status User -->
        <USelect
          v-model="selectedStatus"
          :options="statusOptions"
          option-attribute="label"
          value-attribute="value"
          size="sm"
          class="w-full sm:w-36"
        />
      </div>
    </div>

    <!-- State 1: Loading (Skeleton Table) -->
    <div v-if="pending" class="flex flex-col gap-4 flex-1">
      <div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <!-- Header Tabel Bayangan -->
        <div class="grid grid-cols-7 gap-4 p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div v-for="n in 7" :key="'h-'+n"><USkeleton class="h-4 w-20" /></div>
        </div>
        
        <!-- Baris Data Bayangan (Looping 5 baris skeleton) -->
        <div v-for="i in 5" :key="i" class="grid grid-cols-7 gap-4 p-4 border-b border-gray-100 dark:border-gray-800 items-center">
          <div class="flex items-center justify-start">
            <USkeleton class="h-8 w-8 rounded-full" />
          </div>
          <div><USkeleton class="h-4 w-3/4" /></div>
          <div><USkeleton class="h-4 w-1/2" /></div>
          <div><USkeleton class="h-5 w-24 rounded" /></div>
          <div><USkeleton class="h-4 w-20" /></div>
          <div><USkeleton class="h-4 w-20" /></div>
          <div class="flex gap-1"><USkeleton class="h-5 w-16 rounded" /></div>
        </div>
      </div>

      <!-- Footer Pagination Bayangan -->
      <div class="flex items-center justify-between pt-2 px-2">
        <USkeleton class="h-4 w-40" />
        <USkeleton class="h-8 w-48" />
      </div>
    </div>

    <!-- State 2: Error -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      Gagal memuat data warga dari server. Silakan coba lagi.
    </div>

    <!-- State 3: Data Kosong -->
    <div v-else-if="users.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex-1 flex flex-col items-center justify-center">
      <p>Tidak ada data warga yang cocok dengan kriteria filter.</p>
    </div>

    <!-- State 4: Main Content Area (Table + Paging) -->
    <div v-else class="flex flex-col gap-4 flex-1">
      <!-- Tabel Utama -->
      <UTable :data="users" :columns="columns" class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden" />

      <!-- Footer Terintegrasi Pagination Control Bawaan NuxtUI -->
      <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4 px-2">
        <p class="text-sm text-gray-500">
          Menampilkan <span class="font-medium">{{ users.length }}</span> dari <span class="font-medium">{{ totalItems }}</span> warga
        </p>

        <UPagination 
          v-model:page="page" 
          :total="totalItems" 
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
        />
      </div>
    </div>
  </div>
</template>