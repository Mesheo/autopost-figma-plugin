console.log("[FIGMA PLUGIN] Showing the UI...")
figma.showUI(__html__)
figma.ui.resize(500, 500)

figma.ui.onmessage = async (pluginMessage) => {
    await figma.loadFontAsync({ family: "Rubik", style: "Regular"});

    const nodes:SceneNode[] = [];
    const postComponentSet = figma.root.findOne(node => node.type === "COMPONENT_SET" && node.name === "post") as ComponentSetNode;

    const darkModeVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === "Image=none, Dark mode=true") as ComponentNode
    const darkModeSingleVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === "Image=single, Dark mode=true") as ComponentNode
    const darkModeCarouselVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === "Image=carousel, Dark mode=true") as ComponentNode

    const lightModeVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === "Image=none, Dark mode=false") as ComponentNode
    const lightModeSingleVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === "Image=single, Dark mode=false") as ComponentNode
    const lightModeCarouselVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === "Image=carousel, Dark mode=false") as ComponentNode

    let newPost;
    if (pluginMessage.darkModeState) {
        switch (pluginMessage.imageVariant) {
            case "Single Image":
                newPost = darkModeSingleVariant.createInstance();
                break;
            case "Carousel":
                newPost = darkModeCarouselVariant.createInstance();
                break;
            default:
                newPost = darkModeVariant.createInstance()
                break;
        }
    } else {
        switch (pluginMessage.imageVariant) {
            case "Single Image":
                newPost = lightModeSingleVariant.createInstance();
                break;
            case "Carousel":
                newPost = lightModeCarouselVariant.createInstance();
                break;
            default:
                newPost = lightModeVariant.createInstance()
                break;
        }
    }

    const templateName = newPost.findOne(node => node.name == "displayName" && node.type == "TEXT") as TextNode;
    const templateUsername = newPost.findOne(node => node.name == "@username" && node.type == "TEXT") as TextNode;
    const templateDescription = newPost.findOne(node => node.name == "description" && node.type == "TEXT") as TextNode;

    templateName.characters = pluginMessage.name;
    templateUsername.characters = pluginMessage.username;
    templateDescription.characters = pluginMessage.description;

    console.log(
        "[PLUGIN CODE]",
        {
            "name": templateName.characters,
            "username": templateUsername.characters,
            "description": templateDescription.characters
        });
    
    nodes.push(newPost);
    figma.viewport.scrollAndZoomIntoView(nodes);
    
    figma.closePlugin();
}