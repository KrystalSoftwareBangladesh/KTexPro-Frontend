<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-ktex text-white flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      ]"
    >
      <!-- Logo / Title -->
      <div
        class="flex items-center justify-between p-4 border-b border-ktexDark"
      >
        <span
          v-if="!collapsed"
          class="text-2xl font-bold whitespace-nowrap"
        >
          KTexPro
        </span>
        <button
          @click="collapsed = !collapsed"
          class="text-white hover:text-gray-300"
        >
          ☰
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 p-2 space-y-2">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-4 py-2 rounded hover:bg-ktexDark transition"
        >
          📊
          <span v-if="!collapsed">Dashboard</span>
        </RouterLink>
        <RouterLink
          to="/users"
          class="flex items-center gap-3 px-4 py-2 rounded hover:bg-ktexDark transition"
        >
          👥
          <span v-if="!collapsed">User Management</span>
        </RouterLink>
        <RouterLink
          to="/leads"
          class="flex items-center gap-3 px-4 py-2 rounded hover:bg-ktexDark transition"
        >
          📌
          <span v-if="!collapsed">Leads</span>
        </RouterLink>
        <RouterLink
          to="/contacts"
          class="flex items-center gap-3 px-4 py-2 rounded hover:bg-ktexDark transition"
        >
          📇
          <span v-if="!collapsed">Contacts</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-white shadow flex items-center px-4">
        <div class="flex-1 text-xl font-semibold text-ktex">Dashboard</div>
        <!-- Profile Dropdown -->
        <div class="relative" @click="profileOpen = !profileOpen">
          <button class="flex items-center gap-2 text-ktex hover:text-ktexDark">
            👤
            <span v-if="!collapsed">Profile</span>
          </button>
          <div
            v-if="profileOpen"
            class="absolute right-0 mt-2 bg-white shadow rounded w-40 text-gray-700"
          >
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6 overflow-auto flex-1">
        <h2 class="text-2xl font-bold mb-6 text-ktex">
          Welcome to KTexPro ERP
        </h2>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">
              New Leads This Week
            </div>
            <div class="mt-2 text-3xl font-bold text-ktex">12</div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">
              Follow-ups Due Today
            </div>
            <div class="mt-2 text-3xl font-bold text-ktex">5</div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">
              Converted Leads This Month
            </div>
            <div class="mt-2 text-3xl font-bold text-ktex">8</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      collapsed: false,
      profileOpen: false
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/login");
    }
  }
}
</script>
