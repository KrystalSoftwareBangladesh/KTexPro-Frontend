<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-ktex">User Management</h2>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
      <button
        class="px-4 py-2 bg-ktex text-white rounded hover:bg-ktexDark"
        @click="openCreateForm"
      >
        + Create New User
      </button>

      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search users..."
        class="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-ktex"
      />
    </div>


    <div class="overflow-x-auto rounded-lg border border-gray-300">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
              <button
                class="text-indigo-600 hover:text-indigo-900"
                @click="openEditForm(user)"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                @click="deleteUser(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="text-center px-6 py-4 text-gray-500">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination controls -->
    <div class="mt-4 flex justify-between items-center">
      <div>
        Showing
        <span class="font-semibold">{{ startUser + 1 }}</span>
        to
        <span class="font-semibold">{{ endUser }}</span>
        of
        <span class="font-semibold">{{ filteredUsers.length }}</span> users
      </div>

      <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
            currentPage === page
              ? 'z-10 bg-ktex text-white border-ktex'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          aria-label="Next"
        >
          ›
        </button>
      </nav>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingUser ? 'Edit User' : 'Create User' }}
        </h3>

        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label class="block mb-1 font-medium" for="name">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium" for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium" for="role">Role</label>
            <select
              id="role"
              v-model="form.role"
              class="w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>Select role</option>
              <option>Admin</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Merchandiser</option>
            </select>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              class="px-4 py-2 rounded border"
              @click="closeForm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-ktex text-white rounded hover:bg-ktexDark"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      users: [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Sales' },
        { id: 3, name: 'Cathy Lee', email: 'cathy@example.com', role: 'Marketing' },
        { id: 4, name: 'David Kim', email: 'david@example.com', role: 'Merchandiser' },
        { id: 5, name: 'Eva Green', email: 'eva@example.com', role: 'Sales' },
        { id: 6, name: 'Frank Moore', email: 'frank@example.com', role: 'Admin' },
        // add more for testing pagination
        { id: 7, name: 'Grace Hall', email: 'grace@example.com', role: 'Marketing' },
        { id: 8, name: 'Henry Long', email: 'henry@example.com', role: 'Sales' },
        { id: 9, name: 'Isabel Diaz', email: 'isabel@example.com', role: 'Merchandiser' },
        { id: 10, name: 'Jackie Fox', email: 'jackie@example.com', role: 'Admin' },
        { id: 11, name: 'Karen Wright', email: 'karen@example.com', role: 'Marketing' },
      ],
      showForm: false,
      editingUser: null,
      form: {
        name: '',
        email: '',
        role: '',
      },
      searchQuery: '',
      currentPage: 1,
      usersPerPage: 5,
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users
      const q = this.searchQuery.toLowerCase()
      return this.users.filter(
        user =>
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.role.toLowerCase().includes(q)
      )
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.usersPerPage)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.usersPerPage
      return this.filteredUsers.slice(start, start + this.usersPerPage)
    },
    startUser() {
      return (this.currentPage - 1) * this.usersPerPage
    },
    endUser() {
      return Math.min(this.startUser + this.usersPerPage, this.filteredUsers.length)
    },
  },
  methods: {
    openCreateForm() {
      this.editingUser = null
      this.form = { name: '', email: '', role: '' }
      this.showForm = true
    },
    openEditForm(user) {
      this.editingUser = user
      this.form = { ...user }
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
      this.editingUser = null
    },
    saveUser() {
      if (this.editingUser) {
        const index = this.users.findIndex(u => u.id === this.editingUser.id)
        if (index !== -1) {
          this.users.splice(index, 1, { ...this.form, id: this.editingUser.id })
        }
      } else {
        const newId = this.users.length
          ? Math.max(...this.users.map(u => u.id)) + 1
          : 1
        this.users.push({ ...this.form, id: newId })
      }
      this.closeForm()
    },
    deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.users = this.users.filter(u => u.id !== id)
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
  },
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
