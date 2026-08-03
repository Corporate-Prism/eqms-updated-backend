import {
  City,
  Plant,
  Department,
  SubDepartment,
  Location,
  Role,
  User,
  Equipment,
  Question,
  DeviationCategory,
  ChangeControlCategory,
  Product,
} from './orgModels.js';
import Document from './dmsModel.js';
import Deviation from './deviationsModel.js';
import QrmRecord from './qrmModel.js';
import ChangeControl from './changeControlModel.js';
import Supplier from './suppliersModel.js';
import { EmbrTemplate, EmbrRecord, EmbrRequest } from './embrModels.js';
import { TrainingCourse, TrainingNeed, TrainingRecord } from './trainingModels.js';

// Keys here are exactly the keys of the `data` object in the frontend's
// AppDataContext (and therefore its seed data) — this map is the single
// source of truth for which Mongo collection backs each REST route and each
// key in the /api/bootstrap response.
export const COLLECTIONS = {
  cities: City,
  plants: Plant,
  departments: Department,
  subDepartments: SubDepartment,
  locations: Location,
  roles: Role,
  users: User,
  equipment: Equipment,
  questions: Question,
  deviationCategories: DeviationCategory,
  changeControlCategories: ChangeControlCategory,
  products: Product,
  documents: Document,
  deviations: Deviation,
  qrmRecords: QrmRecord,
  changeControls: ChangeControl,
  suppliers: Supplier,
  embrTemplates: EmbrTemplate,
  embrRecords: EmbrRecord,
  embrRequests: EmbrRequest,
  trainingCourses: TrainingCourse,
  trainingNeeds: TrainingNeed,
  trainingRecords: TrainingRecord,
};

export const COLLECTION_NAMES = Object.keys(COLLECTIONS);
