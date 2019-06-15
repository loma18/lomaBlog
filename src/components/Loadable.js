import Loadable from 'react-loadable';

export const loadable = (filename) => Loadable({
    loader:() => import(`${filename}`),
    loading:() => ('')
});