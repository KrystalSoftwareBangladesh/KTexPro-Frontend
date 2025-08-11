<template>
  <div>
    <h1 class="text-3xl font-bold text-ktex mb-6">Dashboard Overview</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-gray-500">New Leads This Week</h3>
        <p class="text-2xl font-bold text-ktex">12</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-gray-500">Follow-ups Due Today</h3>
        <p class="text-2xl font-bold text-ktex">5</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-gray-500">Converted Leads This Month</h3>
        <p class="text-2xl font-bold text-ktex">8</p>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: 'Home',
}
</script>

