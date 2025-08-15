<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Lead Management</h1>

    <!-- Tabs -->
    <div class="flex space-x-4 border-b border-gray-200 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[activeTab === tab.key ? 'border-b-2 border-ktexDark text-ktexDark' : 'text-gray-500 hover:text-gray-700', 'px-4 py-2 font-medium']"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <LeadTable
      v-if="activeTab === 'all'"
      :leads="leads"
      title="All Leads"
      @update-leads="leads = $event"
    />

    <LeadTable
      v-else-if="activeTab === 'my'"
      :leads="leads"
      :current-user="currentUser"
      title="My Leads"
      @update-leads="leads = $event"
    />

    <LeadTable
      v-else-if="activeTab === 'converted'"
      :leads="leads"
      filter-status="Converted"
      :show-status-filter="false"
      title="Converted Leads"
      @update-leads="leads = $event"
    />

    <LeadTable
      v-else-if="activeTab === 'lost'"
      :leads="leads"
      filter-status="Lost"
      :show-status-filter="false"
      title="Lost Leads"
      @update-leads="leads = $event"
    />
  </div>
</template>

<script>
import LeadTable from '@/components/leads/LeadTable.vue'

export default {
  name: 'LeadManagement',
  components: { LeadTable },
  data() {
    return {
      activeTab: 'all',
      currentUser: 'Admin', // example logged-in user
      tabs: [
        { key: 'all', label: 'All Leads' },
        { key: 'my', label: 'My Leads' },
        { key: 'converted', label: 'Converted' },
        { key: 'lost', label: 'Lost' }
      ],
      leads: [
        { id: 1, name: 'John Doe', company: 'ABC Ltd', contact: '123456789', status: 'New', owner: 'Admin', created_at: '2025-08-15' },
        { id: 2, name: 'Jane Smith', company: 'XYZ Inc', contact: '987654321', status: 'In Progress', owner: 'User1', created_at: '2025-08-14' },
        { id: 3, name: 'Bob Lee', company: 'Tech Corp', contact: '555555555', status: 'Converted', owner: 'Admin', created_at: '2025-08-10' }
      ]
    }
  }
}
</script>
