# Progetto Programmazione Avanzata - Joshua Sgariglia

## 1 - Obiettivo del progetto e Strumenti utilizzati

### 1.1 - Obiettivo del Progetto

Questo progetto consiste nella realizzazione di un sistema backend per la gestione di prenotazioni di slot temporali su risorse HPC (High Performance Computing), come GPU o altri dispositivi. L'accesso e le azioni sono differenziate in base al ruolo (Pubbliche, Utente o Admin), e tutte le rotte, ad eccezione di quelle pubbliche, sono protette tramite JWT e autorizzazione basata su ruoli. Il sistema permette agli utenti autenticati di visualizzare, effettuare, cancellare e monitorare le proprie richieste di utilizzo, con un sistema di token virtuali per gestire i costi. Gli admin autenticati possono invece creare nuovi account, eseguire operazioni CRUD sui calendari, visualizzare e approvare\rifiutare le richieste di utilizzo degli utenti, e ricaricare i loro token.

Il progetto è stato realizzato per il corso di Programmazione Avanzata dell'Università Politecnica delle Marche (UNIVPM).

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

Di seguito è fornita la struttura dell'applicazione in maniera schematica. Successivamente è presente una descrizione più discorsiva dei componenti principali.

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

Il progetto segue una struttura modulare basata su una variante estesa dell'architettura MVC. Il codice sorgente è contenuto nella directory [`src/`](./src), suddivisa logicamente in sotto-moduli:

- [`controllers/`](./src/controllers): contiene i controller responsabili della gestione delle richieste in ingresso e del coordinamento con i servizi. Vi è un controller per ogni gruppo di rotte.
- [`services/`](./src/services): implementa la logica di business centralizzata, orchestrando l’interazione tra controller, repository e utilità. Vi è una classe service per ogni classe controller.
- [`repositories/`](./src/repositories): fornisce un layer di accesso ai dati, astraendo rispetto ai modelli e alla logica base di Sequelize. Vi è una repository per ciascuna classe model.
- [`models/`](./src/models): definisce le entità dell'applicazione e realizza l'ORM con Sequelize.
- [`routes/`](./src/routes): contiene le definizioni delle rotte Express divise in tre gruppi (pubbliche, utente, admin).
- [`middleware/`](./src/middleware): include middleware per autenticazione, logging, gestione degli errori e validazione schema-based.

Particolarmente articolata è la directory [`utils/`](./src/utils), suddivisa in più sottocartelle e file di utilità:

- [`connector/`](./src/utils/connector): connessione al database, inizializzazione delle classi model e decoratore per le transazioni.
- [`factories/`](./src/utils/factories): generazione di risposte di errore e di successo.
- [`responses/`](./src/utils/responses): definizioni comuni per formattare le risposte HTTP.
- [`validation/`](./src/utils/validation): schemi Zod e helper per la validazione dei payload.

- *AsyncRouter.ts*: wrapper asincrono per la gestione centralizzata degli errori lanciati nei service.
- *config.ts*: file di configurazione per variabili d’ambiente.
- *datetimeUtils.ts*: funzioni per la gestione e manipolazione delle date.
- *enums.ts*: enumeratori utilizzati per stati, ruoli, e tipi di errore e di successo usati nelle factory.
- *interfaces.ts*: interfacce TypeScript per oggetti personalizzati forniti in risposta ad alcune richieste HTTP.
- *logger.ts*: console e file logger basato sulla libreria Winston.

Completano la struttura del progetto le cartelle [`docs/`](./docs) con i diagrammi UML e E-R, [`scripts/`](./scripts) con gli script SQL di inizializzazione del database, e [`tests/`](./tests) contenente gli unit test Jest.

### 4.2 - Pattern Architetturali utilizzati

Nella definizione dell'architettura del progetto sono stati utilizzati i pattern *MVC* e *Repository*, messi in comunicazione da uno strato *Service*.

