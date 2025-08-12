<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-ktex">User Roles & Permissions</h2>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 w-full">
      <button
        class="w-full md:w-auto px-4 py-2 bg-ktex text-white rounded hover:bg-ktexDark"
        @click="openCreateForm"
      >
        + Create New Role
      </button>

      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search roles..."
        class="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-ktex"
      />
    </div>

    <div class="w-full overflow-x-auto">
      <table
        class="w-full border-collapse border-spacing-0 divide-y divide-gray-200 sm:table block"
      >
        <thead class="hidden sm:table-header-group bg-ktex/10">
          <tr class="bg-gradient-to-r from-ktex/10 to-ktex/5">
            <th class="px-6 py-3 text-left text-xs font-medium text-ktex uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-ktex uppercase tracking-wider">Permissions</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-ktex uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200 sm:table-row-group block">
          <tr
            v-for="role in paginatedRoles"
            :key="role.id"
            class="hover:bg-gray-50 sm:table-row flex flex-col sm:flex-row sm:items-center sm:justify-between border-b sm:border-0"
          >
            <td class="px-6 py-4 text-sm text-gray-900 sm:whitespace-nowrap">{{ role.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <ul class="list-disc pl-5 space-y-1">
                <li v-for="perm in role.permissions" :key="perm">{{ perm }}</li>
              </ul>
            </td>
            <td class="px-6 py-4 text-sm font-medium flex flex-col sm:flex-row gap-2 justify-center">
              <!-- Edit button -->
              <button
                class="flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                @click="openEditForm(role)"
              >
                <!-- Pencil Icon -->
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5h2m-6 4h8m-8 4h8m-6 4h4m1.293-13.293a1 1 0 011.414 0l2.586 2.586a1 1 0 010 1.414l-9.293 9.293a1 1 0 01-.39.242l-4 1a1 1 0 01-1.263-1.263l1-4a1 1 0 01.242-.39l9.293-9.293z"/>
                </svg>
                Edit
              </button>

              <!-- Delete button -->
              <button
                class="flex items-center gap-1 text-red-600 hover:text-red-900"
                @click="deleteRole(role.id)"
              >
                <!-- Trash Icon -->
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4m16 0h-4"/>
                </svg>
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="filteredRoles.length === 0" class="sm:table-row block">
            <td colspan="3" class="text-center px-6 py-4 text-gray-500">No roles found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination controls -->
    <div class="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-center sm:text-left">

      <!-- Info text -->
      <div class="text-sm order-2 sm:order-1">
        Showing <span class="font-semibold">{{ startRole + 1 }}</span>
        to <span class="font-semibold">{{ endRole }}</span>
        of <span class="font-semibold">{{ filteredRoles.length }}</span> roles
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
      <div class="bg-white rounded shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingRole ? 'Edit Role' : 'Create Role' }}
        </h3>

        <form @submit.prevent="saveRole" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium" for="roleName">Role Name</label>
            <input
              id="roleName"
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">Permissions</label>
            <div class="flex flex-col space-y-2 max-h-48 overflow-auto border rounded p-3">
              <label
                v-for="perm in allPermissions"
                :key="perm"
                class="inline-flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="perm"
                  v-model="form.permissions"
                />
                <span>{{ perm }}</span>
              </label>
            </div>
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
  name: 'UserRoles',
  data() {
    return {
      roles: [
        {
          id: 1,
          name: 'Admin',
          permissions: [
            'Full access to all resources',
          ],
        },
        {
          id: 2,
          name: 'Sales',
          permissions: [
            'Manage own leads/contacts',
          ],
        },
        {
          id: 3,
          name: 'Marketing',
          permissions: [
            'View marketing campaigns',
          ],
        },
        {
          id: 4,
          name: 'Merchandiser',
          permissions: [
            'View assigned leads/contacts',
            'Add follow-ups',
          ],
        },
      ],
      allPermissions: [
        'Full access to all resources',
        'Manage own leads/contacts',
        'View marketing campaigns',
        'View assigned leads/contacts',
        'Add follow-ups',
      ],
      showForm: false,
      editingRole: null,
      form: {
        name: '',
        permissions: [],
      },
      searchQuery: '',
      currentPage: 1,
      rolesPerPage: 5,
    }
  },
  computed: {
    filteredRoles() {
      if (!this.searchQuery) return this.roles
      const q = this.searchQuery.toLowerCase()
      return this.roles.filter(role =>
        role.name.toLowerCase().includes(q) ||
        role.permissions.some(perm => perm.toLowerCase().includes(q))
      )
    },
    totalPages() {
      return Math.ceil(this.filteredRoles.length / this.rolesPerPage)
    },
    paginatedRoles() {
      const start = (this.currentPage - 1) * this.rolesPerPage
      return this.filteredRoles.slice(start, start + this.rolesPerPage)
    },
    startRole() {
      return (this.currentPage - 1) * this.rolesPerPage
    },
    endRole() {
      return Math.min(this.startRole + this.rolesPerPage, this.filteredRoles.length)
    },
  },
  methods: {
    openCreateForm() {
      this.editingRole = null
      this.form = { name: '', permissions: [] }
      this.showForm = true
    },
    openEditForm(role) {
      this.editingRole = role
      this.form = { name: role.name, permissions: [...role.permissions] }
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
      this.editingRole = null
    },
    saveRole() {
      if (this.editingRole) {
        const idx = this.roles.findIndex(r => r.id === this.editingRole.id)
        if (idx !== -1) {
          this.roles.splice(idx, 1, { id: this.editingRole.id, ...this.form })
        }
      } else {
        const newId = this.roles.length ? Math.max(...this.roles.map(r => r.id)) + 1 : 1
        this.roles.push({ id: newId, ...this.form })
      }
      this.closeForm()
    },
    deleteRole(id) {
      if (confirm('Are you sure you want to delete this role?')) {
        this.roles = this.roles.filter(r => r.id !== id)
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
  /* Optional mobile modal improvements */
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
