// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {menu} from '../models';
import {app} from '../models';

export function ApplicationMenu():Promise<menu.Menu>;

export function CreateNewWire(arg1:string):Promise<app.WireInfo>;

export function GetWireOtp(arg1:string):Promise<app.Otp>;

export function Greet(arg1:string):Promise<string>;

export function ListWires():Promise<Array<app.WireInfo>>;