#### Pattern MVC (Model‑View‑Controller)
Il pattern **MVC** è una suddivisione classica dell’applicazione in tre componenti chiave: **Model**, **View** e **Controller**. Il *Model* incapsula il dominio e lo stato, la *View* visualizza l’interfaccia utente con i dati, e il *Controller* gestisce l’interazione utente, orchestrando le chiamate al Model e aggiornando la View.  

Nel progetto, i *Controller* ricevono le richieste HTTP, interagiscono con i *Service* per ottenere e modificare i dati dei *Model* tramite le *Repository*, e inviano i dati elaborati al client. I *Model* rappresentano semplicemente le entità del dominio e non includono la logica di business, mentre le *View* classiche non sono presenti, trattandosi di un backend.

#### Service Layer
Il **Service layer** introduce uno strato di logica di business tra *Controller* e *Repository*. Qui si trovano validazioni legate al dominio, calcoli e orchestrazioni fra più entità. Questo approccio consente ai *Controller* di restare “leggeri”, occupandosi solo di ricevere le richieste HTTP, estrarre i dati in input da passare ai *Service*, e preparare la risposta con i dati forniti dai *Service*: tutta la logica significativa è collocata nei *Service*.

Nel progetto, ogni operazione importante (es. registrazione utente, gestione dei calendari, approvazione delle richieste) è gestita di un metodo di una classe *Service*. Tali classi accedono alle *Repository* per persistere o recuperare dati, applicano logiche complesse (es. validazioni incrociate che coinvolgono più classi model) e restituiscono a un *Controller* un output pronto per essere iniettato in una risposta generata tramite una factory, da inviare al client. Le classi *Service* sono utilizzate per inizializzare i rispettivi *Controller* tramite Dependency Injection.

#### Pattern Repository
Il **Repository** è un ponte tra la logica dell’applicazione e la persistenza dei dati. Espone metodi come `getById`, `getByUsername`, `add` nascondendo i dettagli di come tali operazioni sono eseguite. Si occupa esclusivamente di operazioni CRUD su entità, senza contenere logica di business e senza lanciare eccezioni.

Nel progetto, le quattro entità — `Calendar`, `ComputingResource`, `Slot`, e `User` — sono rappresentate da classi model che estendono la classe base `Model` fornita da Sequelize. Per ciascuna di queste classi model è definita una repository dedicata, incaricata di gestire le operazioni di accesso e persistenza dei dati. Tali repository incapsulano le interazioni con il database e vengono iniettate nei *Service* tramite Dependency Injection, permettendo così di mantenere separata la gestione della persistenza.

#### Middleware

Il pattern **Middleware**, ampiamente adottato in framework come Express, consiste in una catena di funzioni che ricevono un oggetto richiesta (`req`), risposta (`res`) e una funzione `next()` per passare il controllo al middleware successivo. Ogni middleware può modificare la richiesta o la risposta, eseguire logica aggiuntiva o gestire errori, rendendo il flusso delle operazioni modulare e facilmente estendibile.

In questo progetto, il pattern middleware viene applicato seguendo un ordine ben definito e coerente per ogni richiesta HTTP. Il primo file ad agire è [`loggingHandlers.ts`](./src/middleware/loggingHandlers.ts), che esegue il logging della richiesta in ingresso tramite il middleware `logRouteMethod`. Subito dopo entra in azione [`authHandlers.ts`](./src/middleware/authHandlers.ts), che esegue una catena di controlli sull'autenticazione: verifica la presenza e il formato dell'header di autorizzazione, convalida e decodifica il token JWT tramite *jsonwebtoken*, ne verifica lo schema tramite Zod, e infine controlla che l’utente abbia il ruolo autorizzato per la rotta. Successivamente, interviene [`validationHandlers.ts`](./src/middleware/validationHandlers.ts), che attraverso una serie di handler generati e basati su schema Zod, convalida i parametri URL e/o il corpo della richiesta in base alla rotta specifica. Infine, una volta completate tutte queste fasi preliminari, la richiesta raggiunge una action di un controller specifico, che contiene la logica principale da eseguire. Se durante l’intera catena si verifica un errore, viene passato ai middleware di [`errorHandlers.ts`](./src/middleware/errorHandlers.ts), che sono applicati alla fine della catena: prima si gestiscono errori relativi a rotte non definite, poi errori come `ErrorType`, poi errori già istanziati come `ErrorResponse`, e infine eventuali errori imprevisti tramite un generico gestore delle eccezioni. Per gli errori, in ogni caso alla fine viene generato un oggetto di tipo `ErrorResponse`, che viene fornito al client in risposta.


