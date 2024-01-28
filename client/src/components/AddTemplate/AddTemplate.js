import React, { useState, useEffect } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";

function AddTemplate() {
    const [color, setColor] = useState("");
    const [width, setWidth] = useState("");
    const [style, setStyle] = useState("");
    const [url, setUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [backgroundColorStyle, setBackgroundColorStyle] = useState("");

    const styles = {
        Landscape: "width: 1123px; height: 794px; ",
        Portrait: "width: 794px; height: 1120px; ",
        Border: `border: ${width}px ${style} ${color};`,
        "Background Image": `background-image: url(${uploadedImageUrl || url
            }); background-repeat: no-repeat; background-size: cover; background-position: center;`,
        "Background Color": `background-color: ${backgroundColor};`,
    };

    const [orientationStyle, setOrientationStyle] = useState("");
    const [borderStyle, setBorderStyle] = useState("");
    const [backgroundImageStyle, setBackgroundImageStyle] = useState("");
    const [showBorderColor, setShowBorderColor] = useState(false);
    const [showBackgroundColor, setShowBackgroundColor] = useState(false);
    const [showBackgroundImage, setShowBackgroundImage] = useState(false);
    const [orientation, setOrientation] = useState("");
    const [type, setType] = useState("");
    const [template, setTemplate] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const [selectedOrientation, setSelectedOrientation] = useState("");

    useEffect(() => {
        setBorderStyle(styles["Border"]);
    }, [color, width, style]);

    useEffect(() => {
        setBackgroundImageStyle(styles["Background Image"]);
    }, [url, uploadedImageUrl]);

    useEffect(() => {
        setBackgroundColorStyle(styles["Background Color"]);
    }, [backgroundColor]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData);
            console.log('Image uploaded. Image URL:', response.data.imageUrl);
            setUploadedImageUrl('http://localhost:5000' + response.data.imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    useEffect(() => {
        setBackgroundImageStyle(styles["Background Image"]);
    }, [url, imageFile]);

    useEffect(() => {
        setBackgroundColorStyle(styles["Background Color"]);
    }, [backgroundColor]);

    const createTemplate = async () => {
        if (type === "" || orientation === "" || template === "") {
            window.alert("Please enter all the required fields!");
        } else {
            try {
                const templateData = {
                    type: type,
                    template: template,
                    orientation: orientation,
                };

                await axios.post(
                    "http://localhost:5000/api/certificates",
                    templateData
                );

                setType("");
                setTemplate("");
                setOrientation("Portrait");
                window.alert("Created new certificate template successfully!");
            } catch (error) {
                console.error("Error creating certificate template:", error);
            }
        }
    };

    const handleBackgroundImageUpload = (e) => {
        const file = e.target.files[0];

        const imageUrl = URL.createObjectURL(file);
        console.log(imageUrl);
        setUploadedImageUrl(imageUrl);
    };
    const handleBackgroundImageSelect = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => handleBackgroundImageUpload(e);
        input.click();
    };

    const setBackgroundImage = () => {
        const backgroundImageValue = uploadedImageUrl || url;
        setBackgroundImageStyle(
            `background-image: url(${backgroundImageValue}); background-repeat: no-repeat; background-size: cover; background-position: center;`
        );
    };

    const wantBorder = () => {
        setShowBorderColor(!showBorderColor);
        if (showBorderColor === true) {
            setBorderStyle("");
            setColor("");
            setWidth("");
            setStyle("");
        } else {
            if (color === "") setColor("black");
            if (width === "") setWidth("10");
            if (style === "") setStyle("solid");
            setBorderStyle(styles["Border"]);
        }
    };

    const wantBackgroundColor = () => {
        setShowBackgroundColor(!showBackgroundColor);
        if (showBackgroundColor === true) {
            setBackgroundColor("");
        }
    };

    const wantBackgroundImage = () => {
        setShowBackgroundImage((prevShowBackgroundImage) => {
            if (!prevShowBackgroundImage) {
                setBackgroundImageStyle(styles["Background Image"]);
            } else {
                setBackgroundImageStyle("");
            }
            return !prevShowBackgroundImage;
        });
    };

    const showEditorMethod = () => {
        const backgroundImageValue = uploadedImageUrl || url;
        const stringDiv = `<div style="${orientationStyle} ${borderStyle} ${backgroundColorStyle} ${backgroundImageStyle}"></div>`;
        setTemplate(stringDiv);
        setShowEditor(true);
    };

    const setOrientationMethod = (e) => {
        setSelectedOrientation(e.target.value);
        setOrientationStyle(styles[e.target.value]);
        setOrientation(e.target.value);
    };

    return (
        <div>
            <div>
                <p style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    Select Orientation Type:
                    <select onChange={setOrientationMethod} value={selectedOrientation}>
                        <option>Select an Orientation</option>
                        <option value="Landscape">Landscape</option>
                        <option value="Portrait">Portrait</option>
                    </select>
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showBorderColor}
                            onChange={wantBorder}
                        />
                        <span>Add Border?</span>
                    </label>
                    {showBorderColor ? (
                        <p>
                            Border Color:{" "}
                            <input
                                type="color"
                                onChange={(e) => {
                                    setColor(e.target.value);
                                }}
                            />
                        </p>
                    ) : (
                        <></>
                    )}
                    {showBorderColor ? (
                        <p>
                            Border Width:{" "}
                            <input
                                type="text"
                                onChange={(e) => {
                                    setWidth(e.target.value);
                                }}
                                placeholder="Enter value in pixels..."
                                defaultValue="10"
                            />
                        </p>
                    ) : (
                        <></>
                    )}
                    {showBorderColor ? (
                        <p>
                            Border Style:{" "}
                            <input
                                type="text"
                                onChange={(e) => {
                                    setStyle(e.target.value);
                                }}
                                defaultValue="solid"
                            />
                        </p>
                    ) : (
                        <></>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showBackgroundColor}
                            onChange={wantBackgroundColor}
                        />
                        <span>Add Background Color</span>
                    </label>
                    {showBackgroundColor ? (
                        <p>
                            Background Color:{" "}
                            <input
                                type="color"
                                onChange={(e) => setBackgroundColor(e.target.value)}
                            />
                        </p>
                    ) : (
                        <></>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showBackgroundImage}
                            onChange={wantBackgroundImage}
                        />
                        <span>Add Background Image</span>
                    </label>
                    {showBackgroundImage ? (
                        <>
                            <p>
                                URL:{" "}
                                <input type="text" onChange={(e) => setUrl(e.target.value)} />
                            </p>
                            <p>
                                Upload Image:{" "}
                                <input type="file" onChange={handleImageChange} />
                            </p> 
                            <p>
                                {uploadedImageUrl && (
                                    <img
                                        src={uploadedImageUrl}
                                        alt="Background"
                                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                                    />
                                )}
                            </p>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <button
                onClick={() => {
                    showEditorMethod();
                }}
            >
                Generate
            </button>

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

                {type !== "" ? (
                    <div>
                        <JoditEditor
                            value={template}
                            onChange={(newContent) => {
                                console.log("Content changed:", newContent);
                                setTemplate(newContent);
                            }}
                        />
                        <br></br>
                        <br></br>
                        <button onClick={createTemplate}>Create</button>
                    </div>
                ) : (
                    <></>
                )}
            </form>
        </div>
    );
}

export default AddTemplate;
