<template>
  <div v-if="workouts.length > 0" class="mb-4 border border-gray-200 rounded-md">
    <button 
      @click="toggleFilters" 
      class="w-full px-4 py-2 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
    >
      <span class="font-medium">Filters & Sorting</span>
      <span class="text-sm text-gray-500">
        {{ filterType ? `Type: ${filterType}` : 'All types' }} | 
        {{ getSortLabel(sortOption) }}
      </span>
      <svg 
        class="w-5 h-5 transform transition-transform" 
        :class="{ 'rotate-180': showFilters }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <div v-if="showFilters" class="p-4 border-t border-gray-200">
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="text-sm font-medium">Filter by type:</span>
        <button
          @click="updateFilterType('')"
          :class="['px-2 py-1 text-xs rounded border', filterType === '' ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300']"
          type="button"
        >
          All
        </button>
        <button
          v-for="type in usedWorkoutTypes"
          :key="type"
          @click="updateFilterType(type)"
          :class="['px-2 py-1.5 text-xs rounded border flex flex-col items-center', filterType === type ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300']"
          type="button"
        >
          <span class="text-base mb-0.5">{{ typeEmojis[type] }}</span>
          <span class="truncate w-full text-center">{{ type }}</span>
        </button>
      </div>
      
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm font-medium">Sort by:</span>
        <select 
          :value="sortOption" 
          @change="updateSortOption($event.target.value)" 
          class="input text-sm" 
          style="max-width: 150px"
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="type">By Type</option>
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button @click="resetFilters" class="ml-auto text-sm text-blue-500 hover:text-blue-700">
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutFilters',
  props: {
    workouts: {
      type: Array,
      required: true
    },
    workoutTypes: {
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
  data() {
    return {
      showFilters: false
    }
  },
  computed: {
    usedWorkoutTypes() {
      // Get an array of workout types that are actually used
      const types = new Set(this.workouts.map(workout => workout.type));
      return this.workoutTypes.filter(type => types.has(type));
    }
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    updateFilterType(type) {
      this.$emit('update:filterType', type);
    },
    updateSortOption(option) {
      this.$emit('update:sortOption', option);
    },
    resetFilters() {
      this.$emit('update:filterType', '');
      this.$emit('update:sortOption', 'alphabetical');
    },
    getSortLabel(option) {
      switch(option) {
        case 'alphabetical': return 'Sort: A-Z';
        case 'type': return 'Sort: By Type';
        case 'recent': return 'Sort: Most Recent';
        case 'oldest': return 'Sort: Oldest First';
        default: return 'Sort: A-Z';
      }
    }
  }
}
</script>