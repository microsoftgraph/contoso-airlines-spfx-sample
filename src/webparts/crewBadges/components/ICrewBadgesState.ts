import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface ICrewBadgesState {
  siteCompatible: boolean;
  pilots: MicrosoftGraph.User[];
  flightAttendants: MicrosoftGraph.User[];
  error: string;
}