import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'getCurrentWebsite' : ActorMethod<[], string>,
  'getPublishedWebsites' : ActorMethod<[], Array<string>>,
  'publishWebsite' : ActorMethod<[], Result_1>,
  'saveWebsite' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
