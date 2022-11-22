export default function ({ redirect, $strapi, params }) {
    const coach = $strapi.$users
        .find({
          "filters[id]": params.beratung,
        })
    if (coach.length == 0) redirect('/')
  }