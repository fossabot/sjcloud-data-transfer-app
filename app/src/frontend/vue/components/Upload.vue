<template>
	<div class='row'>
		<div class='col-xs-4 left-panel-container'>
			<left-panel></left-panel>
		</div>
		<div id='upload-panel' class='col-xs-8 right-panel-container'>
			<div v-show='!transferComplete'>
				<nav-bar></nav-bar>
				<div class="alert-container" v-show="noProjectsFound">
					<img src="http://via.placeholder.com/175x175">
					<h3>Could not find any projects!</h3>
				</div>
				<file-status class="middle" v-show='hasTools && hasFiles'></file-status>
				<dropzone class="middle" v-show='hasTools && !hasFiles'></dropzone>

				<div class="bottom-bar" v-show="hasTools && hasFiles">
					<div class="bottom-bar-left"></div>
					<div class="bottom-bar-right">
						<button class='btn btn-primary btn-stjude download-btn'
									  v-bind:disabled='!hasFilesInStaging'
										@click='uploadFiles()'>
							Upload
						</button>
						<button class='btn btn-danger btn-stjude-warning delete-btn'
									  v-bind:disabled='!hasFilesInStaging'
										@click="removeCheckedFiles()"
										>
							Delete
						</button>
						<button class='btn btn-danger btn-stjude-warning cancel-btn'
						        v-bind:disabled='!hasFilesInTransit'
										@click="cancelCheckedFiles()">
							Cancel
						</button>
					</div>
				</div>
			</div>

			<div class="upload-complete-div" v-show='transferComplete && hasFiles'>
				<!-- _empty_tip_ prevents tippy destroy error -->
				<step-outcome 
					successMessage='Upload complete!' 
					outcome='done'></step-outcome>
				<div class="upload-complete-btn-div">
					<button id="ready-to-run-btn" 
                  class='btn btn-stjude'
					        v-show="currTool && currTool.isSJCPTool"
					        v-on:click="openExternal(currTool.SJCPToolURL)">
						<i class='material-icons open-in-browser-icon'>open_in_browser</i>
						READY TO RUN
					</button>
					<button id="upload-more-data-btn"
                  class='btn btn-stjude' 
                  v-on:click='removeAllFiles'>
						<i class='material-icons cloud-upload-icon'>cloud_upload</i>
						UPLOAD MORE DATA
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import LeftPanel from "./LeftPanel.vue";
import NavBar from "./NavBar.vue";
import FileStatus from "./FileStatus.vue";
import UploadTarget from "./UploadTarget.vue";
import Dropzone from "./Dropzone.vue";
import StepOutcome from "./StepOutcome.vue";

export default {
  components: {
    LeftPanel,
    NavBar,
    FileStatus,
    UploadTarget,
    Dropzone,
    StepOutcome
  },
  data() {
    return {};
  },
  computed: {
    currTool() {
      return this.$store.getters.currTool;
    },
    noProjectsFound() {
      return this.$store.getters.noProjectsFound;
    },
    hasFiles() {
      return this.$store.getters.currFiles.length;
    },
    hasFilesInStaging() {
      return this.$store.getters.hasFilesInStaging;
    },
    hasFilesInTransit() {
      return this.$store.getters.hasFilesInTransit;
    },
    hasTools() {
      return this.$store.getters.tools.length;
    },
    checkedFiles() {
      return this.$store.getters.checkedFiles;
    },
    transferComplete() {
      return this.$store.getters.transferComplete;
    }
  },
  mounted() {
    this.$store.commit("setInfoTipText", "");
  },
  methods: {
    openExternal(url) {
      this.$root.backend.utils.openExternal(url);
    },
    uploadFiles() {
      const files = this.$store.getters.currTool.upload.filter(f => f.checked);
      const dnanexusProjectId = this.$store.getters.currTool.dx_location;
      const concurrency = this.$store.getters.concurrentOperations;
      
      console.log(
        "Uploading",
        files.length,
        "files with a concurrency of",
        concurrency
      );

      files.forEach(file => {
        this.$root.backend.utils.resetFileStatus(file);
        file.waiting = true;

        let task = {
          _rawFile: file,
          local_location: file.path,
          remote_location: dnanexusProjectId
        };

        this.$root.backend.queue.addUploadTask(task);
      });
    },
    removeCheckedFiles() {
      this.$store.commit("removeCheckedFiles");
    },
    removeAllFiles() {
      this.$store.commit("removeAllFiles");
      this.$store.dispatch("updateToolsFromRemote", true);
    },
    cancelCheckedFiles() {
      this.$store.commit("cancelCheckedFiles");
    }
  }
};
</script>

<style scoped>
.left-panel-container {
  font-family: "Open Sans";
}

.right-panel-container {
  height: 570px;
  font-family: "Lato";
}

.alert-container {
  margin-top: 90px;
  text-align: center;
}

.bottom-bar-right button {
  margin: 2px;
}

.upload-complete-div {
  margin-top: 100px;
  text-align: center;
}

.upload-complete-btn-div {
  margin-top: 30px;
}

#ready-to-run-btn {
  margin-right: 24px;
  font-size: 22px;
}

.open-in-browser-icon {
  vertical-align: bottom;
  font-size: 28px;
}

#upload-more-data-btn {
  font-size: 22px;
}

.cloud-upload-icon {
  vertical-align: bottom;
  font-size: 28px;
  height: 30px;
  margin-right: 2px;
}
</style>
