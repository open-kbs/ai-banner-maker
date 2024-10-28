export const getActions = (meta) => [
    [/\/?textToImage\("([^"]*)"(?:,\s*"([^"]*)")?\)/, async (match) => {
        const hasDefaultImageToTextModel = !'{{variables.defaultImageToTextModel}}'.startsWith('{{')
        const response = await openkbs.textToImage(match[1], {
            negative_prompt: match[2],
            serviceId: hasDefaultImageToTextModel ? '{{variables.defaultImageToTextModel}}' : undefined
        });
        const imageSrc = `data:${response.ContentType};base64,${response.base64Data}`;
        return { type: 'SAVED_CHAT_IMAGE', imageSrc, ...meta };
    }],
    [/\/?webpageToText\("(.*)"\)/, async (match) => {
        try {
            let response = await openkbs.webpageToText(match[1], { parsePrice: true });
            if (response?.content?.length > 5000) response.content = response.content.substring(0, 5000);
            return { data: response, ...meta };
        } catch (e) {
            return { error: e.response.data, ...meta };
        }
    }]
];