export default function ({ redirect, $strapi }) {
    if ($strapi.user) {
        if ($strapi.user.roleName == 'Coach') redirect('/beratung')
        else redirect('/frauen')
        
    } else redirect('/registration/signin')
  }