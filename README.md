- [Comment il est construit?](#construction)
- [Comment faire fonctionner le projet?](#fonctionnement)
- [Comment tu envisages la partie hébergement?](#hébergement)
- [Comment tu vois une éventuelle montée en charge du système?](#scaling)
- [Ses forces, ses faiblesses](#ses-forces-et-ses-faiblesses)


## Construction

Backend OMDB basé sur ExpressJS et Typescript.

Le projet utilise des **middlewares** et des **controllers**.
- Les middlewares afin d'autoriser seulement les personnes ayant une clé api OMDB
- Les controllers pour exécuter la logique de l'application.


## Fonctionnement

### **Lancement du projet**

Pour faire fonctionner le projet, il faut :
1. créer un .env à partir du .env.example
```bash
> cp .env.example .env
```

2. éditer le .env et changer ces trois variables  :
```bash
GOOGLE_SPREADSHEET_FILE_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

- ```GOOGLE_SPREADSHEET_FILE_ID``` est l'id du Google Spreadsheet où les changements seront faits.

> L'id est la dernière chaîne de caractères dans l'url du spreadsheet. Par exemple, dans l'url https://docs.google.com/spreadsheets/d/1qpyC0XzvTcKT6EISywvqESX3A0MwQoFDE8p-Bll4hps/edit#gid=0, le spreadsheet ID est ```1qpyC0XzvTcKT6EISywvqESX3A0MwQoFDE8p-Bll4hps```.

- ```GOOGLE_SERVICE_ACCOUNT_EMAIL``` est l'email du compte de service. e.g. : xxx@xxx-xxx.iam.gserviceaccount.com
- ```GOOGLE_PRIVATE_KEY``` est la clé privée du compte de service.

> Afin d'obtenir de créer le compte de service, suivre le tutoriel suivant : https://developers.google.com/workspace/guides/create-credentials#service-account.<br>Un fichier ```.json``` est téléchargé dans lequel on retrouve deux propriétés ```client_email``` et ```private_key``` qui sont les valeurs à renseigner.

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email>
GOOGLE_PRIVATE_KEY=<private_key>
```

3. partager le Google Spreadsheet avec l'email du compte de service et le mettre en **Éditeur**

4. enfin, exécuter les deux commandes suivantes afin de lancer le serveur
```bash
> yarn install
> yarn dev
```

### **Utilisation du projet**


| Method   | URL                                      | Description |
|----------|------------------------------------------|-------------|
| `GET`    | /films        | récupérer les films Fast & Furious  |
| `GET`    | /films/pirates| récupérer les films Pirates des Caraïbes et générer une feuille Google Spreadsheet   |

> La clé api OMDB doit est fournie dans toutes les requêtes au serveur afin d'éviter les accès anonymes à l'API

```bash
$ curl --location 'http://localhost:8080/films' --header 'Authorization: Bearer <OMDB_API_KEY>'
```


## Hébergement

L'hebergement pour un projet simple comment celui-ci peut être fait avec une PaaS (platform as a service) comme Heroku par exemple. Cette plateforme permet d'obtenir un serveur de production clé en main.
Ainsi, quand la configuration d'heroku est terminée, chaque push sur la branche master deviendra une mise en production.

## Scaling

Le framework choisi est performant et scalable, il faut tout de même mettre en place des outils de monitoring et de mise en cache, ainsi qu'une architecture évolutive, pour garantir la performance de notre système en cas de forte demande.

## Ses forces et ses faiblesses

Forces:
- rapidité et efficacité
- scalabilité: une architecture solide afin de pouvoir augmenter la complexité du projet
- facilité d'utilisation du framework

Faiblesses:
- sécurité: il faut mettre en place des sécurités non comprises dans le framework
- la mise à l'échelle: si le projet est utilisé par un grand nombre de personnes, il faudrait sûrement l'optimiser. [Scaling](#scaling)

Mise en production:
- s'assurer que le code est propre et fonctionne correctement sur un serveur local, en utilisant des tests unitaires, tests fonctionnels et des intégrations continues
- mettre en place un environnement de production sécurisé notamment à l'aide de certificats SSL
- nécessite une plateforme de déploiement comme vu précédemment. [Hébergement](#hébergement)