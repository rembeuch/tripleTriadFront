import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query; 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setAlert("Le token est manquant. Veuillez vérifier l'URL.");
            return;
        }

        if (newPassword.length < 6) {
            setAlert("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setAlert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player: {
                        reset_password_token: token,
                        password: newPassword,
                        password_confirmation: confirmPassword,
                    },
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setAlert(data.message || 'Une erreur est survenue.');
                return;
            }

            setAlert("Mot de passe mis à jour avec succès.");
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe :", error);
            setAlert('Une erreur est survenue.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Nouveau Mot de Passe :</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            {newPassword.length < 6 && newPassword.length > 0 && (
                <p style={{ color: 'red' }}>Le mot de passe doit contenir au moins 6 caractères.</p>
            )}

            <label>Confirmation du Mot de Passe :</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <button type="submit">Réinitialiser le Mot de Passe</button>
            {alert && <p>{alert}</p>}
        </form>
    );
};

export default ResetPassword;
