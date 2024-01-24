import React, { useState } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

function AddTemplate() {

    const [type, setType] = useState('');
    const [template, setTemplate] = useState('');

    const createTemplate = async () => {

        try {
            const templateData = {
                type: type,
                template: template,
            };

            await axios.post('http://localhost:5000/api/certificates', templateData)
            setType('');
            setTemplate('');
            window.alert('Created new certificate template successfully!');
        } catch (error) {
            console.error('Error creating certificate template:', error);
        }

    };

    return (
        <div>
            <form>
                <label>
                    Type
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                </label>
                <br></br>
                <br></br>
                <JoditEditor
                    value={template}
                    onChange={(newContent) => setTemplate(newContent)}
                />
            </form>
            <br></br>
            <br></br>
            <button onClick={createTemplate}>Create</button>
        </div>
    );
}

export default AddTemplate;
