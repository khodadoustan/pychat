<template>
  <div class="controls">
    <div class="spanHo">
      <span
        v-for="currentUser in valueUsers"
        :key="currentUser.id"
        class="spann"
      >{{ currentUser.user }}
        <i
          class="icon-cancel"
          @click="removeUser(currentUser.id)"
        />
      </span>
    </div>
    <template v-if="showAddUsersComp">
      <div>{{ text }}</div>
      <input
        v-model="search"
        type="search"
        class="input"
        placeholder="Search"
        title="Filter by username"
      >
      <ul>
        <li
          v-for="user in filteredUsers"
          :key="user.id"
          @click="addUser(user.id)"
        >
          {{ user.user }}
        </li>
      </ul>
    </template>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator';
import { UserModel } from '@/ts/types/model';
import { State } from '@/ts/instances/storeInstance';

@Component
export default class PickUser extends Vue {

  @Prop() public value!: number[];
  @Prop() public text!: string;
  @Prop() public usersIds!: number[];
  @Prop({default: true}) public showInviteUsers!: boolean;

  @State
  public readonly allUsersDict!: {[id: number]: UserModel} ;

  public search: string = '';

  get valueUsers(): UserModel[] {
    return this.value.map(id => this.allUsersDict[id]);
  }

  get displayedUserIds(): number[] {
    return this.usersIds.filter(a => this.value.indexOf(a) < 0);
  }

  get displayedUsers(): UserModel[] {
    return this.displayedUserIds.map(id => this.allUsersDict[id]);
  }

  get showAddUsersComp() {
    return this.showInviteUsers && this.displayedUserIds.length > 0;
  }

  get filteredUsers(): UserModel[] {
    this.$logger.debug('Reeval filter CreatePrivateRoom')();
    const s = this.search.toLowerCase();

    return this.displayedUsers.filter(u => u.user.toLowerCase().indexOf(s) >= 0);
  }

  public removeUser(id: number) {
    this.value.splice(this.value.indexOf(id), 1);
  }

  public addUser(id: number) {
    this.search = '';
    this.value.push(id);
  }
}
</script>

<style lang="sass" scoped>

  @import "~@/assets/sass/partials/abstract_classes"
  .spann
    @extend %hovered-user-room

  .controls
    display: flex
    flex-direction: column
    > *
      margin-bottom: 5px

  .icon-cancel
    cursor: pointer

  .color-reg .icon-cancel
      @include hover-click($red-cancel-reg)
  .color-lor .icon-cancel
    color: #a94442

  .spanHo
    max-width: 300px
    max-height: calc(50vh - 100px)
    overflow: auto

  ul
    min-height: 50px
    max-height: calc(50vh - 100px)
    margin-top: 5px
    overflow-y: scroll
    padding-left: 0

  li
    padding: 0 0 0 5px
    border-radius: 2px
    text-overflow: ellipsis
    overflow: hidden
    text-align: left
    white-space: nowrap
    @extend %hovered-user-room
</style>
