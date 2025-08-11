<template>
  <header class="h-16 bg-white shadow flex items-center justify-between px-6">
    <!-- Left: Collapse Sidebar Button -->
    <button
      @click="$emit('toggle-sidebar')"
      class="text-2xl focus:outline-none"
      aria-label="Toggle Sidebar"
    >
      <span v-if="sidebarOpen">✕</span>
      <span v-else>☰</span>
    </button>

    <!-- Right: Notification and Message icons -->
    <div class="flex items-center space-x-4 text-gray-600">
      <button
        class="relative focus:outline-none hover:text-ktex"
        aria-label="Notifications"
      >
        <BellIcon class="w-6 h-6" />
        <span
          v-if="notificationsCount > 0"
          class="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
        >
          {{ notificationsCount }}
        </span>
      </button>

      <button
        class="relative focus:outline-none hover:text-ktex"
        aria-label="Messages"
      >
        <ChatBubbleOvalLeftEllipsisIcon class="w-6 h-6" />
        <span
          v-if="messagesCount > 0"
          class="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
        >
          {{ messagesCount }}
        </span>
      </button>
    </div>
  </header>
</template>

<script>
import { BellIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Navbar',
  components: {
    BellIcon,
    ChatBubbleOvalLeftEllipsisIcon,
  },
  props: {
    notificationsCount: {
      type: Number,
      default: 0,
    },
    messagesCount: {
      type: Number,
      default: 0,
    },
    sidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
