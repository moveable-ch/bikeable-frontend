<!-- /entries/{id} -->

<template>
  <div
    class="entry"
    v-bind:class="{
      'is-famed': currentEntry.famed,
      'is-fixed': currentEntry.gotFixed,
      pending: loadingData,
    }"
  >
    <delete-modal
      v-if="isLoggedIn && entryIsFromUser && showDeleteModal"
      :entryId="this.entryId"
      @close="showDeleteModal = false"
    ></delete-modal>
    <map-modal
      v-if="showMapModal"
      @close="showMapModal = false"
      :coords="currentEntry.coords"
    ></map-modal>
    <add-photo-modal
      v-if="showPhotoModal"
      @close="showPhotoModal = false"
      @success="loadEntry"
      :entryId="entryId"
      :entry="currentEntry"
    ></add-photo-modal>
    <add-category-modal
      v-if="showCategoryModal"
      @close="showCategoryModal = false"
      @success="loadEntry"
      :entryId="entryId"
      :entry="currentEntry"
    ></add-category-modal>
    <div class="entry__header">
      <h1>{{ currentEntry.title }}</h1>
      <div
        class="entry__votes"
        v-bind:class="{
          'is-active': hasVoted,
          disabled: currentEntry.gotFixed,
          famed: currentEntry.famed,
          visible: !voteCheckPending,
        }"
      >
        <a
          @click.prevent="upvoteEntry"
          class="entry__votes__button"
          href="#"
          title="Upvote"
        >
          <span class="entry__votes__fixed" v-if="currentEntry.gotFixed"
            >fixed</span
          >
          <svg
            width="38px"
            height="38px"
            viewBox="0 0 38 38"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Artboard-Copy-4"
                transform="translate(-55.000000, -184.000000)"
                fill="#FE0094"
                fill-rule="nonzero"
              >
                <path
                  d="M88.0791191,210.889976 C88.8162973,209.929072 89.169842,208.898983 89.1247086,207.838146 C89.0795753,206.669687 88.5680639,205.754906 88.1468192,205.193739 C88.6357639,203.948408 88.8238196,201.988164 87.1914964,200.466093 C85.9954623,199.351444 83.9644611,198.851774 81.1511483,198.990144 C79.1728026,199.082391 77.5179128,199.459065 77.4502127,199.47444 C77.0665792,199.543625 76.6679011,199.628185 76.2617009,199.720431 C76.231612,199.228449 76.3143565,198.006179 77.2019792,195.254151 C78.255091,191.979391 78.1949132,189.473354 77.0064013,187.797538 C75.7577117,186.037163 73.7643216,185.898793 73.1775879,185.898793 C72.6134209,185.898793 72.0943873,186.137097 71.7257982,186.575269 C70.890831,187.566921 70.9886199,189.396482 71.0939311,190.242077 C70.1009972,192.963356 67.3177733,199.635872 64.9633163,201.488494 C64.9181829,201.519243 64.8805718,201.557679 64.8429607,201.596115 C64.1509158,202.341777 63.6845378,203.148936 63.3686042,203.856161 C62.9247929,203.610169 62.4208037,203.471799 61.8792033,203.471799 L57.290645,203.471799 C55.5605329,203.471799 54.1613987,204.909311 54.1613987,206.669687 L54.1613987,219.161435 C54.1613987,220.929498 55.5680551,222.359322 57.290645,222.359322 L61.8792033,222.359322 C62.5486815,222.359322 63.1730263,222.14408 63.6845378,221.775093 L65.452261,221.990335 C65.7230612,222.028771 70.5372863,222.651437 75.4793893,222.551503 C76.3745343,222.620688 77.2170237,222.659124 77.9993353,222.659124 C79.3458139,222.659124 80.5192812,222.551503 81.4971707,222.336261 C83.7989721,221.836591 85.3711175,220.837251 86.1684735,219.36899 C86.7777739,218.246654 86.7777739,217.132006 86.6799849,216.424781 C88.1769081,215.04108 88.440186,213.511321 88.3875304,212.435109 C88.3574415,211.812443 88.2220414,211.282024 88.0791191,210.889976 Z M56.1923999,219.161435 L56.1923999,206.662 C56.1923999,206.039334 56.6888669,205.539664 57.290645,205.539664 L61.8792033,205.539664 C62.4885037,205.539664 62.9774484,206.047021 62.9774484,206.662 L62.9774484,219.153748 C62.9774484,219.776413 62.4809815,220.276083 61.8792033,220.276083 L57.290645,220.276083 C56.6813447,220.28377 56.1923999,219.776413 56.1923999,219.161435 Z M86.1534291,209.99057 C85.8374955,210.328808 85.7773177,210.843852 86.018029,211.243588 C86.018029,211.251276 86.3264403,211.789382 86.3640514,212.527356 C86.416707,213.534383 85.9428067,214.426101 84.9498728,215.187137 C84.5963281,215.463877 84.4534058,215.940486 84.6038504,216.37097 C84.6038504,216.378658 84.9273061,217.393372 84.4007502,218.354276 C83.896761,219.276743 82.7759493,219.937845 81.075926,220.306832 C79.714403,220.606634 77.8639352,220.660445 75.5922227,220.475951 C75.5621338,220.475951 75.5245227,220.475951 75.4869115,220.475951 C70.6501197,220.583572 65.7606723,219.937845 65.7080168,219.930158 L64.9407496,219.837911 C64.985883,219.622669 65.0084497,219.392052 65.0084497,219.161435 L65.0084497,206.662 C65.0084497,206.331449 64.9557941,206.008585 64.8655274,205.708783 C65.0009274,205.193739 65.3770388,204.048341 66.2646615,203.072063 C69.6421413,200.33541 72.9443989,191.103047 73.0873212,190.703311 C73.147499,190.541879 73.1625435,190.365073 73.1324546,190.188267 C73.0045767,189.327297 73.0497101,188.274146 73.2302435,187.95897 C73.6289215,187.966657 74.7046,188.081966 75.3515115,188.996746 C76.1187786,190.080645 76.0886897,192.017827 75.2612447,194.585362 C73.9975106,198.498162 73.8921995,200.558339 74.8926556,201.465432 C75.3891226,201.918979 76.0510785,201.942041 76.5325011,201.765234 C76.9913569,201.657613 77.427646,201.565366 77.8413685,201.496181 C77.8714574,201.488494 77.9090685,201.480807 77.9391575,201.47312 C80.2484811,200.958075 84.3857058,200.642899 85.8224511,201.980477 C87.0410518,203.118187 86.1759958,204.624884 86.0782068,204.786316 C85.7998844,205.2168 85.8826289,205.777968 86.2587402,206.123893 C86.2662625,206.131581 87.0560963,206.892616 87.0937074,207.915018 C87.1237963,208.599181 86.8078628,209.298719 86.1534291,209.99057 Z"
                  id="Shape"
                  transform="translate(71.644971, 204.278958) rotate(-165.000000) translate(-71.644971, -204.278958) "
                ></path>
              </g>
            </g>
          </svg>
        </a>
        <span class="entry__votes__num">{{ currentEntry.votes }}</span>
      </div>
    </div>
    <entry-media-view
      :entry="currentEntry"
      :userData="userData"
      :hasVoted="hasVoted"
      :isLoggedIn="isLoggedIn"
      @vote="upvoteEntry()"
    >
    </entry-media-view>
    <div class="entry__container" v-if="!loadingData">
      <div class="lead">
        <span v-if="currentEntry.gotFixed" class="lead__fixed">Fixed!</span>
        <p class="lead__desc" v-html="entryDescription">
          {{ currentEntry.text }}
        </p>
        <p v-if="currentEntry.gotFixed" class="lead__notice lead__notice--good">
          {{ $t("entry.fixed") }}
        </p>
      </div>
      <div class="entry__meta">
        <div class="entry__meta__user">
          <div
            v-if="currentEntry.user.avatar"
            class="entry__meta__user__image"
            :style="
              'background-image:url(' + currentEntry.user.avatar.small + ')'
            "
          ></div>
          <div class="entry__meta__user__text">
            <span class="name"
              ><router-link :to="'/users/' + currentEntry.user._id">{{
                currentEntry.user.name
              }}</router-link></span
            >
            <span class="date">{{ entryDate }}</span>
          </div>
        </div>
        <div class="entry__meta__location">
          <a
            class="entry__meta__location__button"
            @click.prevent="showMapModal = true"
            href="#"
            >{{ currentEntry.address }}</a
          >
        </div>
        <div
          class="entry__meta__regions"
          v-if="currentEntry.regions.length > 0"
        >
          <ul>
            <li v-for="region in currentEntry.regions" v-bind:key="region._id">
              {{ region.name }}
            </li>
          </ul>
        </div>
        <template v-if="currentEntry.categories">
          <div
            class="entry__meta__categories"
            v-if="currentEntry.categories.length > 0"
          >
            <ul>
              <li
                v-for="category in currentEntry.categories"
                v-bind:key="category._id"
              >
                {{ category[$i18n.locale] }}
              </li>
            </ul>
          </div>
        </template>
        <template
          v-if="!currentEntry.famed && !currentEntry.gotFixed && isLoggedIn"
        >
          <div class="entry__meta__propose">
            <h2>{{ $t("entry.proposetitle") }}</h2>
            <p v-html="$tc('entry.proposetext', [fixProposalsNeeded])"></p>
            <a
              v-if="isLoggedIn && !currentEntry.gotFixed && !currentEntry.famed"
              @click.prevent="proposeFixedSpot"
              href="#"
              class="entry__meta__tools__button"
              v-bind:class="{ 'has-proposed': alreadyProposedSpotAsFixed }"
              ><span class="material-icons">thumb_up</span
              >{{ $t("entry.markasfixed") }}</a
            >
            <a
              @click.prevent="showPhotoModal = true"
              v-if="isLoggedIn"
              href="#"
              class="entry__meta__tools__button"
              ><span class="material-icons">add_a_photo</span
              >{{ $t("entry.uploadphotofix") }}</a
            >
          </div>
        </template>
        <template v-if="showArchival">
          <div class="entry__meta__archive">
            <p>
              {{ $t("entry.archivedon") }}
              <br /><strong>{{ archiveDate }}</strong>
            </p>
            <a
              href="#"
              class="entry__meta__tools__button"
              @click.prevent="delayArchiving"
            >
              <span class="material-icons">access_time</span>
              {{ $t("entry.delayarchival") }}</a
            >
          </div>
        </template>
        <div class="entry__meta__tools" v-if="isLoggedIn">
          <a
            v-if="isLoggedIn && entryIsFromUser"
            :href="'/edit/' + currentEntry._id"
            class="entry__meta__tools__button"
            ><span class="material-icons">edit</span
            >{{ $t("entry.editspot") }}</a
          >

          <a
            @click.prevent="showDeleteModal = true"
            v-if="isLoggedIn && entryIsFromUser"
            class="entry__meta__tools__button"
            href="#"
            ><span class="material-icons">delete</span
            >{{ $t("entry.deletespot") }}</a
          >
          <a
            @click.prevent="showPhotoModal = true"
            v-if="isLoggedIn"
            href="#"
            class="entry__meta__tools__button"
            ><span class="material-icons">add_a_photo</span
            >{{ $t("entry.uploadphoto") }}</a
          >
          <a
            @click.prevent="showCategoryModal = true"
            v-if="isLoggedIn"
            href="#"
            class="entry__meta__tools__button"
            ><span class="material-icons">add_circle_outline</span
            >{{ $t("entry.addcat") }}</a
          >
        </div>
      </div>
      <div class="entry__social">
        <a
          class="entry__social__button entry__social__button--fb"
          target="_blank"
          :href="'https://www.facebook.com/sharer/sharer.php?u=' + entryUrl"
        ></a>
        <a
          class="entry__social__button entry__social__button--twitter"
          target="_blank"
          :href="'https://twitter.com/home?status=' + entryUrl"
        ></a>
        <a
          class="entry__social__button entry__social__button--mail"
          :href="'mailto:?subject=' + currentEntry.title + '&body=' + entryUrl"
        ></a>
      </div>
    </div>

    <div class="comments">
      <div class="comments__container">
        <div class="notice" v-if="!isLoggedIn">
          <router-link to="/register">{{ $t("entry.register") }}</router-link>
        </div>
        <div class="comments__form" v-if="isLoggedIn && userData">
          <div
            class="comments__form__image"
            :style="'background-image:url(' + userAvatar + ')'"
          ></div>
          <form @submit.prevent="postComment">
            <textarea
              :placeholder="$t('comment.comment')"
              v-model="commentText"
              rows="2"
            ></textarea
            ><br />
            <button
              type="submit"
              class="btn comments__form__button"
              v-bind:class="{ disabled: !commentText }"
            >
              {{ $t("entry.send") }}
            </button>
          </form>
        </div>
        <div class="comments__list" v-if="comments">
          <comment-view
            v-for="comment in comments"
            :key="comment._id"
            :isChild="false"
            :comment="comment"
            :loadComments="loadComments"
            :entryId="entryId"
            :fetchData="fetchData"
            :avatar="userAvatar"
          ></comment-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anchorme from "anchorme";
