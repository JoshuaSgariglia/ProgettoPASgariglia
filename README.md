# Progetto Programmazione Avanzata - Joshua Sgariglia

## 1 - Obiettivo del progetto e Strumenti utilizzati

### 1.1 - Obiettivo del Progetto

Questo progetto consiste nella realizzazione di un sistema backend per la gestione di prenotazioni di slot temporali su risorse HPC (High Performance Computing), come GPU o altri dispositivi. L'accesso e le azioni sono differenziate in base al ruolo (Pubbliche, Utente o Admin), e tutte le rotte, ad eccezione di quelle pubbliche, sono protette tramite JWT e autorizzazione basata su ruoli. Il sistema permette agli utenti autenticati di visualizzare, effettuare, cancellare e monitorare le proprie richieste di utilizzo, con un sistema di token virtuali per gestire i costi. Gli admin autenticati possono invece creare nuovi account, eseguire operazioni CRUD sui calendari, visualizzare e approvare\rifiutare le richieste di utilizzo degli utenti, e ricaricare i loro token.

Il progetto è stato realizzato per il corso di Programmazione Avanzata dell'Università Politecnica delle Marche (UNIVPM).

---

### 1.2 - Strumenti e Librerie utilizzati

#### Strumenti e Tecnologie Principali

- [**Node.js**](https://nodejs.org/) – Runtime JavaScript lato server  
- [**Express**](https://expressjs.com/) – Framework per la creazione di API RESTful  
- [**TypeScript**](https://www.typescriptlang.org/) – Estensione di JavaScript con tipizzazione statica  
- [**PostgreSQL**](https://www.postgresql.org/) – Database relazionale scelto per la persistenza dei dati  
- [**Docker**](https://www.docker.com/) – Per la containerizzazione e orchestrazione dei servizi  
- [**Visual Studio Code**](https://code.visualstudio.com/) – Per lo sviluppo dell'API  
- [**Postman**](https://www.postman.com/) – Per il testing dell'API  
- [**DBeaver**](https://dbeaver.io/) – Per l'interazione con il database tramite interfaccia grafica  
- [**JWT (RSA 256)**](https://jwt.io/) – Sistema di autenticazione basato su token con crittografia asimmetrica  

#### Librerie e Dipendenze TypeScript

- [**Sequelize**](https://sequelize.org/) – Libreria per l'ORM compatibile con PostgreSQL  
- [**pg**](https://node-postgres.com/) – Driver di PostgreSQL per Node.js  
- [**jsonwebtoken**](https://github.com/auth0/node-jsonwebtoken) – Per la firma e verifica dei token JWT  
- [**Zod**](https://zod.dev/) – Libreria di validazione schema-based utilizzata nei middleware  
- [**Winston**](https://github.com/winstonjs/winston) – Logging sia su console che su file  
- [**dotenv**](https://github.com/motdotla/dotenv) – Gestione delle variabili di ambiente tramite file `.env`  
- [**bcrypt**](https://github.com/kelektiv/node.bcrypt.js) – Hashing e salting delle password degli utenti  
- [**http-status-codes**](https://www.npmjs.com/package/http-status-codes) – Utilizzo di enumerabili per gli Status Code HTTP  
- [**Jest**](https://jestjs.io/) – Framework di testing usato per la scrittura degli unit test

---

## 2 - Analisi

### 2.1 - Entità Principali

- **User**: rappresenta un utente autenticato con un numero limitato di token.
- **Admin**: rappresenta un utente con privilegi elevati per la gestione del sistema.
- **ComputingResource**: risorsa computazionale (es. GPU o CPU) che può essere assegnata ad un calendario per l'utilizzo.
- **Calendar**: calendario associato ad una risorsa computazionale con costo orario.
- **SlotRequest**: richiesta di prenotazione su un calendario, effettuata da uno User.

### 2.2 - Validazione e Vincoli

#### Utenti e Sicurezza

- Lo username e l'email degli utenti devono essere unici.
- Le password devono essere memorizzate soltanto dopo essere state crittografate (hashing e salting).
- Il sistema deve verificare l'autenticazione tramite JWT e l'autorizzazione basata su ruoli degli utenti per tutte le rotte non pubbliche.
- Il sistema di autenticazione deve far uso di crittografia asimmetrica con algoritmo RSA 256.

#### Calendari e Risorse

- Il nome di un calendario deve essere unico.
- I calendari possono fare uso di una sola risorsa alla volta.
- Una risorsa non può essere utilizzata da più di un calendario alla volta, escludendo i calendari archiviati.

#### Prenotazioni di Slot

- Le prenotazioni degli slot devono avere durata in ore intere, con durata minima di un'ora.
- La data di fine prenotazione deve essere successiva a quella di inizio. Le prenotazioni devono avvenire con almeno 24 ore di anticipo per dare tempo agli admin di visualizzarle e approvarle\rifiutarle.
- Bisogna impedire che vi siano sovrapposizioni di richieste approvate.
- I token sono pagati al momento della creazione di una richiesta valida. Le richieste non valide (token insufficienti) devono essere comunque salvate.
- In caso di eliminazione di una richiesta valida, l'utente ha diritto a un risarcimento legato al numero di ore non ancora utilizzate.
- L'utente non deve poter eliminare richieste archiviate, rifiutate o pienamente utilizzate.
- In caso di rifiuto di una richiesta, l'admin deve fornire una motivazione e l'utente ha diritto a un pieno risarcimento.

### 2.3 - Diagrammi dei Casi d'Uso

I diagrammi dei casi d'uso sono disponibili nella cartella [`/docs/use_case_diagrams`](<docs/use_case_diagrams>).

*User* e *Admin* rappresentano attori che possiedono un account con omonimo ruolo. *AnyUser* rappresenta invece un utente qualsiasi, anche non autenticato. Comprende gli altri due tipi di attori, rispetto a cui è una generalizzazione.

#### Attori
![Diagramma dei casi d'uso - Attori](<docs/use_case_diagrams/1 - Attori.jpg>)

#### Relazioni tra gli attori
![Diagramma dei casi d'uso - Relazioni tra gli attori](<docs/use_case_diagrams/2 - Relazioni tra attori.jpg>)

#### Casi d'uso pubblici
![Diagramma dei casi d'uso - Casi d'uso pubblici](<docs/use_case_diagrams/3 - Use Case Pubblici.jpg>)

#### Casi d'uso per User
![Diagramma dei casi d'uso - Casi d'uso per User](<docs/use_case_diagrams/4 - Use Case Utente.jpg>)

#### Casi d'uso per Admin
![Diagramma dei casi d'uso - Casi d'uso per Admin](<docs/use_case_diagrams/5 - Use Case Admin.jpg>)

---

## 3 - Progettazione

### 3.1 - Diagramma Entity-Relationship

Il diagramma E-R è disponibile nella cartella [`/docs/entity_relationship_diagram`](<docs/entity_relationship_diagram>) ed è mostrato di seguito.

La relazione *Usage* è semplificata e riguarda solo le risorse assegnate a calendari non archiviati. Un *Calendar*, archiviato o non, è sempre associato a una sola *ComputingResource*, mentre una ComputingResource può essere associata al più a un Calendar attivo, e a molteplici Calendar archiviati.

![Diagramma entità-relazione](<docs/entity_relationship_diagram/E-R Diagram.jpg>)


### 3.2 - Diagrammi di Sequenza

I diagrammi di sequenza sono disponibili nella cartella [`/docs/sequence_diagrams`](<docs/sequence_diagrams>).

I diagrammi sono commentati tramite note sulla sinistra, che forniscono informazioni di contesto e spiegano il susseguirsi delle chiamate e delle operazioni eseguite. Poiché sono ben 29, non sono riportati qui per brevità, tuttavia di seguito è presente un loro elenco diviso in gruppi:

#### Autenticazione, Autorizzazione e Validazione

- [**01 - Authentication**](docs/sequence_diagrams/01%20-%20Authentication.jpg) – Verifica dell'autenticazione e della validità del token JWT fornito
- [**02 - User Authorization**](docs/sequence_diagrams/02%20-%20User%20Authorization.jpg) – Verifica dei permessi per User (controllo del ruolo)
- [**03 - Admin Authorization**](docs/sequence_diagrams/03%20-%20Admin%20Authorization.jpg) – Verifica dei permessi per Admin (controllo del ruolo)  
- [**04 - Validation**](docs/sequence_diagrams/04%20-%20Validation.jpg) – Validazione del payload in input

#### Rotte pubbliche

Le rotte pubbliche hanno il prefisso `/api`.

- [**05 - ServiceOnline**](docs/sequence_diagrams/05%20-%20ServiceOnline.jpg) – Verifica stato operativo del servizio  
  - Rotta `/api GET`
- [**06 - Login**](docs/sequence_diagrams/06%20-%20Login.jpg) – Accesso tramite credenziali (username e password) e ottenimento di un nuovo JWT    
  - Rotta `/api/login POST`

#### Rotte protette per User

Le rotte riservate agli utenti User hanno il prefisso `/api/user`.

##### Principali

- [**07 - CreateSlotRequest**](docs/sequence_diagrams/07%20-%20CreateSlotRequest.jpg) – Creazione richiesta di prenotazione     
  - Rotta `/api/user/request POST` 
- [**08 - GetRequestsByStatusAndCreation**](docs/sequence_diagrams/08%20-%20GetRequestsByStatusAndCreation.jpg) – Ricerca stato richieste dell'utente per stato e data creazione     
  - Rotta `/api/user/requests-status GET` 
- [**09 - DeleteSlotRequest**](docs/sequence_diagrams/09%20-%20DeleteSlotRequest.jpg) – Cancellazione di una richiesta  
  - Rotta `/api/user/request/:id DELETE` 
- [**10 - CheckCalendarSlot**](docs/sequence_diagrams/10%20-%20CheckCalendarSlot.jpg) – Verifica disponibilità slot in calendario 
  - Rotta `/api/user/calendar-slot GET`  
- [**11 - GetRequestsByStatusAndPeriod**](docs/sequence_diagrams/11%20-%20GetRequestsByStatusAndPeriod.jpg) – Ricerca richieste dell'utente per calendario, stato e intervallo di tempo di prenotazione
  - Rotta `/api/user/requests GET` 

##### Funzioni riutilizzate

- [**12 - GetRequestIfExistsAndOwnedByUser**](docs/sequence_diagrams/12%20-%20GetRequestIfExistsAndOwnedByUser.jpg) – Ottenimento richiesta se esistente e se l'utente è il creatore della richiesta
- [**13 - GetCalendarIfExistsAndNotArchived**](docs/sequence_diagrams/13%20-%20GetCalendarIfExistsAndNotArchived.jpg) – Ottenimento calendario se esistente e se non archiviato 
- [**14 - GetCalendarIfExists (User)**](docs/sequence_diagrams/14%20-%20GetCalendarIfExists%20(User).jpg) – Ottenimento calendario se esistente  

#### Rotte Protette per Admin

Le rotte riservate agli utenti Admin hanno il prefisso `/api/admin`.

##### Principali

- [**15 - CreateUser**](docs/sequence_diagrams/15%20-%20CreateUser.jpg) – Creazione di un nuovo utente 
  - Rotta `/api/admin/user POST` 
- [**16 - CreateCalendar**](docs/sequence_diagrams/16%20-%20CreateCalendar.jpg) – Creazione di un calendario che utilizza una risorsa  
  - Rotta `/api/admin/calendar POST` 
- [**17 - UpdateCalendar**](docs/sequence_diagrams/17%20-%20UpdateCalendar.jpg) – Modifica di un calendario esistente  
  - Rotta `/api/admin/calendar/:id PUT` 
- [**18 - GetCalendar**](docs/sequence_diagrams/18%20-%20GetCalendar.jpg) – Recupero dati di un calendario  
  - Rotta `/api/admin/calendar/:id GET` 
- [**19 - DeleteCalendar**](docs/sequence_diagrams/19%20-%20DeleteCalendar.jpg) – Eliminazione logica di un calendario  
  - Rotta `/api/admin/calendar/:id DELETE` 
- [**20 - ArchiveCalendar**](docs/sequence_diagrams/20%20-%20ArchiveCalendar.jpg) – Archiviazione di un calendario non più attivo 
  - Rotta `/api/admin/calendar/:id/archive PATCH`  
- [**21 - UpdateRequestStatus**](docs/sequence_diagrams/21%20-%20UpdateRequestStatus.jpg) – Approvazione o rifiuto di una richiesta  
  - Rotta `/api/admin/request-status/:id PATCH` 
- [**22 - GetRequestsStatusByCalendar**](docs/sequence_diagrams/22%20-%20GetRequestsStatusByCalendar.jpg) – Ricerca stato richieste per calendario
  - Rotta `/api/admin/calendar/:id/requests-status GET`   
- [**23 - UpdateUserTokens**](docs/sequence_diagrams/23%20-%20UpdateUserTokens.jpg) – Ricarica token di un utente
  - Rotta `/api/admin/user/:id/tokens PATCH` 

##### Funzioni riutilizzate

- [**24 - GetCalendarIfExists (Admin)**](docs/sequence_diagrams/24%20-%20GetCalendarIfExists%20(Admin).jpg) – Ottenimento calendario se esistente
- [**25 - GetUserIfExists**](docs/sequence_diagrams/25%20-%20GetUserIfExists.jpg) – Ottenimento utente se esistente
- [**26 - GetRequestIfExists**](docs/sequence_diagrams/26%20-%20GetRequestIfExists.jpg) – Ottenimento richiesta se esistente 
- [**27 - GetResourceIfExists**](docs/sequence_diagrams/27%20-%20GetResourceIfExists.jpg) – Ottenimento risorsa se esistente
- [**28 - CheckResourceAvailability**](docs/sequence_diagrams/28%20-%20CheckResourceAvailability.jpg) – Controllo disponibilità di una risorsa  
- [**29 - CheckOngoingRequests**](docs/sequence_diagrams/29%20-%20CheckOngoingRequests.jpg) – Verifica se ci sono richieste in corso per un calendario al momento presente


---

## 4 - Implementazione

### 4.1 - Struttura dell'applicazione

```plaintext
ProgettoPASgariglia/              
├── docs/         
│   ├── entity_relationship_diagrams/    
│   │   └── E-R Diagram.jpg    
│   │   
│   ├── sequence_diagrams/    
│   │   ├── 01 - Authentication.jpg   
│   │   ├── ...   
│   │   └── 29 - CheckOngoingRequests.jpg  
│   │          
│   └── use_case_diagrams/
│       ├── 1 - Attori.jpg   
│       ├── ...   
│       └── 5 - Use Case Admin.jpg
│      
├── scripts/    
│   ├── 00_database.sql   
│   ├── 01_tables.sql   
│   └── 02_seeding.sql  
│                        
├── src/                
│   ├── controllers/
│   │   ├── AdminController.ts   
│   │   ├── AuthController.ts   
│   │   └── UserController.ts 
│   │            
│   ├── middleware/
│   │   ├── authHandlers.ts 
│   │   ├── errorHandlers.ts   
│   │   ├── loggingHandlers.ts   
│   │   └── validationHandlers.ts 
│   │            
│   ├── models/
│   │   ├── Calendar.ts 
│   │   ├── ComputingResource.ts   
│   │   ├── SlotRequest.ts   
│   │   └── User.ts 
│   │            
│   ├── repositories/
│   │   ├── CalendarRepository.ts 
│   │   ├── ComputingResourceRepository.ts   
│   │   ├── SlotRequestRepository.ts   
│   │   └── UserRepository.ts 
│   │            
│   ├── routes/
│   │   ├── adminRoutes.ts   
│   │   ├── publicRoutes.ts   
│   │   └── userRoutes.ts 
│   │            
│   ├── services/
│   │   ├── AdminService.ts   
│   │   ├── AuthService.ts   
│   │   └── UserService.ts 
│   │              
│   ├── utils/
│   │   ├── connector/  
│   │   │   ├── connect.ts   
│   │   │   ├── DatabaseConnector.ts   
│   │   │   └── transactionDecorator.ts 
│   │   │         
│   │   ├── factories/    
│   │   │   ├── errorFactory.ts   
│   │   │   └── successFactory.ts 
│   │   │         
│   │   ├── responses/  
│   │   │   ├── errorResponses.ts   
│   │   │   ├── HttpResponse.ts   
│   │   │   └── successResponses.ts 
│   │   │         
│   │   ├── validation/  
│   │   │   ├── schemas.ts   
│   │   │   ├── schemasUtils.ts   
│   │   │   └── validate.ts 
│   │   │         
│   │   │
│   │   ├── AsyncRouter.ts             
│   │   ├── config.ts          
│   │   ├── datetimeUtils.ts               
│   │   ├── enums.ts                    
│   │   ├── interfaces.ts        
│   │   └── logger.ts  
│   │
│   └── app.ts     
│ 
├── tests/                         
│   ├── datetimeUtils/   
│   │   └── datetimeUtils.test.ts        
│   │
│   └── validation/                 
│       ├── LoginPayloadSchema.test.ts
│       ├── RequestApprovalPayloadSchema.test.ts      
│       └── SlotRequestPayloadSchema.test.ts         
│
├── .dockerignore
├── .gitignore
├── .docker-compose.yaml
├── Dockerfile
├── jest.config.js
├── package.json
├── README.md                  
└── tsconfig.json          
```

### 4.2 - Pattern Architetturali utilizzati



### 4.3 - Design Pattern utilizzati



### 4.4 - Inizializzazione del database



### 4.4 - Altri aspetti implementativi interessanti




---

## 5 - Unit Testing

---

## 🚀 6 - Avvio del Progetto con Docker

1. Clona la repository:
```bash
git clone https://github.com/JoshuaSgariglia/ProgettoPASgariglia.git
cd ProgettoPASgariglia
```

2. Crea un file .env:
```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hpc_booking
DB_HOST=db
DB_PORT=5432

JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
```

3. Avvia i servizi:
```bash
docker-compose up --build
```
