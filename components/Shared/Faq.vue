<template>
  <div id="faq">
    <h3
      class="text-h3 text-uppercase secondary--text pt-16 pb-8 font-weight-bold"
    >
      HÄUFIGE FRAGEN
    </h3>
    <v-row v-if="faqList.length != 0" id="faqwrapper" class="pb-8">
      <v-col
        v-for="(cat, i) in faqList"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <div v-if="cat">
          <p class="caption font-weight-bold">{{ cat.catTitle }}</p>
          <v-expansion-panels style="box-shadow: none !important">
            <v-expansion-panel
              v-for="faq in cat.faqs"
              :key="faq.id"
              style="box-shadow: none !important"
            >
              <v-expansion-panel-header
                class="caption primary--text align-start"
              >
             {{ faq.question }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="caption bluegray--text">
                <!--<div v-html="$md.render(faq.answer)"></div>-->
                <div
                  v-html="$md.render(faq.answer)"
                ></div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: String,
      default: "",
      // filter the list with the words written in strapi under faq > faqCategory > filterTag
    },
  },

  data() {
    return {
      faqList: [],
    };
  },

  async mounted(){
    const faqs = await this.$strapi.$faq
      .find({
        populate: "*",
      })
      .then(({data}) => {
        return data.attributes.faqCategory
      })
    console.log('faqs', await faqs)
    this.faqList = await faqs
  },
  /*async mounted() {
    const f = (
      await this.$strapi.$faq.find({
        populate: "*",
      })
    ).data;
    console.log(f);
    const newFaqCatList = f.attributes.faqCategory.map((cat) => {
      if (this.list == "") return cat;
      if (this.list.includes(cat.filterTag)) return cat;
    });
    console.log("newFaqCatList", newFaqCatList);
    f.attributes.faqCategory = newFaqCatList;
    console.log("f new", f);
    /*f.attributes.faqCategory.forEach((c)=>{
      console.log(this.forwoman && c.catTitle == 'Frauen')
      if(this.forwoman && c.catTitle == 'Frauen') {
        console.log('push: ',c)
        this.faqList.push(c)
      }
      
    })*//*
    //console.log(this.faqList)
    this.faqList = f;
  },*/
};
</script>

<style>
#faq .v-expansion-panel::before {
  box-shadow: none !important;
}
#faq .v-expansion-panel-header,
#faq .v-expansion-panel-content__wrap {
  padding-right: 0;
  padding-left: 0;
}
#faq .v-expansion-panels .v-expansion-panel:not(:first-child)::after {
  border-color: transparent !important;
}

#faq .v-expansion-panel-header__icon i {
  color: #f48fb1 !important;
  opacity: 0.6;
}

#faq .v-expansion-panel-header__icon {
  margin-left: 0px;
}
</style>
