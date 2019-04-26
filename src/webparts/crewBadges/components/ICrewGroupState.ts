import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface ICrewGroupState {
  siteCompatible: boolean;
  message: string;
  json: string;
  pilots: MicrosoftGraph.User[];
  flightAttendants: MicrosoftGraph.User[];
}