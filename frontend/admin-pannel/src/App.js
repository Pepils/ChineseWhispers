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
import RichTextInput from 'ra-input-rich-text';

const apiurl = 'http://127.0.0.1:5000'

const dataProvider = jsonServerProvider(apiurl);
const myDataProvider = {
    ...dataProvider,
    create: (resource, params) => {
        if (resource !== 'recordings') { 
            // fallback to the default implementation
            return dataProvider.create(resource, params)
        }
        // console.log(params)
        // console.log(params.data.filepath.src)
        const formData = new FormData()
        let myreq = {}
        try {
            for (let [key, val] of Object.entries(params.data)) {
                // console.log(key,val)
                if (key === "filepath") {
                    formData.append("filepath", val.title)
                    formData.append('file', val.rawFile)
                } else {
                    formData.append(key,val)
                }
            }
            myreq = {
                method:'POST',
                mode: 'cors',
                body: formData,
            }
        } catch (err) {
            return Promise.reject(err)    
        }
        return fetch(apiurl+"/recordings", myreq)
            .then( response => {
                if (!response.ok) {
                    return Promise.reject("Missing data")
                }
                // console.log(response)
                return dataProvider.create( resource, {
                data: {
                    ...params.data,
                    }
                }
            )
        })
    },
    update: (resource, params) => {
        if (resource !== 'recordings' || !params.data.newfilepath) { 
            // fallback to the default implementation
            return dataProvider.update(resource, params)
        }
        // console.log(params)
        const formData = new FormData()
        let myreq = {}
        try {
            if (params.data.newfilepath) {
                formData.append("filepath", params.data.newfilepath.title)
                formData.append('file', params.data.newfilepath.rawFile)
                params.data.filepath = params.data.newfilepath.title
            }
            myreq = {
                method:'POST',
                mode: 'cors',
                body: formData,
            }
        } catch (err) {
            return Promise.reject(err)    
        }
        return fetch(apiurl+"/recordings/"+params.data.id, myreq)
            .then( response => {
                if (!response.ok) {
                    return Promise.reject("Missing data")
                }
                return dataProvider.update( resource, {
                ...params
                }
            )
        })
    },
}

const App = () => (
    <Admin dataProvider={myDataProvider}>
        <Resource name="recordings" list={RecordingList} edit={RecordingEdit} create={RecordingCreate}/>
        <Resource name="langages" list={LangList} edit={LangEdit} create={LangCreate} />
        <Resource name="poems" list={PoemList} edit={PoemEdit} create={PoemCreate} />
    </Admin>
);

const SoundField = ({ source, record = {} }) => <audio controls="controls" src={record[source]} controlsList="download"/>
SoundField.defaultProps = { label: 'File' }

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
            <ReferenceField source="parent_id" reference="recordings">
                <TextField source="name" />
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
            <RichTextInput source="transcript" />
            <FileInput source="newfilepath" >
                <FileField source="src" title="title" />
            </FileInput>
            <TextInput disabled source="url" />
            <SoundField source="url" />
            <ReferenceInput source="poem_id" reference="poems">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <ReferenceInput source="parent_id" reference="recordings">
                <SelectInput optionText="name" />
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
            <RichTextInput source="transcript" />
            <FileInput source="filepath" >
                <FileField source="src" title="title" />
            </FileInput>
            <ReferenceInput source="poem_id" reference="poems">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <ReferenceInput source="parent_id" reference="recordings">
                <SelectInput optionText="name" />
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

const PoemCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
        </SimpleForm>
    </Create>
)

export default App;
