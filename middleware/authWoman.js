export default function ({ redirect, $strapi }) {
    console.log($strapi.user)
    if (!$strapi.user) {
        redirect('/login')
    } else {
        if($strapi.user.roleName != 'woman') {
            redirect('/')
        }
    }
  }