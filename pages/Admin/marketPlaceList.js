import {List, Datagrid, TextField, DateField, EditButton, DeleteButton} from 'react-admin';

const marketPlaceList = (props) => {
  return (
    <List {...props}>
        <Datagrid>
            <TextField source='id'></TextField>
            <TextField source='name'></TextField>
            <TextField source='location'></TextField>

        </Datagrid>
    </List>
  )
}

export default marketPlaceList