### 4.3 - Design Pattern utilizzati

#### Singleton

Il **Singleton** è un pattern architetturale che garantisce che una determinata classe abbia una sola istanza globale durante l'intero ciclo di vita dell'applicazione. Questo pattern è utile quando si desidera centralizzare la gestione di una risorsa condivisa. Il Singleton espone un metodo pubblico (spesso chiamato `getInstance`) che restituisce l'istanza unica, creando l'oggetto solo alla prima invocazione.

##### Modulo [DatabaseConnector.ts](./src/utils/connector/DatabaseConnector.ts)

Nel progetto, il pattern Singleton è utilizzato nella classe `DatabaseConnector` dell'omonimo modulo per garantire un'unica istanza della connessione Sequelize al database PostgreSQL. Il costruttore della classe è privato, impedendo l'istanziazione esterna. Il metodo statico `getInstance()` controlla se l'istanza Sequelize esiste già: se non esiste, viene creata tramite `getDatabaseConnector()` e salvata nella proprietà statica `instance`. Questo approccio evita che vengano create connessioni multiple e ridondanti al database.

#### Factory method

Il **Factory Method** è un design pattern creazionale che fornisce un'interfaccia per creare oggetti. Invece di usare direttamente `new`, l’oggetto viene creato attraverso un metodo dedicato, centralizzando la logica di costruzione e facilitando l’estensione e la manutenzione del codice.

##### Modulo [errorFactory.ts](./src/utils/factories/errorFactory.ts)

Nel progetto, il file [`errorFactory.ts`](./src/utils/factories/errorFactory.ts) applica questo pattern attraverso la classe `ErrorFactory`. Il metodo statico `getError()` agisce come factory method, ricevendo un valore dall'enum `ErrorType` e restituendo un’istanza di una delle classi di errore definite in [`errorResponses.ts`](./src/utils/responses/errorResponses.ts), tutte eredi della classe base `ErrorResponse`. In base al tipo di errore passato, viene istanziata la classe corrispondente (es. `BadRequest`, `TokenExpired`, `InvalidInputValue`, ecc.), con un messaggio opzionale. In questo modo si evita l'abuso di `if` o `switch` sparsi nel codice applicativo, concentrando la generazione delle risposte di errore HTTP in un solo punto. *ErrorFactory* è utilizzata nella validazione dei dati forniti in input e nel middleware per quanto riguarda gli handler degli errori.

##### Modulo [successFactory.ts](./src/utils/factories/successFactory.ts)

Nel file [`successFactory.ts`](./src/utils/factories/successFactory.ts), il *Factory Method* viene applicato tramite la classe `SuccessResponseFactory`, la quale centralizza la creazione di oggetti di risposta positiva verso i client. Il metodo statico `getResponse()` agisce da factory method: accetta un valore dell'enum `SuccessType` e opzionalmente un oggetto `data` da iniettare nell'oggetto risposta da generare, e restituisce quindi un'istanza della classe di risposta corrispondente, che eredita `SuccessResponse`, definita in [`successResponses.ts`](./src/utils/responses/successResponses.ts). In base al tipo specificato (es. `CalendarCreated`, `SlotRequestsRetrieved`, `AccountLoggedIn`, ecc.), viene creata la classe di successo adeguata. Questo approccio consente di generare risposte in modo coerente. *SuccessResposeFactory* è utilizzata nelle action dei Controller per generare risposte iniettandovi i dati ottenuti dai Service.

