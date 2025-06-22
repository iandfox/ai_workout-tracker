<template>
  <div v-if="filteredWorkouts.length === 0" class="text-center text-gray-500 py-6">
    No workouts added yet. Add your first workout above!
  </div>

  <div v-else class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="bg-gray-50 border-b">
          <th class="text-left py-3 px-4">Workout</th>
          <th class="text-left py-3 px-4">Type</th>
          <th class="text-left py-3 px-4">Last Weight</th>
          <th class="text-left py-3 px-4">Last Worked Out</th>
          <th class="text-center py-3 px-4">Actions</th>
          <th class="text-center py-3 px-4">Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(workout, index) in filteredWorkouts"
            :key="workout.id"
            class="border-b hover:bg-gray-50 transition-colors">
          <td class="py-3 px-4">{{ workout.name }}</td>
          <td class="py-3 px-4 text-sm">
            <span :class="['tag flex items-center gap-1', `tag-${workout.type.toLowerCase()}`]">
              <span>{{ typeEmojis[workout.type] }}</span>
              <span class="truncate">{{ workout.type }}</span>
            </span>
          </td>
          <td class="py-3 px-4">
            <input
              v-model="workout.weight"
              type="text"
              class="input w-full max-w-[120px]"
              placeholder="Weight"
              @change="weightChanged(workout)"
            />
          </td>
          <td class="py-3 px-4">
            {{ formatDate(workout.lastDate) }}
          </td>
          <td class="py-3 px-4 text-center">
            <button
              @click="$emit('mark-done', workout.id)"
              class="btn btn-success text-sm py-1 px-3">
              Done Today
            </button>
          </td>
          <td class="py-3 px-4 text-center">
            <button
              @click="$emit('remove-workout', workout.id)"
              class="text-red-500 hover:text-red-700 transition-colors">
              ✕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'WorkoutList',
  props: {
    workouts: {
      type: Array,
      required: true
    },
    typeEmojis: {
      type: Object,
      required: true
    },
    filterType: {
      type: String,
      default: ''
    },
    sortOption: {
      type: String,
      default: 'alphabetical'
    }
  },
  computed: {
    filteredWorkouts() {
      // First filter by type if needed
      let filtered = this.workouts;
      if (this.filterType) {
        filtered = filtered.filter(workout => workout.type === this.filterType);
      }
      
      // Then sort according to the selected option
      return filtered.sort((a, b) => {
        switch (this.sortOption) {
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          
          case 'type':
            // First sort by type, then by name
            if (a.type === b.type) {
              return a.name.localeCompare(b.name);
            }
            return a.type.localeCompare(b.type);
          
          case 'recent':
            // Put workouts with dates at the top, sorted by most recent
            if (!a.lastDate && !b.lastDate) return 0;
            if (!a.lastDate) return 1;
            if (!b.lastDate) return -1;
            return new Date(b.lastDate) - new Date(a.lastDate);
          
          case 'oldest':
            // Put workouts with dates at the top, sorted by oldest first
            if (!a.lastDate && !b.lastDate) return 0;
            if (!a.lastDate) return 1;
            if (!b.lastDate) return -1;
            return new Date(a.lastDate) - new Date(b.lastDate);
          
          default:
            return 0;
        }
      });
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Never';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    weightChanged(workout) {
      this.$emit('weight-changed', workout);
    }
  }
}
</script>