import * as org from './seedOrg.js';
import { documents } from './seedDms.js';
import { deviations } from './seedDeviations.js';
import { qrmRecords } from './seedQrm.js';
import { changeControls } from './seedChangeControl.js';
import { suppliers } from './seedSuppliers.js';
import { embrTemplates, embrRecords, embrRequests } from './seedEmbr.js';
import { trainingCourses, trainingNeeds, trainingRecords } from './seedTraining.js';

// Builds a fresh copy of the seed dataset. Called once on first load and
// whenever the person chooses "Reset sample data" from the sidebar.
export function createSeedData() {
  return {
    cities: org.cities,
    plants: org.plants,
    departments: org.departments,
    subDepartments: org.subDepartments,
    locations: org.locations,
    roles: org.roles,
    users: org.users,
    equipment: org.equipment,
    questions: org.questions,
    deviationCategories: org.deviationCategories,
    changeControlCategories: org.changeControlCategories,
    products: org.products,
    documents,
    deviations,
    qrmRecords,
    changeControls,
    suppliers,
    embrTemplates,
    embrRecords,
    embrRequests,
    trainingCourses,
    trainingNeeds,
    trainingRecords,
  };
}
