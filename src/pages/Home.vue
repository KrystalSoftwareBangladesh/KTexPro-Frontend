<template>
  <div>
    <h1 class="text-3xl font-bold text-[#7AA959] mb-6">Dashboard Overview</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        class="bg-green-50 p-6 rounded-lg shadow-md transition-colors duration-300 hover:bg-green-100"
      >
        <h3 class="text-green-700 mb-2">New Leads This Week</h3>
        <p class="text-4xl font-extrabold text-green-800">12</p>
      </div>
      <div
        class="bg-green-50 p-6 rounded-lg shadow-md transition-colors duration-300 hover:bg-green-100"
      >
        <h3 class="text-green-700 mb-2">Follow-ups Due Today</h3>
        <p class="text-4xl font-extrabold text-green-800">5</p>
      </div>
      <div
        class="bg-green-50 p-6 rounded-lg shadow-md transition-colors duration-300 hover:bg-green-100"
      >
        <h3 class="text-green-700 mb-2">Converted Leads This Month</h3>
        <p class="text-4xl font-extrabold text-green-800">8</p>
      </div>
    </div>
  </div>
</template>




<script>
export default {
  name: 'Home',
}
</script>
<style scoped>
/* Define smoother base colors */
.bg-ktexLight {
  background-color: #f0f5f9; /* light bluish-gray */
}
.bg-ktexLightHover {
  background-color: #e1e8ef; /* slightly darker on hover */
}
.text-ktexDark {
  color: #1e293b; /* dark slate */
}
</style>
