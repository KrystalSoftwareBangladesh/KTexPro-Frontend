<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar
      :collapsed="isCollapsed"
      :showSidebar="showSidebar"
      @closeSidebar="closeSidebarOnMobile"
    />

    <div
      class="flex-1 flex flex-col transition-margin duration-300"
      :class="{
        'md:ml-0': !isCollapsed,
        'md:ml-0': isCollapsed,
        'overflow-hidden': showSidebar, // prevent scrolling when mobile sidebar open
      }"
    >
      <Navbar
        :notificationsCount="notificationsCount"
        :messagesCount="messagesCount"
        :sidebarOpen="isCollapsed || showSidebar"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'DashboardLayout',
  components: { Sidebar, Navbar },
  data() {
    return {
      isCollapsed: false,  // desktop collapsed state
      showSidebar: false,  // mobile sidebar visibility
      notificationsCount: 3,
      messagesCount: 7,
    }
  },
  methods: {
    toggleSidebar() {
      if (window.innerWidth < 768) {
        this.showSidebar = !this.showSidebar
      } else {
        this.isCollapsed = !this.isCollapsed
      }
    },
    closeSidebarOnMobile() {
      if (window.innerWidth < 768) {
        this.showSidebar = false
      }
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        this.showSidebar = false
      }
    })
  },
}
</script>
