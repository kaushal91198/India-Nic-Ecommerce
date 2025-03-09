import { BrowserRouter, Route, Routes } from "react-router";
import { JSX } from "react";
import { routes } from "./routes";


interface RouteAttribute {
    path: string;
    element: React.LazyExoticComponent<() => JSX.Element>;
}


function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {routes.map((route: RouteAttribute) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.element />}
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Router;
