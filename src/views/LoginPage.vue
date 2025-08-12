<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleLogin" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-ktex text-center">KTexPro Login</h2>

      <div class="mb-4">
        <label for="email" class="block mb-1 font-semibold">Email</label>
        <input
          v-model="email"
          id="email"
          type="email"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ktex"
        />
      </div>

      <div class="mb-6 relative">
        <label for="password" class="block mb-1 font-semibold">Password</label>
        
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ktex"
        />

        <!-- Eye icon button -->
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.973 9.973 0 012.538-4.362m3.228-2.339A9.956 9.956 0 0112 5c4.477 0 8.267 2.943 9.541 7a9.972 9.972 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
          </svg>
        </button>
      </div>


      <button
        type="submit"
        class="w-full bg-ktex text-white py-2 rounded hover:bg-ktexDark transition"
      >
        Login
      </button>
      <!-- Copyright -->
      <p class="text-center text-xs text-gray-500 mt-6">
        © {{ new Date().getFullYear() }} KTexPro. All rights reserved.
      </p>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      error: ''
    }
  },
  methods: {
    handleLogin() {
      // Mock simple auth check
      if (this.email === 'admin@ktexpro.com' && this.password === 'password') {
        localStorage.setItem('authToken', 'mock-token')
        this.$router.push('/')
      } else {
        this.error = 'Invalid email or password'
      }
    }
  }
}
</script>
