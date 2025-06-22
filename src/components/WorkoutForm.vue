<template>
  <div class="mb-4">
    <div class="flex items-center flex-grow">
      <input
        v-model="workoutName"
        @keyup.enter="addWorkout"
        placeholder="Add new workout..."
        class="input flex-grow mr-2"
        type="text"
      />
      <div class="grid grid-cols-3 gap-1 mr-2" style="max-width: 180px">
        <button
          v-for="type in workoutTypes"
          :key="type"
          @click="selectedType = type"
          :class="['px-2 py-1.5 text-xs rounded border flex flex-col items-center', selectedType === type ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300']"
          type="button"
        >
          <span class="text-base mb-0.5">{{ typeEmojis[type] }}</span>
          <span class="truncate w-full text-center">{{ type }}</span>
        </button>
      </div>
      <button type="button" @click="addWorkout" class="btn btn-primary">Add</button>
    </div>
    
    <div class="flex mt-2 justify-end">
      <button @click="$emit('show-backup')" class="text-sm text-blue-500 hover:text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        Backup/Restore
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutForm',
  props: {
    workoutTypes: {
      type: Array,
      required: true
    },
    typeEmojis: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      workoutName: '',
      selectedType: 'Arms'
    }
  },
  methods: {
    addWorkout() {
      if (this.workoutName.trim()) {
        this.$emit('add-workout', {
          name: this.workoutName.trim(),
          type: this.selectedType
        });
        this.workoutName = '';
      }
    }
  }
}
</script>