import React from 'react';
import { 
    Admin, 
    Resource,
    List,
    Edit,
    Create,
    SimpleForm,
    SelectInput,
    FileInput,
    Datagrid,
    TextField,
    BooleanField,
    FileField,
    BooleanInput,
    TextInput,
    ReferenceField,
    ReferenceInput,
} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('http://127.0.0.1:5000');
const myDataProvider = {
    ...dataProvider,
    create: (resource, params) => {
        if (resource !== 'recordings') { //|| !params.data.pictures) {
            // fallback to the default implementation
            return dataProvider.create(resource, params)
        }
        console.log(params)
        console.log(params.data.filepath.src)
        const formData = new FormData()
        formData.append("filename", params.data.filepath.title)
        formData.append('file', params.data.filepath.rawFile)
        formData.append("lang", "");
        formData.append("langfam","");
        formData.append("transcript","");
        formData.append("name","");

        let request = new XMLHttpRequest()
        request.open("POST", "http://127.0.0.1:5000/recordings")
        request.send(formData);
        return dataProvider.create( resource, {
            ...params,
            data: {
                ...params.data,
            }
        })
    },
}


const App = () => (
    <Admin dataProvider={myDataProvider}>
        <Resource name="recordings" list={RecordingList} edit={RecordingEdit} create={RecordingCreate}/>
    </Admin>
);

const SoundField = ({ source, record = {} }) => <audio controls="controls" src={record[source]} controlsList="nodownload"/>
SoundField.defaultProps = { label: 'File' }

            // <TextField source="filepath" />
const RecordingList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="transcript" />
            <TextField source="name" />
            <SoundField source="filepath" />
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

const RecordingCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="transcript" />
            <TextInput source="name" />
            <TextInput source="lang" />
            <FileInput source="filepath" >
                <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="langfam" />
            <BooleanInput source="pending" />
            <BooleanInput source="added" />
        </SimpleForm>
    </Create>
);

export default App;
