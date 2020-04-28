<template>
  <div class="about-team">
    <div class="about-team__wrap">
      <div class="about-team__item" v-for="(item, index) in teamArray" :key="index">
        <div class="about-team__item__member" v-for="(member, index) in item" :key="index">
          <img :src="member.image" :alt="member.name">
          <span class="name">{{ member.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Prismic from 'prismic.io';

export default {
  name: 'c-aboutteam',
  props: ['teamData'],
  data () {
    return {
      teamArray: []
    }
  },
  mounted() {
    this.teamData.toArray().forEach((item) => {
      this.teamArray.push({
        name: item.getText('name'),
        image: item.getImage('portrait').url,
      });
    });
    this.shuffleArray(this.teamArray);
    let tempArray = [];
    for(let i=0; i<this.teamArray.length; i+=2) {
      if(this.teamArray[i+1]) {
        tempArray.push([this.teamArray[i], this.teamArray[i+1]]);
      }else{
        tempArray.push([this.teamArray[i]]);
      }
    }
    tempArray.reverse();
    this.teamArray = tempArray;
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
      }
    }
  },

  computed: {
  },

  watch: {
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.about-team {
  position: relative;
  height: 320px;
  margin: 4rem 0;
  overflow: hidden;

  @include tablet {
    margin: 8rem 0;
  }

  &::before, &::after {
    content: "";
    display: block;
    position: absolute; left: 0; top: 0;
    width: 2rem; height: 100%;
    background: linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);;
    z-index: 2;
  }
  &::after {
    left: auto;
    right: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);;
  }

  &__wrap {
    display: flex;
    position: absolute;
    left: -100%;
    top: 0;
    transform: translateX(-100%);
    will-change: left;
    animation: 40s about-bikes linear infinite;
  }

  &__item {
    display: block;
    width: 439px;
    height: 249px;
    flex-shrink: 0;
    margin-right: 3rem;
    position: relative;

    &::before {
      content: "";
      display: block;
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      background-image: url('../assets/team-bike.svg');
      z-index: 1;
    }

    &__member {
      width: 160px;
      position: absolute;
      top: 75px;
      left: 266px;

      img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 99%;
        animation: 30s about-heads linear infinite;
      }

      .name {
        display: block;
        font-size: 1rem;
        width: 100%;
        text-align: center;
        margin-top: 1.5rem;
        line-height: 1.4;
      }

      &:nth-child(2) {
        left: 14px;
      }
    }
  }

}

@keyframes about-bikes {
  from {
    left: 0;
    transform: translateX(-100%);
  }
  to {
    left: 100%;
    transform: translateX(0);
  }
}
@keyframes about-heads {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>
