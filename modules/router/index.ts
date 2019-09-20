import {renderRoutes} from 'react-router-config';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

interface route {
  path: string;
  id?: string;
  key?: any;
  name?: string;
  component: any;
  routes?: Array<route>;
  children?: Array<route>;
}

interface pathObject {
  name: string;
  params?: object;
}

type routerType = 'react' | 'vue';

export default class Router {
  private Routes: Array<route>;
  private originRoutes: Array<route>;
  private routesInArray: Array<route> = [];
  private type: routerType;

  constructor(routes: Array<route>, type: routerType) {
    this.originRoutes = _.cloneDeep(routes);
    this.type = type;
    this.Routes = this.combinePathname(routes);
    this.transFormRouteToArray(routes);
  }

  private combinePathname(
    routes: Array<route>,
    parentPath?: string
  ): Array<route> {
    return routes.map(it => {
      const realPath = parentPath ? [parentPath, it.path].join('/') : it.path;
      if (it.routes) {
        it.routes = this.combinePathname(it.routes, realPath);
      }
      if (it.children) {
        it.children = this.combinePathname(it.children, realPath);
      }
      return parentPath ? {...it, path: realPath} : it;
    });
  }

  private getRoutes(): Array<route> {
    return this.Routes;
  }

  private getOrigin(): Array<route> {
    return this.originRoutes;
  }

  private returnReactRouter() {
    return renderRoutes(this.Routes);
  }

  public getRouter() {
    return this.type === 'react'
      ? renderRoutes(this.Routes)
      : this.originRoutes;
  }

  private transFormRouteToArray(routes: Array<route>): void {
    routes.forEach(it => {
      if (it.children) {
        this.routesInArray = this.routesInArray.concat([...it.children]);
      } else if (it.routes) {
        this.routesInArray = this.routesInArray.concat([...it.routes]);
      } else {
        this.routesInArray = this.routesInArray.concat([it]);
      }
    });

    this.routesInArray = _.uniq(this.routesInArray);
  }

  public findRouteArrayByName(name: string): Array<route> {
    return this.routesInArray.filter(it => it.name === name);
  }

  public findRouteItem(name: string): route {
    return this.findRouteArrayByName(name)[0];
  }

  private isFindRouter(name: string): boolean {
    return this.findRouteArrayByName(name).length > 0;
  }

  public getUrlByNameParams(pathObject: pathObject): string {
    return this.isFindRouter(pathObject.name)
      ? this.translateParamsInUrl(
          this.findRouteItem(pathObject.name).path,
          pathObject.params || {}
        )
      : '';
  }

  private translateParamsInUrl(url: string, params: object): string {
    const toPath = pathToRegexp.compile(url);
    return toPath(params);
  }
}
