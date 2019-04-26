import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface ICrewMemberCardProps {
  graphClient: MSGraphClient;
  user: MicrosoftGraph.User;
}