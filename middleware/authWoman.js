export default function ({ redirect, $strapi, route }) {
    if (!$strapi.user) {
        window.localStorage.setItem('redirectBackTo', route.fullPath)
        redirect('/registration/signin')
    } else {
        if($strapi.user.roleName != 'Woman') {
            redirect('/beratung')
        }
    }
  }