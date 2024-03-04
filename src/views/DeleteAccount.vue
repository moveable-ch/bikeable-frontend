<!-- deleteaccount -->

<template>
  <div class="contentpage deleteaccount">
    <div class="container">
      <h1>{{ $t("deleteaccount.title") }}</h1>
      <p>{{ $t("deleteaccount.explanation") }} <a href='mailto:info@bikeable.ch'>info@bikeable.ch</a></p>
      <h3>{{ $t("deleteaccount.what_title") }}</h3>
      <p>{{ $t("deleteaccount.what_text") }}</p>
      </div>
  </div>
</template>
<style lang="scss">
@import "../styles/helpers";

.deleteaccount {
  b {
    font-weight: bold;
  }

  h3 {
    margin: 2rem auto !important;

    }
}
</style>
