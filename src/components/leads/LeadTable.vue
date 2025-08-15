<template>
  <div class="p-4 bg-white shadow rounded">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <button
        @click="openModal('create')"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + New Lead
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="flex gap-4 mb-4 flex-wrap">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or company..."
        class="border p-2 rounded flex-1"
      />
      <select v-if="showStatusFilter" v-model="localFilterStatus" class="border p-2 rounded">
        <option value="">All Status</option>
        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
    </div>

    <!-- Leads Table -->
    <table class="min-w-full border bg-white">
      <thead class="bg-gray-100">
        <tr>
          <th class="py-2 px-4 border">Name</th>
          <th class="py-2 px-4 border">Company</th>
          <th class="py-2 px-4 border">Contact</th>
          <th class="py-2 px-4 border">Status</th>
          <th class="py-2 px-4 border">Owner</th>
          <th class="py-2 px-4 border">Created At</th>
          <th class="py-2 px-4 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in paginatedLeads" :key="lead.id" class="hover:bg-gray-50">
          <td class="py-2 px-4 border">{{ lead.name }}</td>
          <td class="py-2 px-4 border">{{ lead.company }}</td>
          <td class="py-2 px-4 border">{{ lead.contact }}</td>
          <td class="py-2 px-4 border">{{ lead.status }}</td>
          <td class="py-2 px-4 border">{{ lead.owner }}</td>
          <td class="py-2 px-4 border">{{ lead.created_at }}</td>
          <td class="py-2 px-4 border flex gap-2">
            <button @click="openModal('edit', lead)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
            <button @click="deleteLead(lead.id)" class="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
        <tr v-if="filteredLeads.length === 0">
          <td colspan="7" class="text-center py-4 text-gray-500">No leads found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-end gap-2">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ modalType === 'create' ? 'New Lead' : 'Edit Lead' }}</h3>
        <div class="flex flex-col gap-2">
          <input v-model="form.name" type="text" placeholder="Name" class="border p-2 rounded" />
          <input v-model="form.company" type="text" placeholder="Company" class="border p-2 rounded" />
          <input v-model="form.contact" type="text" placeholder="Contact" class="border p-2 rounded" />
          <select v-model="form.status" class="border p-2 rounded">
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </select>
          <input v-model="form.owner" type="text" placeholder="Owner" class="border p-2 rounded" />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="saveLead" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {{ modalType === 'create' ? 'Create' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeadTable',
  props: {
    leads: { type: Array, default: () => [] },
    currentUser: { type: String, default: '' },
    filterStatus: { type: String, default: '' },
    title: { type: String, default: 'Leads' },
    showStatusFilter: { type: Boolean, default: true }
  },
  data() {
    return {
      searchQuery: '',
      localFilterStatus: this.filterStatus, // local copy
      currentPage: 1,
      perPage: 5,
      showModal: false,
      modalType: 'create',
      form: { id: null, name: '', company: '', contact: '', status: 'New', owner: '' },
      statuses: ['New', 'In Progress', 'Follow-up', 'Converted', 'Lost']
    };
  },
  watch: {
    filterStatus(newVal) {
      this.localFilterStatus = newVal;
    }
  },
  computed: {
    filteredLeads() {
      if (!this.leads || this.leads.length === 0) return [];

      return this.leads.filter(lead => {
        const matchesSearch = this.searchQuery
          ? lead.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            lead.company.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;

        // Only filter by currentUser if it is set (for "My Leads")
        const matchesUser = this.currentUser ? lead.owner === this.currentUser : true;

        // Only filter by status if localFilterStatus is set (for Converted/Lost)
        const matchesStatus = this.localFilterStatus ? lead.status === this.localFilterStatus : true;

        return matchesSearch && matchesUser && matchesStatus;
      });
    },
    totalPages() {
      return Math.max(Math.ceil(this.filteredLeads.length / this.perPage), 1);
    },
    paginatedLeads() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredLeads.slice(start, start + this.perPage);
    }
  },
  methods: {
    openModal(type, lead = null) {
      this.modalType = type;
      this.form = lead
        ? { ...lead }
        : { id: null, name: '', company: '', contact: '', status: 'New', owner: this.currentUser || '' };
      this.showModal = true;
    },
    closeModal() { this.showModal = false; },
    saveLead() {
      const updatedLeads = [...this.leads];
      if (this.modalType === 'create') {
        const newLead = { ...this.form, id: Date.now(), created_at: new Date().toISOString().split('T')[0] };
        updatedLeads.push(newLead);
      } else {
        const index = updatedLeads.findIndex(l => l.id === this.form.id);
        if (index !== -1) updatedLeads.splice(index, 1, { ...this.form });
      }
      this.$emit('update-leads', updatedLeads);
      this.closeModal();
    },
    deleteLead(id) {
      if (confirm('Are you sure?')) {
        const updatedLeads = this.leads.filter(l => l.id !== id);
        this.$emit('update-leads', updatedLeads);
      }
    },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  }
};
</script>

