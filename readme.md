# Structure du Projet

Ce projet est divisé en deux parties principales :

## Organisation des Dossiers

- `/client` : Contient l'application front-end
- `/server` : Contient l'application back-end

## URLs d'Accès

### Front-end
- URL du site : https://riviart.alwaysdata.net/
- Hébergement : alwaysdata

### Back-end (API)
- URL de base de l'API : https://moviie-booker.onrender.com
- Hébergement : Render

## ⚠️ Note Importante sur l'API

En raison de l'utilisation de la version gratuite de Render pour l'hébergement du back-end, veuillez noter :
- Un temps de démarrage initial de 3 à 5 minutes est nécessaire
- Ce délai est dû au redémarrage automatique du serveur sur la version gratuite de Render
- Une fois démarré, l'API fonctionne normalement

## Documentation de l'API

URL vers la documentation : https://moviie-booker.onrender.com/api-docs

### Authentification

#### Inscription
- Méthode : `POST`
- Endpoint : `/api/user-controller/auth/register`
- Corps de la requête :
```json
{
    "email": "exemple@email.com",
    "password": "motdepasse",
    "username": "nomutilisateur"
}
```

#### Connexion
- Méthode : `POST`
- Endpoint : `/api/user-controller/auth/login`
- Corps de la requête :
```json
{
    "email": "exemple@email.com",
    "password": "motdepasse"
}
```
- Retourne un token d'accès à utiliser pour les requêtes authentifiées

#### Profil Utilisateur
- Méthode : `GET`
- Endpoint : `/api/user-controller/profile`
- Authentification requise : Bearer Token

### Films

#### Liste des Films
- Méthode : `GET`
- Endpoint : `/api/movies`
- Paramètres de requête :
  - `page` : Numéro de page (ex: ?page=15)
  - `search` : Terme de recherche
  - `limit` : Nombre de résultats par page (ex: ?limit=10)
- Authentification requise : Bearer Token

### Réservations

#### Liste des Réservations
- Méthode : `GET`
- Endpoint : `/api/reservations`
- Authentification requise : Bearer Token

#### Créer une Réservation
- Méthode : `POST`
- Endpoint : `/api/reservations`
- Corps de la requête :
```json
{
    "seanceId": 5,
    "dateReservation": "2025-02-05T16:01:00Z"
}
```
- Authentification requise : Bearer Token

#### Supprimer une Réservation
- Méthode : `DELETE`
- Endpoint : `/api/reservations/:id`
- Authentification requise : Bearer Token
- Note : Remplacer `:id` par l'identifiant de la réservation

## Sécurité
Toutes les requêtes (sauf login et register) nécessitent un token Bearer dans le header d'authentification.
