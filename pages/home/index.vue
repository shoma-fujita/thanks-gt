<script setup>
definePageMeta({
  middleware: 'auth',
})
const supabase = useSupabaseClient()

const user = useSupabaseUser()

const signOut = async () => {
  await supabase.auth.signOut()
  return navigateTo('/login')
}
console.log('user', user.value)
</script>

<template>
  <div class="Home">
    <h1>Home Page</h1>
    <p>Welcome, {{ user.email }}</p>
    <p>Welcome to the Home page</p>
    <button @click="signOut">
      ログアウト
    </button>
  </div>
</template>
