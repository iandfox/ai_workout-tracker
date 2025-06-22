<template>
  <div class="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-center text-blue-600">Workout Tracker</h1>
    </header>

    <div class="bg-white rounded-lg shadow p-4">
      <WorkoutForm 
        :workout-types="workoutTypes"
        :type-emojis="typeEmojis"
        @add-workout="handleAddWorkout"
        @show-backup="showBackupModal = true"
      />

      <WorkoutFilters
        :workouts="workouts"
        :workout-types="workoutTypes"
        :type-emojis="typeEmojis"
        v-model:filter-type="filterType"
        v-model:sort-option="sortOption"
      />

      <WorkoutList
        :workouts="workouts"
        :type-emojis="typeEmojis"
        :filter-type="filterType"
        :sort-option="sortOption"
        @mark-done="markWorkoutDone"
        @remove-workout="removeWorkout"
        @weight-changed="handleWeightChanged"
      />
    </div>
    
    <BackupModal
      v-model:show="showBackupModal"
      :workouts="workouts"
      :workout-types="workoutTypes"
      @import-workouts="handleImportWorkouts"
    />
  </div>
</template>

<script>
import WorkoutForm from './components/WorkoutForm.vue';
import WorkoutFilters from './components/WorkoutFilters.vue';
import WorkoutList from './components/WorkoutList.vue';
import BackupModal from './components/BackupModal.vue';

export default {
  name: 'App',
  components: {
    WorkoutForm,
    WorkoutFilters,
    WorkoutList,
    BackupModal
  },
  data() {
    return {
      workouts: [],
      workoutTypes: ['Arms', 'Legs', 'Back', 'Shoulders', 'Other'],
      typeEmojis: {
        Arms: '💪',
        Back: '🔙',
        Shoulders: '🍖',
        Legs: '🦵',
        Other: '🤷'
      },
      colorClasses: {
        Arms: 'tag-arms',
        Back: 'tag-back',
        Shoulders: 'tag-shoulders',
        Legs: 'tag-legs',
        Other: 'tag-other'
      },
      filterType: '',
      sortOption: 'alphabetical',
      showBackupModal: false,
    }
  },
  mounted() {
    console.log('App mounted');
    this.loadWorkouts();
    console.log('Workouts loaded:', this.workouts);
    
    // Add ids to any existing workouts that don't have them
    this.workouts = this.workouts.map(workout => {
      if (!workout.id) {
        workout.id = Date.now() + Math.floor(Math.random() * 1000);
      }
      if (!workout.type || !this.workoutTypes.includes(workout.type)) {
        workout.type = 'Arms'
      }
      return workout;
    });
    this.saveWorkouts();
    
    console.log('Initial state:', {
      workouts: this.workouts.length,
      filterType: this.filterType,
      sortOption: this.sortOption
    });
  },
  methods: {
    handleAddWorkout(workout) {
      console.log('Adding new workout', workout);
      const newWorkout = {
        id: Date.now(), // Unique ID for each workout
        name: workout.name,
        type: workout.type,
        weight: '',
        lastDate: null
      };

      // Make a copy of the workouts array and add the new workout
      this.workouts = [...this.workouts, newWorkout];
      this.saveWorkouts();
    },
    markWorkoutDone(workoutId) {
      const index = this.workouts.findIndex(w => w.id === workoutId);
      if (index !== -1) {
        this.workouts[index].lastDate = new Date().toISOString();
        this.saveWorkouts();
      }
    },
    removeWorkout(workoutId) {
      if (confirm('Are you sure you want to remove this workout?')) {
        const index = this.workouts.findIndex(w => w.id === workoutId);
        if (index !== -1) {
          this.workouts.splice(index, 1);
          this.saveWorkouts();
        }
      }
    },
    handleWeightChanged(workout) {
      this.saveWorkouts();
    },
    handleImportWorkouts(importedWorkouts) {
      this.workouts = importedWorkouts;
      this.saveWorkouts();
    },
    saveWorkouts() {
      console.log('Saving workouts', this.workouts);
      localStorage.setItem('workouts', JSON.stringify(this.workouts));
    },
    loadWorkouts() {
      console.log('Loading workouts from localStorage');
      const saved = localStorage.getItem('workouts');
      if (saved) {
        try {
          this.workouts = JSON.parse(saved);
          console.log('Workouts loaded successfully', this.workouts);
        } catch (e) {
          console.error('Error parsing workouts from localStorage', e);
          this.workouts = [];
        }
      } else {
        console.log('No saved workouts found');
      }
    }
  },
  computed: {
  }
}
</script>
