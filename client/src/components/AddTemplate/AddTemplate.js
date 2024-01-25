import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

function AddTemplate() {
    const [color, setColor] = useState('');
    const [width, setWidth] = useState('');
    const [style, setStyle] = useState('');
    const [url, setUrl] = useState('');
    const styles = {
        'Landscape': 'width: 1123px; height: 794px; ',
        'Portrait': 'width: 794px; height: 1120px; ',
        'Border': `border: ${width}px ${style} ${color};`,
        'Background Image': `background-image: url(${url}); background-repeat: no-repeat; background-size: cover; background-position: center;`
    };

    const [orientationStyle, setOrientationStyle] = useState('')
    const [borderStyle, setBorderStyle] = useState('')
    const [backgroundImageStyle, setBackgroundImageStyle] = useState('')
    const [showBorderColor, setShowBorderColor] = useState(false);
    const [showBackgroundImage, setShowBackgroundImage] = useState(false);
    const [orientation, setOrientation] = useState('');
    const [type, setType] = useState('');
    const [template, setTemplate] = useState('');
    const [showEditor, setShowEditor] = useState(false);
    const [selectedOrientation, setSelectedOrientation] = useState('');

    useEffect(() => {
        setBorderStyle(styles['Border']);
    }, [color, width, style]);

    useEffect(() => {
        setBackgroundImageStyle(styles['Background Image'])
    }, [url]);

    const createTemplate = async () => {
        if(type === '' || orientation === '' || template === '') {
            window.alert('Please enter all the required fields!');
        } else {
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
        }   
    };

    const wantBorder = () => {
        setShowBorderColor(!showBorderColor);
        if (showBorderColor === true) {
            setBorderStyle('');
            setColor('');
            setWidth('');
            setStyle('');
        } else {
            if(color === '')
                setColor('black');
            if(width === '') 
                setWidth('10')
            if(style === '')
                setStyle('solid')
            setBorderStyle(styles['Border']);
        }
    }

    const wantBackgroundImage = () => {
        setShowBackgroundImage(!showBackgroundImage);
        if (showBackgroundImage === true) {
            setBackgroundImageStyle('');
        } else {
            setBackgroundImageStyle(styles['Background Image']);
        }
    }

    const showEditorMethod = () => {
        const stringDiv = `<div style="${orientationStyle} ${borderStyle} ${backgroundImageStyle} box-sizing: border-box">\n</div>`
        setTemplate(stringDiv)
        setShowEditor(true)
    }

    const setOrientationMethod = (e) => {
        setSelectedOrientation(e.target.value);
        setOrientationStyle(styles[e.target.value]);
        setOrientation(e.target.value);
    };

    return (
        <div>
            <div>
                <p style={{ display: 'flex', alignItems: "center", gap: '20px' }}>
                    Select Orientation Type:
                    <select onChange={setOrientationMethod} value={selectedOrientation}>
                        <option>Select an Orientation</option>
                        <option value="Landscape">Landscape</option>
                        <option value="Portrait">Portrait</option>
                    </select>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <label>
                        <input type="checkbox" checked={showBorderColor} onChange={wantBorder} />
                        <span>Add Border?</span>
                    </label>
                    {showBorderColor ? <p>Border Color: <input type="color" onChange={(e) => { setColor(e.target.value) }} /></p> : <></>}
                    {showBorderColor ? <p>Border Width: <input type="text" onChange={(e) => { setWidth(e.target.value) }} placeholder='Enter value in pixels...' defaultValue='10' /></p> : <></>}
                    {showBorderColor ? <p>Border Style: <input type="text" onChange={(e) => { setStyle(e.target.value) }} defaultValue='solid' /></p> : <></>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <label>
                        <input type="checkbox" checked={showBackgroundImage} onChange={wantBackgroundImage} />
                        <span>Add Background Image?</span>
                    </label>
                    {showBackgroundImage ? <p>URL: <input type="text" onChange={(e) => { console.log(e.target.value); setUrl(e.target.value) }} /></p> : <></>}
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

                { type !== '' ? <div>
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
                </div> : <></>}
            </form>
        </div>
    );
}

export default AddTemplate;
