import User from '../models/user'
import Role from '../models/role'

export const createUser = async (req, res) => {
    try {
        const {username, password, name, lastName, email, roles} = req.body
        const roles_found = await Role.find({ name: {$in: roles} })
        
        const user = new User({ username, password, name, lastName, email, roles: roles_found.map( (role) => role._id ) })
        user.password = await User.encrypted_password(user.password)
        const saved_user = await user.save()
        
        return res.status(201).json({
            _id: saved_user._id,
            username: saved_user.username,
            name: saved_user.name,
            lastName: saved_user.lastName,
            email: saved_user.email,
            roles: saved_user.roles
        })
    } catch(error) {
        console.error(error)
    }
}
