<template>
  <div :class="mainClass">
    <chat-message-header
      :time="receivingFile.time"
      :user-id="receivingFile.userId"
    />
    <receiving-file-info
      :receiving-file="receivingFile"
    />
    <app-progress-bar
      v-if="showProgress"
      class="progress-wrap-file"
      :upload="receivingFile.upload"
    />
    <div
      v-if="showYesNo"
      class="yesNo"
    >
      <input
        type="button"
        value="Accept"
        class="green-btn"
        @click="accept"
      >
      <input
        type="button"
        value="Decline"
        class="red-btn"
        @click="decline"
      >
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator';
import { State } from '@/ts/instances/storeInstance';
import {
  FileTransferStatus,
  ReceivingFile
} from '@/ts/types/model';
import AppProgressBar from '@/vue/ui/AppProgressBar.vue';
import ChatMessageHeader from '@/vue/chat/ChatMessageHeader.vue';
import ReceivingFileInfo from '@/vue/chat/ReceivingFileInfo.vue';


@Component({
  components: {ReceivingFileInfo, ChatMessageHeader, AppProgressBar}
})
export default class ChatReceivingFile extends Vue {
  @Prop() public receivingFile!: ReceivingFile;
  @State
  public readonly myId!: number;

  get showYesNo(): boolean {
    return this.receivingFile.status === FileTransferStatus.NOT_DECIDED_YET;
  }


  get showProgress(): boolean {
    return FileTransferStatus.IN_PROGRESS === this.receivingFile.status;
  }

  get mainClass(): string {
    if (this.receivingFile.userId === this.myId) {
      return 'message-self';
    } else {
      return 'message-others';
    }
  }

  public accept() {
    this.$webrtcApi.acceptFile(this.receivingFile.connId, this.receivingFile.opponentWsId);
  }

  public decline() {
    this.$webrtcApi.declineFile(this.receivingFile.connId, this.receivingFile.opponentWsId);
  }

}
</script>

<style lang="sass" scoped>

  .progress-wrap-file /deep/ .progress-wrap
    width: calc(100% - 40px)
  .yesNo
    padding-top: 15px
    padding-bottom: 5px
    display: flex
    justify-content: space-around
    input[type=button]
      width: 100%
      &:first-child
        margin-right: 10px
</style>
