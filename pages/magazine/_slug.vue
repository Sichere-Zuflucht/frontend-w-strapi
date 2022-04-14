<template>
  <div v-if="article">
    <v-img
      v-if="article.cover"
      :src="article.cover.url ? article.cover.url : null"
      width="100%"
      max-height="300"
    />
    <v-container style="margin-top: -45px">
      <v-avatar color="white"
        ><v-icon>{{ article.tag.icon }}</v-icon></v-avatar
      >
      <h1 class="text-h1 primary--text pt-2">{{ article.title }}</h1>
      <p class="font-weight-bold pb-6">{{ article.subtitle }}</p>
      <p class="caption">von {{ article.author }}</p>

      <iframe
        v-if="article.spotifylink"
        :src="
          'https://open.spotify.com/embed/' +
          article.spotifylink.replace('https://open.spotify.com/', '')
        "
        class="pt-2"
        width="100%"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <iframe
        v-if="article.youtubelink"
        width="100%"
        :src="
          'https://www.youtube.com/embed/' +
          article.youtubelink.replace('https://youtu.be/', '')
        "
        class="pt-2"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <a
        v-if="article.youtubelink"
        class="caption"
        :href="article.youtubelink"
        target="_blank"
      >
        {{ article.youtubelink.slice(0, 50)
        }}{{ article.youtubelink.length > 50 ? '...' : '' }}
      </a>
      <iframe
        v-if="article.soundcloudlink"
        class="pt-2"
        width="100%"
        height="300"
        scrolling="no"
        frameborder="no"
        allow="autoplay"
        :src="
          'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' +
          article.soundcloudlink +
          '&color=%23f9a825&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
        "
      ></iframe>

      <div
        class="singleArticleText mt-8"
        :style="cssVars"
        v-html="$md.render(article.text)"
      ></div>
    </v-container>
    <v-divider />
    <v-container>
      <h2 class="text-h2 secondary--text mb-4 mt-12">Verwandte Einträge</h2>
      <v-row v-if="relatedArticles" class="pt-8" style="z-index: 1">
        <v-col
          v-for="relatedArticle in relatedArticles.filter(
            (m) => m.tag.name != slugpath
          )"
          :key="relatedArticle.id"
          cols="12"
          sm="6"
          md="4"
          class="pb-4"
        >
          <MagazineTeaserBox :magazine-data="relatedArticle" /> </v-col
      ></v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: null,
      error: null,
      relatedArticles: null,
      slugpath: this.$route.params.slug,
    }
  },
  computed: {
    cssVars() {
      return {
        '--primary': this.$vuetify.theme.themes.light.primary,
        '--secondary': this.$vuetify.theme.themes.light.secondary,
      }
    },
  },
  async mounted() {
    const loadArticle = await this.$strapi.find('magazines', {
      slug: this.$route.params.slug,
    })
    this.article = loadArticle[0]
    const getRelatedArticles = await this.$strapi.find('magazines', {
      _limit: 3,
    })
    this.relatedArticles = getRelatedArticles
      .filter((art) => art.slug !== this.$route.params.slug)
      .slice(0, 2)
  },
}
</script>

<style>
.singleArticleText h1,
.singleArticleText h3 {
  color: var(--primary);
  text-transform: uppercase;
}
.singleArticleText h2,
.singleArticleText h4 {
  color: var(--secondary);
  text-transform: uppercase;
}
.singleArticleText h1 {
  font-size: 1.4rem;
}
.singleArticleText h2 {
  font-size: 1.2rem;
}
.singleArticleText h3,
.singleArticleText h4,
.singleArticleText h5,
.singleArticleText h6 {
  font-size: 1rem;
}
</style>
