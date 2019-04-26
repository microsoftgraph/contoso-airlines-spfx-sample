import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';


export interface ICrewGroupProps {
  graphClient: MSGraphClient;
  groupName: string;
  users: MicrosoftGraph.User [];
}