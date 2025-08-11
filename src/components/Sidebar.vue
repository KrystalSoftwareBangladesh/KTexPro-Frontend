<template>
  <div>
    <!-- Backdrop for mobile when sidebar is open -->
    <div
      v-if="showSidebar"
      @click="$emit('closeSidebar')"
      class="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
    ></div>

    <aside
      :class="[
        'bg-ktex text-white flex flex-col transition-all duration-300 ease-in-out fixed md:static top-0 left-0 h-full z-30',
        collapsed ? 'w-20' : 'w-64',
        showSidebar ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ]"
    >
      <!-- Sidebar content -->
      <div class="p-6 text-2xl font-bold border-b border-ktexDark flex items-center justify-center">
        <span v-if="!collapsed">KTexPro</span>
        <span v-else class="text-xl">KP</span>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/"
          class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-ktexDark transition"
          active-class="bg-ktexDark font-semibold"
          @click="$emit('closeSidebar')"
        >
          <HomeIcon class="w-6 h-6" />
          <span v-if="!collapsed">Dashboard</span>
        </router-link>

        <router-link
          to="/users"
          class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-ktexDark transition"
          active-class="bg-ktexDark font-semibold"
          @click="$emit('closeSidebar')"
        >
          <UserIcon class="w-6 h-6" />
          <span v-if="!collapsed">User Management</span>
        </router-link>

        <!-- Add more links here -->
      </nav>

      <div class="p-4 border-t border-ktexDark">
        <button
          @click="logout"
          class="w-full bg-red-600 hover:bg-red-700 rounded py-2 font-semibold flex items-center justify-center space-x-2"
        >
          <span v-if="!collapsed">Logout</span>
          <ArrowRightOnRectangleIcon class="w-6 h-6" v-else />
        </button>
      </div>
    </aside>
  </div>
</template>

<script>
import { HomeIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Sidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    showSidebar: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    HomeIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken')
      this.$router.push('/login')
    },
  },
}
</script>
