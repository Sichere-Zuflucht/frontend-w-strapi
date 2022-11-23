<template>
  <div v-if="article">
    <UtilsBanner :url="article.attributes.cover.data.attributes.url" strapiImg/>
    <v-container style="margin-top: -45px">
      <v-avatar color="white"
        ><v-icon>{{
          article.attributes.tags.data[0].attributes.icon
        }}</v-icon></v-avatar
      >
      <h1 class="text-h1 primary--text pt-2">{{ article.attributes.title }}</h1>
      <p class="font-weight-bold pb-6">{{ article.attributes.subtitle }}</p>
      <p class="caption">von {{ article.attributes.author }}</p>

      <iframe
        v-if="article.attributes.spotifylink"
        :src="
          'https://open.spotify.com/embed/' +
          article.attributes.spotifylink.replace(
            'https://open.spotify.com/',
            ''
          )
        "
        class="pt-2"
        width="100%"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <iframe
        v-if="article.attributes.youtubelink"
        width="100%"
        :src="
          'https://www.youtube.com/embed/' +
          article.attributes.youtubelink.replace('https://youtu.be/', '')
        "
        class="pt-2"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <a
        v-if="article.attributes.youtubelink"
        class="caption"
        :href="article.attributes.youtubelink"
        target="_blank"
      >
        {{ article.attributes.youtubelink.slice(0, 50)
        }}{{ article.attributes.youtubelink.length > 50 ? "..." : "" }}
      </a>
      <iframe
        v-if="article.attributes.soundcloudlink"
        class="pt-2"
        width="100%"
        height="300"
        scrolling="no"
        frameborder="no"
        allow="autoplay"
        :src="
          'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' +
          article.attributes.soundcloudlink +
          '&color=%23f9a825&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
        "
      ></iframe>

      <div
        class="singleArticleText mt-8"
        :style="cssVars"
        v-html="$md.render(article.attributes.text)"
      ></div>
    </v-container>
    <v-divider />
    <v-container>
      <h2 class="text-h2 secondary--text mb-4 mt-12">Verwandte Einträge</h2>
      <v-row v-if="relatedArticles" class="pt-8" style="z-index: 1">
        <v-col
          v-for="relatedArticle in relatedArticles.filter(
            (m) => m.attributes.tags.data[0].attributes.name != slugpath
          )"
          :key="relatedArticle.attributes.id"
          cols="12"
          sm="6"
          md="4"
          class="pb-4"
        >
          <MagazineTeaserBox :magazine-data="relatedArticle" /> </v-col
      ></v-row>
    </v-container>
  </div>
  <div v-else>user: {{article}}</div>
</template>

<script>
export default {
  async asyncData({params, $strapi}){
    const article = await $strapi.$magazines
      .find({
        populate: '*',
        "filters[slug]": params.slug
      })
      .then(({data}) => data[0])
      
    //if(article === undefined) window.location.replace('/')
    return { article }
  },
  data() {
    return {
      //article: null,
      error: null,
      relatedArticles: null,
      slugpath: this.$route.params.slug,
    };
  },
  computed: {
    cssVars() {
      return {
        "--primary": this.$vuetify.theme.themes.light.primary,
        "--secondary": this.$vuetify.theme.themes.light.secondary,
      };
    },
  },
  /*async mounted() {
    console.log(this.$route.params.slug);
    await this.$strapi.$magazines
      .find({
        populate: '*',
        "filters[slug]": this.$route.params.slug
      })
      .then(({data}) => {
        this.article = data[0];
      });

    await this.$strapi.$magazines
      .find({
        populate: "*",
        _limit: 3,
      })
      .then((getRelatedArticles) => {
        this.relatedArticles = getRelatedArticles.data
          .filter((art) => art.attributes.slug !== this.$route.params.slug)
          .slice(0, 2);
      })
      .catch((e) => {
        this.$store.dispatch("errorhandling", e);
      });
  },*/
};
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