##### Modulo [validationHandlers.ts](./src/middleware/validationHandlers.ts)

Nel file [`validationHandlers.ts`](./src/middleware/validationHandlers.ts), la funzione `validationHandlerGenerator` rappresenta un esempio di factory method: essa accetta come parametri uno schema di validazione (definito con Zod), una sorgente dei dati (`body`, `params`, `query`) e un flag opzionale. In base a questi parametri, restituisce una funzione middleware specifica, che valida i dati in arrivo e, se corretti, li salva in `res.locals.validated`. Ogni handler esportato (es. `loginPayloadHandler`, `uuidParameterHandler`, ecc.) è un'istanza generata dalla factory, costruita passando lo schema e le opzioni necessarie.


##### Modulo [authHandlers.ts](./src/middleware/validationHandlers.ts)

Anche in [`authHandlers.ts`](./src/middleware/authHandlers.ts) troviamo un'applicazione simile del pattern. La funzione `verifyAuthorizationGenerator` genera dinamicamente un middleware che verifica il ruolo utente in base a un parametro passato (`UserRole.User` oppure `UserRole.Admin`). Questo consente di produrre catene di autenticazione specifiche su base ruolo (`userAuthHandlers`, `adminAuthHandlers`), evitando la duplicazione del codice per l'autorizzazione.


#### Decorator

Il **design pattern Decorator** è un pattern strutturale che consente di estendere o modificare il comportamento di un oggetto in modo flessibile, senza alterarne la struttura originale. Questo viene fatto "decorando" una funzione o un oggetto con altre funzioni che aggiungono funzionalità prima o dopo l’esecuzione dell’originale.

##### Modulo [connect.ts](./src/utils/connector/connect.ts)

Nel codice presente nel file [connect.ts](./src/utils/connector/connect.ts), il pattern Decorator viene implementato tramite funzioni higher-order che arricchiscono la logica di connessione al database. La funzione `connect` rappresenta il comportamento di base, ovvero la semplice autenticazione con Sequelize. Questo comportamento viene decorato con `withRetry`, che aggiunge la logica di retry con backoff esponenziale, e successivamente con `withConnectionLogged`, che introduce messaggi di log prima e dopo la connessione. Ogni decoratore riceve in input una funzione `ConnectionFunction` e ne restituisce una versione estesa, mantenendo lo stesso contratto. In questo modo, il codice risulta modulare e riusabile, con una chiara separazione delle responsabilità. 

##### Modulo [transactionDecorator.ts](./src/utils/connector/transactionDecorator.ts)

Nel modulo [transactionDecorator.ts](./src/utils/connector/transactionDecorator.ts), il pattern Decorator viene utilizzato per estendere il comportamento di una funzione asincrona con la gestione automatica delle transazioni tramite Sequelize. La funzione `withTransaction` agisce come un decoratore: riceve in input una funzione (`transactionCallback`) che incapsula la logica applicativa da eseguire all'interno di una transazione e la "decora" aggiungendo il controllo sul commit o sul rollback. In caso di esecuzione corretta, `withTransaction` effettua il commit; in caso di errore, esegue un rollback e propaga l'eccezione. Questo approccio consente di separare la gestione della transazione dalla logica che ne fa uso, migliorando la riusabilità e semplificando il codice nei metodi del Service, layer in cui le transazioni sono utilizzate.

##### Modulo [AsyncRouter.ts](./src/utils/AsyncRouter.ts)

Anche la classe `AsyncRouter` può essere vista come un'applicazione del pattern Decorator. Qui viene utilizzato per decorare i controller asincroni di Express con una gestione automatica degli errori: la funzione `asyncHandlerWrapper` avvolge la action del controller, intercettando eventuali eccezioni asincrone e inoltrandole alla catena di middleware tramite `next()`. Questo consente di evitare blocchi `try-catch` ripetitivi all’interno di ogni controller. Il metodo `wrapHandlers` garantisce che solo l’ultimo handler (la action del controller) venga decorato, lasciando intatti eventuali middleware di logging, autenticazione o validazione. Ogni metodo della classe (`getAsync`, `postAsync`, ecc.) incapsula così il comportamento standard del Router di Express, con un livello aggiuntivo di gestione delle eccezioni.





