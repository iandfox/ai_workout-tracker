<template>
  <div class="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-center text-blue-600">Workout Tracker</h1>
    </header>

    <div class="bg-white rounded-lg shadow p-4">
      <div class="mb-4">
        <div class="flex items-center flex-grow">
          <input
            v-model="newWorkoutName"
            @keyup.enter="addWorkout"
            placeholder="Add new workout..."
            class="input flex-grow mr-2"
            type="text"
          />
          <div class="grid grid-cols-3 gap-1 mr-2" style="max-width: 180px">
            <button
              v-for="type in workoutTypes"
              :key="type"
              @click="newWorkoutType = type"
              :class="['px-2 py-1.5 text-xs rounded border flex flex-col items-center', newWorkoutType === type ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300']"
              type="button"
            >
              <span class="text-base mb-0.5">{{ typeEmojis[type] }}</span>
              <span class="truncate w-full text-center">{{ type }}</span>
            </button>
          </div>
          <button type="button" @click="addWorkout" class="btn btn-primary">Add</button>
        </div>
        
        <div class="flex mt-2 justify-end">
          <button @click="showBackupModal = true" class="text-sm text-blue-500 hover:text-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            Backup/Restore
          </button>
        </div>
      </div>

      <div v-if="workouts.length > 0" class="mb-4 border border-gray-200 rounded-md">
        <button 
          @click="showFilters = !showFilters" 
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
              @click="filterType = ''"
              :class="['px-2 py-1 text-xs rounded border', filterType === '' ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300']"
              type="button"
            >
              All
            </button>
            <button
              v-for="type in usedWorkoutTypes"
              :key="type"
              @click="filterType = type"
              :class="['px-2 py-1.5 text-xs rounded border flex flex-col items-center', filterType === type ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300']"
              type="button"
            >
              <span class="text-base mb-0.5">{{ typeEmojis[type] }}</span>
              <span class="truncate w-full text-center">{{ type }}</span>
            </button>
          </div>
          
          <div class="flex flex-wrap gap-2 items-center">
            <span class="text-sm font-medium">Sort by:</span>
            <select v-model="sortOption" class="input text-sm" style="max-width: 150px">
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
                  @change="saveWorkouts"
                />
              </td>
              <td class="py-3 px-4">
                {{ workout.lastDate ? formatDate(workout.lastDate) : 'Never' }}
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="markWorkoutDone(index)"
                  class="btn btn-success text-sm py-1 px-3">
                  Done Today
                </button>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="removeWorkout(index)"
                  class="text-red-500 hover:text-red-700 transition-colors">
                  ✕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Backup/Restore Modal -->
    <div v-if="showBackupModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">Backup & Restore Data</h3>
        </div>
        
        <div class="p-4">
          <div class="mb-4">
            <h4 class="font-medium mb-2">Export Data</h4>
            <p class="text-sm text-gray-600 mb-2">Copy this data and save it somewhere safe:</p>
            <div class="relative">
              <textarea 
                ref="exportDataField"
                v-model="exportData" 
                class="w-full h-32 p-2 border rounded font-mono text-xs" 
                readonly
              ></textarea>
              <button 
                @click="copyToClipboard" 
                class="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded p-1"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
            <div v-if="copySuccess" class="text-green-600 text-sm mt-1">
              Copied to clipboard!
            </div>
          </div>
          
          <div>
            <h4 class="font-medium mb-2">Import Data</h4>
            <p class="text-sm text-gray-600 mb-2">Paste your backup data here:</p>
            <textarea 
              v-model="importData" 
              class="w-full h-32 p-2 border rounded font-mono text-xs"
              placeholder="Paste your backup data here..."
            ></textarea>
            <div class="mt-2 flex justify-between items-center">
              <div v-if="importError" class="text-red-600 text-sm">
                {{ importError }}
              </div>
              <div v-if="importSuccess" class="text-green-600 text-sm">
                Data imported successfully!
              </div>
              <button 
                @click="importWorkouts" 
                class="btn btn-primary text-sm py-1 px-3 ml-auto"
              >
                Import
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t bg-gray-50 flex justify-end">
          <button @click="showBackupModal = false" class="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      workouts: [],
      newWorkoutName: '',
      newWorkoutType: 'General',
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
      showFilters: false,
      showBackupModal: false,
      exportData: '',
      importData: '',
      copySuccess: false,
      importSuccess: false,
      importError: '',
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
    
    // Prepare export data
    this.updateExportData();

    // Ensure we have a default workout type selected
    if (!this.newWorkoutType || !this.workoutTypes.includes(this.newWorkoutType)) {
      this.newWorkoutType = 'Arms';
    }
    console.log('Initial state:', {
      workouts: this.workouts.length,
      newWorkoutType: this.newWorkoutType,
      filterType: this.filterType,
      sortOption: this.sortOption
    });
  },
  methods: {
    getSortLabel(option) {
      switch(option) {
        case 'alphabetical': return 'Sort: A-Z';
        case 'type': return 'Sort: By Type';
        case 'recent': return 'Sort: Most Recent';
        case 'oldest': return 'Sort: Oldest First';
        default: return 'Sort: A-Z';
      }
    },
    addWorkout() {
      console.log('addWorkout called', this.newWorkoutName, this.newWorkoutType);
      if (this.newWorkoutName.trim()) {
        console.log('Adding new workout');
        const newWorkout = {
          id: Date.now(), // Unique ID for each workout
          name: this.newWorkoutName.trim(),
          type: this.newWorkoutType || 'Arms',
          weight: '',
          lastDate: null
        };
        console.log('New workout object created', newWorkout);

        // Make a copy of the workouts array and add the new workout
        this.workouts = [...this.workouts, newWorkout];
        console.log('New workout added', this.workouts);
        this.newWorkoutName = '';
        this.saveWorkouts();
      } else {
        console.log('Workout name is empty, not adding');
      }
    },
    markWorkoutDone(index) {
      const workout = this.filteredWorkouts[index]
      const actualIndex = this.workouts.findIndex(w => w.id === workout.id)
      if (actualIndex !== -1) {
        this.workouts[actualIndex].lastDate = new Date().toISOString()
        this.saveWorkouts()
      }
    },
    removeWorkout(index) {
      const workout = this.filteredWorkouts[index]
      if (confirm('Are you sure you want to remove this workout?')) {
        const actualIndex = this.workouts.findIndex(w => w.id === workout.id)
        if (actualIndex !== -1) {
          this.workouts.splice(actualIndex, 1)
          this.saveWorkouts()
        }
      }
    },
    resetFilters() {
      this.filterType = ''
      this.sortOption = 'alphabetical'
    },
    saveWorkouts() {
      console.log('Saving workouts', this.workouts);
      localStorage.setItem('workouts', JSON.stringify(this.workouts));
      this.updateExportData();
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
    },
    updateExportData() {
      this.exportData = JSON.stringify(this.workouts, null, 2);
    },
    copyToClipboard() {
      const exportField = this.$refs.exportDataField;
      exportField.select();
      document.execCommand('copy');
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    },
    importWorkouts() {
      if (!this.importData.trim()) {
        this.importError = 'Please paste backup data';
        return;
      }
      
      try {
        const importedWorkouts = JSON.parse(this.importData);
        
        if (!Array.isArray(importedWorkouts)) {
          this.importError = 'Invalid data format. Expected an array.';
          return;
        }
        
        // Validate each workout
        const validWorkouts = importedWorkouts.filter(workout => {
          return workout && typeof workout === 'object' && 
                 workout.name && workout.id;
        });
        
        if (validWorkouts.length === 0) {
          this.importError = 'No valid workouts found in the data';
          return;
        }
        
        // Replace current workouts with imported ones
        this.workouts = validWorkouts;
        
        // Make sure all workouts have valid types
        this.workouts = this.workouts.map(workout => {
          if (!workout.type || !this.workoutTypes.includes(workout.type)) {
            workout.type = 'Arms';
          }
          return workout;
        });
        
        this.saveWorkouts();
        this.importSuccess = true;
        this.importError = '';
        setTimeout(() => {
          this.importSuccess = false;
        }, 3000);
      } catch (e) {
        console.error('Import error:', e);
        this.importError = 'Invalid JSON data';
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  computed: {
    usedWorkoutTypes() {
      // Get an array of workout types that are actually used
      const types = new Set(this.workouts.map(workout => workout.type));
      return this.workoutTypes.filter(type => types.has(type));
    },
    filteredWorkouts() {
      // First filter by type if needed
      let filtered = this.workouts
      if (this.filterType) {
        filtered = filtered.filter(workout => workout.type === this.filterType)
      }
      
      // Then sort according to the selected option
      return filtered.sort((a, b) => {
        switch (this.sortOption) {
          case 'alphabetical':
            return a.name.localeCompare(b.name)

          case 'type':
            // First sort by type, then by name
            if (a.type === b.type) {
              return a.name.localeCompare(b.name)
            }
            return a.type.localeCompare(b.type)

          case 'recent':
            // Put workouts with dates at the top, sorted by most recent
            if (!a.lastDate && !b.lastDate) return 0
            if (!a.lastDate) return 1
            if (!b.lastDate) return -1
            return new Date(b.lastDate) - new Date(a.lastDate)

          case 'oldest':
            // Put workouts with dates at the top, sorted by oldest first
            if (!a.lastDate && !b.lastDate) return 0
            if (!a.lastDate) return 1
            if (!b.lastDate) return -1
            return new Date(a.lastDate) - new Date(b.lastDate)

          default:
            return 0
        }
      })
    }
  }
}
</script>
