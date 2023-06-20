import { Admin, Resource} from "react-admin";
import jsonServerProvider from 'ra-data-json-server';
import marketPlaceList from "./marketPlaceList";
const index = () => {
  return (
    <Admin dataProvider={jsonServerProvider('http://localhost:3000')} >
        <Resource name="Market place" list={marketPlaceList}/>
    </Admin>
  )
}

export default index