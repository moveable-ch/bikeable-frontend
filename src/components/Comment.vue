<template>
  <div class="comment" v-bind:class="{ child: isChild }">
    <div
      class="comment__avatar"
      v-if="comment.user.avatar"
      :style="'background-image:url(' + comment.user.avatar.small + ')'"
    ></div>
    <div class="comment__body">
      <div class="comment__meta">
        <router-link :to="'/users/' + comment.user._id" class="username">{{
          comment.user.name
        }}</router-link
        ><span class="date">{{ dateCreated }}</span>
      </div>
      <p v-html="linkifiedComment" v-if="!editMode"></p>
      <textarea
        name="editText"
        v-model="editableText"
        id="editText"
        cols="30"
        rows="3"
        v-if="editMode"
        class="comment__textarea"
      ></textarea>
      <button
        v-if="editMode"
        type="submit"
        class="btn comment__editsend"
        v-bind:class="{ disabled: !editableText }"
        @click.prevent="saveEditedComment"
      >
        {{ $t("comment.send") }}
      </button>
    </div>
    <div class="comment__buttons" v-if="!isChild && isLoggedIn">
      <a
        @click.prevent="upvoteComment"
        href="#"
        class="comment__button comment__button--vote"
        v-bind:class="{ disabled: !isLoggedIn }"
      >
        <span class="material-icons">arrow_upward</span>{{ comment.votesCount }}
      </a>
      <a
        @click.prevent="showForm = !showForm"
        href="#"
        class="comment__button comment__button--reply"
        ><span class="material-icons">reply</span
        ><span class="comment__button__label">{{
          $t("comment.reply")
        }}</span></a
      >
      <a
        href="#"
        @click.prevent="makeEditable"
        v-if="comment.user._id == userData._id"
        class="comment__button comment__button--edit"
        ><span class="material-icons">edit</span
        ><span class="comment__button__label">Bearbeiten</span></a
      >
    </div>

    <div class="comment__reply" v-if="showForm">
      <div
        class="comment__reply__image"
        :style="'background-image:url(' + avatar + ')'"
      ></div>
      <form @submit.prevent="postReply">
        <textarea
          :placeholder="$t('comment.comment')"
          v-model="replyText"
          rows="2"
        ></textarea>
        <button
          type="submit"
          class="btn comment__reply__button"
          v-bind:class="{ disabled: !replyText }"
        >
          {{ $t("comment.send") }}
        </button>
      </form>
    </div>

    <div class="comment__children" v-if="responses">
      <c-comment
        v-for="comment in responses"
        :isChild="true"
        :key="comment._id"
        :comment="comment"
        :loadComments="loadComments"
        :avatar="avatar"
      ></c-comment>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import linkify from 'linkifyjs';
// import linkifyHtml from 'linkifyjs/html';
import DOMPurify from "dompurify";
import anchorme from "anchorme";

export default {
  name: "c-comment",
  props: [
    "entryId",
    "fetchData",
    "comment",
    "loadComments",
    "isChild",
    "avatar",
  ],
  data() {
    return {
      replyText: "",
      editableText: "",
      showForm: false,
      editMode: false,
    };
  },

  computed: {
    dateCreated() {
      if (!this.comment.createdAt) return "";
      let d = new Date(this.comment.createdAt);
      return d.toLocaleDateString("de-DE");
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userData() {
      return this.$store.getters.userData;
    },
    responses() {
      return this.comment.responses;
    },
    linkifiedComment() {
      const _text = DOMPurify.sanitize(this.comment.text, {
        ALLOWED_TAGS: [],
      });
      return anchorme({
        input: _text,
        options: {
          attributes: { target: "_blank" },
        },
      });
    },
  },

  watch: {},

  mounted() {},

  methods: {
    postReply() {
      if (this.commentText == "") return;
      if (!this.isLoggedIn) return;

      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      this.$store.commit("LOAD_START");

      axios
        .post(
          process.env.VUE_APP_BACKEND_URL + "/api/v1/comments",
          {
            entryId: this.entryId,
            parentId: this.comment._id,
            text: this.replyText,
            user: {
              _id: userId,
            },
          },
          {
            headers: {
              "X-User-Id": userId,
              "X-Auth-Token": token,
            },
          }
        )
        .then((response) => {
          this.replyText = "";
          this.showForm = false;
          this.fetchData();
          this.$store.commit("LOAD_FINISH");
        });
    },
    upvoteComment() {
      if (!this.isLoggedIn) return;

      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      this.$store.commit("LOAD_START");
      axios
        .post(
          process.env.VUE_APP_BACKEND_URL +
            "/api/v1/comments/" +
            this.comment._id +
            "/vote",
          {},
          {
            headers: {
              "X-User-Id": userId,
              "X-Auth-Token": token,
            },
          }
        )
        .then(
          (response) => {
            this.$store.commit("LOAD_FINISH");
            this.loadComments();
          },
          (error) => {
            let msg = "Error";
            if (error.request.data.status) {
              let msg = response.body.status + ": " + response.body.message;
            }
            this.$store.commit("SET_MESSAGE", msg);
            this.$store.commit("LOAD_FINISH");
          }
        );
    },
    saveEditedComment() {
      console.log(this.editableText);
    },
    makeEditable() {
      this.editMode = !this.editMode;
      this.editableText = this.comment.text;
    },
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.comment {
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  position: relative;
  padding-left: 2rem;

  @include tablet {
    padding-left: 3rem;
  }

  &.child {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }

  &__textarea {
    display: block;
    width: 100%;
    max-width: none;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  &__editsend {
    margin-top: .5rem;
  }

  &__reply {
    margin-top: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
    padding-left: 2rem;

    &__image {
      width: 1.5rem;
      height: 1.5rem;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fff;
      background-size: cover;
      border: 2px solid $c-blue;
      border-radius: 99%;
    }

    @include tablet {
      padding-left: 3rem;

      &__image {
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    label {
      margin-bottom: 0.5rem;
    }
    &__button {
      margin-top: 4px;
    }

    textarea {
      display: block;
      padding: 0.5rem;
      font-size: 0.8rem;
      border-color: $c-blue;
      // height: 4rem;
    }

    @include tablet {
      // margin-top: 2rem;
    }
  }

  &__avatar {
    width: 1.5rem;
    height: 1.5rem;
    background-color: #fff;
    background-size: cover;
    background-position: center;
    margin-right: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid $c-blue;
    border-radius: 4px;
    border-radius: 99%;

    @include tablet {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  &__body {
    background-color: #fff;
    border: 1px solid $c-blue;
    border-radius: 4px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 0px;
    padding: 1rem;
    overflow: hidden;

    p {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    a {
      color: $c-black;
      text-decoration: underline;
    }
  }
  &__buttons {
    display: flex;
    justify-content: space-between;
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    height: 1.6rem;
    font-size: 0.8rem;
    text-align: center;
    color: #666;
    border: 1px solid $c-blue;
    border-top: none;
    background-color: rgba($c-blue, 0.4);
    width: 100%;

    &:hover {
      background-color: rgba($c-blue, 0.8);
    }

    .material-icons {
      margin-right: 0.4rem;
    }
    &__label {
      display: none;

      @include tablet() {
        display: inline;
      }
    }
  }

  &__meta {
    margin-bottom: 0.2rem;
    position: relative;

    .username {
      font-weight: 600;
      text-decoration: none;
    }
    .date {
      position: absolute;
      top: 0;
      right: 0;
      color: $c-grey-darkest;
    }
  }
  p {
    margin-top: 0.5rem;
  }
}
</style>