### 4.4 - Altri aspetti implementativi interessanti

#### Inizializzazione del database

L'inizializzazione automatica del database PostgreSQL è gestita attraverso l'integrazione tra Docker Compose e una serie di script SQL presenti nella directory [`./scripts`](./scripts). All’avvio del container `postgres`, Docker rileva automaticamente la presenza della cartella montata come volume in `/docker-entrypoint-initdb.d` e ne esegue i file `.sql` in ordine alfanumerico: lo script `00_database.sql` crea il database, `01_tables.sql` definisce la struttura delle tabelle, e `02_seeding.sql` popola le tabelle con dati iniziali. Questo approccio consente di avere un database pronto all’uso in fase di avvio, senza interventi manuali o configurazioni aggiuntive.

#### File di configurazione

Il file [`config.ts`](./src/utils/config.ts) centralizza la configurazione dell'applicazione, gestendo sia variabili di ambiente provenienti dal file `.env`, sia parametri specifici del dominio applicativo. In fase di avvio, il file carica il contenuto del `.env` tramite la libreria `dotenv`, notificando tramite log eventuali errori di caricamento. Successivamente, definisce una serie di variabili che leggono dal processo (`process.env`) con valori di fallback. In aggiunta, il file gestisce il caricamento dei certificati RSA da una directory `certs/`, fondamentali per la firma e la verifica dei token JWT: in caso di errore nella lettura dei certificati, l’applicazione si arresta immediatamente con un errore fatale. Oltre ai parametri legati ai servizi, il file include anche configurazioni legate al dominio applicativo, come limiti di lunghezza per nomi utente, email e titoli delle richieste, soglie di penalità per l’uso scorretto delle risorse, e impostazioni di salting per le password e di cifratura per i JWT. In questo modo, `config.ts` agisce da punto unico di riferimento per la configurazione.


#### Schemi di validazione Zod

Il sistema di validazione nel progetto si basa sugli schemi Zod e sulla funzione `validate`, definita nel file [`validate.ts`](./src/utils/validation/validate.ts). Questa funzione si occupa di ricevere uno schema Zod e dei dati in input, verificandone la correttezza. In particolare, controlla inizialmente se l’input è assente (a meno che non sia marcato come opzionale) e, in seguito, delega la validazione allo schema fornito. Se lo schema fallisce, la funzione analizza il primo errore restituito da Zod e lo traduce in un errore semantico più leggibile attraverso l’uso di un `ErrorFactory`, utilizzando uno switch per restituire messaggi specifici a seconda del tipo di errore (campo mancante, tipo errato, formato non valido, ecc.).

Il file [`schemas.ts`](./src/utils/validation/schemas.ts) contiene la definizione di tutti gli schemi di validazione utilizzati nelle varie operazioni dell'applicazione. Gli schemi sono costruiti con la libreria Zod e garantiscono che i payload rispettino determinati vincoli strutturali e semantici. Alcuni di questi schemi sfruttano `.refine()` per definire regole di validazione personalizzate non esprimibili tramite i vincoli standard: ad esempio, per verificare che il datetime di fine di una richiesta sia successivo a quello di inizio, o che una richiesta venga fatta almeno 24 ore prima dell’orario di inizio desiderato.

A supporto degli schemi, [`schemasUtils.ts`](./src/utils/validation/schemasUtils.ts) fornisce funzioni riutilizzabili come `createDatetimeSchema`, che permette di definire formati specifici per date e orari combinando espressioni regolari e validazioni custom tramite `.refine()`. Consente di assicurare che i datetime rispettino il formato atteso e rappresentino effettivamente date valide.


---

## 5 - Unit Testing



---

## 6 - Avvio del Progetto con Docker

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
