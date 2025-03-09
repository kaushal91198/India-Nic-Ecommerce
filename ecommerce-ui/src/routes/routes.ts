
import { JSX, lazy } from "react";
import { PUBLIC_NAVIGATION } from "../constans/navigation.constant";

export interface RoutesInterface {
  path: string;
  element: React.LazyExoticComponent<() => JSX.Element>;
}


export const routes: RoutesInterface[] = [
  {
    path: PUBLIC_NAVIGATION.products,
    element: lazy(() => import("../pages/products")),
  },
];
