import supabase from '../config/supabase.js';

export default class Usuario {
    static async findUserWithRole(idUsuario) {
        const { data: usuario, error: usuarioError } = await supabase
            .from('usuario')
            .select('id_usuario, contraseña')
            .eq('id_usuario', String(idUsuario).trim())
            .maybeSingle();

        if (usuarioError || !usuario) {
            return { data: null, error: usuarioError };
        };

        const { data: asignar, error: asignarError } = await supabase
            .from('asignar')
            .select('id_rol, rol(nombre_rol)')
            .eq('id_usuario', usuario.id_usuario)
            .maybeSingle();

        if (asignarError || !asignar?.id_rol) {
            return { data: null, error: asignarError };
        };

        return {
            data: {
                id_usuario: usuario.id_usuario,
                contraseña: usuario.contraseña,
                id_rol: asignar.id_rol,
                nombre_rol: asignar.rol?.nombre_rol ?? null,
            },
            error: null,
        };
    }

    static verifyPassword(attemptedPassword, storedPassword) {
        if (attemptedPassword == null || storedPassword == null) {
            return false;
        };
        return String(attemptedPassword) === String(storedPassword);
    }
}
