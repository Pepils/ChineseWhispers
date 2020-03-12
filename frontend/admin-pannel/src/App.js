import React from 'react';
import { 
    Admin, 
    Resource,
    ListGuesser,
    EditGuesser,
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
    EditButton,
    ReferenceField,
    ReferenceManyField, 
    ReferenceInput,
} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const apiurl = 'http://127.0.0.1'

const dataProvider = jsonServerProvider(apiurl);
const myDataProvider = {
    ...dataProvider,
    create: (resource, params) => {
        if (resource !== 'recordings') { 
            // fallback to the default implementation
            return dataProvider.create(resource, params)
        }
        console.log(params)
        // console.log(params.data.filepath.src)
        const formData = new FormData()
        formData.append("filename", params.data.filepath.title)
        formData.append('file', params.data.filepath.rawFile)
        formData.append("lang_id", params.data.lang_id);
        formData.append("poem_id", params.data.poem_id);
        formData.append("langfam",params.data.langfam);
        formData.append("transcript",params.data.transcript);
        formData.append("pending",params.data.pending);
        formData.append("added",params.data.added);
        formData.append("name",params.data.name);
        let myreq = {
            method:'POST',
            mode: 'cors',
            body: formData,
        } 
        // let request = new XMLHttpRequest()
        // request.open("POST", "http://127.0.0.1:5000/recordings")
        // return new Promise(resolve => {
        //     request.send(formData, (err,resp,body) => {
        //             console.log(err,resp,body)
        //             if (!err) resolve(body)
        //             }
        //         )})
        return fetch(apiurl+"/recordings", myreq)
            .then( response => { 
                console.log(response)
                return dataProvider.create( resource, {
                // ...params,
                data: {
                    ...params.data,
                    }
                }
            )
        })
    },
}


const App = () => (
    <Admin dataProvider={myDataProvider}>
        <Resource name="recordings" list={RecordingList} edit={RecordingEdit} create={RecordingCreate}/>
        <Resource name="langages" list={LangList} edit={LangEdit} create={LangCreate} />
        <Resource name="poems" list={PoemList} edit={PoemEdit}  />
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
            <ReferenceField source="lang_id" reference="langages">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="poem_id" reference="poems">
                <TextField source="id" />
            </ReferenceField>
            <SoundField source="url" />
            <TextField source="langfam" />
            <TextField source="filepath" />
            <BooleanField source="pending" />
            <BooleanField source="added" />
        </Datagrid>
    </List>
)

const RecordingEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <ReferenceInput source="lang_id" reference="langages">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="langfam" />
            <TextInput source="transcript" />
            <TextInput source="filepath" />
            <TextInput disabled source="url" />
            <ReferenceInput source="poem_id" reference="poems">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <BooleanInput source="pending" />
            <BooleanInput source="added" />
        </SimpleForm>
    </Edit>
)

const RecordingCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceInput source="lang_id" reference="langages">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="langfam" />
            <TextInput source="transcript" />
            <FileInput source="filepath" >
                <FileField source="src" title="title" />
            </FileInput>
            <ReferenceInput source="poem_id" reference="poems">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <BooleanInput source="pending" />
            <BooleanInput source="added" />
        </SimpleForm>
    </Create>
)

const LangEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name"/>
        </SimpleForm>
    </Edit>
)

const LangCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name"/>
        </SimpleForm>
    </Create>
)

const LangList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
        </Datagrid>
    </List>
)

const PoemList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceManyField label="Recordings" reference="recordings" target="poem_id">
                <Datagrid>
                    <TextField source="name" />
                    <TextField source="transcript" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </Datagrid>
    </List>
)

const PoemEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <ReferenceManyField label="Recordings" reference="recordings" target="poem_id">
                <Datagrid>
                    <TextField source="name" />
                    <TextField source="transcript" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
)

export default App;
