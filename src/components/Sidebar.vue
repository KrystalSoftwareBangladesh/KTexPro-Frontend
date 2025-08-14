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
        'bg-ktex text-white flex flex-col transition-all duration-300 ease-in-out fixed md:static top-0 left-0 h-screen z-30',
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

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
        <router-link
          to="/"
          class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-ktexDark transition text-sm"
          active-class="bg-ktexDark font-semibold"
          @click="$emit('closeSidebar')"
        >
          <HomeIcon class="w-6 h-6" />
          <span v-if="!collapsed">Dashboard</span>
        </router-link>

        <!-- User Management with submenu -->
        <div>
          <button
            @click="toggleUserMenu"
            class="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-ktexDark transition text-left text-sm"
          >
            <div class="flex items-center space-x-2">
              <UserIcon class="w-6 h-6" />
              <span v-if="!collapsed">User Management</span>
            </div>

            <svg
              v-if="!collapsed"
              :class="{'transform rotate-90': userMenuOpen}"
              class="w-4 h-4 transition-transform duration-200 text-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <div
            v-show="userMenuOpen"
            class="ml-8 mt-2 space-y-1"
            :class="{hidden: collapsed}"
          >
            <router-link
              to="/users"
              class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-ktexDark transition mt-2 text-xs"
              active-class="bg-ktexDark font-semibold"
              @click="$emit('closeSidebar')"
            >
              <UserIcon class="w-6 h-6" />
              <span v-if="!collapsed">Users</span>
            </router-link>

            <router-link
              to="/roles"
              class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-ktexDark transition mt-2 text-xs"
              active-class="bg-ktexDark font-semibold"
              @click="$emit('closeSidebar')"
            >
              <LockClosedIcon class="w-6 h-6" />
              <span v-if="!collapsed">Roles & Permissions</span>
            </router-link>
          </div>
        </div>
        <!-- Lead Management with submenu -->
        <div>
          <router-link
            to="/leads"
            class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-ktexDark transition mt-2 text-sm"
            active-class="bg-ktexDark font-semibold"
            @click="$emit('closeSidebar')"
          >
            <BriefcaseIcon class="w-6 h-6" />
            <span v-if="!collapsed">Lead Management</span>
          </router-link>
        </div>


        <!-- Add more links here -->
      </nav>

      <div class="p-4 border-t border-ktexDark">
        <button
          @click="logout"
          class="w-full bg-mint hover:bg-mint-dark rounded py-2 font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 text-sm"
        >
          <span v-if="!collapsed">Logout</span>
          <ArrowRightOnRectangleIcon class="w-6 h-6" v-else />
        </button>
      </div>

    </aside>
  </div>
</template>

<script>
import { 
  HomeIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  LockClosedIcon,
  BriefcaseIcon,
} from '@heroicons/vue/24/outline'

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
    LockClosedIcon,
    BriefcaseIcon,
  },
  data() {
    return {
      userMenuOpen: false,
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken')
      this.$router.push('/login')
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
    },
  },
}
</script>
<style scoped>
.bg-mint {
  background-color: #0F4B3E;
  color: #ffffff; /* dark mint text */
}
.bg-mint-dark:hover {
  background-color: #7DD3B2;
  color: #0F4B3E;
}
/* in your main.css */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
