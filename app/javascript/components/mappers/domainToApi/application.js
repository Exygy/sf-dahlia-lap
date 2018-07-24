import { toPairs, filter, map, join, compact } from 'lodash'
import { createFieldMapper} from '~/utils/objectUtils'

const checkListToString = (list) => {
  return join(compact(list),';')
}

const adaPrioritiesMapValues = {
  'vision_impaired': 'Vision Impaired',
  'mobility_impaired': 'Mobility Impaired',
  'hearing_impaired': 'Hearing Impaired'
}

const mapAdaPrioritiesMap = (list) => {
  const selectedPriorities = filter(toPairs(list), ([a, b]) => b)
  return map(selectedPriorities, ([a, b]) => adaPrioritiesMapValues[a])
}

export const applicationFieldMapper = {
  id: 'id',
  has_military_service: 'hasMilitaryService',
  has_developmentaldisability: 'hasDevelopmentalDisability',
  answered_community_screening: 'answeredCommunityScreening',
  annual_income: 'annualIncome',
  housing_voucher_or_subsidy: 'householdVouchersSubsidies',
  terms_acknowledged: 'agreeToTerms',
  number_of_dependents: 'numberOfDependents',
  reserved_senior: 'hasSenior',
  adaPrioritiesSelected: (source) => checkListToString(mapAdaPrioritiesMap(source.has_ada_priorities_selected))
}

export const mapApplication = createFieldMapper(applicationFieldMapper)