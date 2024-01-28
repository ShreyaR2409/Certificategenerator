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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/upload",
                formData
            );
            setUploadedImageUrl(response.data.imageUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
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
        // Get the selected image file
        const file = e.target.files[0];

        // Create a URL for the selected image file
        const imageUrl = URL.createObjectURL(file);
        console.log(imageUrl);
        // Update the uploaded image URL in the local state
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
        <div style={{backgroundImage: "url('data:image/jpeg;base64,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')"}}>

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
                                <button type="button" onClick={handleBackgroundImageSelect}>
                                    Select Image
                                </button>
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
                    wantBackgroundImage();
                    setBackgroundImage();
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
