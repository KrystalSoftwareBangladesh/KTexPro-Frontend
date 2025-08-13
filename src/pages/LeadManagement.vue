<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Lead Management</h1>

    <!-- Tabs -->
    <div class="flex space-x-4 border-b border-gray-200 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-4 py-2 font-medium',
          activeTab === tab.key
            ? 'border-b-2 border-ktexDark text-ktexDark'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div>
      <div v-if="activeTab === 'all'">
        <AllLeads />
      </div>
      <div v-else-if="activeTab === 'my'">
        <MyLeads />
      </div>
      <div v-else-if="activeTab === 'converted'">
        <ConvertedLeads />
      </div>
      <div v-else-if="activeTab === 'lost'">
        <LostLeads />
      </div>
    </div>
  </div>
</template>

<script>
import AllLeads from '@/components/leads/AllLeads.vue'
import MyLeads from '@/components/leads/MyLeads.vue'
import ConvertedLeads from '@/components/leads/ConvertedLeads.vue'
import LostLeads from '@/components/leads/LostLeads.vue'

export default {
  name: 'LeadManagement',
  components: {
    AllLeads,
    MyLeads,
    ConvertedLeads,
    LostLeads
  },
  data() {
    return {
      activeTab: 'all',
      tabs: [
        { key: 'all', label: 'All Leads' },
        { key: 'my', label: 'My Leads' },
        { key: 'converted', label: 'Converted' },
        { key: 'lost', label: 'Lost' }
      ]
    }
  }
}
</script>
