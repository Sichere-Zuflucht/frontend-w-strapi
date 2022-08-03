export default function ({ redirect, $strapi }) {
    if ($strapi.user) {
        if($strapi.user.roleName == 'woman') {
            redirect('/frauen')
        } else if($strapi.user.roleName == 'coach') {
            redirect('/beratung')
        }
    }
  }