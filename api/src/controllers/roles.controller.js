import Role from '../models/role';

export const get_Roles = async (req, res) => {
    try {
        const list_roles = await Role.find();
        console.log('lista de roles')
        console.log(list_roles)
        res.status(200).json({ list_roles })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ token: null, message: 'Internal server error' });
    }

}