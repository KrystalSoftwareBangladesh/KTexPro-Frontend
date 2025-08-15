<template>
  <div class="p-4 bg-white shadow rounded">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">My Leads</h2>
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
      <select v-model="filterStatus" class="border p-2 rounded">
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
          <td class="py-2 px-4 border">{{ lead.created_at }}</td>
          <td class="py-2 px-4 border flex gap-2">
            <button @click="openModal('edit', lead)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
            <button @click="deleteLead(lead.id)" class="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
        <tr v-if="filteredLeads.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">No leads found.</td>
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
          <input v-bind="form.name" type="text" placeholder="Name" class="border p-2 rounded" />
          <input v-bind="form.company" type="text" placeholder="Company" class="border p-2 rounded" />
          <input v-bind="form.contact" type="text" placeholder="Contact" class="border p-2 rounded" />
          <select v-bind="form.status" class="border p-2 rounded">
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </select>
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
  name: 'MyLeads',
  data() {
    return {
      leads: [
        { id: 1, name: 'John Doe', company: 'ABC Ltd', contact: '123456789', status: 'New', created_at: '2025-08-15' },
        { id: 2, name: 'Jane Smith', company: 'XYZ Inc', contact: '987654321', status: 'In Progress', created_at: '2025-08-14' },
      ],
      statuses: ['New', 'In Progress', 'Follow-up', 'Converted', 'Lost'],
      searchQuery: '',
      filterStatus: '',
      currentPage: 1,
      perPage: 5,
      showModal: false,
      modalType: 'create',
      form: { id: null, name: '', company: '', contact: '', status: 'New' }
    };
  },
  computed: {
    filteredLeads() {
      return this.leads.filter(lead => {
        const matchesSearch = this.searchQuery
          ? lead.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            lead.company.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;
        const matchesStatus = this.filterStatus ? lead.status === this.filterStatus : true;
        return matchesSearch && matchesStatus;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredLeads.length / this.perPage);
    },
    paginatedLeads() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredLeads.slice(start, start + this.perPage);
    }
  },
  methods: {
    openModal(type, lead = null) {
      this.modalType = type;
      this.form = lead ? { ...lead } : { id: null, name: '', company: '', contact: '', status: 'New' };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveLead() {
      if (this.modalType === 'create') {
        const newLead = { ...this.form, id: Date.now(), created_at: new Date().toISOString().split('T')[0] };
        this.leads.push(newLead);
      } else {
        const index = this.leads.findIndex(l => l.id === this.form.id);
        if (index !== -1) this.leads.splice(index, 1, { ...this.form });
      }
      this.closeModal();
    },
    deleteLead(id) {
      if (confirm('Are you sure you want to delete this lead?')) {
        this.leads = this.leads.filter(l => l.id !== id);
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    }
  }
};
</script>
