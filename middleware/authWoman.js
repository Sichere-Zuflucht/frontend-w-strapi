export default function ({ redirect, $strapi, route }) {
    if (!$strapi.user) {
        window.localStorage.setItem('redirectBackTo', route.fullPath)
        redirect('/registration/signin')
    } else {
        console.log('role',$strapi.user.roleName)
        if($strapi.user.roleName != 'woman') {
            redirect('/beratung')
        }
    }
  }