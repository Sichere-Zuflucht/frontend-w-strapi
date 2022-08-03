export default function ({ redirect, $strapi }) {
    if ($strapi.user) {
        if ($strapi.user.roleName == 'coach') redirect('/beratung')
        else redirect('/frauen')
        
    } else redirect('/registration/signin')
  }