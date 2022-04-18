export default function ({ redirect, $strapi }) {
    if (!$strapi.user) {
        redirect('/registration/signin')
    } else {
        if($strapi.user.roleName != 'Woman') {
            redirect('/frauen')
        }
    }
  }