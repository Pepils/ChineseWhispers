import React from 'react';
import { 
    Admin, 
    Resource,
    List,
    Edit,
    SimpleForm,
    SelectInput,
    Datagrid,
    TextField,
    EmailField,
    BooleanField,
    BooleanInput,
    TextInput,
    ReferenceField,
    ReferenceInput,
} from 'react-admin';

import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('http://127.0.0.1:5000');

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="recordings" list={RecordingList} edit={RecordingEdit}/>
    </Admin>
);

const RecordingList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="transcript" />
            <TextField source="name" />
            <TextField source="filepath" />
            <TextField source="lang" />
            <TextField source="langfam" />
            <BooleanField source="pending" />
            <BooleanField source="added" />
        </Datagrid>
    </List>
);
const RecordingEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="transcript" />
            <TextInput source="name" />
            <TextInput source="filepath" />
            <TextInput source="lang" />
            <TextInput source="langfam" />
            <BooleanInput source="pending" />
            <BooleanInput source="added" />
        </SimpleForm>
    </Edit>
);

export default App;
