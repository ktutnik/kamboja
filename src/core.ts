import "reflect-metadata"
import {HttpMethod} from "./http-method"

interface DependencyResolver {
    resolve<T>(symbol: symbol);
}
