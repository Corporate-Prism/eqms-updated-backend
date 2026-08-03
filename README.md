# eqms-backend

Express + MongoDB (Mongoose) API for the EQMS app. See the root `README.md` for how to run this alongside the frontend and the full route table.

## Structure

```
server.js                 entrypoint — Express app, CORS, JSON body parsing, error handler, non-blocking DB connect
src/config/db.js          Mongoose connection (short server-selection timeout, buffering disabled so failures are fast/clear)
src/middleware/auth.js    requireAuth (verifies JWT, sets req.user), requireRole (used only on POST /api/reset)
src/models/
  orgModels.js             City, Plant, Department, SubDepartment, Location, Role, User, Equipment,
                            Question, DeviationCategory, ChangeControlCategory, Product
                            (User also carries the password-hashing hooks — see Auth below)
  dmsModel.js              Document
  deviationsModel.js       Deviation
  qrmModel.js              QrmRecord
  changeControlModel.js    ChangeControl
  suppliersModel.js        Supplier
  embrModels.js            EmbrTemplate, EmbrRecord, EmbrRequest
  trainingModels.js        TrainingCourse, TrainingNeed, TrainingRecord
  index.js                 COLLECTIONS map — the single source of truth for collection name -> Model,
                            used by both the route mounter and /api/bootstrap
src/routes/
  auth.js                  signup / login / logout / me / verify-password — see Auth below
  crudFactory.js           generic router: GET /, GET /:id, POST /, PATCH /:id, DELETE /:id, PUT /replace-all
                            (accepts a `hideFields` option — used to strip `password` from every users/ response)
  index.js                 mounts /auth (public), then requireAuth, then crudFactory once per collection +
                            /health (public), /bootstrap, /reset (Master Admin only)
src/seed/
  data/                    seed data — ported directly from the frontend's src/data/*.js (same shapes)
  run.js                   seedDatabase() — used by `npm run seed` and POST /api/reset; hashes seed users'
                            plaintext passwords before insertMany (insertMany bypasses the model's save hook)
```

## Auth

JWT-based, stateless. `POST /api/auth/login` (or `/signup`) returns a token; the frontend sends it back as `Authorization: Bearer <token>` on every subsequent request. `requireAuth` middleware is applied to everything under `/api` except `/api/auth/*` and `/api/health` — see `routes/index.js`.

Passwords are hashed with bcrypt via two Mongoose hooks on the User schema (`orgModels.js`), not in the route handlers — this way it doesn't matter whether a password came in through `/api/auth/signup` or the generic `POST /api/users` (used by the Hierarchy admin screen's "Add User"):
- `pre('save')` — covers `Model.create()`, which both signup and the generic POST route use.
- `pre('findOneAndUpdate')` — covers `findByIdAndUpdate()`, which the generic PATCH route uses. `save()` hooks don't fire for query-based updates, so this needed its own hook.

`password` is stripped from every API response for the `users` collection (`hideFields: ['password']` where it's mounted in `routes/index.js`) — hashes never reach the browser, which is also why e-signature re-authentication (`SignatureModal` on the frontend) calls `POST /api/auth/verify-password` instead of comparing client-side like the localStorage-era version did.

`employeeId` has a unique index; the generic error handler in `server.js` turns any duplicate-key write (code 11000) into a 409 with a readable message, so this works the same whether the duplicate came from signup or an admin creating a user by hand.

**Not implemented:** per-action role authorization beyond `requireRole('Master Admin')` on `/api/reset`. A logged-in Trainee hitting `PATCH /api/deviations/:id` directly wouldn't be stopped server-side from setting a status only a QA Approver's UI would normally let them set — that gating still lives entirely in the frontend's role checks. See the root README's "Scope boundary" section.

## Schema design

Every model overrides `_id` to `String` so records keep the exact ids the frontend already uses (`'c1'`, `'dev1'`, …) rather than switching to ObjectId — this is what lets the frontend's existing cross-references (`plant.cityId`, `deviation.departmentId`) and seed data work with zero remapping.

Top-level scalar fields (title, status, dates, names) are typed properly, and `status` fields carry the real enum from the frontend's status maps. Deeply-nested, per-module-variable structures (`timeline`, `steps`, `hazards`, `materials`, `trainees`, `capas`, team lists, etc.) are `Schema.Types.Mixed` rather than fully specified sub-schemas — a deliberate speed/flexibility tradeoff that's idiomatic for MongoDB's document model, not a shortcut that loses data (Mongoose stores whatever shape you give it either way).

## Why one generic CRUD router instead of 23 hand-written ones

The frontend already established this pattern for its own Hierarchy admin screens (one config-driven component covering 11 screens). `crudFactory.js` does the same thing for the API: it's mounted once per collection in `routes/index.js`, so every collection gets identical, consistently-tested behavior instead of 23 copies of the same five route handlers.

## Extending

Adding a 24th collection: define a schema in `src/models/`, add it to the `COLLECTIONS` map in `src/models/index.js`, done — it automatically gets all CRUD routes, shows up in `/api/bootstrap`, and gets seeded/reset alongside everything else.
