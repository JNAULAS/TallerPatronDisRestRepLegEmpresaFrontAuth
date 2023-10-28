import Role from '../models/role';

export const get_Roles = async (req, res) => {
    const list_roles = await Role.find();
    console.log('lista de roles')
    console.log(list_roles)
}