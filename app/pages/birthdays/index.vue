<script setup lang="ts">
import { ref, computed, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useUserAnniversariesThisMonth } from '~/composables/useUsers'
import type { UserModel } from '~/model/UserModel'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

// 1. Definisikan tipe event hasil mapping dari composable
type UserAnniversaryEvent = UserModel & {
  anniversaryType: 'birth' | 'wedding'
}

// 2. Panggil data bulan ini dari Composable
const { rawUsers, pending, error } = useUserAnniversariesThisMonth()

// 3. State untuk Filter Active (Chips)
// Pilihan: 'wedding' | 'birth' | 'past'
const activeFilter = ref<'wedding' | 'birth' | 'past'>('birth')

// Waktu hari ini (Juli 2026) untuk pengecekan data lewat secara lokal
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const currentDate = today.getDate()
const dateToday = new Date(currentYear, currentMonth, currentDate)

const thisMonth = `Daftar ulang tahun kelahiran dan pernikahan bulan ini. ${currentMonth + 1}/${currentYear}`;

// 4. Proses Filter Data secara Lokal Berdasarkan Chips yang Dipilih
const filteredData = computed<UserAnniversaryEvent[]>(() => {
  if (!rawUsers.value) return []

  const result: UserAnniversaryEvent[] = []

  rawUsers.value.forEach((user) => {
    // Kategori: Sudah Lewat Bulan Ini (Baik Ultah Lahir maupun Pernikahan)
    if (activeFilter.value === 'past') {
      let isPast = false
      
      if (user.rawBirthDate) {
        const bDate = new Date(user.rawBirthDate)
        const bAnniversary = new Date(currentYear, bDate.getMonth(), bDate.getDate())
        if (bAnniversary < dateToday && bDate.getDate() !== currentDate) {
          result.push({ ...user, anniversaryType: 'birth' })
          isPast = true
        }
      }
      
      if (user.rawWeddingDate) {
        const wDate = new Date(user.rawWeddingDate)
        const wAnniversary = new Date(currentYear, wDate.getMonth(), wDate.getDate())
        if (wAnniversary < dateToday && wDate.getDate() !== currentDate && !isPast) {
          result.push({ ...user, anniversaryType: 'wedding' })
        }
      }
      return
    }

    // Kategori: Ulang Tahun Pernikahan Bulan Ini (Belum Lewat / Hari Ini)
    if (activeFilter.value === 'wedding' && user.rawWeddingDate) {
      const wDate = new Date(user.rawWeddingDate)
      const wAnniversary = new Date(currentYear, wDate.getMonth(), wDate.getDate())
      if (wAnniversary >= dateToday || wDate.getDate() === currentDate) {
        result.push({ ...user, anniversaryType: 'wedding' })
      }
    }

    // Kategori: Ulang Tahun Kelahiran Bulan Ini (Belum Lewat / Hari Ini)
    if (activeFilter.value === 'birth' && user.rawBirthDate) {
      const bDate = new Date(user.rawBirthDate)
      const bAnniversary = new Date(currentYear, bDate.getMonth(), bDate.getDate())
      if (bAnniversary >= dateToday || bDate.getDate() === currentDate) {
        result.push({ ...user, anniversaryType: 'birth' })
      }
    }
  })

  // Urutkan berdasarkan tanggal terdekat agar rapi
  return result.sort((a, b) => {
    const dateA = new Date(a.anniversaryType === 'birth' ? a.rawBirthDate : a.rawWeddingDate!)
    const dateB = new Date(b.anniversaryType === 'birth' ? b.rawBirthDate : b.rawWeddingDate!)
    return dateA.getDate() - dateB.getDate()
  })
})

// 5. Konfigurasi Kolom Tabel UTable Baru
const columns: TableColumn<UserAnniversaryEvent>[] = [
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
    accessorKey: 'familyRelation',
    header: 'Hubungan',
    cell: ({ row }) => {
      const relation = row.getValue('familyRelation') as string
      const color = relation === 'Kepala Keluarga' ? 'primary' : relation === 'Istri' ? 'secondary' : 'neutral'
      return h(UBadge, { variant: 'flat', color, size: 'sm' }, () => relation)
    }
  },
  {
    accessorKey: 'anniversaryType',
    header: 'Event Bulan Ini',
    cell: ({ row }) => {
      const type = row.getValue('anniversaryType')
      const isToday = type === 'birth' 
        ? new Date(row.original.rawBirthDate).getDate() === currentDate
        : new Date(row.original.rawWeddingDate!).getDate() === currentDate

      return h('div', { class: 'flex items-center gap-2' }, [
        h(UBadge, {
          color: type === 'birth' ? 'info' : 'warning',
          variant: 'subtle'
        }, () => type === 'birth' ? '🎂 Ulang Tahun' : '💍 Pernikahan'),
        isToday ? h(UBadge, { color: 'error', variant: 'solid', class: 'animate-pulse' }, () => 'Hari Ini!') : null
      ])
    }
  },
  {
    accessorKey: 'date',
    header: 'Tanggal Perayaan',
    cell: ({ row }) => {
      // Tampilkan tanggal indo sesuai tipe data aktifnya
      return row.original.anniversaryType === 'birth' 
        ? row.original.birthDate 
        : row.original.weddingDate || '-'
    }
  }
]
</script>

<template>
  <div class="flex flex-col gap-4 p-6 flex-1">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><Icon name="i-lucide-calendar" /> Apresiasi Jemaat</h1>
        <p class="text-sm text-gray-500">{{ thisMonth }}</p>
      </div>

      <!-- Chips / Buttons Filter Kontrol Lokal -->
      <div class="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg self-start sm:self-center">
        <UButton
          :variant="activeFilter === 'birth' ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          label="🎂 Ulang Tahun"
          @click="() => { activeFilter = 'birth'; }"
        />
        <UButton
          :variant="activeFilter === 'wedding' ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          label="💍 Pernikahan"
          @click="() => { activeFilter = 'wedding'; }"
        />
        <UButton
          :variant="activeFilter === 'past' ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          label="⏮️ Sudah Lewat"
          @click="() => { activeFilter = 'past'; }"
        />
      </div>
    </div>

    <!-- State Loading -->
    <div v-if="pending" class="flex justify-center items-center py-12 text-gray-500 flex-1">
      <p>Memuat data warga...</p>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      Gagal memuat data warga. Silakan coba lagi.
    </div>

    <!-- State Data Kosong -->
    <div v-else-if="filteredData.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
      Tidak ada data perayaan untuk kategori ini di bulan sekarang.
    </div>

    <!-- Tampilkan Tabel Utama -->
    <UTable v-else :data="filteredData" :columns="columns" class="flex-1 border border-gray-200 dark:border-gray-800 rounded-lg" />
  </div>
</template>