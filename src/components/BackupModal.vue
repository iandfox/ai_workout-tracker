<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
        <button @click="close" class="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 text-sm">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackupModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    workouts: {
      type: Array,
      required: true
    },
    workoutTypes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      exportData: '',
      importData: '',
      copySuccess: false,
      importSuccess: false,
      importError: ''
    }
  },
  watch: {
    workouts: {
      handler() {
        this.updateExportData();
      },
      deep: true
    },
    show(newVal) {
      if (newVal) {
        this.updateExportData();
        this.importData = '';
        this.importError = '';
        this.importSuccess = false;
        this.copySuccess = false;
      }
    }
  },
  methods: {
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
        
        // Make sure all workouts have valid types
        const processedWorkouts = validWorkouts.map(workout => {
          if (!workout.type || !this.workoutTypes.includes(workout.type)) {
            workout.type = 'Arms';
          }
          return workout;
        });
        
        this.$emit('import-workouts', processedWorkouts);
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
    close() {
      this.$emit('update:show', false);
    }
  }
}
</script>