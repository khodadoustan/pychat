<template>
  <div class="top-div">
    <form
        class="holder"
        v-if="channel"
        @submit.prevent="apply"
    >
      <table>
        <tbody>
        <tr>
          <th>
            Name
          </th>
          <td>
            <input
                v-model="channelName"
                type="text"
                required="true"
                class="input"
                maxlength="16"
            >
          </td>
        </tr>
        <tr>
          <th>Admin</th>
          <td v-if="isAdmin">
            <pick-user
                v-model="admin"
                :show-invite-users="showInviteUsers"
                :users-ids="userIds"
            />
          </td>
          <td v-else-if="currentAdmin">
            {{currentAdmin.user}}
          </td>
              <!-- TODO remove fallback in future-->
          <td v-else>
            This channel doesnt have an admin
          </td>
        </tr>
        <tr v-if="noRooms && isAdmin">
          <td colspan="2">
            <app-submit
                type="button"
                class="red-btn"
                value="DELETE THIS CHANNEL"
                :running="running"
                @click.native="deleteChannel"
            />
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <app-submit
                value="APPLY SETTINGS"
                class="green-btn"
                :running="running"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </form>
    <div v-else>
      Channel #{{ channelId }} doesn't exist
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {ChannelsDictUIModel, ChannelUIModel, CurrentUserInfoModel, UserModel} from '@/ts/types/model';
import {ApplyGrowlErr, State} from '@/ts/instances/storeInstance';
import AppSubmit from '@/vue/ui/AppSubmit.vue';
import PickUser from '@/vue/pages/parts/PickUser.vue';

@Component({
    components: {PickUser, AppSubmit}
  })
  export default class ChannelSettings extends Vue {

    public running: boolean = false;

    public channelName!: string;

    public admin: number[] = [];

    @State
    public readonly userInfo!: CurrentUserInfoModel;

    @State
    public readonly allUsersDict!: {[id: number]: UserModel} ;

    @State
    public readonly channelsDictUI!: ChannelsDictUIModel;

    get channel(): ChannelUIModel {
      return this.channelsDictUI[this.channelId];
    }

    get showInviteUsers() {
      return  this.admin.length < 1;
    }

    get singleAdmin(): number {
      if (this.admin.length > 0) {
        return this.admin[0];
      } else {
        return this.channel.creator;
      }
    }

    get noRooms(): boolean {
      return this.channel.rooms.length === 0;
    }

    get isAdmin(): boolean {
      return this.channel.creator === this.userInfo.userId;
    }

    get userIds(): number[] {
      let results: number[] = [this.userInfo.userId]; // channel can have no rooms,
      this.channel.rooms.forEach(r => results.push(...r.users));
      return Array.from(new Set(results));
    }

    get currentAdmin(): UserModel {
      return this.allUsersDict[this.channel.creator];
    }

    @ApplyGrowlErr({runningProp: 'running'})
    async apply() {
      if (this.isAdmin && this.admin.length === 0) {
        throw Error("Pick an admin");
      }
      await this.$ws.saveChannelSettings(this.channelName, this.channelId, this.singleAdmin);
      this.$store.growlSuccess('Settings has been saved');
      this.$router.go(-1);
    }

    get channelId(): number {
      const id = this.$route.params.id;
      this.$logger.log('Rending channel settings for {}', id)();

      return parseInt(id);
    }


    @ApplyGrowlErr({runningProp: 'running'})
    public async deleteChannel(): Promise<void> {
      await this.$ws.sendDeleteChannel(this.channelId);
      this.$store.growlSuccess('Channel has been deleted');
      this.$router.go(-1);
    }

    created() {
      this.$logger.log('Updated for channel settings {} ', this.channel)();
      this.channelName = this.channel.name;
      this.admin = [this.channel.creator];
    }
  }
</script>
<!-- eslint-disable -->
<style lang="sass" scoped>

  .top-div
    display: flex
    justify-content: center

  .holder
    overflow-y: auto
    display: flex
    justify-content: center
    align-items: center

    input[type=text]
      width: 150px

    th
      text-align: right
    th, td
      padding: 5px
    td
      text-align: center
      > *
        margin: auto
      &[colspan="2"] > *
        width: 100%
</style>
