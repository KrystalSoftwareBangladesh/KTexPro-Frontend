<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-ktex">User Management</h2>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 w-full">
      <button
        class="w-full md:w-auto px-4 py-2 bg-ktex text-white rounded hover:bg-ktexDark"
        @click="openCreateForm"
      >
        + Create New User
      </button>

      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search users..."
        class="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-ktex"
      />
    </div>


    <div class="w-full overflow-x-auto">
      <table
        class="w-full border-collapse border-spacing-0 divide-y divide-gray-200 sm:table block"
      >
        <thead class="hidden sm:table-header-group bg-ktex/10">
          <tr class="bg-gradient-to-r from-ktex/10 to-ktex/5">
            <th class="px-6 py-3 text-left text-xs font-medium text-ktex uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-ktex uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-ktex uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-ktex uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200 sm:table-row-group block">
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="hover:bg-gray-50 sm:table-row flex flex-col sm:flex-row sm:items-center sm:justify-between border-b sm:border-0"
          >
            <td class="px-6 py-4 text-sm text-gray-900 sm:whitespace-nowrap">{{ user.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 break-words">{{ user.email }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ user.role }}</td>
            <td class="px-6 py-4 text-sm font-medium flex flex-col sm:flex-row gap-2 justify-center">
            <!-- Edit button -->
            <button 
              class="flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
              @click="openEditForm(user)"
            >
              <!-- Heroicon Pencil -->
              <svg xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11 5h2m-6 4h8m-8 4h8m-6 4h4m1.293-13.293a1 1 0 011.414 0l2.586 2.586a1 1 0 010 1.414l-9.293 9.293a1 1 0 01-.39.242l-4 1a1 1 0 01-1.263-1.263l1-4a1 1 0 01.242-.39l9.293-9.293z" />
              </svg>
              Edit
            </button>

            <!-- Delete button -->
            <button 
              class="flex items-center gap-1 text-red-600 hover:text-red-900"
              @click="deleteUser(user.id)"
            >
              <!-- Heroicon Trash -->
              <svg xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4m16 0h-4" />
              </svg>
              Delete
            </button>
          </td>

          </tr>
          <tr v-if="filteredUsers.length === 0" class="sm:table-row block">
            <td colspan="4" class="text-center px-6 py-4 text-gray-500">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination controls -->
    <div class="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-center sm:text-left">
      
      <!-- Info text -->
      <div class="text-sm order-2 sm:order-1">
        Showing <span class="font-semibold">{{ startUser + 1 }}</span>
        to <span class="font-semibold">{{ endUser }}</span>
        of <span class="font-semibold">{{ filteredUsers.length }}</span> users
      </div>

      <!-- Pagination -->
      <nav class="order-1 sm:order-2 flex justify-center sm:justify-end">
        <ul class="inline-flex items-center -space-x-px">
          <!-- Prev -->
          <li>
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >‹</button>
          </li>

          <!-- Pages -->
          <li v-for="page in totalPages" :key="page">
            <button
              @click="changePage(page)"
              :class="[
                'px-3 py-2 border text-sm font-medium',
                currentPage === page
                  ? 'bg-ktex text-white border-ktex'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >{{ page }}</button>
          </li>

          <!-- Next -->
          <li>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >›</button>
          </li>
        </ul>
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
  @media (max-width: 576px) {
        .modal-dialog {
            margin: 10px;
            max-width: 100%;
        }
        .modal-content {
            border-radius: 12px;
            box-shadow: 0px 4px 15px rgba(0,0,0,0.2);
        }
        .form-control {
            font-size: 16px; /* Bigger tap targets */
            padding: 10px;
        }
        .modal-header {
            padding: 15px;
        }
        .modal-footer {
            padding: 10px 15px;
        }
        .btn {
            padding: 10px;
            font-size: 16px;
            width: 100%; /* Full width buttons for mobile */
        }
    }
</style>
