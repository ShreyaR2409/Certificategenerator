import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

function AddTemplate() {
    const [color, setColor] = useState('black');
    const [width, setWidth] = useState('5');
    const [style, setStyle] = useState('solid');
    const styles = {
        
        'Landscape': 'width: 800px; height: 600px; ',
        'Portrait': 'width: 794px; height: 1123px; ',
        'Border': `border: ${width}px ${style} ${color};`
    };

    const [orientationStyle, setOrientationStyle] = useState(styles['Portrait'])
    const [borderStyle, setBorderStyle] = useState('')
    const [showBorderColor, setShowBorderColor] = useState(false);
    const [orientation, setOrientation] = useState('Portrait');
    const [type, setType] = useState('');
    const [template, setTemplate] = useState(`<div style="${orientationStyle}">\n</div>`);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedOrientation, setSelectedOrientation] = useState('Portrait');

    const createTemplate = async () => {
        try {
          const templateData = {
            type: type,
            template: template,
            orientation: orientation,
          };
    
          await axios.post('http://localhost:5000/api/certificates', templateData);
    
          setType('');
          setTemplate('');
          setOrientation('Portrait');
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

    const setOrientationMethod = (e) => {
        setSelectedOrientation(e.target.value);
        setOrientationStyle(styles[e.target.value]);
        setOrientation(e.target.value); 
      };

    return (
        <div>
            <div>
                <p style={{display: 'flex', alignItems: "center", gap: '20px'}}>
                    Select Orientation Type: 
                    <select onChange={setOrientationMethod} value={selectedOrientation}>
                        <option value="Landscape">Landscape</option>
                        <option value="Portrait">Portrait</option>
                    </select>
                </p>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                     <label>
                        <input type="checkbox" checked={showBorderColor} onChange={wantBorder} />
                        <span>Want Border?</span>
                    </label>
                    { showBorderColor ? <p>Border Color: <input type="color" onChange={(e) => {setColor(e.target.value)}} /></p> : <></> }
                    { showBorderColor ? <p>Border Width: <input type="text" onChange={(e) => {setWidth(e.target.value)}} placeholder='Enter value in pixels...' /></p> : <></> }
                    { showBorderColor ? <p>Border Style: <input type="text" onChange={(e) => {setStyle(e.target.value)}} /></p> : <></> }
                </div>
            </div>
            <button onClick={showEditorMethod}>Generate</button>
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
                    </div> 
                
            </form>
        </div>
    );
}

export default AddTemplate;
