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
        <Resource name="records" list={RecordList} edit={RecordEdit}/>
        <Resource name="entries" list={EntryList} edit={EntryEdit}/>
    </Admin>
);

const RecordList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="filepath" />
            <TextField source="lang" />
            <TextField source="langfam" />
            <BooleanField source="pending" />
            <BooleanField source="added" />
        </Datagrid>
    </List>
);
const RecordEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="filepath" />
            <TextInput source="lang" />
            <TextInput source="langfam" />
            <BooleanInput source="pending" />
            <BooleanInput source="added" />
        </SimpleForm>
    </Edit>
);

const EntryList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="record_id" reference="records">
                <TextField source="id" /></ReferenceField>
            <TextField source="text" />
        </Datagrid>
    </List>
);
const EntryEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <ReferenceInput source="record_id" reference="records">
                <SelectInput optionText="id" /></ReferenceInput>
            <TextInput source="text" />
        </SimpleForm>
    </Edit>
);

export default App;
