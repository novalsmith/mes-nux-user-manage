// app/composables/useArticleSearchBox.ts
export const useArticleSearchBox = () => {
  const route = useRoute()
  
  const searchQuery = ref((route.query.q as string) || '')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const handleSearch = () => {
    const trimmedQuery = searchQuery.value.trim()

    if (!trimmedQuery) {
      navigateTo('/articles')
      return
    }

    if (trimmedQuery.length < 3) {
      return
    }

    navigateTo({
      path: '/articles',
      query: { q: trimmedQuery }
    })
  }

  watch(searchQuery, (newVal) => {
    if (route.path !== '/articles') return

    if (debounceTimer) clearTimeout(debounceTimer)

    const trimmed = newVal.trim()
    if (!trimmed) {
      handleSearch()
      return
    }

    debounceTimer = setTimeout(() => {
      handleSearch()
    }, 500)
  })

  watch(
    (() => route.query.q),
    (newQ) => {
      const freshQ = (newQ as string) || ''
      if (searchQuery.value !== freshQ) {
        searchQuery.value = freshQ
      }
    }
  )

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    searchQuery,
    handleSearch
  }
}