export default function ({ redirect, $strapi }) {
    if (!$strapi.user) {
        redirect('/registration/signin')
    }
  }