import DOMPurify from "dompurify";
import { format, parseISO } from "date-fns";
import { enGB, de, fr } from 'date-fns/locale'

import Comment from "@/components/Comment";
import EntryMedia from "@/components/EntryMedia";
import MapModal from "@/components/MapModal";
import AddPhotoModal from "@/components/AddPhotoModal";
import AddCategoryModal from "@/components/AddCategoryModal";
import DeleteModal from "@/components/DeleteModal";

import spots from "../api/spots";
import comments from "../api/comments";

export default {
  name: "v-entry",
  head: {
    title: function () {
      return {
        inner: this.currentEntry.title,
      };
    },
    meta: function () {
      if (!this.currentEntry) return;
      var photo = "#";
      if (this.currentEntry.photo) {
        if (this.currentEntry.photo.medium != "") {
          photo = this.currentEntry.photo.medium.url;
        }
      }
      if (this.currentEntry.gallery[0]) {
        photo = this.currentEntry.gallery[0].photo.medium;
      }

      return [
        {
          property: "og:title",
          content: this.currentEntry.title + " – Bikeable",
          id: "og-title",
        },
        { property: "og:image", content: photo, id: "og-image" },
        { property: "og:url", content: this.entryUrl, id: "og-url" },
        { property: "og:desc", content: this.currentEntry.text, id: "og-desc" },
      ];
    },
  },
  props: [],
  components: {
    "comment-view": Comment,
    "entry-media-view": EntryMedia,
    "map-modal": MapModal,
    "add-photo-modal": AddPhotoModal,
    "add-category-modal": AddCategoryModal,
    "delete-modal": DeleteModal,
  },
  data() {
    return {
      entryId: 0,
      loadingData: true,
      hasVoted: false,
      currentEntry: {
        title: " ",
        user: {
          name: "",
        },
        photo: {
          large: "",
          medium: {
            url: "",
          },
        },
        famed: false,
        gallery: [],
      },
      comments: {},
      commentText: "",
      showMapModal: false,
      showPhotoModal: false,
      showCategoryModal: false,
      voteCheckPending: true,
      showDeleteModal: false,
    };
  },

  computed: {
    entries() {
      return this.$store.getters.entries;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    entryDate() {
      if (!this.currentEntry.createdAt) return "";
      let d = new Date(this.currentEntry.createdAt);
      return d.toLocaleDateString("de-DE");
    },
    entryUrl() {
      return "https://bikeable.ch" + this.$route.fullPath;
    },
    entryTitle() {
      if (!this.currentEntry.title) return "what";
      return this.currentEntry.title;
    },
    entryDescription() {
      const _text = DOMPurify.sanitize(this.currentEntry.text, {
        ALLOWED_TAGS: [],
      });
      return anchorme({
        input: _text,
        options: {
          attributes: { target: "_blank" },
        },
      });
    },
    entryIsFromUser() {
      return this.currentEntry.user._id === this.userData._id;
    },
    userData() {
      return this.$store.getters.userData;
    },
    userAvatar() {
      if (!this.userData) return "";
      if (!this.userData.profile) return "";
      return this.userData.profile.avatar.small;
    },
    alreadyProposedSpotAsFixed() {
      if (this.currentEntry.fixProposals) {
        for (var i = 0; i < this.currentEntry.fixProposals.length; i++) {
          if (this.currentEntry.fixProposals[i].userId === this.userData._id) {
            return true;
          }
        }
      }
      return false;
    },
    fixProposalsNeeded() {
      if (!this.currentEntry) return 3;
      if (!this.currentEntry.fixProposals) return 3;
      return 3 - this.currentEntry.fixProposals.length;
    },
    archiveDate() {
      if (!this.currentEntry.archivedOn) return null;
      if(this.$i18n.locale == 'de') {
        return format(new Date(this.currentEntry.archivedOn), 'PPP', { locale: de })
      } else if(this.$i18n.locale == 'fr') {
        return format(new Date(this.currentEntry.archivedOn), 'PPP', { locale: fr })
      } else {
        return format(new Date(this.currentEntry.archivedOn), 'PPP', { locale: enGB })
      }
    },
    showArchival() {
      let show = true;
      if(!this.isLoggedIn) show = false;
      if(!this.entryIsFromUser) show = false;
      if(!this.currentEntry.archivedOn) show = false;
      return show;
    }
  },

  watch: {
    $route(to, from) {
      this.fetchData();
    },
  },

  mounted() {
    this.comments = null;
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.loadEntry();
      this.loadComments();

      if (!this.isLoggedIn) {
        this.voteCheckPending = false;
        return;
      }
      this.checkUpvote();
    },

    loadEntry() {
      this.entryId = this.$route.params.id;

      // TODO: Move to Store
      this.$store.commit("LOAD_START");

      spots.getSpotById(this.entryId).then(
        (data) => {
          this.currentEntry = data;
          this.loadingData = false;
          this.$store.commit("LOAD_FINISH");
          this.$emit("updateHead");
        },
        (error) => {
          this.$store.commit("LOAD_FINISH");
          this.$router.push("/entries");
          this.$store.dispatch("handleError", "Spot nicht gefunden");
        }
      );
    },

    loadComments() {
      // TODO: Move to Store
      this.$store.commit("LOAD_START");

      comments.getCommentsBySpot(this.entryId).then(
        (data) => {
          this.comments = data;
          this.$store.commit("LOAD_FINISH");
        },
        (error) => {
          this.$store.commit("LOAD_FINISH");
          this.$store.dispatch("handleError", error);
        }
      );
    },

    postComment() {
      if (this.commentText == "") return;
      if (!this.isLoggedIn) return;

      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      this.$store.commit("LOAD_START");

      comments
        .postComment({
          entryId: this.entryId,
          comment: this.commentText,
          userId: userId,
          authToken: token,
        })
        .then(
          (data) => {
            this.commentText = "";
            this.fetchData();
            this.$store.commit("LOAD_FINISH");
          },
          (error) => {
            this.$store.dispatch("handleError", error);
            this.$store.commit("LOAD_FINISH");
          }
        );
    },

    checkUpvote() {
      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      spots
        .checkUpvote({
          spotId: this.entryId,
          userId: userId,
          authToken: token,
        })
        .then(
          () => {
            this.hasVoted = true;
            this.voteCheckPending = false;
          },
          () => {
            this.hasVoted = false;
            this.voteCheckPending = false;
          }
        );
    },

    upvoteEntry() {
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }
      if (this.hasVoted == true) return;

      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      // TODO: Move to Store
      this.$store.commit("LOAD_START");
      // this.hasVoted = true;

      spots
        .upvoteSpot({
          spotId: this.entryId,
          userId: userId,
          authToken: token,
        })
        .then(
          (data) => {
            this.$store.commit("LOAD_FINISH");

            if (data.lastAction == "addVote") {
              this.hasVoted = true;
            } else {
              this.hasVoted = false;
            }
            this.loadEntry();
          },
          (error) => {
            this.$store.commit("SET_MESSAGE", error);
            this.$store.commit("LOAD_FINISH");
          }
        );
    },

    proposeFixedSpot() {
      // TODO: Move to Store
      if (!this.isLoggedIn) return;

      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      this.$store.commit("LOAD_START");
      // this.hasVoted = true;

      spots
        .proposeFixedSpot({
          spotId: this.entryId,
          userId: userId,
          authToken: token,
        })
        .then(
          (data) => {
            this.$store.commit("LOAD_FINISH");
            this.loadEntry();
          },
          (error) => {
            this.$store.commit("SET_MESSAGE", error);
            this.$store.commit("LOAD_FINISH");
          }
        );
    },

    delayArchiving() {
      // TODO: Move to Store
      if (!this.isLoggedIn) return;

      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      this.$store.commit("LOAD_START");

      spots
        .delayArchiving({
          spotId: this.entryId,
          userId: userId,
          authToken: token,
        })
        .then(
          (data) => {
            this.$store.commit("LOAD_FINISH");
            this.loadEntry();
          },
          (error) => {
            this.$store.commit("SET_MESSAGE", error);
            this.$store.commit("LOAD_FINISH");
          }
        );
    },
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.entry {
  margin: 0;
  padding-bottom: 4rem;
  padding-top: 5rem;
  font-family: $f-body;
  min-height: calc(100vh - 600px);
  position: relative;
  margin-bottom: -1rem;

  &::before,
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 25rem;
    position: absolute;
    top: 0;
    left: 0;
  }
  &::before {
    z-index: -1;
    background-image: linear-gradient(
      0deg,
      #ffffff 2%,
      rgba(255, 255, 255, 0) 74%
    );
  }
  &::after {
    z-index: -2;
    background-image: linear-gradient(-137deg, #fcffd6 0%, #e2fdff 100%);
  }

  @include tablet {
    padding-top: 7rem;
    margin-bottom: -8rem;

    &::before,
    &::after {
      height: 40rem;
    }
  }

  .embed & {
    padding-top: 2rem;
  }

  &__social {
    margin-top: 1rem;
    display: flex;
    justify-content: center;

    &__button {
      display: block;
      width: 40px;
      height: 40px;
      background-color: rgba($c-blue, 0.2);
      background-size: 100%;
      background-position: center;
      margin-left: 5px;
      border: 1px solid $c-blue;
      border-radius: 99%;
      transition: 0.1s border-color;

      &--fb {
        background-image: url("../assets/share-fb.png");
      }
      &--twitter {
        background-image: url("../assets/share-twitter.png");
      }
      &--mail {
        background-image: url("../assets/share-mail.png");
      }

      &:hover {
        border-color: $c-black;
      }
    }
  }

  &__meta {
    background-color: rgba($c-blue, 0.2);
    border: 1px solid $c-blue;
    border-radius: 4px;
    margin-top: 3rem;

    h3 {
      display: block;
      width: 100%;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
      opacity: 0.5;
      margin: 0;
      margin-bottom: 0.25rem;
    }

    &__user {
      display: flex;
      align-items: center;
      border-bottom: 1px solid $c-blue;
      padding: 0.5rem;
      flex-wrap: wrap;

      &__image {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #fff;
        background-size: cover;
        background-position: center;
        margin-right: 0.75rem;
        border: 2px solid $c-blue;
        border-radius: 99%;
      }
      &__text {
        span {
          display: block;
          line-height: 1.2;
        }
        .name {
          font-weight: bold;
          a {
            color: $c-black;

            &:hover {
              color: $c-main;
            }
          }
        }
        .date {
          color: #888;
        }
      }
    }
    &__regions,
    &__categories {
      padding: 0.55rem;
      border-bottom: 1px solid $c-blue;

      li {
        display: inline-block;
        background: $c-blue;
        border-radius: 4px;
        padding: 0.4rem 0.75rem;
        margin: 0.2rem;
        font-size: 0.8rem;
        letter-spacing: 0.03rem;
      }
    }
    &__location {
      border-bottom: 1px solid $c-blue;
      padding: 1rem;
      line-height: 1.3;

      &__button {
        color: $c-black;
        text-decoration: underline;
        padding-left: 1.75rem;
        position: relative;
        display: block;

        &::before {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          left: 0;
          width: 1.5rem;
          height: 1.5rem;
          margin-top: -0.75rem;
          background-image: url("../assets/entry-map.png");
          background-size: 100%;
        }

        &:hover {
          text-decoration: none;
        }
      }
    }
    &__archive {
      padding: 0.75rem;
      p {
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
      }
    }
    &__propose {
      padding: 0.75rem;
      border-bottom: 1px solid $c-blue;

      h2 {
        font-size: 0.8rem;
        margin: 0;
        margin-bottom: 0.25rem;
        font-family: $f-body;
      }
      p {
        font-size: 0.8rem;
        margin-bottom: 0.75rem;
        max-width: 450px;
        opacity: 0.7;
      }
    }
    &__tools {
      padding: 0.75rem;
      background-color: $c-blue;

      &__button {
        display: block;
        border: 1px solid $c-grey-darkest;
        background-color: #fff;
        color: $c-black;
        border-radius: 4px;
        padding: 0 1rem;
        padding-left: 2.75rem;
        margin-bottom: 0.5rem;
        position: relative;
        // margin: 0.5rem;
        // margin-right: 0.75rem;
        line-height: 2rem;
        height: 2rem;
        overflow: hidden;

        &.has-proposed {
          border-color: #77bb77;
          background-color: rgba(#77bb77, 0.1);
          pointer-events: none;
          opacity: 0.6;

          .material-icons {
            background-color: rgba(#77bb77, 0.3);
          }
        }

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          // background-color: $c-blue;
          border-color: $c-main;

          .material-icons {
            color: $c-main;
          }
        }
        @include tablet {
          width: auto;
          display: inline-block;
          margin-bottom: -4px;
          margin: 0.25rem;
          margin-bottom: calc(0.25rem - 4px);

          &:last-child {
            margin-bottom: calc(0.25rem - 4px);
          }
        }
        .material-icons {
          color: $c-grey-darkest;
          display: block;
          font-size: 1rem;
          background-color: $c-blue;
          position: absolute;
          height: 2rem;
          width: 2rem;
          left: 0;
          top: 0;
          text-align: center;
          line-height: 2rem;
          transition: 0.1s color;
        }
      }
    }
  }
  div:last-child {
    border-bottom: none;
  }

  &__container {
    max-width: 940px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .lead {
    &__location {
      display: block;
      font-family: $f-body;
      text-transform: none;
      margin-bottom: 1rem;
      font-size: 1rem;
      color: #888;
      font-weight: 400;
      line-height: 1.2;
    }
    &__desc {
      font-size: 1rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    &__meta {
      display: block;
      color: #888;
      border-bottom: 1px solid #444;
    }
    &__notice {
      margin: 2rem 0;
      padding: 1rem 0.5rem;
      line-height: 1.2;
      background-color: $c-grey;
      text-align: center;
      max-width: none;
      font-weight: 600;

      &--good {
        color: $c-main;
        background-color: rgba($c-main, 0.1);
        border-radius: 4px;
      }
    }
    &__fixed {
      display: inline-block;
      background-color: $c-main;
      font-size: 0.9rem;
      padding: 5px 10px;
      color: #fff;
      font-weight: 600;
      margin-left: -5px;
      transform: rotate(-4deg);
    }
  }

  &__header {
    position: relative;
    z-index: 1;
    padding: 0 1rem;

    h1 {
      font-size: 1.5rem;
      line-height: 1.2;
      margin: 1rem auto;
      max-width: 40rem;
    }
    @include tablet {
      padding: 0 2rem;

      h1 {
        font-size: 2.5rem;
      }
    }
  }
  &__votes {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.2;
    pointer-events: none;

    &__fixed {
      background-color: $c-main;
      color: #fff;
      padding: 0.25rem 1rem;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      transform: translate(-50%, -50%) rotate(-5deg);
      font-weight: bold;
    }
    &__button {
      display: inline-block;
      position: relative;
      width: 3.3rem;
      height: 3.3rem;
      border: 2px solid $c-highlight;
      border-radius: 99%;
      transition: 0.3s $easeOutQuint transform, 0.2s background-color;
      background-color: #fff;

      svg {
        width: 2rem;
        height: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        transition: 0.3s $easeOutQuint transform;
      }

      &:hover {
        transform: scale(1.1);

        svg {
          transform: rotate(-10deg);
        }
      }
    }
    &__num {
      font-weight: 700;
      color: $c-highlight;
      margin-left: 0.75rem;
      position: relative;

      &::before {
        content: "";
        display: block;
        position: absolute;
        top: -0.75rem;
        left: 50%;
        width: 0;
        height: 0;
        margin-left: -5px;
        border: solid transparent;
        pointer-events: none;
        border-width: 5px;
        border-bottom-color: $c-highlight;
      }
    }

    &.is-active {
      .entry__votes__button {
        pointer-events: none;
        background-color: $c-highlight;

        svg path {
          fill: white;
        }
      }
      &.famed {
        .entry__votes__button {
          background-color: $c-main;

          svg path {
            fill: white;
          }
        }
      }
    }
    &.visible {
      pointer-events: auto;
      opacity: 1;
    }
    &.disabled {
      pointer-events: none;
    }
    &.famed {
      .entry__votes__button {
        border-color: $c-main;

        svg {
          transform: rotate(150deg);
        }
        svg path {
          fill: $c-main;
        }
        &:hover {
          svg {
            transform: rotate(160deg);
          }
        }
      }
      .entry__votes__num {
        color: $c-main;
        &::before {
          border-bottom-color: $c-main;
        }
      }
    }
  }

  .comments {
    border-top: 1px solid $c-blue;
    margin-top: 2rem;
    padding-top: 2rem;

    @include tablet {
      margin-top: 4rem;
      padding-top: 4rem;
    }

    &__container {
      margin: 0 auto;
      max-width: 940px;
      padding: 0 1rem;
    }
    &__form {
      margin-bottom: 3rem;
      position: relative;
      padding-left: 3rem;

      &__image {
        width: 2.5rem;
        height: 2.5rem;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        border: 2px solid $c-blue;
        background-size: cover;
        background-position: center;
        border-radius: 99%;
      }

      label {
        margin-bottom: 0.5rem;
      }
      &__button {
        min-width: 5rem;
        height: 2rem;
        line-height: 2rem;
        margin: 0;
      }

      textarea {
        padding: 0.75rem;
        font-size: 0.9rem;
        border-color: $c-blue;
        margin-bottom: 0.5rem;

        &:focus {
          border-color: $c-black;
        }
      }
    }
  }
}
</style>
