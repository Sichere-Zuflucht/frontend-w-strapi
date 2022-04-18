export default function ({ redirect, $strapi }) {
    if ($strapi.user) {
        if($strapi.user.roleName == 'Woman') {
            redirect('/frauen')
        } else if($strapi.user.roleName == 'Coach') {
            redirect('/beratung')
        }
    }
  }