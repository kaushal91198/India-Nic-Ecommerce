import { Router } from "express";

export interface Routes {
    path: string | RegExp | Array<string | RegExp>;
    route: Router;
}