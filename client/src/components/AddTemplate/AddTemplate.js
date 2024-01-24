import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

function AddTemplate() {
    const [color, setColor] = useState('black');
    const [width, setWidth] = useState('5');
    const [style, setStyle] = useState('solid');
    const styles = {
        'Landscape': 'width: 800px; height: 600px; ',
        'Portrait': 'width: 210mm; height: 297mm; ',
        'Border': `border: ${width}px ${style} ${color};`
    };

    const [orientationStyle, setOrientationStyle] = useState(styles['Landscape'])
    const [borderStyle, setBorderStyle] = useState('')
    const [showBorderColor, setShowBorderColor] = useState(false);
    const [template, setTemplate] = useState(`<div style="${orientationStyle}">\n</div>`);

    const [showEditor, setShowEditor] = useState(false);

    const createTemplate = async () => {
        console.log(template)

        try {
            const templateData = {
                template: template,
            };

            await axios.post('http://localhost:5000/api/certificates', templateData)
            setTemplate('');
            window.alert('Created new certificate template successfully!');
        } catch (error) {
            console.error('Error creating certificate template:', error);
        }

    };

    const wantBorder = () => {
        setShowBorderColor(!showBorderColor);
        if(showBorderColor === true) {
            setBorderStyle('');
        } else {
            setBorderStyle(styles['Border']);
        }
    }

    useEffect(() => {
        setBorderStyle(styles['Border']);
    }, [ color, width, style ])

    const showEditorMethod = () => {
        const stringDiv = `<div style="${orientationStyle} ${borderStyle}">\n</div>`
        console.log(borderStyle)
        setTemplate(stringDiv)
        setShowEditor(true)
        console.log(template)
    }

    const setOrientationMethod = (selectedOrientation) => {
        setOrientationStyle(styles[selectedOrientation])
    }

    return (
        <div>
            <div>
                <p style={{display: 'flex', alignItems: "center", gap: '20px'}}>
                    Select Orientation Type: 
                    <select>
                        <option onClick={() => setOrientationMethod('Landscape')} style={{cursor: 'pointer'}}>Landscape</option>
                        <option onClick={() => setOrientationMethod('Portrait')} style={{cursor: 'pointer'}}>Portrait</option>
                    </select>
                </p>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <p style={{display: "flex", alignItems: "center", gap: '20px', cursor: 'pointer'}} onClick={wantBorder}>
                        <input type="checkbox" checked={showBorderColor} /><p>Want Border?</p>
                    </p>
                    { showBorderColor ? <p>Border Color: <input type="text" onChange={(e) => {setColor(e.target.value)}} /></p> : <></> }
                    { showBorderColor ? <p>Border Width: <input type="text" onChange={(e) => {setWidth(e.target.value)}} placeholder='Enter value in pixels...' /></p> : <></> }
                    { showBorderColor ? <p>Border Style: <input type="text" onChange={(e) => {setStyle(e.target.value)}} /></p> : <></> }
                </div>
                <button onClick={showEditorMethod}>Generate</button>
            </div>
            <form>
                <br></br>
                <br></br>
                { showEditor ?
                    <div>
                        <JoditEditor
                            value={template}
                            onChange={(newContent) => {
                                console.log('Content changed:', newContent);
                                setTemplate(newContent);
                            }}
                        />
                        <br></br>
                        <br></br>
                        <button onClick={createTemplate}>Create</button>
                    </div> : <></>
                }   
            </form>
        </div>
    );
}

export default AddTemplate;
