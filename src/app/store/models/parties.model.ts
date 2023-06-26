import {
  GetAllCustomersResponseI,
  SupplierI,
} from 'src/app/core/services/parties/parties.service';

export interface PartiesModel {
  partiesList: Array<GetAllCustomersResponseI | SupplierI>;
  selectedParty: GetAllCustomersResponseI | SupplierI | undefined;
}
