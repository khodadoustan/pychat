<template>
  <div :class="cls" @mouseover.passive="removeUnread">
    <chat-message :message="message" />
    <template v-if="message.transfer">
      <app-progress-bar
        v-if="message.transfer.upload && !message.transfer.error"
        :upload="message.transfer.upload"
      />
      <i
        v-else-if="filesExist"
        class="icon-repeat"
        @click="retry"
      >{{ message.transfer.error }}</i>
    </template>
    <div class="spinner" v-if="message.sending" />
  </div>
</template>
<script lang="ts">
import { State } from '@/ts/instances/storeInstance';
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator';
import ChatMessage from '@/vue/chat/ChatMessage.vue';
import AppProgressBar from '@/vue/ui/AppProgressBar.vue';

import { SetMessageProgressError } from '@/ts/types/types';
import {
  CurrentUserInfoModel,
  MessageModel,
  RoomDictModel
} from '@/ts/types/model';

@Component({
  components: {AppProgressBar, ChatMessage}
})
export default class ChatSendingMessage extends Vue {
  @Prop() public message!: MessageModel;

  @State
  public readonly userInfo!: CurrentUserInfoModel;
  @State
  public readonly roomsDict!: RoomDictModel;

  get searchedIds() {
    return this.roomsDict[this.message.roomId].search.searchedIds;
  }

  get filesExist() {
    return this.message.files && Object.keys(this.message.files).length > 0;
  }

  get id() {
    return this.message.id;
  }

  removeUnread() {
    if (this.message.isHighlighted) {
      this.$store.markMessageAsRead({messageId: this.message.id, roomId: this.message.roomId})
    }
  }

  get cls() {
    return {
      sendingMessage: this.message.transfer && !this.message.transfer.upload,
      uploadMessage: this.message.transfer && !!this.message.transfer.upload,
      'filter-search': this.searchedIds.indexOf(this.message.id) >= 0,
      'message-self': this.isSelf,
      'message-others': !this.isSelf,
      'removed-message': this.message.deleted,
      'unread-message': this.message.isHighlighted,
    };
  }

  get isSelf() {
    return this.message.userId === this.userInfo.userId;
  }

  public retry() {
    const newVar: SetMessageProgressError = {
      messageId: this.message.id,
      roomId: this.message.roomId,
      error: null
    };
    this.$store.setMessageProgressError(newVar);
    this.$messageSenderProxy.getMessageSender(this.message.roomId).syncMessage(this.message.roomId, this.id);
    this.$store.growlInfo('Trying to upload files again');
  }
}
</script>

<style lang="sass" scoped>

  @import "~@/assets/sass/partials/mixins"

  .sendingMessage
    position: relative
    > p
      padding-right: 30px

  .unread-message:before
    content: ""
    background-color: #444444 !important
    border-radius: 5px
    position: absolute
    width: 100%
    height: 100%
    z-index: -1
    padding: 4px 0

  .spinner
    position: absolute
    right: 0
    top: 3px
    display: inline-block
    margin: -4px 10px -4px 10px
    @include spinner(3px, white)
  .icon-repeat
    display: block
    text-align: center
    cursor: pointer

</style>
